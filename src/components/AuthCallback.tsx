/**
 * Post-auth redirect: Supabase sends users here after Google sign-in.
 * We let the client recover the session from the URL hash, then send them to the main app (leaderboard).
 * Baitjet & santosSuccess
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabase) {
      navigate('/', { replace: true })
      return
    }
    // Let Supabase process the hash and persist the session, then go to home (leaderboard in sidebar)
    const go = () => navigate('/', { replace: true })
    supabase.auth.getSession().then(() => go())
  }, [navigate])

  return (
    <div className="auth-callback">
      <p>Signing you in…</p>
      <p className="auth-callback-hint">You’ll see the leaderboard next.</p>
    </div>
  )
}
