"use server"

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { get } from "http";
import { revalidatePath } from "next/cache";

export async function syncUser(user: any) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      }
    })

    if (existingUser) {
      return existingUser;
    }

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ''} ${user.lastName || ''}`,
        username: user.username ?? user.emailAddresses[0].emailAddress.split('@')[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      }
    })

    return dbUser;
  } catch (error) {
    console.error("Error syncing user", error );
  }
};

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: { 
      clerkId
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        }
      }
    }
  }); 
}

export async function  getDbUserId() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  };

  const user = await getUserByClerkId(clerkId);

  if (!user) {
    throw new Error("User not found");
  }

  return user.id
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return [];
    }

    // get 3 random users, exclude myself and already followed
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          {NOT: {id: userId}},
          {NOT: {followers: {some: {followerId: userId}}}}
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          }
        }
      },
      take: 3
    });

    return randomUsers;
  } catch (error) {
    console.error("Error getting random users", error);
    return [];
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();

    if (userId === targetUserId) {
      throw new Error("You cannot follow yourself");
    }

    if (!userId) {
      return;
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        }
      }
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          }
        }
      });
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          }
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId,
            creatorId: userId,
          }
        })
      ]);
    }

    revalidatePath("/");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error toggling follow:", error);
    return {
      success: false,
      error: "Error toggling follow",
    }
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;
    if (!content) throw new Error("Content is required");

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    // Create comment and notification in a transaction
    const [comment] = await prisma.$transaction(async (tx) => {
      // Create comment first
      const newComment = await tx.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
      });

      // Create notification if commenting on someone else's post
      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }

      return [newComment];
    });

    revalidatePath(`/`);
    return { success: true, comment };
  } catch (error) {
    console.error("Failed to create comment:", error);
    return { success: false, error: "Failed to create comment" };
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Unauthorized - no delete permission");

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/"); // purge the cache
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}
