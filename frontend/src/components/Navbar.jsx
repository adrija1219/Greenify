import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar({ onAuthOpen }) {
  const { user, logout } = useAuth()
  const { totalQty } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/',          label: 'Home' },
    { to: '/my-plants', label: 'My Plants' },
    { to: '/shop',      label: 'Shop' },
    { to: '/calendar',  label: 'Care Calendar' },
    { to: '/dr-green',  label: 'Dr. Green 🤖' },
  ]

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span>🌿</span> Greenify
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              style={{ ...styles.link, ...(isActive(l.to) ? styles.linkActive : {}) }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={styles.right}>
          <Link to="/cart" style={styles.cartBtn}>
            🛒 Cart
            {totalQty > 0 && <span style={styles.badge}>{totalQty}</span>}
          </Link>

          {user ? (
            <div style={styles.userBadge}>
              <div style={styles.avatar}>{user.name[0].toUpperCase()}</div>
              <span style={styles.userName}>{user.name.split(' ')[0]}</span>
              <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/') }}>
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={styles.authBtn} onClick={() => onAuthOpen('login')}>Sign In</button>
              <button style={{ ...styles.authBtn, ...styles.authBtnPrimary }} onClick={() => onAuthOpen('signup')}>
                Sign Up Free
              </button>
            </div>
          )}

          {/* Hamburger */}
          <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              style={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: '#3D5210',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 2px 24px rgba(61,82,16,0.45)',
    padding: '0 5%',
  },
  inner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: 66, maxWidth: 1300, margin: '0 auto',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontFamily: "'Playfair Display', serif", fontSize: '1.5rem',
    color: '#fff', fontWeight: 700, textDecoration: 'none',
  },
  links: { display: 'flex', alignItems: 'center', gap: 4 },
  link: {
    padding: '8px 14px', borderRadius: 100, fontSize: '0.88rem',
    fontWeight: 500, color: 'rgba(255,255,255,0.78)',
    textDecoration: 'none', transition: 'all .2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  linkActive: { background: '#8AB82A', color: 'white' },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  cartBtn: {
    position: 'relative', padding: '8px 16px',
    background: '#E8F5A3', border: 'none', borderRadius: 100,
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    fontSize: '0.9rem', color: '#3D5210', textDecoration: 'none',
    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
  },
  badge: {
    background: '#E07A5F', color: 'white', borderRadius: '50%',
    width: 20, height: 20, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 11, fontWeight: 700,
    position: 'absolute', top: -4, right: -4,
  },
  userBadge: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: '#8AB82A', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.9rem',
  },
  userName: { fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' },
  logoutBtn: {
    padding: '6px 14px', border: '1.5px solid rgba(255,255,255,0.3)',
    background: 'transparent', borderRadius: 100,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
    cursor: 'pointer', color: 'rgba(255,255,255,0.85)', transition: 'all .2s',
  },
  authBtn: {
    padding: '9px 18px', borderRadius: 100,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
    fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
    border: '1.5px solid rgba(255,255,255,0.4)',
    color: 'rgba(255,255,255,0.9)', background: 'transparent',
  },
  authBtnPrimary: { background: '#8AB82A', color: 'white', borderColor: '#8AB82A' },
  hamburger: {
    display: 'none', background: 'none', border: 'none',
    color: 'white', fontSize: '1.5rem', cursor: 'pointer',
    '@media(max-width:768px)': { display: 'block' },
  },
  mobileMenu: {
    display: 'flex', flexDirection: 'column', padding: '12px 5% 16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  mobileLink: {
    padding: '12px 0', color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none', fontSize: '0.95rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    fontFamily: "'DM Sans', sans-serif",
  },
}
