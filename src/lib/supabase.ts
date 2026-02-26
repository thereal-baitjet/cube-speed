/**
 * Supabase client — Baitjet & santosSuccess
 */
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL ?? ''
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = url && anon ? createClient(url, anon) : null

export type LeaderboardRow = {
  id: string
  user_id: string
  display_name: string | null
  time_ms: number
  created_at: string
}
