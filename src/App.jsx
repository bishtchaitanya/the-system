import { useState } from 'react'
import { useStore } from './store/useStore'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import LoadingScreen from './components/LoadingScreen'

function NavBar({ current, onChange }) {
  const tabs = [
    { id: 'dashboard', label: 'Quests', icon: '⚔' },
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
  } = useStore()
  const [page, setPage] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />
  }

  if (!hunter) {
    return <Onboarding onComplete={createHunter} />
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
        />
      )}
      <NavBar current={page} onChange={setPage} />
    </>
  )
}

export default App