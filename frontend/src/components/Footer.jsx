import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <div style={s.grid}>
          <div>
            <h3 style={s.brand}>🌿 Greenify</h3>
            <p style={s.tagline}>The smartest way to care for your plants. Track, learn, shop, and grow — all in one place.</p>
          </div>
          <div>
            <h4 style={s.colHead}>Product</h4>
            <Link to="/my-plants" style={s.link}>My Plants</Link>
            <Link to="/shop"      style={s.link}>Plant Shop</Link>
            <Link to="/calendar"  style={s.link}>Care Calendar</Link>
            <Link to="/dr-green"  style={s.link}>Dr. Green AI</Link>
          </div>
          <div>
            <h4 style={s.colHead}>Company</h4>
            <a style={s.link}>About Us</a>
            <a style={s.link}>Blog</a>
            <a style={s.link}>Careers</a>
            <a style={s.link}>Press</a>
          </div>
          <div>
            <h4 style={s.colHead}>Support</h4>
            <a style={s.link}>Help Center</a>
            <a style={s.link}>Contact</a>
            <a style={s.link}>Privacy Policy</a>
            <a style={s.link}>Terms</a>
          </div>
        </div>
        <div style={s.bottom}>
          <span>© 2025 Greenify · Grow with love 💚</span>
          <span>Made in India 🇮🇳</span>
        </div>
      </div>
    </footer>
  )
}

const s = {
  footer: { background: '#3D5210', color: 'white', padding: '60px 5% 32px', marginTop: 60 },
  inner: { maxWidth: 1300, margin: '0 auto' },
  grid: {
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: 48, marginBottom: 48,
  },
  brand: { fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', marginBottom: 12 },
  tagline: { opacity: .65, fontSize: '0.88rem', lineHeight: 1.7, maxWidth: 260 },
  colHead: { fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: 1, opacity: .6, marginBottom: 16 },
  link: {
    display: 'block', opacity: .75, fontSize: '0.88rem',
    marginBottom: 10, cursor: 'pointer', textDecoration: 'none', color: 'white',
  },
  bottom: {
    borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: 24,
    display: 'flex', justifyContent: 'space-between',
    fontSize: '0.8rem', opacity: .5,
  },
}
