import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const CATS = ['all','indoor','outdoor','succulent','tropical','accessories']

// Fallback data if backend isn't running
const FALLBACK = [
  { _id:'1', name:'Monstera Deliciosa', scientificName:'Monstera deliciosa', category:'tropical', price:899, emoji:'🌿', badge:'Bestseller', rating:4.8, reviews:124, care:'Easy', light:'Medium' },
  { _id:'2', name:'Fiddle Leaf Fig', scientificName:'Ficus lyrata', category:'indoor', price:1299, emoji:'🌳', badge:'Popular', rating:4.5, reviews:89, care:'Medium', light:'Bright' },
  { _id:'3', name:'Snake Plant', scientificName:'Sansevieria trifasciata', category:'indoor', price:499, emoji:'🗡️', badge:'', rating:4.9, reviews:203, care:'Easy', light:'Any' },
  { _id:'4', name:'Echeveria Rosette', scientificName:'Echeveria elegans', category:'succulent', price:299, emoji:'🌸', badge:'Sale', rating:4.7, reviews:67, care:'Easy', light:'Bright' },
  { _id:'5', name:'Bird of Paradise', scientificName:'Strelitzia reginae', category:'tropical', price:1799, emoji:'🦜', badge:'Rare', rating:4.6, reviews:45, care:'Medium', light:'Full Sun' },
  { _id:'6', name:'ZZ Plant', scientificName:'Zamioculcas zamiifolia', category:'indoor', price:699, emoji:'🌱', badge:'', rating:4.8, reviews:156, care:'Easy', light:'Low' },
  { _id:'7', name:'Aloe Vera', scientificName:'Aloe barbadensis', category:'succulent', price:249, emoji:'🌵', badge:'', rating:4.9, reviews:312, care:'Easy', light:'Bright' },
  { _id:'8', name:'Peace Lily', scientificName:'Spathiphyllum wallisii', category:'indoor', price:549, emoji:'🤍', badge:'Pet Friendly', rating:4.7, reviews:98, care:'Easy', light:'Low' },
  { _id:'9', name:'Cactus Mix', scientificName:'Various species', category:'succulent', price:199, emoji:'🌵', badge:'', rating:4.6, reviews:78, care:'Easy', light:'Full Sun' },
  { _id:'10', name:'Fiddle Pot — Terracotta', scientificName:'Accessory', category:'accessories', price:349, emoji:'🪣', badge:'', rating:4.8, reviews:55, care:'-', light:'-' },
  { _id:'11', name:'Organic Plant Feed', scientificName:'Accessory', category:'accessories', price:199, emoji:'🌿', badge:'', rating:4.7, reviews:88, care:'-', light:'-' },
  { _id:'12', name:'Palm Plant', scientificName:'Chamaedorea elegans', category:'outdoor', price:999, emoji:'🌴', badge:'', rating:4.5, reviews:34, care:'Medium', light:'Bright' },
]

export default function Shop({ onAuthOpen, onToast }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [products, setProducts] = useState(FALLBACK)
  const [cat, setCat]           = useState('all')
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get('/api/shop', { params: { category: cat !== 'all' ? cat : undefined, search: search || undefined } })
        setProducts(data.length ? data : FALLBACK)
      } catch {
        // Backend not running — use fallback
        let filtered = FALLBACK
        if (cat !== 'all') filtered = filtered.filter(p => p.category === cat)
        if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        setProducts(filtered)
      } finally {
        setLoading(false)
      }
    }
    const t = setTimeout(fetch, 300)
    return () => clearTimeout(t)
  }, [cat, search])

  const handleAdd = async (p) => {
    if (!user) { onAuthOpen('login'); return }
    const ok = await addToCart(p)
    if (ok) onToast(`🌿 ${p.name} added to cart!`, 'success')
    else onToast('Failed to add to cart.', 'error')
  }

  return (
    <main className="page-main">
      <div className="section-head">
        <h2>🌿 Plant Shop</h2>
        <span style={{ color: '#7A8C3A', fontSize: '0.85rem' }}>Free delivery over ₹1,499</span>
      </div>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input placeholder="Search plants, pots, accessories..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="filter-chips">
        {CATS.map(c => (
          <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /><span>Loading plants…</span></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🌱</div>
          <h3>No plants found</h3>
          <p>Try a different search or category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 22 }}>
          {products.map(p => (
            <div key={p._id} style={s.card}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              <div style={s.thumb}>
                {p.badge && <span style={s.badge}>{p.badge}</span>}
                <span style={{ fontSize: '5rem' }}>{p.emoji}</span>
              </div>
              <div style={{ padding: 18 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</h4>
                <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#7A8C3A', marginBottom: 8 }}>{p.scientificName}</p>
                <p style={{ fontSize: '0.78rem', color: '#7A8C3A', marginBottom: 2 }}>
                  <span style={{ color: '#F0A500' }}>★</span> {p.rating} ({p.reviews} reviews)
                </p>
                {p.care !== '-' && <p style={{ fontSize: '0.78rem', color: '#7A8C3A' }}>Care: {p.care} · {p.light} light</p>}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                  <span style={s.price}>₹{p.price}</span>
                  <button className="btn-sage" style={{ fontSize: '0.85rem' }} onClick={() => handleAdd(p)}>
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

const s = {
  card: { background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 20px rgba(90,122,16,0.09)', transition: 'all .25s' },
  thumb: { height: 190, background: '#EFF5C4', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { position: 'absolute', top: 12, left: 12, background: '#E07A5F', color: 'white', borderRadius: 100, padding: '4px 12px', fontSize: '0.72rem', fontWeight: 700 },
  price: { fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 700, color: '#5A7A10' },
}
