/**
 * Leaderboard fetch & submit — Baitjet & santosSuccess
 */
import { supabase, type LeaderboardRow } from './supabase'

const TABLE = 'leaderboard'
const LIMIT = 50

export async function fetchLeaderboard(): Promise<LeaderboardRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, user_id, display_name, time_ms, created_at')
    .order('time_ms', { ascending: true })
    .limit(LIMIT)
  if (error) return []
  return (data ?? []) as LeaderboardRow[]
}

export async function submitTime(timeMs: number): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase not configured' }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in' }
  const displayName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? 'Anonymous'
  const { error } = await supabase.from(TABLE).insert({
    user_id: user.id,
    display_name: displayName,
    time_ms: timeMs,
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
