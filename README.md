# Rubik's Cube Speed Game

**By Baitjet & santosSuccess**

An animated 3D Rubik's Cube that hovers in the center of the screen. Use the keyboard to perform moves, race against the clock, and submit your best times to the leaderboard. Original Rubik's Cube colors and Supabase + Google Auth for the high-score board.

## Features

- **Original colors** — White, yellow, red, orange, green, blue (standard Rubik's scheme)
- **Keyboard controls** — R, L, U, D, F, B (Shift + key for counter-clockwise), Space to scramble
- **Timer** — Starts on first move, stops when the cube is solved
- **Leaderboard** — Sign in with Google and submit your time; view top times

## Run locally

```bash
npm install
npm run dev
```

## Leaderboard (Supabase)

1. Create a [Supabase](https://supabase.com) project.
2. In **Authentication → Providers**, enable **Google** and add your OAuth client ID/secret from [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
3. In **SQL Editor**, run:

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

4. Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Restart the dev server. Sign in with Google and submit a time after solving.

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

## Tech

- React, TypeScript, Vite
- Three.js via `@react-three/fiber` and `@react-three/drei`
- Supabase (Auth + PostgreSQL)

---

**Created by Baitjet & santosSuccess**
