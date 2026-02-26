/**
 * Rubik's Cube Speed Game — Baitjet & santosSuccess
 */
import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { CubeVisual } from './cube/CubeVisual'
import {
  createCubeState,
  applyCubeMove,
  applyScramble,
  scrambleMoves,
  isSolved,
  type FaceColor,
  type Move,
} from './cube/state'
import { useTimer } from './hooks/useTimer'
import { useKeyboardMoves } from './hooks/useKeyboardMoves'
import { Leaderboard } from './components/Leaderboard'
import { AuthCallback } from './components/AuthCallback'
import './App.css'

const SCRAMBLE_LENGTH = 22

function Scene({ state }: { state: FaceColor[] }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.4} />
      <group position={[0, 0, 0]}>
        <CubeVisual state={state} />
      </group>
      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2 + 0.2}
      />
    </>
  )
}

export default function App() {
  const [state, setState] = useState<FaceColor[]>(() => createCubeState())
  const [solved, setSolved] = useState(false)
  const [justSolvedTimeMs, setJustSolvedTimeMs] = useState<number | null>(null)
  const { timeMs, running, start, stop, reset, format, getCurrentTimeMs } = useTimer()

  const applyMove = useCallback((move: Move) => {
    setState((prev) => {
      const next = applyCubeMove(prev, move)
      if (isSolved(next)) {
        setSolved(true)
        stop()
        setJustSolvedTimeMs((t) => (t != null ? t : getCurrentTimeMs()))
      }
      return next
    })
  }, [stop, getCurrentTimeMs])

  const doScramble = useCallback(() => {
    setSolved(false)
    setJustSolvedTimeMs(null)
    reset()
    const moves = scrambleMoves(SCRAMBLE_LENGTH)
    setState((prev) => applyScramble(prev, moves))
  }, [reset])

  const onFirstMove = useCallback(() => {
    if (!running && !solved) start()
  }, [running, solved, start])

  useKeyboardMoves(
    (move) => {
      onFirstMove()
      applyMove(move)
    },
    doScramble,
    true
  )

  const handleSubmitted = useCallback(() => {
    setJustSolvedTimeMs(null)
  }, [])

  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/" element={
    <div className="app">
      <header className="header">
        <h1>Rubik's Cube Speed — Baitjet & santosSuccess</h1>
        <p className="tagline">Original colors · Keyboard controls · Compete for the best time</p>
      </header>

      <div className="game-area">
        <div className="canvas-wrap">
          <Canvas
            camera={{ position: [5, 4, 5], fov: 45 }}
            shadows
            gl={{ antialias: true }}
          >
            <Scene state={state} />
          </Canvas>
        </div>

        <div className="sidebar">
          <div className="timer-box">
            <span className="timer-label">Time</span>
            <span className="timer-value">{format(timeMs)}</span>
            {solved && <p className="solved-msg">Solved!</p>}
          </div>
          <button type="button" className="btn btn-scramble" onClick={doScramble}>
            Scramble (Space)
          </button>
          <div className="keys-legend">
            <h4>Controls — Baitjet & santosSuccess</h4>
            <p>R L U D F B = moves</p>
            <p>Shift + key = counter-clockwise</p>
            <p>Space = scramble</p>
          </div>
          <Leaderboard justSolvedTimeMs={justSolvedTimeMs} onSubmitted={handleSubmitted} />
        </div>
      </div>

      <footer className="footer">
        Created by <strong>Baitjet</strong> & <strong>santosSuccess</strong>
      </footer>
    </div>
      } />
    </Routes>
  )
}
