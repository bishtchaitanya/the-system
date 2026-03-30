import { supabase } from '../lib/supabase'
import { RANKS, STREAK_MULTIPLIERS, DIFFICULTY } from '../data/habits'

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

// AUTH
export async function signUp(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: error.message }

  // Create hunter profile row
  const { error: profileError } = await supabase.from('hunters').insert({
    id: data.user.id,
    name: displayName,
    title: 'Newly Awakened',
    total_xp: 0,
    streak_days: 0,
    last_active_day: null,
    goals: [],
  })
  if (profileError) return { error: profileError.message }

  return { success: true, user: data.user }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { success: true, user: data.user, session: data.session }
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// HUNTER
export async function fetchHunter(userId) {
  const { data, error } = await supabase
    .from('hunters')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return {
    id: data.id,
    name: data.name,
    title: data.title,
    totalXP: data.total_xp,
    streakDays: data.streak_days,
    lastActiveDay: data.last_active_day,
    goals: data.goals || [],
    createdAt: data.created_at,
  }
}

export async function updateHunter(userId, updates) {
  const dbUpdates = {}
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.title !== undefined) dbUpdates.title = updates.title
  if (updates.totalXP !== undefined) dbUpdates.total_xp = updates.totalXP
  if (updates.streakDays !== undefined) dbUpdates.streak_days = updates.streakDays
  if (updates.lastActiveDay !== undefined) dbUpdates.last_active_day = updates.lastActiveDay
  if (updates.goals !== undefined) dbUpdates.goals = updates.goals

  const { error } = await supabase
    .from('hunters')
    .update(dbUpdates)
    .eq('id', userId)

  return { error }
}

export async function createHunterProfile(userId, hunterData) {
  const { error } = await supabase
    .from('hunters')
    .upsert({
      id: userId,
      name: hunterData.name,
      title: hunterData.title || 'Newly Awakened',
      total_xp: hunterData.startingXP || 0,
      streak_days: 0,
      last_active_day: null,
      goals: hunterData.goals || [],
    })
  return { error }
}

// HABITS
export async function fetchHabits(userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  if (error) return []
  return data.map(h => ({
    id: h.id,
    name: h.name,
    category: h.category,
    difficulty: h.difficulty,
    isCustom: h.is_custom,
    isActive: h.is_active,
    createdAt: h.created_at,
  }))
}

export async function insertHabits(userId, habits) {
  const rows = habits.map(h => ({
    id: h.id || Date.now() + Math.random(),
    user_id: userId,
    name: h.name,
    category: h.category,
    difficulty: h.difficulty,
    is_custom: h.isCustom || false,
    is_active: true,
  }))
  const { error } = await supabase.from('habits').insert(rows)
  return { error }
}

export async function insertHabit(userId, habit) {
  const row = {
    id: Date.now(),
    user_id: userId,
    name: habit.name,
    category: habit.category,
    difficulty: habit.difficulty,
    is_custom: true,
    is_active: true,
  }
  const { data, error } = await supabase.from('habits').insert(row).select().single()
  if (error) return { error }
  return {
    data: {
      id: data.id,
      name: data.name,
      category: data.category,
      difficulty: data.difficulty,
      isCustom: data.is_custom,
      isActive: data.is_active,
      createdAt: data.created_at,
    }
  }
}

export async function deleteHabit(habitId) {
  await supabase.from('habit_logs').delete().eq('habit_id', habitId)
  const { error } = await supabase.from('habits').delete().eq('id', habitId)
  return { error }
}

// LOGS
export async function fetchLogs(userId) {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
  if (error) return []
  return data.map(l => ({
    id: l.id,
    habitId: l.habit_id,
    completedAt: l.completed_at,
    xpEarned: l.xp_earned,
    streakAtTime: l.streak_at_time,
    sealUsed: l.seal_used,
  }))
}

export async function insertLog(userId, log) {
  const { error } = await supabase.from('habit_logs').insert({
    id: log.id,
    user_id: userId,
    habit_id: log.habitId,
    completed_at: log.completedAt,
    xp_earned: log.xpEarned,
    streak_at_time: log.streakAtTime,
    seal_used: log.sealUsed || false,
  })
  return { error }
}

export async function deleteLogsForHabit(habitId) {
  const { error } = await supabase
    .from('habit_logs')
    .delete()
    .eq('habit_id', habitId)
  return { error }
}

// RAIDS
export async function fetchRaids(userId) {
  const { data, error } = await supabase
    .from('raids')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
  if (error) return []
  return data.map(r => ({
    instanceId: r.instance_id,
    id: r.id,
    name: r.name,
    threat: r.threat,
    type: r.type,
    status: r.status,
    currentHP: r.current_hp,
    maxHP: r.max_hp,
    color: r.color,
    reward: r.reward,
    description: r.description,
    startedAt: r.started_at,
    endsAt: r.ends_at,
  }))
}

export async function insertRaid(userId, raid) {
  const { error } = await supabase.from('raids').insert({
    instance_id: raid.instanceId,
    user_id: userId,
    id: raid.id,
    name: raid.name,
    threat: raid.threat,
    type: raid.type,
    status: raid.status,
    current_hp: raid.currentHP,
    max_hp: raid.maxHP,
    color: raid.color,
    reward: raid.reward,
    description: raid.description,
    started_at: raid.startedAt,
    ends_at: raid.endsAt,
  })
  return { error }
}

export async function updateRaid(instanceId, updates) {
  const dbUpdates = {}
  if (updates.currentHP !== undefined) dbUpdates.current_hp = updates.currentHP
  if (updates.status !== undefined) dbUpdates.status = updates.status
  const { error } = await supabase
    .from('raids')
    .update(dbUpdates)
    .eq('instance_id', instanceId)
  return { error }
}

// ARTIFACTS
export async function fetchArtifacts(userId) {
  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
  if (error) return []
  return data.map(a => ({
    instanceId: a.instance_id,
    id: a.id,
    used: a.used,
    earnedAt: a.earned_at,
    fromRaid: a.from_raid,
  }))
}

export async function insertArtifact(userId, artifact) {
  const { error } = await supabase.from('artifacts').insert({
    instance_id: artifact.instanceId,
    user_id: userId,
    id: artifact.id,
    used: false,
    earned_at: artifact.earnedAt,
    from_raid: artifact.fromRaid,
  })
  return { error }
}

export async function markArtifactUsed(instanceId) {
  const { error } = await supabase
    .from('artifacts')
    .update({ used: true })
    .eq('instance_id', instanceId)
  return { error }
}

// DELETE ALL USER DATA
export async function deleteAllUserData(userId) {
  await supabase.from('habit_logs').delete().eq('user_id', userId)
  await supabase.from('habits').delete().eq('user_id', userId)
  await supabase.from('raids').delete().eq('user_id', userId)
  await supabase.from('artifacts').delete().eq('user_id', userId)
  await supabase.from('hunters').update({
    name: 'Hunter',
    title: 'Newly Awakened',
    total_xp: 0,
    streak_days: 0,
    last_active_day: null,
    goals: [],
  }).eq('id', userId)
}