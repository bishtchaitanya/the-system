export const ARTIFACTS = {
  SHADOW_CRYSTAL: {
    id: 'SHADOW_CRYSTAL',
    name: 'Shadow Crystal',
    description: 'Skip one day without breaking your streak.',
    icon: '💎',
    rarity: 'rare',
    color: '#a78bfa',
  },
  MANA_VIAL: {
    id: 'MANA_VIAL',
    name: 'Mana Vial',
    description: 'Double XP on your next habit completion.',
    icon: '🧪',
    rarity: 'uncommon',
    color: '#60a5fa',
  },
  HUNTERS_SEAL: {
    id: 'HUNTERS_SEAL',
    name: "Hunter's Seal",
    description: 'Mark one habit as complete without doing it.',
    icon: '📜',
    rarity: 'uncommon',
    color: '#4ade80',
  },
  ELIXIR_OF_FORGETTING: {
    id: 'ELIXIR_OF_FORGETTING',
    name: 'Elixir of Forgetting',
    description: 'Reset a single habit log for a fresh start.',
    icon: '⚗️',
    rarity: 'epic',
    color: '#f59e0b',
  },
  RANK_TALISMAN: {
    id: 'RANK_TALISMAN',
    name: 'Rank Talisman',
    description: 'Grants 500 bonus XP instantly.',
    icon: '🏮',
    rarity: 'epic',
    color: '#fb923c',
  },
  GATE_FRAGMENT: {
    id: 'GATE_FRAGMENT',
    name: 'Gate Fragment',
    description: 'Collect 3 to unlock a Legendary boss raid.',
    icon: '🔮',
    rarity: 'legendary',
    color: '#f43f5e',
  },
}

export const RARITY_COLORS = {
  uncommon: '#4ade80',
  rare: '#a78bfa',
  epic: '#f59e0b',
  legendary: '#f43f5e',
}

export const WEEKLY_BOSSES = [
  // E/D Rank — Goblin tier
  {
    id: 'goblin_king',
    name: 'Goblin King Kargas',
    threat: 'E-Rank Gate',
    ranks: ['E', 'D'],
    hp: 35,
    reward: { xp: 200, artifact: 'SHADOW_CRYSTAL' },
    description: 'A low-tier gate has opened nearby. The System deems this within your capability.',
    color: '#4ade80',
  },
  {
    id: 'cave_troll',
    name: 'Cave Troll Brugosh',
    threat: 'D-Rank Gate',
    ranks: ['E', 'D'],
    hp: 40,
    reward: { xp: 250, artifact: 'MANA_VIAL' },
    description: 'A troll of considerable size guards the gate. Consistent effort will prevail.',
    color: '#4ade80',
  },
  // C/B Rank — Orc tier
  {
    id: 'orc_warlord',
    name: 'Orc Warlord Grethak',
    threat: 'C-Rank Gate',
    ranks: ['C', 'B'],
    hp: 55,
    reward: { xp: 400, artifact: 'HUNTERS_SEAL' },
    description: 'A formidable orc commands the gate. Only the disciplined shall pass.',
    color: '#60a5fa',
  },
  {
    id: 'stone_golem',
    name: 'Stone Golem Terrak',
    threat: 'C-Rank Gate',
    ranks: ['C', 'B'],
    hp: 60,
    reward: { xp: 450, artifact: 'MANA_VIAL' },
    description: 'An ancient construct of immense durability. Chip away at it daily.',
    color: '#60a5fa',
  },
  // A/S Rank
  {
    id: 'shadow_drake',
    name: 'Shadow Drake Velthar',
    threat: 'A-Rank Gate',
    ranks: ['A', 'S'],
    hp: 80,
    reward: { xp: 700, artifact: 'SHADOW_CRYSTAL' },
    description: 'A drake born of shadow energy. Its power grows if you falter.',
    color: '#a78bfa',
  },
  {
    id: 'iron_golem',
    name: 'Iron Golem Terminus',
    threat: 'S-Rank Gate',
    ranks: ['A', 'S', '★'],
    hp: 100,
    reward: { xp: 1000, artifact: 'GATE_FRAGMENT' },
    description: 'A machine of destruction. The System warns: do not underestimate this gate.',
    color: '#f59e0b',
  },
]

export const MONTHLY_BOSSES = [
  // E/D Rank — Iron Gate
  {
    id: 'iron_sentinel',
    name: 'Iron Sentinel Mordak',
    threat: 'Iron Gate',
    ranks: ['E', 'D'],
    hp: 80,
    reward: { xp: 600, artifact: 'RANK_TALISMAN' },
    description: 'Guardian of the Iron Gate. A month of discipline is required to fell this beast.',
    color: '#94a3b8',
  },
  {
    id: 'frost_giant',
    name: 'Frost Giant Yolgur',
    threat: 'Iron Gate',
    ranks: ['E', 'D'],
    hp: 100,
    reward: { xp: 700, artifact: 'ELIXIR_OF_FORGETTING' },
    description: 'A colossus of ice and fury. Sustained effort will melt its defences.',
    color: '#94a3b8',
  },
  // C/B Rank — Crystal Gate
  {
    id: 'crystal_hydra',
    name: 'Crystal Hydra Xyrath',
    threat: 'Crystal Gate',
    ranks: ['C', 'B'],
    hp: 130,
    reward: { xp: 1000, artifact: 'RANK_TALISMAN' },
    description: 'Each head regenerates unless your momentum is unbroken.',
    color: '#60a5fa',
  },
  {
    id: 'void_colossus',
    name: 'Void Colossus Narveth',
    threat: 'Crystal Gate',
    ranks: ['C', 'B'],
    hp: 150,
    reward: { xp: 1200, artifact: 'GATE_FRAGMENT' },
    description: 'A being of pure void energy. The System has classified this as critical.',
    color: '#60a5fa',
  },
  // A/S Rank — Shadow Gate
  {
    id: 'shadow_monarch_echo',
    name: 'Echo of the Shadow Monarch',
    threat: 'Shadow Gate',
    ranks: ['A', 'S'],
    hp: 200,
    reward: { xp: 2000, artifact: 'GATE_FRAGMENT' },
    description: 'A remnant of ancient power. Only the truly consistent will survive this gate.',
    color: '#a78bfa',
  },
  // National Level — Architect
  {
    id: 'architect_of_ruin',
    name: 'Architect of Ruin',
    threat: 'Architect Gate',
    ranks: ['★'],
    hp: 300,
    reward: { xp: 5000, artifact: 'RANK_TALISMAN' },
    description: 'The System has never recorded a hunter who cleared this gate. Arise.',
    color: '#f43f5e',
  },
]

export function getBossesForRank(rank, type = 'weekly') {
  const pool = type === 'weekly' ? WEEKLY_BOSSES : MONTHLY_BOSSES
  return pool.filter(b => b.ranks.includes(rank))
}