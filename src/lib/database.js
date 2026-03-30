import { supabase } from './supabase'

// Auth
export async function signUp(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName }
    }
  })
  if (error) return { error: error.message }

  if (data.user) {
    const { error: hunterError } = await supabase.from('hunters').insert({
      id: data.user.id,
      name: displayName,
      title: 'Newly Awakened',
      total_xp: 0,
      streak_days: 0,
      last_active_day: null,
      goals: [],
    })
    if (hunterError) return { error: hunterError.message }
  }

  return { success: true, user: data.user }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { success: true, user: data.user, session: data.session }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) return { error: error.message }
  return { success: true }
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// Hunter
export async function getHunter(userId) {
  const { data, error } = await supabase
    .from('hunters')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function updateHunter(userId, updates) {
  const { error } = await supabase
    .from('hunters')
    .update(updates)
    .eq('id', userId)
  return !error
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
  return !error
}

// Habits
export async function getHabits(userId) {
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

export async function insertHabit(userId, habit) {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      id: Date.now(),
      user_id: userId,
      name: habit.name,
      category: habit.category,
      difficulty: habit.difficulty,
      is_custom: habit.isCustom ?? true,
      is_active: true,
    })
    .select()
    .single()
  if (error) return null
  return data
}

export async function insertHabits(userId, habits) {
  if (!habits.length) return true
  const rows = habits.map(h => ({
    id: Math.floor(Date.now() + Math.random() * 1000),
    user_id: userId,
    name: h.name,
    category: h.category,
    difficulty: h.difficulty,
    is_custom: h.isCustom ?? false,
    is_active: true,
  }))
  const { error } = await supabase.from('habits').insert(rows)
  return !error
}

export async function deleteHabit(habitId, userId) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', userId)
  return !error
}

// Logs
export async function getLogs(userId) {
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
  const { error } = await supabase
    .from('habit_logs')
    .insert({
      id: log.id,
      user_id: userId,
      habit_id: log.habitId,
      completed_at: log.completedAt,
      xp_earned: log.xpEarned,
      streak_at_time: log.streakAtTime,
      seal_used: log.sealUsed ?? false,
    })
  return !error
}

export async function deleteLogsForHabit(habitId, userId) {
  const { error } = await supabase
    .from('habit_logs')
    .delete()
    .eq('habit_id', habitId)
    .eq('user_id', userId)
  return !error
}

// Raids
export async function getRaids(userId) {
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
  const { error } = await supabase
    .from('raids')
    .insert({
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
  return !error
}

export async function updateRaid(instanceId, userId, updates) {
  const { error } = await supabase
    .from('raids')
    .update({
      current_hp: updates.currentHP,
      status: updates.status,
    })
    .eq('instance_id', instanceId)
    .eq('user_id', userId)
  return !error
}

// Artifacts
export async function getArtifacts(userId) {
  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .eq('user_id', userId)
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
  const { error } = await supabase
    .from('artifacts')
    .insert({
      instance_id: artifact.instanceId,
      user_id: userId,
      id: artifact.id,
      used: false,
      earned_at: artifact.earnedAt,
      from_raid: artifact.fromRaid,
    })
  return !error
}

export async function markArtifactUsed(instanceId, userId) {
  const { error } = await supabase
    .from('artifacts')
    .update({ used: true })
    .eq('instance_id', instanceId)
    .eq('user_id', userId)
  return !error
}