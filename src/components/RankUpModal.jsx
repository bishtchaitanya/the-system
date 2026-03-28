import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function RankUpModal({ rank, onClose }) {
  // Auto close after 6 seconds
  useEffect(() => {
    if (!rank) return
    const timer = setTimeout(onClose, 6000)
    return () => clearTimeout(timer)
  }, [rank, onClose])

  return (
    <AnimatePresence>
      {rank && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
        >
          {/* Ripple rings */}
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                position: 'absolute',
                width: 160,
                height: 160,
                borderRadius: '50%',
                border: `1px solid ${rank.color}`,
                pointerEvents: 'none',
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            style={{
              textAlign: 'center',
              padding: '56px 48px',
              background: '#0a0a0f',
              border: `1px solid ${rank.color}44`,
              borderRadius: 20,
              maxWidth: 420,
              width: '90%',
              position: 'relative',
              zIndex: 1,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* System label */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                color: rank.color,
                fontSize: 11,
                letterSpacing: '0.2em',
                marginBottom: 28,
                fontWeight: 600,
              }}
            >
              [ SYSTEM NOTIFICATION ]
            </motion.p>

            {/* Rank badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 150, damping: 12 }}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: `3px solid ${rank.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                fontWeight: 900,
                color: rank.color,
                margin: '0 auto 28px',
                background: rank.color + '11',
              }}
            >
              {rank.rank}
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p style={{
                color: '#64748b',
                fontSize: 14,
                marginBottom: 8,
                letterSpacing: '0.05em',
              }}>
                Rank up achieved
              </p>
              <h2 style={{
                color: rank.color,
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: '0.05em',
                marginBottom: 16,
              }}>
                {rank.label}
              </h2>
              <p style={{
                color: '#94a3b8',
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 32,
              }}>
                The System acknowledges your growth.<br />
                You have proven yourself worthy of a higher rank.<br />
                Continue forward, Hunter.
              </p>
            </motion.div>

            {/* Dismiss button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={{
                padding: '13px 40px',
                background: rank.color + '22',
                border: `1px solid ${rank.color}`,
                borderRadius: 10,
                color: rank.color,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.12em',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              I ACCEPT
            </motion.button>

            {/* Auto-dismiss hint */}
            <p style={{
              color: '#334155',
              fontSize: 11,
              marginTop: 16,
            }}>
              Closes automatically in 6 seconds
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}