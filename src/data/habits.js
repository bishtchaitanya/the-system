export const HABIT_CATEGORIES = {
  HEALTH: 'Health & Fitness',
  LEARNING: 'Learning & Skills',
  MINDFULNESS: 'Mindfulness & Mental Health',
  PRODUCTIVITY: 'Productivity & Work',
}

export const DIFFICULTY = {
  EASY: { label: 'Easy', xp: 10, color: '#4ade80' },
  MEDIUM: { label: 'Medium', xp: 25, color: '#60a5fa' },
  HARD: { label: 'Hard', xp: 50, color: '#a78bfa' },
  LEGENDARY: { label: 'Legendary', xp: 100, color: '#f59e0b' },
}

export const PRESET_HABITS = [
  { name: 'Morning workout', category: 'HEALTH', difficulty: 'HARD' },
  { name: 'Drink 8 glasses of water', category: 'HEALTH', difficulty: 'EASY' },
  { name: 'Walk 10,000 steps', category: 'HEALTH', difficulty: 'MEDIUM' },
  { name: 'Sleep 8 hours', category: 'HEALTH', difficulty: 'MEDIUM' },
  { name: 'Read for 30 minutes', category: 'LEARNING', difficulty: 'MEDIUM' },
  { name: 'Practice a new skill', category: 'LEARNING', difficulty: 'HARD' },
  { name: 'Watch an educational video', category: 'LEARNING', difficulty: 'EASY' },
  { name: 'Meditate for 10 minutes', category: 'MINDFULNESS', difficulty: 'MEDIUM' },
  { name: 'Journal entry', category: 'MINDFULNESS', difficulty: 'EASY' },
  { name: 'No social media before noon', category: 'MINDFULNESS', difficulty: 'HARD' },
  { name: 'Deep work — 2 hour block', category: 'PRODUCTIVITY', difficulty: 'LEGENDARY' },
  { name: 'Plan tomorrow the night before', category: 'PRODUCTIVITY', difficulty: 'EASY' },
  { name: 'Clear inbox to zero', category: 'PRODUCTIVITY', difficulty: 'MEDIUM' },
]

export const RANKS = [
  { rank: 'E', label: 'E-Rank Hunter', minXP: 0, color: '#94a3b8' },
  { rank: 'D', label: 'D-Rank Hunter', minXP: 500, color: '#4ade80' },
  { rank: 'C', label: 'C-Rank Hunter', minXP: 2000, color: '#60a5fa' },
  { rank: 'B', label: 'B-Rank Hunter', minXP: 6000, color: '#a78bfa' },
  { rank: 'A', label: 'A-Rank Hunter', minXP: 15000, color: '#f59e0b' },
  { rank: 'S', label: 'S-Rank Hunter', minXP: 40000, color: '#fb923c' },
  { rank: '★', label: 'National Level Hunter', minXP: 100000, color: '#f43f5e' },
]

export const STREAK_MULTIPLIERS = [
  { days: 365, multiplier: 5.0, label: '1 Year' },
  { days: 100, multiplier: 3.0, label: '100 Days' },
  { days: 30, multiplier: 2.0, label: '30 Days' },
  { days: 7, multiplier: 1.5, label: '7 Days' },
  { days: 0, multiplier: 1.0, label: 'No streak' },
]