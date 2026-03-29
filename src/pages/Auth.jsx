import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function InputField({ label, type, value, onChange, placeholder, error }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block',
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.08em',
        marginBottom: 8,
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '13px 16px',
          background: '#1e293b',
          border: `1px solid ${error ? '#ef4444' : '#334155'}`,
          borderRadius: 10,
          color: '#f1f5f9',
          fontSize: 15,
          outline: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
      />
      {error && (
        <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{error}</p>
      )}
    </div>
  )
}

function LoginForm({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!email.trim()) return setError('Email is required.')
    if (!password.trim()) return setError('Password is required.')
    setError('')
    const result = onLogin(email, password)
    if (result?.error) setError(result.error)
  }

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <p style={{
        color: '#60a5fa',
        fontSize: 11,
        letterSpacing: '0.15em',
        marginBottom: 12,
      }}>
        [ THE SYSTEM ]
      </p>
      <h2 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
        Welcome back, Hunter.
      </h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>
        The System remembers your progress.
      </p>

      <InputField
        label="EMAIL"
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setError('') }}
        placeholder="hunter@example.com"
      />
      <InputField
        label="PASSWORD"
        type="password"
        value={password}
        onChange={e => { setPassword(e.target.value); setError('') }}
        placeholder="••••••••"
        error={error}
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '14px',
          background: '#1d4ed8',
          border: 'none',
          borderRadius: 10,
          color: '#fff',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.1em',
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: 16,
        }}
      >
        ENTER THE SYSTEM
      </motion.button>

      <p style={{ textAlign: 'center', color: '#475569', fontSize: 13 }}>
        No account?{' '}
        <span
          onClick={onSwitch}
          style={{ color: '#60a5fa', cursor: 'pointer', fontWeight: 600 }}
        >
          Awaken now
        </span>
      </p>
    </motion.div>
  )
}

function SignupForm({ onSignup, onSwitch }) {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!displayName.trim()) e.displayName = 'The System requires a name.'
    if (!email.trim()) e.email = 'Email is required.'
    if (!email.includes('@')) e.email = 'Enter a valid email address.'
    if (password.length < 6) e.password = 'Password must be at least 6 characters.'
    if (password !== confirm) e.confirm = 'Passwords do not match.'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) return setErrors(e)
    setErrors({})
    const result = onSignup(email, password, displayName)
    if (result?.error) setErrors({ email: result.error })
  }

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <p style={{
        color: '#60a5fa',
        fontSize: 11,
        letterSpacing: '0.15em',
        marginBottom: 12,
      }}>
        [ THE SYSTEM ]
      </p>
      <h2 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
        Arise, new Hunter.
      </h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>
        Create your account. Your journey begins here.
      </p>

      <InputField
        label="DISPLAY NAME"
        type="text"
        value={displayName}
        onChange={e => { setDisplayName(e.target.value); setErrors({}) }}
        placeholder="How should The System address you?"
        error={errors.displayName}
      />
      <InputField
        label="EMAIL"
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setErrors({}) }}
        placeholder="hunter@example.com"
        error={errors.email}
      />
      <InputField
        label="PASSWORD"
        type="password"
        value={password}
        onChange={e => { setPassword(e.target.value); setErrors({}) }}
        placeholder="At least 6 characters"
        error={errors.password}
      />
      <InputField
        label="CONFIRM PASSWORD"
        type="password"
        value={confirm}
        onChange={e => { setConfirm(e.target.value); setErrors({}) }}
        placeholder="Repeat your password"
        error={errors.confirm}
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '14px',
          background: '#1d4ed8',
          border: 'none',
          borderRadius: 10,
          color: '#fff',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.1em',
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: 16,
        }}
      >
        CREATE ACCOUNT
      </motion.button>

      <p style={{ textAlign: 'center', color: '#475569', fontSize: 13 }}>
        Already a Hunter?{' '}
        <span
          onClick={onSwitch}
          style={{ color: '#60a5fa', cursor: 'pointer', fontWeight: 600 }}
        >
          Login here
        </span>
      </p>
    </motion.div>
  )
}

export default function Auth({ onLogin, onSignup }) {
  const [mode, setMode] = useState('login')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          initial={{ scale: 0.8, opacity: 0.15 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{
            duration: 3,
            delay: i * 0.8,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          style={{
            position: 'fixed',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '1px solid #60a5fa',
            pointerEvents: 'none',
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: 20,
          padding: '44px 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <LoginForm
              key="login"
              onLogin={onLogin}
              onSwitch={() => setMode('signup')}
            />
          ) : (
            <SignupForm
              key="signup"
              onSignup={onSignup}
              onSwitch={() => setMode('login')}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}