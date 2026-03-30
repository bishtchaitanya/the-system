import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HABIT_CATEGORIES, DIFFICULTY, PRESET_HABITS } from '../data/habits'

const QUESTIONS = [
  {
    id: 'name',
    type: 'text',
    question: 'State your name, Hunter.',
    subtext: 'The System requires identification.',
    placeholder: 'Enter your name...',
  },
  {
    id: 'consistency',
    type: 'choice',
    question: 'How consistent are you with habits currently?',
    subtext: 'The System is assessing your baseline.',
    options: [
      { label: 'I always fail after a few days', value: 0, xp: 0 },
      { label: 'I manage sometimes, but it\'s a struggle', value: 1, xp: 100 },
      { label: 'I\'m fairly consistent with a few habits', value: 2, xp: 300 },
      { label: 'I already have strong habits in place', value: 3, xp: 600 },
    ],
  },
  {
    id: 'goals',
    type: 'multi',
    question: 'What are your primary goals?',
    subtext: 'Select all that apply. The System will assign your quests.',
    options: Object.entries(HABIT_CATEGORIES).map(([key, label]) => ({
      value: key,
      label,
    })),
  },
  {
    id: 'time',
    type: 'choice',
    question: 'How much time can you dedicate daily?',
    subtext: 'Be honest. The System rewards consistency, not ambition.',
    options: [
      { label: 'Less than 15 minutes', value: 'low', xp: 0 },
      { label: '15 – 30 minutes', value: 'medium', xp: 50 },
      { label: '30 – 60 minutes', value: 'high', xp: 100 },
      { label: 'More than an hour', value: 'extreme', xp: 200 },
    ],
  },
  {
    id: 'experience',
    type: 'choice',
    question: 'Have you tried habit tracking before?',
    subtext: 'The System acknowledges prior experience.',
    options: [
      { label: 'Never tried it', value: 0, xp: 0 },
      { label: 'Tried but always quit', value: 1, xp: 50 },
      { label: 'Used apps before with some success', value: 2, xp: 150 },
      { label: 'Experienced — looking to go further', value: 3, xp: 300 },
    ],
  },
]

function getRankFromXP(xp) {
  if (xp >= 600) return { rank: 'C', label: 'C-Rank Hunter', color: '#60a5fa', startingXP: 2000 }
  if (xp >= 300) return { rank: 'D', label: 'D-Rank Hunter', color: '#4ade80', startingXP: 500 }
  return { rank: 'E', label: 'E-Rank Hunter', color: '#94a3b8', startingXP: 0 }
}

function getStartingHabits(goals) {
  return PRESET_HABITS
    .filter(h => goals.includes(h.category))
    .slice(0, 6)
    .map(h => ({
      id: Date.now() + Math.random(),
      ...h,
      isCustom: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    }))
}

export default function Onboarding({ onComplete, displayName }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(
    displayName ? { name: { value: displayName, xp: 0 } } : {}
  )
  const [showVerdict, setShowVerdict] = useState(false)

  const questions = displayName
    ? QUESTIONS.filter(q => q.id !== 'name')
    : QUESTIONS

  const current = questions[step]
  const isLast = step === questions.length - 1

  function handleChoice(value, xp) {
    setAnswers(prev => ({ ...prev, [current.id]: { value, xp } }))
  }

  function handleMulti(value) {
    setAnswers(prev => {
      const existing = prev[current.id]?.value || []
      const updated = existing.includes(value)
        ? existing.filter(v => v !== value)
        : [...existing, value]
      return { ...prev, [current.id]: { value: updated, xp: updated.length * 50 } }
    })
  }

  function handleText(e) {
    setAnswers(prev => ({ ...prev, [current.id]: { value: e.target.value, xp: 0 } }))
  }

  function canAdvance() {
    const ans = answers[current.id]
    if (!ans) return false
    if (current.type === 'text') return ans.value?.trim().length > 0
    if (current.type === 'multi') return ans.value?.length > 0
    return true
  }

  function advance() {
    if (isLast) {
      setShowVerdict(true)
    } else {
      setStep(s => s + 1)
    }
  }

function handleFinish() {
    const totalXP = Object.values(answers).reduce((sum, a) => sum + (a.xp || 0), 0)
    const goals = answers.goals?.value || []
    const startingHabits = getStartingHabits(goals)
    const { rank, startingXP } = getRankFromXP(totalXP)

    onComplete({
      name: answers.name?.value || 'Hunter',
      startingXP,
      goals,
      habits: startingHabits,
      title: rank === 'C' ? 'Seasoned Awakened' : rank === 'D' ? 'Awakened One' : 'Newly Awakened',
    })
  }

  const totalXP = Object.values(answers).reduce((sum, a) => sum + (a.xp || 0), 0)
  const verdict = getRankFromXP(totalXP)

  if (showVerdict) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.screen}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          style={styles.verdictBox}
        >
          <p style={styles.systemText}>[ SYSTEM NOTIFICATION ]</p>
          <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: 14 }}>
            Assessment complete. Analysing hunter potential...
          </p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 120 }}
            style={{ ...styles.rankBadge, borderColor: verdict.color, color: verdict.color }}
          >
            {verdict.rank}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <p style={{ color: verdict.color, fontSize: 20, fontWeight: 700, marginTop: 24 }}>
              {verdict.label}
            </p>
            <p style={{ color: '#64748b', marginTop: 8, fontSize: 13 }}>
              Starting XP: {totalXP.toLocaleString()}
            </p>
            <p style={{ color: '#94a3b8', marginTop: 16, maxWidth: 360, lineHeight: 1.6, fontSize: 14 }}>
              The System has assessed your potential, {answers.name?.value || 'Hunter'}.
              Your journey begins now. Complete your daily quests. Grow stronger.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleFinish}
              style={styles.beginBtn}
            >
              ARISE
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div style={styles.screen}>
      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <motion.div
          animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
          style={styles.progressFill}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          style={styles.card}
        >
          <p style={styles.systemText}>[ THE SYSTEM ]</p>
          <h2 style={styles.question}>{current.question}</h2>
          <p style={styles.subtext}>{current.subtext}</p>

          {/* Text input */}
          {current.type === 'text' && (
            <input
              autoFocus
              value={answers[current.id]?.value || ''}
              onChange={handleText}
              placeholder={current.placeholder}
              style={styles.input}
              onKeyDown={e => e.key === 'Enter' && canAdvance() && advance()}
            />
          )}

          {/* Single choice */}
          {current.type === 'choice' && (
            <div style={styles.options}>
              {current.options.map(opt => {
                const selected = answers[current.id]?.value === opt.value
                return (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(opt.value, opt.xp)}
                    style={{
                      ...styles.optionBtn,
                      borderColor: selected ? '#60a5fa' : '#1e293b',
                      background: selected ? 'rgba(96,165,250,0.1)' : 'transparent',
                      color: selected ? '#60a5fa' : '#94a3b8',
                    }}
                  >
                    {opt.label}
                  </motion.button>
                )
              })}
            </div>
          )}

          {/* Multi select */}
          {current.type === 'multi' && (
            <div style={styles.options}>
              {current.options.map(opt => {
                const selected = (answers[current.id]?.value || []).includes(opt.value)
                return (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMulti(opt.value)}
                    style={{
                      ...styles.optionBtn,
                      borderColor: selected ? '#a78bfa' : '#1e293b',
                      background: selected ? 'rgba(167,139,250,0.1)' : 'transparent',
                      color: selected ? '#a78bfa' : '#94a3b8',
                    }}
                  >
                    {opt.label}
                  </motion.button>
                )
              })}
            </div>
          )}

          <motion.button
            whileHover={canAdvance() ? { scale: 1.02 } : {}}
            whileTap={canAdvance() ? { scale: 0.98 } : {}}
            onClick={advance}
            disabled={!canAdvance()}
            style={{
              ...styles.nextBtn,
              opacity: canAdvance() ? 1 : 0.3,
              cursor: canAdvance() ? 'pointer' : 'not-allowed',
            }}
          >
            {isLast ? 'COMPLETE ASSESSMENT' : 'CONFIRM →'}
          </motion.button>
        </motion.div>
      </AnimatePresence>

      <p style={styles.stepCount}>{step + 1} / {questions.length}</p>
    </div>
  )
}

const styles = {
  screen: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
  },
  progressTrack: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: 3,
    background: '#1e293b',
  },
  progressFill: {
    height: '100%',
    background: '#60a5fa',
    borderRadius: 2,
  },
  card: {
    maxWidth: 560,
    width: '100%',
    padding: '48px 40px',
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 16,
  },
  systemText: {
    color: '#60a5fa',
    fontSize: 11,
    letterSpacing: '0.15em',
    marginBottom: 20,
    fontWeight: 600,
  },
  question: {
    fontSize: 24,
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: 8,
    lineHeight: 1.3,
  },
  subtext: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 32,
    lineHeight: 1.6,
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 10,
    color: '#f1f5f9',
    fontSize: 16,
    outline: 'none',
    marginBottom: 24,
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 32,
  },
  optionBtn: {
    padding: '14px 18px',
    border: '1px solid',
    borderRadius: 10,
    textAlign: 'left',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  nextBtn: {
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
  stepCount: {
    marginTop: 24,
    color: '#334155',
    fontSize: 13,
  },
  verdictBox: {
    maxWidth: 480,
    width: '100%',
    padding: '56px 40px',
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 16,
    textAlign: 'center',
  },
  rankBadge: {
    width: 100,
    height: 100,
    border: '3px solid',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontWeight: 900,
    margin: '0 auto',
  },
  beginBtn: {
    marginTop: 32,
    padding: '14px 48px',
    background: '#1d4ed8',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.15em',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}