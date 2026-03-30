import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getRank } from '../store/useStore'
import { getBossesForRank, ARTIFACTS, RARITY_COLORS } from '../data/raids'

function DaysRemaining({ endsAt }) {
  const now = new Date()
  const end = new Date(endsAt)
  const diff = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)))
  return (
    <span style={{ color: diff <= 2 ? '#ef4444' : '#64748b', fontSize: 12 }}>
      {diff}d remaining
    </span>
  )
}

function HPBar({ current, max, color }) {
  const pct = Math.max(0, (current / max) * 100)
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <span style={{ color: '#64748b', fontSize: 12 }}>Boss HP</span>
        <span style={{ color, fontSize: 12, fontWeight: 600 }}>
          {current} / {max}
        </span>
      </div>
      <div style={{
        height: 8,
        background: '#1e293b',
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: pct > 50 ? color : pct > 25 ? '#f59e0b' : '#ef4444',
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  )
}

function ActiveRaidCard({ raid }) {
  const pct = (raid.currentHP / raid.maxHP) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#0f172a',
        border: `1px solid ${raid.color}44`,
        borderRadius: 16,
        padding: '24px',
        marginBottom: 12,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: `${raid.color}11`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{
            color: raid.color,
            fontSize: 11,
            letterSpacing: '0.12em',
            marginBottom: 4,
          }}>
            [ {raid.type.toUpperCase()} RAID · {raid.threat} ]
          </p>
          <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700 }}>
            {raid.name}
          </h3>
        </div>
        <DaysRemaining endsAt={raid.endsAt} />
      </div>

      <p style={{ color: '#64748b', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
        {raid.description}
      </p>

      <HPBar current={raid.currentHP} max={raid.maxHP} color={raid.color} />

      <div style={{
        marginTop: 16,
        padding: '12px 16px',
        background: '#1e293b',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <p style={{ color: '#64748b', fontSize: 12 }}>Reward on clear</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#f59e0b', fontSize: 13, fontWeight: 600 }}>
            +{raid.reward.xp} XP
          </span>
          {raid.reward.artifact && (
            <span style={{ fontSize: 16 }}>
              {ARTIFACTS[raid.reward.artifact]?.icon}
            </span>
          )}
        </div>
      </div>

      <p style={{ color: '#334155', fontSize: 11, marginTop: 12, textAlign: 'center' }}>
        Deal 1 damage per habit completed · {raid.maxHP - raid.currentHP} damage dealt so far
      </p>
    </motion.div>
  )
}

function BossSelectCard({ boss, type, onStart, alreadyActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: boss.color + '66' }}
      style={{
        background: '#0f172a',
        border: `1px solid #1e293b`,
        borderRadius: 14,
        padding: '20px',
        marginBottom: 10,
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{
            color: boss.color,
            fontSize: 11,
            letterSpacing: '0.1em',
            marginBottom: 4,
          }}>
            {boss.threat} · {boss.hp} HP
          </p>
          <h4 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
            {boss.name}
          </h4>
          <p style={{ color: '#475569', fontSize: 12, lineHeight: 1.6 }}>
            {boss.description}
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <span style={{ color: '#f59e0b', fontSize: 12, fontWeight: 600 }}>
              +{boss.reward.xp} XP
            </span>
            {boss.reward.artifact && (
              <span style={{ color: '#94a3b8', fontSize: 12 }}>
                {ARTIFACTS[boss.reward.artifact]?.icon} {ARTIFACTS[boss.reward.artifact]?.name}
              </span>
            )}
          </div>
        </div>
        <motion.button
          whileHover={!alreadyActive ? { scale: 1.05 } : {}}
          whileTap={!alreadyActive ? { scale: 0.95 } : {}}
          onClick={() => !alreadyActive && onStart(boss, type)}
          disabled={alreadyActive}
          style={{
            marginLeft: 16,
            padding: '8px 16px',
            background: alreadyActive ? '#1e293b' : boss.color + '22',
            border: `1px solid ${alreadyActive ? '#334155' : boss.color}`,
            borderRadius: 8,
            color: alreadyActive ? '#475569' : boss.color,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: alreadyActive ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {alreadyActive ? 'ACTIVE' : 'ENTER GATE'}
        </motion.button>
      </div>
    </motion.div>
  )
}
function ArtifactCard({ artifact, habits, logs, onUse, onSealHabit, onResetHabit }) {
  const def = ARTIFACTS[artifact.id]
  if (!def) return null
  const rarityColor = RARITY_COLORS[def.rarity]
  const [expanded, setExpanded] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const today = new Date().toDateString()
  const completedToday = logs
    .filter(l => new Date(l.completedAt).toDateString() === today)
    .map(l => l.habitId)

  const incompletHabits = habits.filter(h => !completedToday.includes(h.id))

  function handleSimpleUse() {
    if (confirmed) {
      onUse(artifact.instanceId)
      setConfirmed(false)
    } else {
      setConfirmed(true)
      setTimeout(() => setConfirmed(false), 3000)
    }
  }

  function handleSeal(habitId) {
    onSealHabit(artifact.instanceId, habitId)
    setExpanded(false)
  }

  function handleReset(habitId) {
    onResetHabit(artifact.instanceId, habitId)
    setExpanded(false)
  }

  const needsPicker = artifact.id === 'HUNTERS_SEAL' || artifact.id === 'ELIXIR_OF_FORGETTING'
  const isGateFragment = artifact.id === 'GATE_FRAGMENT'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: '#0f172a',
        border: `1px solid ${rarityColor}44`,
        borderRadius: 12,
        padding: '16px 20px',
        overflow: 'hidden',
      }}
    >
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>{def.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <p style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>
              {def.name}
            </p>
            <span style={{
              padding: '2px 8px',
              background: rarityColor + '22',
              border: `1px solid ${rarityColor}44`,
              borderRadius: 20,
              color: rarityColor,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}>
              {def.rarity.toUpperCase()}
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: 12 }}>{def.description}</p>
          <p style={{ color: '#334155', fontSize: 11, marginTop: 3 }}>
            From: {artifact.fromRaid}
          </p>
        </div>

        {/* Action button */}
        {!isGateFragment && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => needsPicker ? setExpanded(e => !e) : handleSimpleUse()}
            style={{
              padding: '8px 14px',
              background: confirmed ? rarityColor + '33' : 'transparent',
              border: `1px solid ${confirmed ? rarityColor : '#334155'}`,
              borderRadius: 8,
              color: confirmed ? rarityColor : '#64748b',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
            }}
          >
            {needsPicker
              ? (expanded ? 'CANCEL' : 'USE')
              : confirmed ? 'CONFIRM?' : 'USE'}
          </motion.button>
        )}

        {isGateFragment && (
          <span style={{
            color: rarityColor,
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            COLLECT 3
          </span>
        )}
      </div>

      {/* Habit picker for Hunter's Seal and Elixir */}
      <AnimatePresence>
        {expanded && needsPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: '1px solid #1e293b',
            }}>
              <p style={{
                color: '#64748b',
                fontSize: 12,
                marginBottom: 10,
                letterSpacing: '0.06em',
              }}>
                {artifact.id === 'HUNTERS_SEAL'
                  ? 'SELECT HABIT TO COMPLETE:'
                  : 'SELECT HABIT TO RESET:'}
              </p>

              {artifact.id === 'HUNTERS_SEAL' && incompletHabits.length === 0 && (
                <p style={{ color: '#475569', fontSize: 13 }}>
                  All habits already completed today.
                </p>
              )}

              {artifact.id === 'ELIXIR_OF_FORGETTING' && habits.length === 0 && (
                <p style={{ color: '#475569', fontSize: 13 }}>
                  No habits to reset.
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {artifact.id === 'HUNTERS_SEAL' &&
                  incompletHabits.map(habit => (
                    <motion.button
                      key={habit.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSeal(habit.id)}
                      style={{
                        padding: '10px 14px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: 8,
                        color: '#e2e8f0',
                        fontSize: 13,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>{habit.name}</span>
                      <span style={{ color: '#475569', fontSize: 11 }}>
                        mark complete →
                      </span>
                    </motion.button>
                  ))
                }

                {artifact.id === 'ELIXIR_OF_FORGETTING' &&
                  habits.map(habit => (
                    <motion.button
                      key={habit.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleReset(habit.id)}
                      style={{
                        padding: '10px 14px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: 8,
                        color: '#e2e8f0',
                        fontSize: 13,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>{habit.name}</span>
                      <span style={{ color: '#ef4444', fontSize: 11 }}>
                        reset logs →
                      </span>
                    </motion.button>
                  ))
                }
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
export default function Raids({ hunter, activeRaids, clearedRaids, unusedArtifacts, habits, logs, startRaid, useArtifact, resetHabitLogs }) {
  const rank = getRank(hunter.totalXP)
  const [tab, setTab] = useState('active')

  const weeklyBosses = getBossesForRank(rank.rank, 'weekly')
  const monthlyBosses = getBossesForRank(rank.rank, 'monthly')

  const activeWeekly = activeRaids.filter(r => r.type === 'weekly')
  const activeMonthly = activeRaids.filter(r => r.type === 'monthly')

  const hasAnyActive = activeRaids.length > 0

  const tabs = [
    { id: 'active', label: 'Active Raids' },
    { id: 'weekly', label: 'Weekly Gates' },
    { id: 'monthly', label: 'Monthly Gates' },
    { id: 'artifacts', label: `Artifacts ${unusedArtifacts.length > 0 ? `(${unusedArtifacts.length})` : ''}` },
  ]

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
          [ GATE MANAGEMENT ]
        </p>
        <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 700 }}>
          Boss Raids
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          Gates available to {rank.label}. Complete daily habits to deal damage.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 6,
        marginBottom: 24,
        overflowX: 'auto',
        paddingBottom: 4,
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 14px',
              background: tab === t.id ? '#1d4ed822' : 'transparent',
              border: `1px solid ${tab === t.id ? '#60a5fa' : '#1e293b'}`,
              borderRadius: 8,
              color: tab === t.id ? '#60a5fa' : '#64748b',
              fontSize: 12,
              fontWeight: tab === t.id ? 600 : 400,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Active raids tab */}
      {tab === 'active' && (
        <div>
          {activeRaids.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '56px 24px',
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: 16,
              }}
            >
              <p style={{ color: '#60a5fa', fontSize: 11, letterSpacing: '0.15em', marginBottom: 12 }}>
                [ NO ACTIVE GATES ]
              </p>
              <p style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                No raids in progress
              </p>
              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>
                Select a Weekly or Monthly gate to begin.<br />
                The System awaits your challenge.
              </p>
            </motion.div>
          ) : (
            activeRaids.map(raid => (
              <ActiveRaidCard key={raid.instanceId} raid={raid} />
            ))
          )}

          {/* Cleared raids history */}
          {clearedRaids.length > 0 && (
            <>
              <p style={{
                color: '#334155',
                fontSize: 12,
                letterSpacing: '0.1em',
                margin: '24px 0 12px',
              }}>
                CLEARED RAIDS
              </p>
              {clearedRaids.map(raid => (
                <div
                  key={raid.instanceId}
                  style={{
                    padding: '14px 20px',
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: 12,
                    marginBottom: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: 0.6,
                  }}
                >
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
                      {raid.name}
                    </p>
                    <p style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>
                      {raid.type} · {new Date(raid.startedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 700 }}>
                    CLEARED ✓
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Weekly gates tab */}
      {tab === 'weekly' && (
        <div>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
            Weekly gates last 7 days. Complete daily habits to deal damage.
            One active weekly raid at a time.
          </p>
          {weeklyBosses.length === 0 ? (
            <p style={{ color: '#475569', fontSize: 13, textAlign: 'center', padding: 32 }}>
              No weekly gates available at your rank yet.
            </p>
          ) : (
            weeklyBosses.map(boss => (
              <BossSelectCard
                key={boss.id}
                boss={boss}
                type="weekly"
                onStart={startRaid}
                alreadyActive={activeWeekly.some(r => r.id === boss.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Monthly gates tab */}
      {tab === 'monthly' && (
        <div>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
            Monthly gates last 30 days with greater rewards.
            One active monthly raid at a time.
          </p>
          {monthlyBosses.length === 0 ? (
            <p style={{ color: '#475569', fontSize: 13, textAlign: 'center', padding: 32 }}>
              No monthly gates available at your rank yet.
            </p>
          ) : (
            monthlyBosses.map(boss => (
              <BossSelectCard
                key={boss.id}
                boss={boss}
                type="monthly"
                onStart={startRaid}
                alreadyActive={activeMonthly.some(r => r.id === boss.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Artifacts tab */}
      {tab === 'artifacts' && (
        <div>
          {unusedArtifacts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '56px 24px',
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: 16,
              }}
            >
              <p style={{ color: '#60a5fa', fontSize: 11, letterSpacing: '0.15em', marginBottom: 12 }}>
                [ INVENTORY EMPTY ]
              </p>
              <p style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                No artifacts yet
              </p>
              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>
                Clear raids to earn artifacts.<br />
                They will appear here when ready to use.
              </p>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {unusedArtifacts.map(a => (
                <ArtifactCard
                  key={a.instanceId}
                  artifact={a}
                  habits={habits}
                  logs={logs}
                  onUse={useArtifact}
                  onSealHabit={(instanceId, habitId) => useArtifact(instanceId, habitId)}
                  onResetHabit={(instanceId, habitId) => {
                    useArtifact(instanceId)
                    resetHabitLogs(habitId)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}