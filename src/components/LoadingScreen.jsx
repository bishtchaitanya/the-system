import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  'Initialising The System...',
  'Scanning hunter biometrics...',
  'Loading quest board...',
  'Calibrating XP engine...',
  'The System is ready.',
]

export default function LoadingScreen({ onComplete }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  // Cycle through messages every 700ms
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => {
        if (prev < MESSAGES.length - 1) return prev + 1
        clearInterval(interval)
        return prev
      })
    }, 700)
    return () => clearInterval(interval)
  }, [])

  // Smooth progress bar over 3.5s
  useEffect(() => {
    const start = Date.now()
    const duration = 3500
    const frame = () => {
      const elapsed = Date.now() - start
      const p = Math.min((elapsed / duration) * 100, 100)
      setProgress(p)
      if (p < 100) {
        requestAnimationFrame(frame)
      } else {
        setTimeout(() => setReady(true), 300)
      }
    }
    requestAnimationFrame(frame)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 32,
    }}>
      {/* Ripple rings — always visible */}
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          initial={{ scale: 0.6, opacity: 0.4 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{
            duration: 2.5,
            delay: i * 0.5,
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
          style={{
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '1px solid #60a5fa',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          color: '#f1f5f9',
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: '0.2em',
          marginBottom: 6,
          zIndex: 1,
        }}
      >
        THE SYSTEM
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          color: '#334155',
          fontSize: 12,
          letterSpacing: '0.15em',
          marginBottom: 56,
          zIndex: 1,
        }}
      >
        HUNTER HABIT TRACKER
      </motion.p>

      {/* Progress bar + messages — hide when ready */}
      <div style={{
        width: '100%',
        maxWidth: 320,
        zIndex: 1,
      }}>
        <AnimatePresence mode="wait">
          {!ready ? (
            <motion.div
              key="loading"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                height: 2,
                background: '#1e293b',
                borderRadius: 1,
                overflow: 'hidden',
                marginBottom: 16,
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: '#60a5fa',
                  borderRadius: 1,
                  transition: 'width 0.05s linear',
                }} />
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    color: '#475569',
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    textAlign: 'center',
                  }}
                >
                  {MESSAGES[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Arise button */
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
              style={{ textAlign: 'center' }}
            >
              <p style={{
                color: '#60a5fa',
                fontSize: 11,
                letterSpacing: '0.2em',
                marginBottom: 20,
              }}>
                [ THE SYSTEM IS READY ]
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                animate={{
                  boxShadow: [
                    '0 0 0px #60a5fa00',
                    '0 0 24px #60a5fa66',
                    '0 0 0px #60a5fa00',
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                style={{
                  padding: '14px 52px',
                  background: 'transparent',
                  border: '1px solid #60a5fa',
                  borderRadius: 10,
                  color: '#60a5fa',
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                ARISE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom version tag */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          position: 'absolute',
          bottom: 32,
          color: '#1e293b',
          fontSize: 11,
          letterSpacing: '0.1em',
        }}
      >
        v0.1.0 — MVP
      </motion.p>
    </div>
  )
}