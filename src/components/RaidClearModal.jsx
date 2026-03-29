import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ARTIFACTS } from '../data/raids'

export default function RaidClearModal({ raid, onClose }) {
  const [phase, setPhase] = useState('impact')

  useEffect(() => {
    if (!raid) return

    // Reset to impact phase every time a new raid clears
    setPhase('impact')

    const t1 = setTimeout(() => setPhase('reveal'), 2000)
    const t2 = setTimeout(() => setPhase('rewards'), 2000)
    const t3 = setTimeout(onClose, 8000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [raid, onClose])

  if (!raid) return null

  const artifact = raid.reward?.artifact ? ARTIFACTS[raid.reward.artifact] : null

  return (
    <AnimatePresence>
      {raid && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(6px)',
          }}
          onClick={onClose}
        >
          {/* Shockwave rings */}
          {[1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{
                duration: 1.8,
                delay: i * 0.15,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                width: 100,
                height: 100,
                borderRadius: '50%',
                border: `2px solid ${raid.color}`,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Vertical light beam */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 1, 0], opacity: [0, 0.6, 0.6, 0] }}
            transition={{ duration: 1.2, times: [0, 0.2, 0.8, 1] }}
            style={{
              position: 'absolute',
              width: 2,
              height: '100vh',
              background: `linear-gradient(to bottom, transparent, ${raid.color}, transparent)`,
              pointerEvents: 'none',
            }}
          />

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 100, damping: 14, delay: 0.3 }}
            style={{
              textAlign: 'center',
              padding: '52px 44px',
              background: '#0a0a0f',
              border: `1px solid ${raid.color}66`,
              borderRadius: 20,
              maxWidth: 440,
              width: '90%',
              position: 'relative',
              zIndex: 1,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* System label */}
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                color: raid.color,
                fontSize: 11,
                letterSpacing: '0.2em',
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              [ RAID CLEARED ]
            </motion.p>

            {/* Boss name */}
            <AnimatePresence mode="wait">
              {phase === 'impact' && (
                <motion.div
                  key="impact"
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <p style={{
                    color: '#f1f5f9',
                    fontSize: 13,
                    letterSpacing: '0.08em',
                    marginBottom: 12,
                    color: '#64748b',
                  }}>
                    {raid.threat}
                  </p>
                  <h2 style={{
                    color: '#f1f5f9',
                    fontSize: 26,
                    fontWeight: 900,
                    lineHeight: 1.2,
                    marginBottom: 24,
                  }}>
                    {raid.name}
                  </h2>
                  <p style={{
                    color: raid.color,
                    fontSize: 32,
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                  }}>
                    DEFEATED
                  </p>
                </motion.div>
              )}

              {phase === 'reveal' && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 style={{
                    color: '#f1f5f9',
                    fontSize: 22,
                    fontWeight: 900,
                    marginBottom: 8,
                  }}>
                    {raid.name}
                  </h2>
                  <p style={{
                    color: raid.color,
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 24,
                    letterSpacing: '0.08em',
                  }}>
                    DEFEATED
                  </p>
                  <p style={{
                    color: '#94a3b8',
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}>
                    The gate has been cleared.<br />
                    The System acknowledges your dedication.
                  </p>
                </motion.div>
              )}

              {phase === 'rewards' && (
                <motion.div
                  key="rewards"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 style={{
                    color: '#f1f5f9',
                    fontSize: 20,
                    fontWeight: 900,
                    marginBottom: 20,
                  }}>
                    {raid.name}
                  </h2>

                  {/* Rewards */}
                  <p style={{
                    color: '#64748b',
                    fontSize: 11,
                    letterSpacing: '0.15em',
                    marginBottom: 14,
                  }}>
                    REWARDS OBTAINED
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                    {/* XP reward */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: '#f59e0b11',
                        border: '1px solid #f59e0b33',
                        borderRadius: 10,
                      }}
                    >
                      <p style={{ color: '#94a3b8', fontSize: 13 }}>Bonus XP</p>
                      <p style={{ color: '#f59e0b', fontSize: 18, fontWeight: 700 }}>
                        +{raid.reward.xp.toLocaleString()} XP
                      </p>
                    </motion.div>

                    {/* Artifact reward */}
                    {artifact && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          background: `${raid.color}11`,
                          border: `1px solid ${raid.color}33`,
                          borderRadius: 10,
                        }}
                      >
                        <p style={{ color: '#94a3b8', fontSize: 13 }}>Artifact</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{artifact.icon}</span>
                          <p style={{ color: raid.color, fontSize: 13, fontWeight: 600 }}>
                            {artifact.name}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    style={{
                      padding: '13px 40px',
                      background: raid.color + '22',
                      border: `1px solid ${raid.color}`,
                      borderRadius: 10,
                      color: raid.color,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    CLAIM REWARDS
                  </motion.button>

                  <p style={{ color: '#1e293b', fontSize: 11, marginTop: 12 }}>
                    Closes automatically
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}