# WorkWise: Work Log & Review Helper

Welcome to WorkWise! This is a Next.js application designed to help you log your daily work, track your progress, and streamline your performance reviews with the help of AI.

## Core Features

*   **User Authentication**: Secure sign-up and login with Google or Email/Password via Firebase.
*   **Daily Work Log**: Easily record your daily tasks, accomplishments, and challenges with an intuitive dialog.
*   **Log Tagging**: Organize your entries with custom tags (e.g., 'merged PR,' 'meeting,' 'debugging').
*   **Dashboard Overview**: A central dashboard to visualize your activity with statistics (total logs, unique tags, daily streak), an activity chart, and a list of your most recent logs.
*   **Timesheet View**: A filterable and searchable table of all your work logs.
*   **AI-Powered Review Helper**: Uses Google's Gemini AI to analyze your work logs from a specific period and generate summaries or answer questions for your performance reviews.
*   **User Profile Management**: View and manage your profile information.
*   **Feedback System**: An integrated feedback form in the sidebar to send suggestions directly.
*   **Customizable Theming**: Switch between light and dark modes.

## Getting Started

To run the application, you need to configure your Firebase project and get a Google AI API key.

### Configuration

Create a `.env.local` file in the root of the project and add the following environment variables.

```env
# Google AI API Key
GOOGLE_API_KEY="..."

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# Email for receiving feedback from the app
FEEDBACK_EMAIL_RECIPIENT="..."
```

#### 1. How to get Firebase credentials

This application uses Firebase Firestore to store work log data and Firebase Auth for authentication.

1.  **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Create a Web App**: In your project's dashboard, click the Web icon (`</>`) to add a new web app. After registering the app, Firebase will provide you with a `firebaseConfig` object.
3.  **Copy Credentials**: Copy the corresponding values from the `firebaseConfig` object into your `.env.local` file using the `NEXT_PUBLIC_` prefixes as shown above.
4.  **Set up Firestore**:
    *   In the Firebase Console, go to **Build > Firestore Database** and click **Create database**.
    *   Start in **production mode** and select a location.
    *   Go to the **Rules** tab and replace the default rules to allow access only to authenticated users.
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Allow users to read and write their own documents
        match /work-logs/{logId} {
          allow read, write: if request.auth != null;
        }
      }
    }
    ```
    *   Click **Publish**.
5.  **Enable Authentication Methods**: See `INSTRUCTIONS-EMAIL-AUTH.md` for details on enabling Email/Password and Google sign-in.

#### 2. How to get a Google AI (Gemini) API Key

The Review Helper feature uses the Google AI Gemini model.

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click **Create API key in new project**.
3.  Copy the generated API key and paste it into the `GOOGLE_API_KEY` variable in your `.env.local` file.

### Running the App

Once your `.env.local` file is configured, install the dependencies and run the development server:

```bash
npm install
npm run dev
```

Your application will be available at `http://localhost:9002`.

### Testing the Application

To test the login functionality, you first need to create a test user.

1.  Navigate to the **Sign up** page.
2.  Use the following credentials to create an account:
    *   **Full Name**: `Test User`
    *   **Email**: `test@example.com`
    *   **Password**: `password`
3.  After signing up, you will be automatically logged in. You can then log out and use these same credentials on the **Login** page to test the login flow.

### Temporarily Disabling Authentication

If you are having trouble with Firebase setup, you can temporarily disable authentication to continue development. The application is currently in a "auth-disabled" state using a mock user.

**To re-enable authentication:**

1.  **Open `src/components/providers/auth-provider.tsx`**.
2.  **Remove the `MOCK_USER` object**: Delete the constant `MOCK_USER`.
3.  **Update `user` state**: Change `useState<User | null>(MOCK_USER)` back to `useState<User | null>(null)`.
4.  **Update `loading` state**: Change `useState(false)` back to `useState(true)`.
5.  **Uncomment `useEffect` blocks**: Uncomment the two `useEffect` blocks that were commented out.
6.  **Restore Login/Signup Pages**: You will need to revert the changes in `src/app/(auth)/page.tsx` and `src/app/(auth)/signup/page.tsx` to show the login/signup forms again.
