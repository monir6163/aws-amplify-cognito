# Authentication with AWS Cognito in Next.js App Router

This project demonstrates how to implement authentication using **AWS Cognito** in a **Next.js** application with the App Router. It includes features like user sign-up, sign-in, GitHub login, profile updates, email change with verification, password change, and more.

## Features

- **SignUp**: Users can create a new account with email and password.
- **SignIn**: Existing users can log in using their credentials.
- **GitHub Login**: Users can log in using their GitHub account (OAuth integration).
- **Profile Data Update**: Authenticated users can update their profile information.
- **Email Change with Verification**: Users can change their email address, with a verification step to confirm the new email.
- **Password Change**: Users can update their password securely.
- **Modal Logout from Other Sessions**: Users can log out from other active sessions using a modal interface.
- **Forgot Password**: Users can reset their password via a secure forgot password flow.

## Technologies Used

- **Next.js**: A React framework for server-rendered applications.
- **AWS Cognito**: A scalable user directory and authentication service.
- **App Router**: Next.js's file-based routing system.
- **Server Actions**: Next.js feature for handling server-side logic.
- **OAuth**: For GitHub login integration.
- **Tailwind CSS** (optional): For styling the application.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- AWS account with Cognito configured
- GitHub OAuth app credentials (for GitHub login)
- Environment variables setup (see `.env.example`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/monir6163/aws-amplify-cognito.git
   cd your-repo-name
   ```
