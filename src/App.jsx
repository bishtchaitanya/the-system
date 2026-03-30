import { useState } from 'react'
import { useStore } from './store/useStore'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import Raids from './pages/Raids'
import Auth from './pages/Auth'
import LoadingScreen from './components/LoadingScreen'

function NavBar({ current, onChange, hasActiveRaid }) {
  const tabs = [
    { id: 'dashboard', label: 'Quests', icon: '⚔' },
    { id: 'raids', label: 'Raids', icon: '🏯' },
    { id: 'stats', label: 'Record', icon: '📊' },
    { id: 'settings', label: 'Config', icon: '⚙' },
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      background: '#0a0a0f',
      borderTop: '1px solid #1e293b',
      display: 'flex',
      zIndex: 30,
    }}>
      {tabs.map(tab => {
        const active = current === tab.id
        const showDot = tab.id === 'raids' && hasActiveRaid && current !== 'raids'
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              fontFamily: 'inherit',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: active ? '#60a5fa' : '#475569',
            }}>
              {tab.label}
            </span>
            {showDot && (
              <span style={{
                position: 'absolute',
                top: 8,
                right: '28%',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#ef4444',
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}

function App() {
  const {
    hunter, habits, logs,
    completeHabit, createHunter,
    addHabit, resetAll, updateHunterName,
    removeHabit, activeRaids, clearedRaids,
    unusedArtifacts, startRaid, useArtifact,
    session, signup, login, logout,
  } = useStore()

  const [page, setPage] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [, forceUpdate] = useState(0)

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />
  }

  // Not logged in — show auth screen
  if (!session) {
    return (
      <Auth
        onLogin={(email, password) => {
          const result = login(email, password)
          if (result?.success) forceUpdate(n => n + 1)
          return result
        }}
        onSignup={(email, password, displayName) => {
          const result = signup(email, password, displayName)
          if (result?.success) forceUpdate(n => n + 1)
          return result
        }}
      />
    )
  }

  // Logged in but no hunter — show onboarding
  if (!hunter) {
    return <Onboarding onComplete={createHunter} displayName={session?.displayName} />
  }

  return (
    <>
      {page === 'dashboard' && (
        <Dashboard
          hunter={hunter}
          habits={habits}
          logs={logs}
          completeHabit={completeHabit}
          addHabit={addHabit}
          removeHabit={removeHabit}
          activeRaids={activeRaids}
          onGoToRaids={() => setPage('raids')}
        />
      )}
      {page === 'raids' && (
        <Raids
          hunter={hunter}
          activeRaids={activeRaids}
          clearedRaids={clearedRaids}
          unusedArtifacts={unusedArtifacts}
          startRaid={startRaid}
          useArtifact={useArtifact}
        />
      )}
      {page === 'stats' && (
        <Stats
          hunter={hunter}
          habits={habits}
          logs={logs}
        />
      )}
      {page === 'settings' && (
        <Settings
          hunter={hunter}
          onReset={resetAll}
          onNameChange={updateHunterName}
          onLogout={logout}
          session={session}
        />
      )}
      <NavBar
        current={page}
        onChange={setPage}
        hasActiveRaid={activeRaids.length > 0}
      />
    </>
  )
}

export default App