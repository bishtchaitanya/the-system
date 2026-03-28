import { useState, useEffect } from 'react'
import { RANKS, STREAK_MULTIPLIERS, DIFFICULTY } from '../data/habits'

const STORAGE_KEY = 'the-system-data'

const defaultState = {
  hunter: null,
  habits: [],
  logs: [],
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultState
  } catch {
    return defaultState
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getRank(totalXP) {
  const rank = [...RANKS].reverse().find(r => totalXP >= r.minXP)
  return rank || RANKS[0]
}

export function getNextRank(totalXP) {
  return RANKS.find(r => r.minXP > totalXP) || null
}

export function getStreakMultiplier(streakDays) {
  const match = STREAK_MULTIPLIERS.find(s => streakDays >= s.days)
  return match ? match.multiplier : 1.0
}

export function calculateXP(difficulty, streakDays) {
  const base = DIFFICULTY[difficulty]?.xp || 10
  const multiplier = getStreakMultiplier(streakDays)
  return Math.round(base * multiplier)
}

export function useStore() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  function completeHabit(habitId) {
    const today = new Date().toDateString()
    const alreadyDone = state.logs.some(
      l => l.habitId === habitId && new Date(l.completedAt).toDateString() === today
    )
    if (alreadyDone) return

    const habit = state.habits.find(h => h.id === habitId)
    if (!habit) return

    const streakDays = state.hunter?.streakDays || 0
    const xpEarned = calculateXP(habit.difficulty, streakDays)

    const newLog = {
      id: Date.now(),
      habitId,
      completedAt: new Date().toISOString(),
      xpEarned,
      streakAtTime: streakDays,
    }

    setState(prev => ({
      ...prev,
      hunter: {
        ...prev.hunter,
        totalXP: (prev.hunter?.totalXP || 0) + xpEarned,
      },
      logs: [...prev.logs, newLog],
    }))

    return xpEarned
  }

  function createHunter(hunterData) {
    setState(prev => ({
      ...prev,
      hunter: {
        id: Date.now(),
        name: hunterData.name,
        totalXP: hunterData.startingXP || 0,
        streakDays: 0,
        title: hunterData.title || 'Awakened One',
        createdAt: new Date().toISOString(),
        goals: hunterData.goals || [],
      },
      habits: hunterData.habits || [],
    }))
  }

  function addHabit(habit) {
    const newHabit = {
      id: Date.now(),
      ...habit,
      createdAt: new Date().toISOString(),
      isCustom: true,
      isActive: true,
    }
    setState(prev => ({ ...prev, habits: [...prev.habits, newHabit] }))
  }
    function updateHunterName(name) {
        setState(prev => ({
        ...prev,
        hunter: { ...prev.hunter, name },
        }))
    }
  function resetAll() {
    setState(defaultState)
  }

  return {
    hunter: state.hunter,
    habits: state.habits,
    logs: state.logs,
    completeHabit,
    createHunter,
    addHabit,
    resetAll,
    updateHunterName,
  }
}