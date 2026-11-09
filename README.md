# ProjectContinuum

A personal webpage project inspired by the Fate franchise. Currently in development.

## ProjectContinuum is a single-page web app for a Fate-inspired D&D campaign. It’s a React frontend that talks straight to Supabase, with no server code of my own.

Frontend:

React 19 with React DOM 19.
Vite 8 is the dev server and bundler, with the @vitejs/plugin-react plugin.
React Router 7 (react-router-dom) handles the pages.
TypeScript syntax in .tsx files.
Plain CSS, with one stylesheet next to most components and theme variables.
oxlint for linting, with the React hooks rules.
State lives in React hooks plus a single auth context that holds the session, role, display name and timeout.

Backend: Supabase (hosted Postgres, using the browser client)

Auth: email and password. GM status is a role: 'gm' value in the user’s app_metadata, which users can’t edit themselves.
Database: Servants, and the forum tables profiles, topics, threads and posts.
Row-level security (RLS): the forum tables have RLS policies, and writes are limited to specific columns.
Functions: create_thread, set_thread_pinned, timeout_user, list_users_for_gm, plus helpers is_gm and is_timed_out.
Storage: served from a public Supabase Storage bucket.

Tooling and hosting

Package manager: npm. Source control: git with GitHub,

This project has the following public features:

-User auth and roles managed by Supabase
-Public forum with topics, threads and posts where any authenticated user can create and comment posts
-Download links to the Fate/Lost Continuum DnD game manual (WIP)

For admins it also has the following features:

-Admin panel and protected view
-Servant filter and search function, with its corresponding document URL
-User timeout function
