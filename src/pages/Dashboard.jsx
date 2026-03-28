import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getRank, getNextRank } from '../store/useStore'
import { DIFFICULTY } from '../data/habits'
import AddHabitPanel from '../components/AddHabitPanel'
import RankUpModal from '../components/RankUpModal'


function XPBar({ totalXP }) {
  const rank = getRank(totalXP)
  const next = getNextRank(totalXP)
  const start = rank.minXP
  const end = next ? next.minXP : totalXP
  const progress = next ? ((totalXP - start) / (end - start)) * 100 : 100

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#64748b', fontSize: 12 }}>
          {totalXP.toLocaleString()} XP
        </span>
        <span style={{ color: '#64748b', fontSize: 12 }}>
          {next ? `${next.minXP.toLocaleString()} XP to ${next.rank}-Rank` : 'MAX RANK'}
        </span>
      </div>
      <div style={{
        height: 6,
        background: '#1e293b',
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          style={{
            height: '100%',
            background: rank.color,
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  )
}

function HunterCard({ hunter }) {
  const rank = getRank(hunter.totalXP)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#0f172a',
        border: `1px solid ${rank.color}33`,
        borderRadius: 16,
        padding: '28px 32px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glow in corner */}
      <div style={{
        position: 'absolute',
        top: -40,
        right: -40,
        width: 160,
        height: 160,
        borderRadius: '50%',
        background: `${rank.color}11`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Rank badge */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: `2px solid ${rank.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 900,
          color: rank.color,
          flexShrink: 0,
        }}>
          {rank.rank}
        </div>

        {/* Hunter info */}
        <div style={{ flex: 1 }}>
          <p style={{ color: '#64748b', fontSize: 11, letterSpacing: '0.12em', marginBottom: 2 }}>
            [ HUNTER PROFILE ]
          </p>
          <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700 }}>
            {hunter.name}
          </h2>
          <p style={{ color: rank.color, fontSize: 13, marginTop: 2 }}>
            {hunter.title}
          </p>
        </div>

        {/* Streak */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#f59e0b', fontSize: 24, fontWeight: 700 }}>
            {hunter.streakDays ?? 0}
            <span style={{ fontSize: 14, marginLeft: 2 }}>🔥</span>
          </p>
          <p style={{ color: '#64748b', fontSize: 11 }}>day streak</p>
          {hunter.streakDays >= 7 && (
            <p style={{ color: '#f59e0b', fontSize: 10, marginTop: 2, letterSpacing: '0.06em' }}>
              ×{hunter.streakDays >= 365 ? '5.0' :
                hunter.streakDays >= 100 ? '3.0' :
                hunter.streakDays >= 30 ? '2.0' : '1.5'} XP
            </p>
          )}
        </div>
      </div>

      <XPBar totalXP={hunter.totalXP} />
    </motion.div>
  )
}

function XPPopup({ xp, id }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -60 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: '40%',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#f59e0b',
        fontSize: 28,
        fontWeight: 900,
        pointerEvents: 'none',
        zIndex: 100,
        textShadow: '0 0 20px #f59e0b88',
      }}
    >
      +{xp} XP
    </motion.div>
  )
}

function HabitCard({ habit, isCompleted, onComplete, onDelete }) {
  const diff = DIFFICULTY[habit.difficulty]
  const [showDelete, setShowDelete] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleDelete(e) {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete(habit.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isCompleted ? 0.5 : 1, y: 0 }}
      onHoverStart={() => setShowDelete(true)}
      onHoverEnd={() => { setShowDelete(false); setConfirmDelete(false) }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        background: '#0f172a',
        border: `1px solid ${confirmDelete ? '#ef444444' : '#1e293b'}`,
        borderRadius: 12,
        marginBottom: 10,
        cursor: isCompleted ? 'default' : 'pointer',
        transition: 'border-color 0.2s',
        position: 'relative',
      }}
      whileHover={!isCompleted ? { borderColor: diff.color + '66' } : {}}
      onClick={() => !isCompleted && onComplete(habit.id)}
    >
      {/* Checkbox */}
      <motion.div
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          border: `2px solid ${isCompleted ? diff.color : '#334155'}`,
          background: isCompleted ? diff.color + '22' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        animate={isCompleted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
      >
        {isCompleted && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ color: diff.color, fontSize: 14 }}
          >
            ✓
          </motion.span>
        )}
      </motion.div>

      {/* Habit name */}
      <div style={{ flex: 1 }}>
        <p style={{
          color: isCompleted ? '#475569' : '#e2e8f0',
          fontSize: 15,
          fontWeight: 500,
          textDecoration: isCompleted ? 'line-through' : 'none',
        }}>
          {habit.name}
        </p>
        <p style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>
          {habit.category?.replace(/_/g, ' & ')}
        </p>
      </div>

      {/* Difficulty + XP */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <span style={{
          color: diff.color,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
        }}>
          {diff.label}
        </span>
        <p style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
          +{diff.xp} XP
        </p>
      </div>

      {/* Delete button */}
      <AnimatePresence>
        {showDelete && !isCompleted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleDelete}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: confirmDelete ? 'auto' : 24,
              height: 24,
              padding: confirmDelete ? '0 10px' : 0,
              borderRadius: 6,
              background: confirmDelete ? '#ef444422' : '#1e293b',
              border: `1px solid ${confirmDelete ? '#ef4444' : '#334155'}`,
              color: confirmDelete ? '#ef4444' : '#64748b',
              fontSize: confirmDelete ? 10 : 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: confirmDelete ? '0.06em' : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {confirmDelete ? 'CONFIRM?' : '×'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function RaidPreviewCard({ activeRaids, onGoToRaids }) {
  if (activeRaids.length === 0) return null
  const raid = activeRaids[0]
  const pct = Math.max(0, (raid.currentHP / raid.maxHP) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onGoToRaids}
      style={{
        background: '#0f172a',
        border: `1px solid ${raid.color}44`,
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 16,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <p style={{ color: raid.color, fontSize: 10, letterSpacing: '0.12em', marginBottom: 3 }}>
            [ {raid.type.toUpperCase()} RAID ACTIVE ]
          </p>
          <p style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>
            {raid.name}
          </p>
        </div>
        <p style={{ color: '#64748b', fontSize: 12 }}>
          {raid.currentHP}/{raid.maxHP} HP
        </p>
      </div>
      <div style={{ height: 4, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
          style={{
            height: '100%',
            background: pct > 50 ? raid.color : pct > 25 ? '#f59e0b' : '#ef4444',
            borderRadius: 2,
          }}
        />
      </div>
      <p style={{ color: '#334155', fontSize: 11, marginTop: 8 }}>
        Tap to view full raid → Complete habits to deal damage
      </p>
    </motion.div>
  )
}

export default function Dashboard({ hunter, habits, logs, completeHabit, addHabit, removeHabit, activeRaids, onGoToRaids }) {
  const [popups, setPopups] = useState([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [rankUpData, setRankUpData] = useState(null)
  const prevRankRef = useRef(null)
  

  const today = new Date().toDateString()
  const completedToday = logs
    .filter(l => new Date(l.completedAt).toDateString() === today)
    .map(l => l.habitId)

  const completedCount = habits.filter(h => completedToday.includes(h.id)).length
  const totalCount = habits.length
  const allDone = completedCount === totalCount && totalCount > 0

useEffect(() => {
    if (!hunter) return
    const currentRank = getRank(hunter.totalXP)
    if (prevRankRef.current && prevRankRef.current !== currentRank.rank) {
      setRankUpData(currentRank)
    }
    prevRankRef.current = currentRank.rank
  }, [hunter?.totalXP])

  function handleComplete(habitId) {
    const result = completeHabit(habitId)
    if (!result) return

    const { xpEarned, bonusXP, newlyCleared } = result

    // Show XP popup
    if (xpEarned) {
      const id = Date.now()
      setPopups(prev => [...prev, { id, xp: xpEarned }])
      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== id))
      }, 1400)
    }

    // Show bonus XP popup if a raid was cleared
    if (bonusXP > 0) {
      const id = Date.now() + 1
      setTimeout(() => {
        setPopups(prev => [...prev, { id, xp: bonusXP }])
        setTimeout(() => {
          setPopups(prev => prev.filter(p => p.id !== id))
        }, 1400)
      }, 600)
    }
  }

  return (
    <div style={{
      maxWidth: 640,
      margin: '0 auto',
      padding: '32px 20px',
      minHeight: '100vh',
    }}>
      {/* XP Popups */}
      <AnimatePresence>
        {popups.map(p => <XPPopup key={p.id} id={p.id} xp={p.xp} />)}
      </AnimatePresence>

      {/* Header */}
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: '#60a5fa', fontSize: 11, letterSpacing: '0.15em', marginBottom: 6 }}>
          [ DAILY QUEST BOARD ]
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 700 }}>
            {getGreeting()}, {hunter.name}
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPanelOpen(true)}
            style={{
              padding: '8px 16px',
              background: '#1d4ed8',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
            }}
          >
            + ADD QUEST
          </motion.button>
        </div>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          {allDone
            ? '✦ All quests complete. The System acknowledges your efforts.'
            : `${totalCount - completedCount} quest${totalCount - completedCount !== 1 ? 's' : ''} remaining today.`}
        </p>
      </div>
    
      <RaidPreviewCard activeRaids={activeRaids} onGoToRaids={onGoToRaids} />

      {/* Hunter Card */}
      <HunterCard hunter={hunter} />

      {/* Daily progress summary */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
          Today's Quests
        </p>
        <p style={{ color: '#64748b', fontSize: 13 }}>
          {completedCount} / {totalCount} complete
        </p>
      </div>

      {/* Progress bar for daily quests */}
      <div style={{
        height: 4,
        background: '#1e293b',
        borderRadius: 2,
        marginBottom: 20,
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
          style={{ height: '100%', background: '#60a5fa', borderRadius: 2 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Habit list */}
      {habits.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: '#475569',
        }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No quests assigned yet.</p>
          <p style={{ fontSize: 13 }}>The System awaits your first habit.</p>
        </div>
      ) : (
        <motion.div layout>
          {/* Incomplete first */}
          {habits
            .filter(h => !completedToday.includes(h.id))
            .map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={false}
                onComplete={handleComplete}
                onDelete={removeHabit}
              />
            ))}
          {habits
            .filter(h => completedToday.includes(h.id))
            .map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={true}
                onComplete={handleComplete}
                onDelete={removeHabit}
              />
            ))}
        </motion.div>
      )}

      {/* All done banner */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: 24,
              padding: '20px 24px',
              background: '#0f172a',
              border: '1px solid #1d4ed8',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#60a5fa', fontSize: 13, letterSpacing: '0.1em', marginBottom: 6 }}>
              [ SYSTEM NOTIFICATION ]
            </p>
            <p style={{ color: '#f1f5f9', fontWeight: 600 }}>
              All daily quests complete.
            </p>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
              Return tomorrow to continue your growth.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <AddHabitPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        onAdd={addHabit}
      />

      <RankUpModal
        rank={rankUpData}
        onClose={() => setRankUpData(null)}
      />
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}