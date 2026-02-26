/**
 * Leaderboard panel — Baitjet & santosSuccess
 */
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { fetchLeaderboard, submitTime } from '../lib/leaderboard'
import type { LeaderboardRow } from '../lib/supabase'

export function Leaderboard({
  justSolvedTimeMs,
  onSubmitted,
}: {
  justSolvedTimeMs: number | null
  onSubmitted: () => void
}) {
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string; name?: string } } | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const data = await fetchLeaderboard()
      if (!cancelled) setRows(data)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [justSolvedTimeMs])

  useEffect(() => {
    if (!supabase) return
    // Recover session from URL hash after OAuth redirect, then validate with server
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async () => {
    if (justSolvedTimeMs == null) return
    setSubmitting(true)
    setSubmitError(null)
    const result = await submitTime(justSolvedTimeMs)
    setSubmitting(false)
    if (result.ok) {
      onSubmitted()
      const data = await fetchLeaderboard()
      setRows(data)
    } else setSubmitError(result.error ?? 'Failed')
  }

  const signIn = async () => {
    if (!supabase) return
    setAuthError(null)
    const redirectTo = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) {
      if (error.message?.includes('not enabled') || error.message?.includes('Unsupported provider') || (error as { code?: string }).code === '400') {
        setAuthError('Google sign-in is not enabled. In Supabase: Authentication → Providers → Google → enable and add Client ID & Secret.')
      } else {
        setAuthError(error.message ?? 'Sign-in failed')
      }
    }
  }

  const signOut = () => {
    supabase?.auth.signOut()
  }

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const sec = s % 60
    const tenths = Math.floor((ms % 1000) / 100)
    return `${m > 0 ? `${m}:` : ''}${sec.toString().padStart(m > 0 ? 2 : 1, '0')}.${tenths}`
  }

  return (
    <div className="leaderboard-panel">
      <h3>Leaderboard — Baitjet & santosSuccess</h3>
      {!supabase && (
        <p className="leaderboard-hint">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable.</p>
      )}
      {supabase && !user && (
        <>
          <button type="button" className="btn btn-google" onClick={signIn}>
            Sign in with Google
          </button>
          <p className="leaderboard-hint redirect-hint">
            Add this in Supabase → Auth → URL Configuration → Redirect URLs:
          </p>
          <code className="redirect-uri">
            {typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''}
          </code>
          {authError && <p className="submit-error">{authError}</p>}
        </>
      )}
      {supabase && user && justSolvedTimeMs != null && (
        <button
          type="button"
          className="btn btn-submit"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting…' : 'Submit my time'}
        </button>
      )}
      {submitError && <p className="submit-error">{submitError}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ol className="leaderboard-list">
          {rows.map((row, i) => (
            <li key={row.id}>
              <span className="rank">#{i + 1}</span>
              <span className="name">{row.display_name ?? 'Anonymous'}</span>
              <span className="time">{formatTime(row.time_ms)}</span>
            </li>
          ))}
        </ol>
      )}
      {supabase && user && (
        <button type="button" className="btn btn-out" onClick={signOut}>
          Sign out
        </button>
      )}
    </div>
  )
}
