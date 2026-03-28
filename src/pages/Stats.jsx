import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import { getRank, getNextRank } from '../store/useStore'
import { DIFFICULTY, HABIT_CATEGORIES } from '../data/habits'

function StatCard({ label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: 12,
        padding: '20px 24px',
      }}
    >
      <p style={{ color: '#64748b', fontSize: 12, letterSpacing: '0.08em', marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ color: color || '#f1f5f9', fontSize: 28, fontWeight: 700 }}>
        {value}
      </p>
      {sub && (
        <p style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>{sub}</p>
      )}
    </motion.div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ marginBottom: 16, marginTop: 32 }}>
      <p style={{
        color: '#60a5fa',
        fontSize: 11,
        letterSpacing: '0.15em',
        marginBottom: 4,
      }}>
        [ SYSTEM ANALYSIS ]
      </p>
      <h3 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 600 }}>
        {children}
      </h3>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 13,
    }}>
      <p style={{ color: '#64748b', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#60a5fa', fontWeight: 600 }}>
        {payload[0].value} {payload[0].name}
      </p>
    </div>
  )
}

export default function Stats({ hunter, habits, logs }) {
  const rank = getRank(hunter.totalXP)
  const nextRank = getNextRank(hunter.totalXP)

  // XP progress to next rank
  const xpProgress = useMemo(() => {
    const start = rank.minXP
    const end = nextRank ? nextRank.minXP : hunter.totalXP
    const progress = nextRank
      ? Math.round(((hunter.totalXP - start) / (end - start)) * 100)
      : 100
    return { progress, remaining: nextRank ? end - hunter.totalXP : 0 }
  }, [hunter.totalXP, rank, nextRank])

  // XP over last 14 days
  const xpByDay = useMemo(() => {
    const days = []
    for (let i = 13; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      const dayLogs = logs.filter(l => new Date(l.completedAt).toDateString() === dateStr)
      const totalXP = dayLogs.reduce((sum, l) => sum + l.xpEarned, 0)
      days.push({
        day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        XP: totalXP,
      })
    }
    return days
  }, [logs])

  // Habits completed by category
  const byCategory = useMemo(() => {
    return Object.keys(HABIT_CATEGORIES).map(key => {
      const categoryHabits = habits.filter(h => h.category === key)
      const categoryLogs = logs.filter(l =>
        categoryHabits.some(h => h.id === l.habitId)
      )
      return {
        name: HABIT_CATEGORIES[key].split(' & ')[0],
        completions: categoryLogs.length,
      }
    }).filter(c => c.completions > 0)
  }, [habits, logs])

  // Habit completion rate
  const completionRate = useMemo(() => {
    if (!logs.length || !habits.length) return 0
    const uniqueDays = [...new Set(
      logs.map(l => new Date(l.completedAt).toDateString())
    )].length
    const totalPossible = uniqueDays * habits.length
    return totalPossible > 0 ? Math.round((logs.length / totalPossible) * 100) : 0
  }, [logs, habits])

  // Best streak calculation
  const bestStreak = useMemo(() => {
    if (!logs.length) return 0
    const days = [...new Set(
      logs.map(l => new Date(l.completedAt).toDateString())
    )].map(d => new Date(d)).sort((a, b) => a - b)

    let best = 1
    let current = 1
    for (let i = 1; i < days.length; i++) {
      const diff = (days[i] - days[i - 1]) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        current++
        best = Math.max(best, current)
      } else {
        current = 1
      }
    }
    return best
  }, [logs])

  // Most completed habit
  const topHabit = useMemo(() => {
    if (!habits.length || !logs.length) return null
    const counts = habits.map(h => ({
      name: h.name,
      count: logs.filter(l => l.habitId === h.id).length,
    }))
    return counts.sort((a, b) => b.count - a.count)[0]
  }, [habits, logs])

  // XP by difficulty breakdown
  const xpByDifficulty = useMemo(() => {
    return Object.entries(DIFFICULTY).map(([key, diff]) => {
      const diffLogs = logs.filter(l => {
        const habit = habits.find(h => h.id === l.habitId)
        return habit?.difficulty === key
      })
      return {
        name: diff.label,
        XP: diffLogs.reduce((sum, l) => sum + l.xpEarned, 0),
        color: diff.color,
      }
    }).filter(d => d.XP > 0)
  }, [logs, habits])

  const totalCompletions = logs.length

  return (
    <div style={{
      maxWidth: 640,
      margin: '0 auto',
      padding: '32px 20px 80px',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: '#60a5fa', fontSize: 11, letterSpacing: '0.15em', marginBottom: 6 }}>
          [ HUNTER STATISTICS ]
        </p>
        <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 700 }}>
          Combat Record
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          The System has recorded your full history.
        </p>
      </div>

      {/* Rank progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#0f172a',
          border: `1px solid ${rank.color}33`,
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: `2px solid ${rank.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 900,
            color: rank.color,
            flexShrink: 0,
          }}>
            {rank.rank}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 2 }}>Current rank</p>
            <p style={{ color: rank.color, fontWeight: 700, fontSize: 16 }}>{rank.label}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 18 }}>
              {hunter.totalXP.toLocaleString()}
            </p>
            <p style={{ color: '#64748b', fontSize: 12 }}>Total XP</p>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            style={{ height: '100%', background: rank.color, borderRadius: 3 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <p style={{ color: '#475569', fontSize: 12 }}>{xpProgress.progress}% to next rank</p>
          {nextRank && (
            <p style={{ color: '#475569', fontSize: 12 }}>
              {xpProgress.remaining.toLocaleString()} XP to {nextRank.rank}-Rank
            </p>
          )}
        </div>
      </motion.div>

      {/* Stat grid */}
      <SectionTitle>Key metrics</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatCard
          label="TOTAL COMPLETIONS"
          value={totalCompletions}
          sub="quests completed all time"
          color="#60a5fa"
        />
        <StatCard
          label="COMPLETION RATE"
          value={`${completionRate}%`}
          sub="of daily quests finished"
          color="#4ade80"
        />
        <StatCard
          label="BEST STREAK"
          value={`${bestStreak}d`}
          sub="consecutive active days"
          color="#f59e0b"
        />
        <StatCard
          label="ACTIVE QUESTS"
          value={habits.length}
          sub="habits being tracked"
          color="#a78bfa"
        />
      </div>

      {/* Top habit */}
      {topHabit && (
        <>
          <SectionTitle>Most completed quest</SectionTitle>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: 12,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 15 }}>
                {topHabit.name}
              </p>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                Your most consistent quest
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: 22 }}>
                {topHabit.count}×
              </p>
              <p style={{ color: '#64748b', fontSize: 12 }}>completions</p>
            </div>
          </motion.div>
        </>
      )}

      {/* XP over time chart */}
      <SectionTitle>XP earned — last 14 days</SectionTitle>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: '20px 8px 8px',
        }}
      >
        {logs.length === 0 ? (
          <p style={{ color: '#475569', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>
            Complete quests to see your XP history.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={xpByDay} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="XP"
                stroke="#60a5fa"
                strokeWidth={2}
                fill="url(#xpGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* XP by difficulty */}
      {xpByDifficulty.length > 0 && (
        <>
          <SectionTitle>XP by difficulty</SectionTitle>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: 12,
              padding: '20px 8px 8px',
            }}
          >
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={xpByDifficulty} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#475569', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="XP" radius={[4, 4, 0, 0]}>
                  {xpByDifficulty.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}

      {/* By category */}
      {byCategory.length > 0 && (
        <>
          <SectionTitle>Completions by category</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {byCategory.sort((a, b) => b.completions - a.completions).map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: 10,
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <p style={{ color: '#94a3b8', fontSize: 14, flex: 1 }}>{cat.name}</p>
                <div style={{
                  flex: 2,
                  height: 4,
                  background: '#1e293b',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(cat.completions / Math.max(...byCategory.map(c => c.completions))) * 100}%`
                    }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ height: '100%', background: '#a78bfa', borderRadius: 2 }}
                  />
                </div>
                <p style={{ color: '#64748b', fontSize: 13, minWidth: 24, textAlign: 'right' }}>
                  {cat.completions}
                </p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}