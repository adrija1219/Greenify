import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ mode, onClose, onSuccess }) {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(mode !== 'signup')
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    if (!isLogin && !form.name) return setError('Please enter your name.')
    setLoading(true)
    try {
      if (isLogin) await login(form.email, form.password)
      else await register(form.name, form.email, form.password)
      onSuccess(isLogin ? `Welcome back! 🌿` : `Welcome to Greenify, ${form.name}! 🌱`)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <button style={styles.close} onClick={onClose}>×</button>
        <div style={styles.logo}>🌿</div>
        <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Join Greenify'}</h2>
        <p style={styles.sub}>{isLogin ? 'Sign in to your account' : 'Create your free account today 🌱'}</p>

        {error && <div style={styles.error}>{error}</div>}

        {!isLogin && (
          <div style={styles.group}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} name="name" placeholder="e.g. Jane Green" value={form.name} onChange={handle} />
          </div>
        )}
        <div style={styles.group}>
          <label style={styles.label}>Email Address</label>
          <input style={styles.input} name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Password</label>
          <input style={styles.input} name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        <button style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
          {loading ? 'Please wait…' : isLogin ? 'Sign In →' : 'Create Account →'}
        </button>

        <p style={styles.switch}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={styles.switchLink} onClick={() => { setIsLogin(!isLogin); setError('') }}>
            {isLogin ? 'Create one free' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  )
}

const inp = {
  width: '100%', padding: '13px 16px',
  border: '1.5px solid rgba(138,184,42,0.35)',
  borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.95rem', outline: 'none', background: '#F9FCE8',
  color: '#2A3210',
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    zIndex: 1000, display: 'flex', alignItems: 'center',
    justifyContent: 'center', backdropFilter: 'blur(6px)',
  },
  modal: {
    background: 'white', borderRadius: 20, padding: '44px 40px',
    maxWidth: 440, width: '90%', position: 'relative',
    boxShadow: '0 20px 80px rgba(0,0,0,0.2)',
  },
  close: {
    position: 'absolute', top: 16, right: 20,
    background: 'none', border: 'none', fontSize: '1.6rem',
    cursor: 'pointer', color: '#7A8C3A', lineHeight: 1,
  },
  logo: { textAlign: 'center', fontSize: '2.5rem', marginBottom: 8 },
  title: {
    fontFamily: "'Playfair Display', serif", fontSize: '1.7rem',
    textAlign: 'center', color: '#5A7A10', marginBottom: 6,
  },
  sub: { textAlign: 'center', color: '#7A8C3A', fontSize: '0.88rem', marginBottom: 28 },
  error: {
    background: '#fde8e8', color: '#c0392b', padding: '10px 14px',
    borderRadius: 8, fontSize: '0.85rem', marginBottom: 16,
  },
  group: { marginBottom: 18 },
  label: {
    display: 'block', fontSize: '0.78rem', fontWeight: 600,
    color: '#3D4D18', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '.5px',
  },
  input: inp,
  submitBtn: {
    width: '100%', padding: 15, background: '#8AB82A',
    color: 'white', border: 'none', borderRadius: 100,
    fontFamily: "'Playfair Display', serif", fontSize: '1rem',
    fontStyle: 'italic', cursor: 'pointer', marginTop: 8, transition: 'all .2s',
  },
  switch: { textAlign: 'center', marginTop: 20, fontSize: '0.88rem', color: '#7A8C3A' },
  switchLink: { color: '#8AB82A', fontWeight: 600, cursor: 'pointer' },
}
