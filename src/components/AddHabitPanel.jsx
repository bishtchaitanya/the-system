import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HABIT_CATEGORIES, DIFFICULTY } from '../data/habits'

const CATEGORY_KEYS = Object.keys(HABIT_CATEGORIES)

export default function AddHabitPanel({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('HEALTH')
  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!name.trim()) {
      setError('The System requires a quest name.')
      return
    }
    onAdd({ name: name.trim(), category, difficulty })
    setName('')
    setCategory('HEALTH')
    setDifficulty('MEDIUM')
    setError('')
    onClose()
  }

  function handleClose() {
    setName('')
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 40,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: 420,
              background: '#0f172a',
              borderLeft: '1px solid #1e293b',
              zIndex: 50,
              padding: '40px 32px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <p style={{
                color: '#60a5fa',
                fontSize: 11,
                letterSpacing: '0.15em',
                marginBottom: 8,
              }}>
                [ NEW QUEST ]
              </p>
              <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700 }}>
                Define your quest
              </h2>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
                The System will track your progress daily.
              </p>
            </div>

            {/* Quest name */}
            <div style={{ marginBottom: 24 }}>
              <label style={styles.label}>Quest name</label>
              <input
                autoFocus
                value={name}
                onChange={e => { setName(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="e.g. Morning run for 20 minutes"
                style={styles.input}
              />
              {error && (
                <p style={{ color: '#f87171', fontSize: 12, marginTop: 6 }}>{error}</p>
              )}
            </div>

            {/* Category */}
            <div style={{ marginBottom: 24 }}>
              <label style={styles.label}>Category</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CATEGORY_KEYS.map(key => {
                  const selected = category === key
                  return (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCategory(key)}
                      style={{
                        ...styles.optionBtn,
                        borderColor: selected ? '#60a5fa' : '#1e293b',
                        background: selected ? 'rgba(96,165,250,0.1)' : 'transparent',
                        color: selected ? '#60a5fa' : '#64748b',
                      }}
                    >
                      {HABIT_CATEGORIES[key]}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: 32 }}>
              <label style={styles.label}>Difficulty</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {Object.entries(DIFFICULTY).map(([key, diff]) => {
                  const selected = difficulty === key
                  return (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setDifficulty(key)}
                      style={{
                        padding: '12px 8px',
                        border: `1px solid ${selected ? diff.color : '#1e293b'}`,
                        borderRadius: 10,
                        background: selected ? diff.color + '18' : 'transparent',
                        color: selected ? diff.color : '#64748b',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: 13,
                        fontWeight: selected ? 600 : 400,
                        textAlign: 'center',
                      }}
                    >
                      <div>{diff.label}</div>
                      <div style={{ fontSize: 11, marginTop: 3, opacity: 0.8 }}>
                        +{diff.xp} XP
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                style={styles.submitBtn}
              >
                ADD QUEST
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleClose}
                style={styles.cancelBtn}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const styles = {
  label: {
    display: 'block',
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: '13px 16px',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 10,
    color: '#f1f5f9',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  optionBtn: {
    padding: '12px 16px',
    border: '1px solid',
    borderRadius: 10,
    textAlign: 'left',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: '#1d4ed8',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  cancelBtn: {
    width: '100%',
    padding: '13px',
    background: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: 10,
    color: '#64748b',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}