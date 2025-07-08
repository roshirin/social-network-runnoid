# runnoid - A Full-Stack Social Network

runnoid is a full-stack social networking application built with Next.js.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

---

## 🔴 Live Demo

You can view and interact with the live deployment here:

**[https://social-network-runnoid-v91k.vercel.app/](https://social-network-runnoid-v91k.vercel.app/)**

## ✨ Key Features

### 1. Authentication
-   **Email & Password Login:** Secure user registration and sign-in functionality.
-   **Google OAuth:** Seamless one-click sign-in and registration using Google accounts.
-   **Protected Routes:** User-specific pages and actions are protected, redirecting unauthenticated users to the login page.

### 2. Core Social Feed
-   **Create Posts:** Authenticated users can create and publish text-based posts into common feed.
-   **Image Uploads:** Users can upload images to their posts (used Uploadthing service for image hosting).
-   **Chronological Feed:** The main dashboard displays a feed of posts from all users.
-   **Like Posts:** Users can like any post, with real-time updates to the like count.
-   **Commenting System:** Users can comment on posts.

### 3. User Profiles
-   **Customizable Profiles:** Users can edit their profile to change their name, username, and bio.
-   **User-Specific Content Tabs:** Profile pages are organized with tabs to view a user's:
    -   Posts
    -   Likes
-   **Follow System:** Users can follow and unfollow other users, with follower/following counts displayed on the profile.

### 4. Responsive UI/UX
-   **Responsive Design:** The layout is fully responsive, providing an optimal experience on desktop, tablet, and mobile devices.
-   **Intuitive Modals:** Actions like editing a profile or viewing comments are handled in non-disruptive modals.

## 🛠️ Technology Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Authentication:** [Clerk](https://clerk.com/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Images hosting:** [Uploadthing](https://uploadthing.com/)
-   **Database:** [PostgreSQL with Neon](https://neon.com/)
-   **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18.x or later)
-   npm, yarn, or pnpm
-   A database instance (e.g., PostgreSQL)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/roshirin/social-network-runnoid.git
    cd social-network-runnoid
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add the necessary environment variables. See the `.env_example` file.

4.  **Push the database schema:**
    Use Prisma to sync your schema with your database.
    ```sh
    npx prisma db push
    ```

5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
