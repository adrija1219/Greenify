import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const SAMPLE = [
  { _id:'p1', name:'Monstera', location:'Living Room', emoji:'🌿', status:'urgent', statusLabel:'Needs Water', lastWatered: new Date(Date.now()-4*86400000), wateringFrequencyDays:7, light:'Medium', health:40 },
  { _id:'p2', name:'Fiddle Leaf Fig', location:'Office', emoji:'🌳', status:'warn', statusLabel:'Spider Mites', lastWatered: new Date(Date.now()-2*86400000), wateringFrequencyDays:5, light:'Bright', health:65 },
  { _id:'p3', name:'Prayer Plant', location:'Bedroom', emoji:'🙏', status:'good', statusLabel:'Healthy', lastWatered: new Date(Date.now()-86400000), wateringFrequencyDays:4, light:'Medium', health:92 },
  { _id:'p4', name:'Snake Plant', location:'Bathroom', emoji:'🗡️', status:'good', statusLabel:'Thriving', lastWatered: new Date(Date.now()-5*86400000), wateringFrequencyDays:14, light:'Low', health:97 },
  { _id:'p5', name:'Aloe Vera', location:'Kitchen', emoji:'🌵', status:'good', statusLabel:'Healthy', lastWatered: new Date(Date.now()-7*86400000), wateringFrequencyDays:14, light:'Bright', health:88 },
  { _id:'p6', name:'Peace Lily', location:'Hallway', emoji:'🤍', status:'warn', statusLabel:'Needs Fertilizer', lastWatered: new Date(Date.now()-86400000), wateringFrequencyDays:5, light:'Low', health:72 },
]

const daysAgo = (d) => {
  const diff = Math.floor((Date.now() - new Date(d)) / 86400000)
  return diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : `${diff} days ago`
}

export default function MyPlants({ onAuthOpen, onToast, onAskDrGreen }) {
  const { user } = useAuth()
  const [plants, setPlants]       = useState([])
  const [filtered, setFiltered]   = useState([])
  const [loading, setLoading]     = useState(false)
  const [search, setSearch]       = useState('')
  const [cat, setCat]             = useState('all')
  const [showAdd, setShowAdd]     = useState(false)
  const [form, setForm]           = useState({ name:'', location:'', emoji:'🌿', light:'Medium', wateringFrequencyDays:7, notes:'' })

  useEffect(() => {
    if (user) fetchPlants()
    else setPlants([])
  }, [user])

  useEffect(() => {
    let list = [...plants]
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.location?.toLowerCase().includes(search.toLowerCase()))
    if (cat === 'needs-water') list = list.filter(p => p.status === 'urgent')
    else if (cat === 'healthy') list = list.filter(p => p.status === 'good')
    else if (cat === 'sick')    list = list.filter(p => p.status === 'warn')
    setFiltered(list)
  }, [plants, search, cat])

  const fetchPlants = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/plants')
      setPlants(data.length ? data : SAMPLE)
    } catch {
      setPlants(SAMPLE)
    } finally {
      setLoading(false)
    }
  }

  const waterPlant = async (id) => {
    try {
      const { data } = await axios.patch(`/api/plants/${id}/water`)
      setPlants(prev => prev.map(p => p._id === id ? data : p))
      onToast('💧 Plant watered! Great job!', 'success')
    } catch {
      // optimistic update for demo
      setPlants(prev => prev.map(p => p._id === id ? { ...p, lastWatered: new Date(), status: 'good', statusLabel: 'Healthy' } : p))
      onToast('💧 Plant watered!', 'success')
    }
  }

  const addPlant = async () => {
    if (!form.name) return onToast('Please enter a plant name.', 'error')
    try {
      const { data } = await axios.post('/api/plants', form)
      setPlants(prev => [data, ...prev])
      onToast(`🌱 ${form.name} added to your collection!`, 'success')
    } catch {
      const fake = { ...form, _id: Date.now().toString(), status: 'good', statusLabel: 'Healthy', lastWatered: new Date(), health: 100 }
      setPlants(prev => [fake, ...prev])
      onToast(`🌱 ${form.name} added!`, 'success')
    }
    setShowAdd(false)
    setForm({ name:'', location:'', emoji:'🌿', light:'Medium', wateringFrequencyDays:7, notes:'' })
  }

  if (!user) return (
    <main className="page-main">
      <div className="card" style={{ textAlign:'center', padding: 60 }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌱</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", color:'#5A7A10', marginBottom:10 }}>Sign in to see your plants</h2>
        <p style={{ color:'#7A8C3A', marginBottom:28 }}>Track your entire plant collection with care reminders and health monitoring.</p>
        <button className="btn-sage" style={{ padding:'12px 28px', fontSize:'1rem' }} onClick={() => onAuthOpen('login')}>Sign In / Sign Up</button>
      </div>
    </main>
  )

  return (
    <main className="page-main">
      <div className="section-head">
        <h2>🪴 My Plant Family</h2>
        <button className="btn-sage" onClick={() => setShowAdd(true)}>+ Add Plant</button>
      </div>

      {/* Add Plant Modal */}
      {showAdd && (
        <div style={modal.overlay} onClick={e => e.target===e.currentTarget && setShowAdd(false)}>
          <div style={modal.box}>
            <button style={modal.close} onClick={() => setShowAdd(false)}>×</button>
            <h3 style={modal.title}>🌱 Add New Plant</h3>
            {[
              { label:'Plant Name *', key:'name', placeholder:'e.g. Monstera' },
              { label:'Location', key:'location', placeholder:'e.g. Living Room' },
              { label:'Emoji', key:'emoji', placeholder:'🌿' },
              { label:'Light Requirement', key:'light', placeholder:'Low / Medium / Bright / Full Sun' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:14 }}>
                <label style={modal.label}>{f.label}</label>
                <input style={modal.input} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(prev=>({...prev,[f.key]:e.target.value}))} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={modal.label}>Watering every (days)</label>
              <input style={modal.input} type="number" min="1" value={form.wateringFrequencyDays} onChange={e => setForm(prev=>({...prev,wateringFrequencyDays:+e.target.value}))} />
            </div>
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button className="btn-sage" style={{ flex:1 }} onClick={addPlant}>Add Plant</button>
              <button className="btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input placeholder="Search your plants..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="filter-chips">
        {[['all','All Plants'],['needs-water','Needs Water 💧'],['healthy','Healthy ✅'],['sick','Needs Attention ⚠️']].map(([v,l]) => (
          <button key={v} className={`chip ${cat===v?'active':''}`} onClick={() => setCat(v)}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /><span>Loading plants…</span></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🪴</div>
          <h3>No plants found</h3>
          <p>Add your first plant to get started!</p>
          <button className="btn-sage" onClick={() => setShowAdd(true)}>+ Add Plant</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
          {filtered.map(p => (
            <div key={p._id} style={card.wrap}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='none'}>
              <div style={card.thumb}>
                <span style={{ ...card.statusPill, background: p.status==='good'?'#d6f0c8':p.status==='warn'?'#fff0c2':'#fde0da', color: p.status==='good'?'#2a6010':p.status==='warn'?'#8a5e00':'#9b2d15' }}>
                  {p.statusLabel}
                </span>
                <span style={{ fontSize:'5rem' }}>{p.emoji}</span>
              </div>
              <div style={{ padding:18 }}>
                <h4 style={{ fontWeight:700, marginBottom:4 }}>{p.name}</h4>
                <p style={{ fontSize:'0.8rem', color:'#7A8C3A', marginBottom:12 }}>📍 {p.location}</p>
                <div style={{ background:'#EFF5C4', borderRadius:100, height:6, overflow:'hidden', marginBottom:12 }}>
                  <div style={{ height:'100%', width:`${p.health}%`, background: p.health>80?'#8AB82A':p.health>50?'#F0A500':'#E07A5F', borderRadius:100, transition:'width .5s' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'#7A8C3A', marginBottom:14 }}>
                  <span>💧 {daysAgo(p.lastWatered)}</span>
                  <span>☀️ {p.light}</span>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn-sage" style={{ flex:1, fontSize:'0.82rem' }} onClick={() => waterPlant(p._id)}>Mark Watered</button>
                  <button className="btn-outline" style={{ fontSize:'0.82rem' }} onClick={() => onAskDrGreen(`My ${p.name} has health issues, what should I do?`)}>Dr. Green</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

const modal = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(6px)' },
  box: { background:'white', borderRadius:20, padding:'36px 32px', maxWidth:420, width:'90%', position:'relative' },
  close: { position:'absolute', top:14, right:18, background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', color:'#7A8C3A' },
  title: { fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'#5A7A10', marginBottom:24 },
  label: { display:'block', fontSize:'0.78rem', fontWeight:600, color:'#3D4D18', marginBottom:6, textTransform:'uppercase', letterSpacing:'.5px' },
  input: { width:'100%', padding:'11px 14px', border:'1.5px solid rgba(138,184,42,0.35)', borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:'0.9rem', outline:'none', background:'#F9FCE8', color:'#2A3210' },
}
const card = {
  wrap: { background:'white', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 20px rgba(90,122,16,0.09)', transition:'all .25s' },
  thumb: { height:160, background:'#EFF5C4', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' },
  statusPill: { position:'absolute', top:12, right:12, padding:'4px 12px', borderRadius:100, fontSize:'0.72rem', fontWeight:700 },
}
