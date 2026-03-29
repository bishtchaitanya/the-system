import { useState, useEffect } from 'react'
import { RANKS, STREAK_MULTIPLIERS, DIFFICULTY } from '../data/habits'
import { ARTIFACTS } from '../data/raids'

const STORAGE_KEY = 'the-system-data'

const defaultState = {
  hunter: null,
  habits: [],
  logs: [],
  raids: [],
  artifacts: [],
}

const ACCOUNTS_KEY = 'the-system-accounts'
const SESSION_KEY = 'the-system-session'

function loadAccounts() {
  try {
    const saved = localStorage.getItem(ACCOUNTS_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function loadSession() {
  try {
    const saved = localStorage.getItem(SESSION_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function saveSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : defaultState
    return {
      ...defaultState,
      ...parsed,
    }
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

export function calculateXP(difficulty, streakDays, doubleXP = false) {
  const base = DIFFICULTY[difficulty]?.xp || 10
  const multiplier = getStreakMultiplier(streakDays)
  const total = Math.round(base * multiplier)
  return doubleXP ? total * 2 : total
}

export function useStore() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    saveState(state)
    const currentSession = loadSession()
    if (currentSession) {
      const accounts = loadAccounts()
      const updated = accounts.map(a =>
        a.id === currentSession.accountId ? { ...a, data: state } : a
      )
      saveAccounts(updated)
    }
  }, [state])

  // Check and update raid progress on habit completion
  function updateRaidProgress(state) {
    const now = new Date()
    return state.raids.map(raid => {
      if (raid.status !== 'active') return raid
      const end = new Date(raid.endsAt)
      if (now > end && raid.currentHP > 0) {
        return { ...raid, status: 'failed' }
      }
      return raid
    })
  }

  function completeHabit(habitId) {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    const alreadyDone = state.logs.some(
      l => l.habitId === habitId && new Date(l.completedAt).toDateString() === today
    )
    if (alreadyDone) return

    const habit = state.habits.find(h => h.id === habitId)
    if (!habit) return

    const currentStreak = state.hunter?.streakDays || 0
    const lastActiveDay = state.hunter?.lastActiveDay || null

    let newStreak
    if (lastActiveDay === today) {
      newStreak = currentStreak
    } else if (lastActiveDay === yesterday) {
      newStreak = currentStreak + 1
    } else {
      newStreak = 1
    }

    // Check for active Mana Vial artifact
    const hasManaVial = state.artifacts.some(
      a => a.id === 'MANA_VIAL' && !a.used
    )

    const xpEarned = calculateXP(habit.difficulty, newStreak, hasManaVial)

    // Use Mana Vial if active
    let updatedArtifacts = state.artifacts
    if (hasManaVial) {
      updatedArtifacts = state.artifacts.map(a =>
        a.id === 'MANA_VIAL' && !a.used ? { ...a, used: true } : a
      )
    }

    const newLog = {
      id: Date.now(),
      habitId,
      completedAt: new Date().toISOString(),
      xpEarned,
      streakAtTime: newStreak,
    }

    // Deal damage to active raids (1 damage per habit completion)
    const updatedRaids = state.raids.map(raid => {
      if (raid.status !== 'active') return raid
      const newHP = Math.max(0, raid.currentHP - 1)
      if (newHP === 0) {
        return { ...raid, currentHP: 0, status: 'cleared' }
      }
      return { ...raid, currentHP: newHP }
    })

    // Check for newly cleared raids and grant rewards
    const newlyCleared = updatedRaids.filter(
      r => r.status === 'cleared' &&
      state.raids.find(old => old.instanceId === r.instanceId)?.status === 'active'
    )

    let bonusXP = 0
    let newArtifactGrants = []
    newlyCleared.forEach(raid => {
      bonusXP += raid.reward.xp
      if (raid.reward.artifact) {
        newArtifactGrants.push({
          instanceId: Date.now() + Math.random(),
          id: raid.reward.artifact,
          earnedAt: new Date().toISOString(),
          used: false,
          fromRaid: raid.name,
        })
      }
    })

    setState(prev => ({
      ...prev,
      hunter: {
        ...prev.hunter,
        totalXP: (prev.hunter?.totalXP || 0) + xpEarned + bonusXP,
        streakDays: newStreak,
        lastActiveDay: today,
      },
      logs: [...prev.logs, newLog],
      raids: updatedRaids,
      artifacts: [...updatedArtifacts, ...newArtifactGrants],
    }))

    return { xpEarned, bonusXP, newlyCleared }
  }

  function startRaid(boss, type) {
    const now = new Date()
    const endsAt = new Date(now)
    if (type === 'weekly') {
      endsAt.setDate(endsAt.getDate() + 7)
    } else {
      endsAt.setDate(endsAt.getDate() + 30)
    }

    const newRaid = {
      instanceId: Date.now(),
      ...boss,
      type,
      status: 'active',
      currentHP: boss.hp,
      maxHP: boss.hp,
      startedAt: now.toISOString(),
      endsAt: endsAt.toISOString(),
    }

    setState(prev => ({
      ...prev,
      raids: [...prev.raids, newRaid],
    }))
  }

  function useArtifact(instanceId, targetHabitId = null) {
    const artifact = state.artifacts.find(
      a => a.instanceId === instanceId && !a.used
    )
    if (!artifact) return

    const artifactDef = ARTIFACTS[artifact.id]
    let updates = {}

    if (artifact.id === 'SHADOW_CRYSTAL') {
      // Extend streak by protecting yesterday
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      updates = {
        hunter: {
          ...state.hunter,
          lastActiveDay: yesterday,
        },
      }
    }

    if (artifact.id === 'RANK_TALISMAN') {
      updates = {
        hunter: {
          ...state.hunter,
          totalXP: (state.hunter?.totalXP || 0) + 500,
        },
      }
    }

    if (artifact.id === 'HUNTERS_SEAL' && targetHabitId) {
      const today = new Date().toDateString()
      const habit = state.habits.find(h => h.id === targetHabitId)
      if (habit) {
        const sealLog = {
          id: Date.now(),
          habitId: targetHabitId,
          completedAt: new Date().toISOString(),
          xpEarned: 0,
          streakAtTime: state.hunter?.streakDays || 0,
          sealUsed: true,
        }
        updates = {
          logs: [...state.logs, sealLog],
        }
      }
    }

    setState(prev => ({
      ...prev,
      ...updates,
      hunter: updates.hunter || prev.hunter,
      logs: updates.logs || prev.logs,
      artifacts: prev.artifacts.map(a =>
        a.instanceId === instanceId ? { ...a, used: true } : a
      ),
    }))
  }

  function createHunter(hunterData) {
    setState(prev => ({
      ...prev,
      hunter: {
        id: Date.now(),
        name: hunterData.name,
        totalXP: hunterData.startingXP || 0,
        streakDays: 0,
        lastActiveDay: null,
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

  function removeHabit(habitId) {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== habitId),
      logs: prev.logs.filter(l => l.habitId !== habitId),
    }))
  }

  function updateHunterName(name) {
    setState(prev => ({
      ...prev,
      hunter: { ...prev.hunter, name },
    }))
  }
  function signup(email, password, displayName) {
    const accounts = loadAccounts()
    const exists = accounts.find(a => a.email.toLowerCase() === email.toLowerCase())
    if (exists) return { error: 'An account with this email already exists.' }

    const newAccount = {
      id: Date.now(),
      email: email.toLowerCase(),
      password,
      displayName,
      createdAt: new Date().toISOString(),
      data: defaultState,
    }

    const updated = [...accounts, newAccount]
    saveAccounts(updated)

    const session = { accountId: newAccount.id, email: newAccount.email, displayName }
    saveSession(session)

    return { success: true, session }
  }

  function login(email, password) {
    const accounts = loadAccounts()
    const account = accounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    )
    if (!account) return { error: 'Invalid email or password.' }

    const session = { accountId: account.id, email: account.email, displayName: account.displayName }
    saveSession(session)

    // Load this account's data into state
    setState(account.data || defaultState)

    return { success: true, session }
  }

  function logout() {
    // Save current state to account before logging out
    const session = loadSession()
    if (session) {
      const accounts = loadAccounts()
      const updated = accounts.map(a =>
        a.id === session.accountId ? { ...a, data: state } : a
      )
      saveAccounts(updated)
    }
    saveSession(null)
    setState(defaultState)
  }
  function resetAll() {
    setState(defaultState)
  }

  const activeRaids = state.raids.filter(r => r.status === 'active')
  const clearedRaids = state.raids.filter(r => r.status === 'cleared')
  const unusedArtifacts = state.artifacts.filter(a => !a.used)

  const session = loadSession()

  return {
    hunter: state.hunter,
    habits: state.habits,
    logs: state.logs,
    raids: state.raids,
    activeRaids,
    clearedRaids,
    artifacts: state.artifacts,
    unusedArtifacts,
    session,
    completeHabit,
    createHunter,
    addHabit,
    removeHabit,
    resetAll,
    updateHunterName,
    startRaid,
    useArtifact,
    signup,
    login,
    logout,
  }
}