# WorkWise: Work Log & Review Helper

Welcome to WorkWise! This is a Next.js application designed to help you log your daily work and streamline your performance reviews with the help of AI.

## Features

*   **Log Work Entries**: Easily record your daily tasks, accomplishments, and challenges.
*   **AI-Powered Review Helper**: Use Google's Gemini AI to analyze your work logs and generate summaries or answer questions for your performance reviews.
*   **Dashboard Overview**: Visualize your activity with stats, charts, and a list of recent logs.
*   **Firebase Integration**: Your data is securely stored and managed in Firebase Firestore.
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
```

#### 1. How to get Firebase credentials

This application uses Firebase Firestore to store work log data.

1.  **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Create a Web App**: In your project's dashboard, click the Web icon (`</>`) to add a new web app. After registering the app, Firebase will provide you with a `firebaseConfig` object.
3.  **Copy Credentials**: Copy the corresponding values from the `firebaseConfig` object into your `.env.local` file.
4.  **Set up Firestore**:
    *   In the Firebase Console, go to **Build > Firestore Database** and click **Create database**.
    *   Start in **production mode** and select a location.
    *   Go to the **Rules** tab and replace the default rules with the following to allow access during development. **Note**: These rules are insecure and should be replaced with proper authentication rules for a production environment.
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if true;
        }
      }
    }
    ```
    *   Click **Publish**.

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
6.  **Uncomment function bodies**: Uncomment the code inside the `signInWithGoogle`, `signUpWithEmail`, `signInWithEmail`, and `signOut` functions.
7.  **Restore Login/Signup Pages**: You will need to revert the changes in `src/app/page.tsx` and `src/app/signup/page.tsx` to show the login/signup forms again.
