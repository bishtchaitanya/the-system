import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getRank } from '../store/useStore'

function SettingRow({ label, sub, children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 0',
      borderBottom: '1px solid #1e293b',
      gap: 16,
    }}>
      <div>
        <p style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>{label}</p>
        {sub && <p style={{ color: '#475569', fontSize: 12, marginTop: 3 }}>{sub}</p>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function DangerModal({ isOpen, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 40,
            }}
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#0f172a',
              border: '1px solid #ef444433',
              borderRadius: 16,
              padding: '36px 32px',
              zIndex: 50,
              maxWidth: 380,
              width: '90%',
              textAlign: 'center',
            }}
          >
            <p style={{
              color: '#ef4444',
              fontSize: 11,
              letterSpacing: '0.15em',
              marginBottom: 16,
            }}>
              [ SYSTEM WARNING ]
            </p>
            <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
              Reset all data?
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: 13,
              lineHeight: 1.7,
              marginBottom: 28,
            }}>
              This will permanently delete your hunter profile,
              all habits, XP, and logs. Your rank will be lost.
              The System does not offer second chances.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onCancel}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: '1px solid #1e293b',
                  borderRadius: 10,
                  color: '#64748b',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ef444422',
                  border: '1px solid #ef4444',
                  borderRadius: 10,
                  color: '#ef4444',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                RESET
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Settings({ hunter, onReset, onNameChange }) {
  const [showReset, setShowReset] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(hunter.name)
  const [saved, setSaved] = useState(false)

  const rank = getRank(hunter.totalXP)

  function handleNameSave() {
    if (!newName.trim()) return
    onNameChange(newName.trim())
    setEditingName(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleReset() {
    setShowReset(false)
    onReset()
  }

  const joinedDate = new Date(hunter.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div style={{
      maxWidth: 640,
      margin: '0 auto',
      padding: '32px 20px 80px',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: '#60a5fa', fontSize: 11, letterSpacing: '0.15em', marginBottom: 6 }}>
          [ SYSTEM SETTINGS ]
        </p>
        <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 700 }}>
          Hunter Config
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          Manage your profile and data.
        </p>
      </div>

      {/* Hunter summary card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#0f172a',
          border: `1px solid ${rank.color}33`,
          borderRadius: 16,
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 32,
        }}
      >
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: `2px solid ${rank.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          fontWeight: 900,
          color: rank.color,
          flexShrink: 0,
        }}>
          {rank.rank}
        </div>
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700 }}>
            {hunter.name}
          </h2>
          <p style={{ color: rank.color, fontSize: 13, marginTop: 2 }}>
            {hunter.title}
          </p>
          <p style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>
            Awakened on {joinedDate}
          </p>
        </div>
      </motion.div>

      {/* Profile settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: 16,
          padding: '4px 24px',
          marginBottom: 16,
        }}
      >
        <SettingRow
          label="Hunter name"
          sub={editingName ? 'Press Enter or Save to confirm' : hunter.name}
        >
          {editingName ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                style={{
                  padding: '7px 12px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  color: '#f1f5f9',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  width: 130,
                }}
              />
              <button
                onClick={handleNameSave}
                style={{
                  padding: '7px 14px',
                  background: '#1d4ed8',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              style={{
                padding: '7px 16px',
                background: 'transparent',
                border: '1px solid #1e293b',
                borderRadius: 8,
                color: '#64748b',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Edit
            </button>
          )}
        </SettingRow>

        <SettingRow
          label="Current rank"
          sub={`${hunter.totalXP.toLocaleString()} XP earned`}
        >
          <span style={{ color: rank.color, fontWeight: 700, fontSize: 14 }}>
            {rank.label}
          </span>
        </SettingRow>

        <SettingRow
          label="Hunter title"
          sub="Assigned by The System"
        >
          <span style={{ color: '#94a3b8', fontSize: 13 }}>
            {hunter.title}
          </span>
        </SettingRow>

        <SettingRow
          label="Active quests"
          sub="Habits currently tracked"
        >
          <span style={{ color: '#94a3b8', fontSize: 13 }}>
            {hunter.goals?.length > 0
              ? hunter.goals.join(', ').toLowerCase().replace(/_/g, ' ')
              : 'All categories'}
          </span>
        </SettingRow>
      </motion.div>

      {/* Saved confirmation */}
      <AnimatePresence>
        {saved && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ color: '#4ade80', fontSize: 13, textAlign: 'center', marginBottom: 16 }}
          >
            ✓ Name updated successfully
          </motion.p>
        )}
      </AnimatePresence>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: '#0f172a',
          border: '1px solid #ef444422',
          borderRadius: 16,
          padding: '20px 24px',
          marginTop: 24,
        }}
      >
        <p style={{
          color: '#ef4444',
          fontSize: 11,
          letterSpacing: '0.12em',
          marginBottom: 12,
        }}>
          [ DANGER ZONE ]
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <div>
            <p style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>
              Reset all data
            </p>
            <p style={{ color: '#475569', fontSize: 12, marginTop: 3 }}>
              Wipe your profile, habits, XP and logs. Restart from zero.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowReset(true)}
            style={{
              padding: '9px 18px',
              background: '#ef444415',
              border: '1px solid #ef444444',
              borderRadius: 8,
              color: '#ef4444',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
              letterSpacing: '0.08em',
            }}
          >
            RESET
          </motion.button>
        </div>
      </motion.div>

      <DangerModal
        isOpen={showReset}
        onConfirm={handleReset}
        onCancel={() => setShowReset(false)}
      />
    </div>
  )
}