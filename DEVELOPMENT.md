# WorkWise Development Guide

This document outlines the folder structure, naming conventions, and best practices for developing the WorkWise application. Following these guidelines ensures the codebase remains clean, consistent, and maintainable.

## Folder Structure

The project uses a feature-based folder structure within the standard Next.js App Router layout.

```
/
├── public/                 # Static assets
├── src/
│   ├── actions/            # Server Actions (e.g., send-email.ts)
│   ├── ai/                 # Genkit AI flows and configuration
│   │   ├── flows/          # Individual AI flow definitions
│   │   └── genkit.ts       # Genkit client initialization
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/           # Route group for auth pages (login, signup)
│   │   │   ├── page.tsx      # Login page
│   │   │   └── signup/
│   │   │       └── page.tsx  # Signup page
│   │   ├── dashboard/        # Protected routes after login
│   │   │   ├── layout.tsx    # Main dashboard layout with sidebar
│   │   │   ├── page.tsx      # Dashboard overview page
│   │   │   └── profile/      # User profile page
│   │   ├── review-helper/    # Review Helper page
│   │   ├── timesheet/        # Timesheet page
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/           # React components
│   │   ├── dashboard/        # Components specific to the dashboard feature
│   │   ├── providers/        # App-wide context providers (Auth, Theme)
│   │   ├── review-helper/    # Components specific to the Review Helper
│   │   ├── shared/           # Components used across multiple features
│   │   └── ui/               # Shadcn UI components (do not modify directly)
│   ├── hooks/                # Custom React hooks (e.g., use-toast.ts)
│   ├── lib/                  # Utility functions and libraries
│   │   ├── firebase.ts       # Firebase initialization
│   │   ├── types.ts          # TypeScript type definitions
│   │   └── utils.ts          # General utility functions (e.g., cn)
│   └── services/             # Data services (e.g., Firebase queries)
├── .env                    # Environment variables (local dev uses .env.local)
├── next.config.ts          # Next.js configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```

## Naming Conventions

-   **Components**: PascalCase (e.g., `RecentLogs.tsx`, `UserNav.tsx`).
-   **Pages**: Kebab-case for folder names (`review-helper`), `page.tsx` for the file.
-   **Server Actions/Services**: Kebab-case (e.g., `work-log-service.ts`).
-   **Types/Interfaces**: PascalCase, defined in `src/lib/types.ts` (e.g., `WorkLog`).
-   **CSS/Tailwind Classes**: Use semantic and utility-first classes provided by Tailwind.

## Code Style & Best Practices

-   **DRY (Don't Repeat Yourself)**: Create reusable components for UI elements used in multiple places (e.g., `StatsCards`, `UserNav`).
-   **SOLID**:
    -   **Single Responsibility**: Components should have one primary purpose. For example, `RecentLogs` only displays recent logs. `UpsertLogDialog` handles both creating and editing a log.
    -   **Open/Closed**: Components should be open for extension but closed for modification. Use props to customize behavior.
-   **Server Components by Default**: Most pages and layout components should be Server Components unless they require client-side interactivity (`"use client"`).
-   **State Management**:
    -   For global state like user authentication, use React Context (`AuthProvider`).
    -   For data that needs to be shared across a feature layout (like work logs in the dashboard), use a context defined within that layout (`WorkLogContext`).
    -   For local component state, use `useState`.
-   **Data Fetching**: Use Server Actions or dedicated service files (`src/services/`) to interact with the database. This keeps data logic separate from UI components.
-   **Styling**:
    -   Use **Shadcn UI** components from `src/components/ui` as the base.
    -   Use **Tailwind CSS** for all styling. Avoid custom CSS files where possible.
    -   Colors should be mapped to the theme variables in `globals.css` to support light/dark modes.
-   **Icons**: Use the `lucide-react` library for all icons to maintain consistency.
