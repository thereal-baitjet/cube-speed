# Rubik's Cube Speed Game

**By Baitjet & santosSuccess**

![Rubik's Cube](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Rubik%27s_cube.svg/220px-Rubik%27s_cube.svg.png)

*Original colors · 3D · Speed solve · Leaderboard*

[![Vercel](https://img.shields.io/badge/vercel-live-black?logo=vercel)](https://rubiks-cube-game.vercel.app)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ecf8e?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An animated 3D Rubik's Cube that hovers in the center of the screen. Use the keyboard to perform moves, race against the clock, and submit your best times to the leaderboard. Original Rubik's Cube colors and Supabase + Google Auth for the high-score board.

## Table of contents

- [Features](#features)
- [Live demo](#live-demo)
- [Run locally](#run-locally)
- [Connect Auth (Google + Supabase)](#connect-auth-google--supabase)
- [Controls](#controls)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

## Features

- **Original colors** — White, yellow, red, orange, green, blue (standard Rubik's scheme)
- **Keyboard controls** — R, L, U, D, F, B (Shift + key for counter-clockwise), Space to scramble
- **Timer** — Starts on first move, stops when the cube is solved
- **Leaderboard** — Sign in with Google and submit your time; view top times

## Live demo

**[→ Open app](https://rubiks-cube-game.vercel.app)**

Production build on Vercel: **https://rubiks-cube-game.vercel.app** **https://rubiks-cube-game-l9yuefwn8-thereal-baitjets-projects.vercel.app**

## Run locally

```bash
npm install
npm run dev
```

## Connect Auth (Google + Supabase)

Do this once so "Sign in with Google" and the leaderboard work (locally and on Vercel).

### 1. Supabase project

- Create a project at [supabase.com](https://supabase.com).
- In **Settings → API** copy **Project URL** and **anon public** key (for `.env` and Vercel).

### 2. Google OAuth credentials

- Open [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and select (or create) a project.
- **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
- Application type: **Web application**.
- **Authorized redirect URIs** — add:
  - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`  
    (replace `YOUR_PROJECT_REF` with your Supabase project ref from the URL, e.g. `abcdefghijk`).
- Create and copy the **Client ID** and **Client secret**.

### 3. Supabase: enable Google provider

- In Supabase: **Authentication → Providers → Google**.
- Enable Google and paste the **Client ID** and **Client secret**.
- Save.

### 4. Supabase: redirect URLs (route after auth)

After Google sign-in, Supabase sends users to `/auth/callback`; the app then shows the main page with the leaderboard.

- **Supabase** → **Authentication → URL Configuration** → **Redirect URLs**.
- Add the **full** URL including `https://` (Supabase will redirect to the wrong place if you omit it):
  - **Production:** `https://rubiks-cube-game.vercel.app/auth/callback` (or your deployment URL + `/auth/callback`)
  - **Local:** `http://localhost:5173/auth/callback`
- Set **Site URL** to your app root, e.g. `https://your-app.vercel.app` (with `https://`).

### 5. Environment variables

- **Local:** copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **Vercel:** Project → **Settings → Environment Variables**. Add:
  - `VITE_SUPABASE_URL` = your Supabase project URL
  - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key  
  Then redeploy so the build picks them up.

### 6. Leaderboard table

In Supabase **SQL Editor**, run:

```sql
create table leaderboard (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  display_name text,
  time_ms integer not null,
  created_at timestamptz default now()
);

alter table leaderboard enable row level security;

create policy "Anyone can read leaderboard"
  on leaderboard for select using (true);

create policy "Users can insert own row"
  on leaderboard for insert with check (auth.uid() = user_id);
```

After the table exists, restart the dev server (or redeploy on Vercel). Sign in with Google and submit a time after solving.

### Verify before go live

1. **Production env vars** — Vercel → your project → **Settings → Environment Variables**. Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set. If you added or changed them, redeploy (Deployments → … → Redeploy or push a commit).
2. **Supabase redirect URLs** — Supabase → **Authentication → URL Configuration**. Ensure **Redirect URLs** includes your production URL (e.g. `https://rubiks-cube-game.vercel.app` and `https://rubiks-cube-game.vercel.app/`).
3. **Test the flow** — Open the production URL → **Sign in with Google** → complete sign-in → you should land back and see **Sign out**. Solve the cube and **Submit my time**; the leaderboard should update.

## Controls

| Key     | Move   | Key (with Shift) | Move  |
|---------|--------|-------------------|-------|
| R       | R      | Shift+R           | R'    |
| L       | L      | Shift+L           | L'    |
| U       | U      | Shift+U           | U'    |
| D       | D      | Shift+D           | D'    |
| F       | F      | Shift+F           | F'    |
| B       | B      | Shift+B           | B'    |
| Space   | Scramble | —               | —     |

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Three.js](https://threejs.org/) via [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Drei](https://github.com/pmndrs/drei)
- [Supabase](https://supabase.com/) (Auth + PostgreSQL)

## Project structure

```
src/
├── App.tsx              # Routes, game layout, cube + sidebar
├── main.tsx
├── cube/
│   ├── colors.ts        # Original face colors
│   ├── state.ts         # Cube state, moves, scramble, solve check
│   └── CubeVisual.tsx   # 3D cube (R3F)
├── components/
│   ├── Leaderboard.tsx  # Leaderboard, Sign in with Google, submit time
│   └── AuthCallback.tsx # Post-OAuth redirect handler
├── hooks/
│   ├── useTimer.ts
│   └── useKeyboardMoves.ts
└── lib/
    ├── supabase.ts
    └── leaderboard.ts
```

## Contributing

PRs and issues welcome. By **Baitjet** & **santosSuccess**.

## License

[MIT](LICENSE)

## Credits

**Created by Baitjet & santosSuccess**
