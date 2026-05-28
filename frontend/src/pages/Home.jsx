import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const FEATURED = [
  { _id: 'seed1', name: 'Monstera Deliciosa', scientificName: 'Monstera deliciosa', category: 'tropical', price: 899, emoji: '🌿', badge: 'Bestseller', rating: 4.8, reviews: 124, care: 'Easy', light: 'Medium' },
  { _id: 'seed2', name: 'Fiddle Leaf Fig',    scientificName: 'Ficus lyrata',        category: 'indoor',   price: 1299, emoji: '🌳', badge: 'Popular',    rating: 4.5, reviews: 89,  care: 'Medium', light: 'Bright' },
  { _id: 'seed3', name: 'Snake Plant',         scientificName: 'Sansevieria',         category: 'indoor',   price: 499,  emoji: '🗡️', badge: '',           rating: 4.9, reviews: 203, care: 'Easy', light: 'Any' },
  { _id: 'seed4', name: 'Bird of Paradise',    scientificName: 'Strelitzia reginae',  category: 'tropical', price: 1799, emoji: '🦜', badge: 'Rare',        rating: 4.6, reviews: 45,  care: 'Medium', light: 'Full Sun' },
]

const ALERTS = [
  { plant: 'Monstera Deliciosa (Living Room)', issue: 'Soil is completely dry — water immediately!', icon: '💧', type: 'urgent',   action: 'Mark Done' },
  { plant: 'Fiddle Leaf Fig (Office)',          issue: 'Potential spider mites detected. Check undersides of leaves.', icon: '🐛', type: 'warn', action: 'View Solution' },
  { plant: 'Prayer Plant (Bedroom)',            issue: 'Fertilize tomorrow. Prepare diluted balanced feed.',           icon: '🧪', type: 'upcoming', action: 'Snooze' },
]

const QUICK = [
  { icon: '🪴', title: 'My Plants',      desc: 'Dashboard of all your green friends and health status.', to: '/my-plants' },
  { icon: '🛍️', title: 'Plant Shop',     desc: 'Discover rare & exotic plants delivered to your door.',  to: '/shop' },
  { icon: '📅', title: 'Care Calendar',  desc: 'Upcoming watering, fertilizing, and pruning schedules.', to: '/calendar' },
  { icon: '🤖', title: 'Dr. Green',      desc: 'AI-powered plant doctor — diagnose pests instantly.',     to: '/dr-green' },
  { icon: '🛒', title: 'My Cart',        desc: 'Review and checkout your selected plants.',               to: '/cart' },
]

export default function Home({ onAuthOpen, onToast }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const handleAdd = async (p) => {
    if (!user) { onAuthOpen('login'); return }
    await addToCart(p)
    onToast(`🌿 ${p.name} added to cart!`, 'success')
  }

  return (
    <>
      {/* Hero */}
      <section style={hero.wrap}>
        <div style={hero.inner}>
          <div style={hero.badge}>🏆 #1 Plant Care App · 50K+ Happy Growers</div>
          <h1 style={hero.h1}>Care for your plants with <em>intelligence</em> & love.</h1>
          <p style={hero.p}>Track watering, diagnose diseases, shop rare plants, and get AI-powered advice — all in one green oasis.</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button style={hero.btnPrimary} onClick={() => user ? navigate('/my-plants') : onAuthOpen('signup')}>Start Growing Free</button>
            <button style={hero.btnOutline} onClick={() => navigate('/shop')}>Browse Plant Shop 🌱</button>
          </div>
          <div style={hero.statsRow}>
            {[['50K+','Plants Tracked'],['2.4K','Species Catalogued'],['98%','Survival Rate'],['4.9★','User Rating']].map(([n,l]) => (
              <div key={l}><div style={hero.statNum}>{n}</div><div style={hero.statLbl}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <main className="page-main">
        {/* Alerts */}
        <div className="section-head">
          <h2>🚨 Urgent Care Needed</h2>
          <button className="section-link" onClick={() => navigate('/my-plants')}>View All Plants →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
          {ALERTS.map((a, i) => (
            <div key={i} style={{ ...alertS.card, borderLeftColor: a.type === 'urgent' ? '#E07A5F' : a.type === 'warn' ? '#F0A500' : '#8AB82A' }}>
              <span style={{ fontSize: '2rem' }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 600, marginBottom: 3, fontSize: '0.95rem' }}>{a.plant}</h4>
                <p style={{ color: '#7A8C3A', fontSize: '0.85rem' }}>{a.issue}</p>
              </div>
              <button className="btn-sage" style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                onClick={() => onToast('✅ Marked as done!', 'success')}>{a.action}</button>
            </div>
          ))}
        </div>

        {/* Quick access */}
        <div className="section-head"><h2>Quick Access</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 48 }}>
          {QUICK.map(q => (
            <div key={q.to} style={featS.card} onClick={() => navigate(q.to)}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>{q.icon}</div>
              <h3 style={featS.h3}>{q.title}</h3>
              <p style={featS.p}>{q.desc}</p>
            </div>
          ))}
        </div>

        {/* Featured */}
        <div className="section-head">
          <h2>🌟 Featured Plants</h2>
          <button className="section-link" onClick={() => navigate('/shop')}>Shop All →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 22, marginBottom: 48 }}>
          {FEATURED.map(p => (
            <div key={p._id} style={shopS.card}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              <div style={shopS.thumb}>
                {p.badge && <span style={shopS.badge}>{p.badge}</span>}
                <span style={{ fontSize: '5rem' }}>{p.emoji}</span>
              </div>
              <div style={{ padding: 18 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</h4>
                <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#7A8C3A', marginBottom: 8 }}>{p.scientificName}</p>
                <p style={{ fontSize: '0.78rem', color: '#7A8C3A' }}>★ {p.rating} ({p.reviews}) · {p.care} care · {p.light} light</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                  <span style={shopS.price}>₹{p.price}</span>
                  <button className="btn-sage" style={{ fontSize: '0.85rem' }} onClick={() => handleAdd(p)}>Add to Cart 🛒</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

const hero = {
  wrap: { background: 'linear-gradient(135deg,#4A6A08 0%,#7BAA1E 55%,#A0C832 100%)', color: 'white', padding: '90px 5% 80px', position: 'relative', overflow: 'hidden' },
  inner: { maxWidth: 1300, margin: '0 auto' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 100, padding: '6px 16px', fontSize: '0.8rem', fontWeight: 500, marginBottom: 20 },
  h1: { fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 700, lineHeight: 1.15, maxWidth: 640, marginBottom: 20 },
  p: { fontSize: '1.05rem', opacity: 0.85, maxWidth: 480, marginBottom: 34, lineHeight: 1.7 },
  btnPrimary: { padding: '14px 28px', borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', background: 'white', color: '#3D5210', border: 'none' },
  btnOutline: { padding: '14px 28px', borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: 'white' },
  statsRow: { display: 'flex', gap: 40, marginTop: 48, paddingTop: 36, borderTop: '1px solid rgba(255,255,255,0.15)', flexWrap: 'wrap' },
  statNum: { fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 700 },
  statLbl: { fontSize: '0.8rem', opacity: 0.7, marginTop: 2 },
}
const alertS = {
  card: { display: 'flex', alignItems: 'center', gap: 18, background: 'white', borderRadius: 14, padding: '18px 22px', boxShadow: '0 2px 20px rgba(90,122,16,0.09)', borderLeft: '5px solid', transition: 'all .2s' },
}
const featS = {
  card: { background: 'white', borderRadius: 14, padding: 26, boxShadow: '0 2px 20px rgba(90,122,16,0.09)', cursor: 'pointer', transition: 'all .25s', textAlign: 'center', border: '2px solid transparent' },
  h3: { fontSize: '1rem', fontWeight: 600, color: '#5A7A10', marginBottom: 6 },
  p: { fontSize: '0.82rem', color: '#7A8C3A', lineHeight: 1.5 },
}
const shopS = {
  card: { background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 20px rgba(90,122,16,0.09)', transition: 'all .25s' },
  thumb: { height: 180, background: '#EFF5C4', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { position: 'absolute', top: 12, left: 12, background: '#E07A5F', color: 'white', borderRadius: 100, padding: '4px 12px', fontSize: '0.72rem', fontWeight: 700 },
  price: { fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 700, color: '#5A7A10' },
}
