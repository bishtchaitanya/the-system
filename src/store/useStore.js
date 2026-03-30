import { useState, useEffect, useCallback } from 'react'
import {
  getRank, getNextRank, getStreakMultiplier, calculateXP,
  signUp, signIn, signOut, getSession,
  fetchHunter, updateHunter, createHunterProfile,
  fetchHabits, insertHabits, insertHabit, deleteHabit,
  fetchLogs, insertLog, deleteLogsForHabit,
  fetchRaids, insertRaid, updateRaid,
  fetchArtifacts, insertArtifact, markArtifactUsed,
  deleteAllUserData,
} from './supabaseStore'

export { getRank, getNextRank }

export function useStore() {
  const [session, setSession] = useState(null)
  const [hunter, setHunter] = useState(null)
  const [habits, setHabits] = useState([])
  const [logs, setLogs] = useState([])
  const [raids, setRaids] = useState([])
  const [artifacts, setArtifacts] = useState([])
  const [loading, setLoading] = useState(true)

  // Load session on mount
  useEffect(() => {
    getSession().then(s => {
      setSession(s)
      setLoading(false)
    })
  }, [])

  // Load all data when session changes
  useEffect(() => {
    if (!session?.user?.id) {
      setHunter(null)
      setHabits([])
      setLogs([])
      setRaids([])
      setArtifacts([])
      return
    }
    loadAllData(session.user.id)
  }, [session])

  async function loadAllData(userId) {
    const [h, hb, l, r, a] = await Promise.all([
      fetchHunter(userId),
      fetchHabits(userId),
      fetchLogs(userId),
      fetchRaids(userId),
      fetchArtifacts(userId),
    ])
    setHunter(h)
    setHabits(hb)
    setLogs(l)
    setRaids(r)
    setArtifacts(a)
  }

  async function signup(email, password, displayName) {
    const result = await signUp(email, password, displayName)
    if (result.error) return { error: result.error }
    const s = await getSession()
    setSession(s)
    return { success: true }
  }

  async function login(email, password) {
    const result = await signIn(email, password)
    if (result.error) return { error: result.error }
    setSession(result.session)
    return { success: true }
  }

  async function logout() {
    await signOut()
    setSession(null)
  }

  async function createHunter(hunterData) {
    if (!session?.user?.id) return
    await createHunterProfile(session.user.id, hunterData)
    if (hunterData.habits?.length > 0) {
      await insertHabits(session.user.id, hunterData.habits)
    }
    await loadAllData(session.user.id)
  }

  async function completeHabit(habitId) {
    if (!session?.user?.id || !hunter) return

    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const alreadyDone = logs.some(
      l => l.habitId === habitId && new Date(l.completedAt).toDateString() === today
    )
    if (alreadyDone) return

    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    const currentStreak = hunter.streakDays || 0
    const lastActiveDay = hunter.lastActiveDay || null

    let newStreak
    if (lastActiveDay === today) {
      newStreak = currentStreak
    } else if (lastActiveDay === yesterday) {
      newStreak = currentStreak + 1
    } else {
      newStreak = 1
    }

    const hasManaVial = artifacts.some(a => a.id === 'MANA_VIAL' && !a.used)
    const xpEarned = calculateXP(habit.difficulty, newStreak, hasManaVial)

    if (hasManaVial) {
      const vial = artifacts.find(a => a.id === 'MANA_VIAL' && !a.used)
      await markArtifactUsed(vial.instanceId)
    }

    const newLog = {
      id: Date.now(),
      habitId,
      completedAt: new Date().toISOString(),
      xpEarned,
      streakAtTime: newStreak,
    }

    await insertLog(session.user.id, newLog)

    // Deal damage to active raids
    let bonusXP = 0
    const newlyCleared = []
    for (const raid of raids.filter(r => r.status === 'active')) {
      const newHP = Math.max(0, raid.currentHP - 1)
      if (newHP === 0) {
        await updateRaid(raid.instanceId, { currentHP: 0, status: 'cleared' })
        newlyCleared.push(raid)
        bonusXP += raid.reward?.xp || 0
        if (raid.reward?.artifact) {
          const newArtifact = {
            instanceId: Date.now() + Math.random(),
            id: raid.reward.artifact,
            earnedAt: new Date().toISOString(),
            fromRaid: raid.name,
          }
          await insertArtifact(session.user.id, newArtifact)
        }
      } else {
        await updateRaid(raid.instanceId, { currentHP: newHP })
      }
    }

    const newTotalXP = hunter.totalXP + xpEarned + bonusXP
    await updateHunter(session.user.id, {
      totalXP: newTotalXP,
      streakDays: newStreak,
      lastActiveDay: today,
    })

    await loadAllData(session.user.id)
    return { xpEarned, bonusXP, newlyCleared }
  }

  async function addHabit(habit) {
    if (!session?.user?.id) return
    const result = await insertHabit(session.user.id, habit)
    if (result.data) setHabits(prev => [...prev, result.data])
  }

  async function removeHabit(habitId) {
    await deleteHabit(habitId)
    setHabits(prev => prev.filter(h => h.id !== habitId))
    setLogs(prev => prev.filter(l => l.habitId !== habitId))
  }

  async function updateHunterName(name) {
    if (!session?.user?.id) return
    await updateHunter(session.user.id, { name })
    setHunter(prev => ({ ...prev, name }))
  }

  async function startRaid(boss, type) {
    if (!session?.user?.id) return
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

    await insertRaid(session.user.id, newRaid)
    setRaids(prev => [...prev, newRaid])
  }

  async function useArtifact(instanceId, targetHabitId = null) {
    if (!session?.user?.id || !hunter) return
    const artifact = artifacts.find(a => a.instanceId === instanceId && !a.used)
    if (!artifact) return

    if (artifact.id === 'SHADOW_CRYSTAL') {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      await updateHunter(session.user.id, { lastActiveDay: yesterday })
    }

    if (artifact.id === 'RANK_TALISMAN') {
      await updateHunter(session.user.id, { totalXP: hunter.totalXP + 500 })
    }

    if (artifact.id === 'HUNTERS_SEAL' && targetHabitId) {
      const sealLog = {
        id: Date.now(),
        habitId: targetHabitId,
        completedAt: new Date().toISOString(),
        xpEarned: 0,
        streakAtTime: hunter.streakDays || 0,
        sealUsed: true,
      }
      await insertLog(session.user.id, sealLog)
    }

    await markArtifactUsed(instanceId)
    await loadAllData(session.user.id)
  }

  async function resetHabitLogs(habitId) {
    await deleteLogsForHabit(habitId)
    setLogs(prev => prev.filter(l => l.habitId !== habitId))
  }

  async function resetAll() {
    if (!session?.user?.id) return
    await deleteAllUserData(session.user.id)
    await loadAllData(session.user.id)
  }

  const activeRaids = raids.filter(r => r.status === 'active')
  const clearedRaids = raids.filter(r => r.status === 'cleared')
  const unusedArtifacts = artifacts.filter(a => !a.used)

  return {
    session,
    hunter,
    habits,
    logs,
    raids,
    activeRaids,
    clearedRaids,
    artifacts,
    unusedArtifacts,
    loading,
    signup,
    login,
    logout,
    createHunter,
    completeHabit,
    addHabit,
    removeHabit,
    updateHunterName,
    startRaid,
    useArtifact,
    resetHabitLogs,
    resetAll,
  }
}