import { useState } from 'react'

const EVENTS = [
  {day:1,type:'water',plant:'Monstera',label:'Water'},{day:3,type:'fertilize',plant:'Peace Lily',label:'Fertilize'},
  {day:5,type:'water',plant:'Fiddle Leaf Fig',label:'Water'},{day:7,type:'prune',plant:'Snake Plant',label:'Prune'},
  {day:10,type:'water',plant:'Aloe Vera',label:'Water'},{day:12,type:'repot',plant:'Prayer Plant',label:'Repot'},
  {day:15,type:'water',plant:'Monstera',label:'Water'},{day:18,type:'fertilize',plant:'Snake Plant',label:'Fertilize'},
  {day:20,type:'water',plant:'Peace Lily',label:'Water'},{day:22,type:'prune',plant:'Fiddle Leaf Fig',label:'Prune'},
  {day:25,type:'water',plant:'Aloe Vera',label:'Water'},{day:28,type:'repot',plant:'Monstera',label:'Repot'},
]

const DOT_COLORS = { water:'#4A90D9', fertilize:'#8BC34A', prune:'#E07A5F', repot:'#9C27B0' }
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function Calendar({ onToast }) {
  const now = new Date()
  const [month, setMonth]       = useState(now.getMonth())
  const [year, setYear]         = useState(now.getFullYear())
  const [selected, setSelected] = useState(null)

  const changeMonth = (d) => {
    let m = month + d, y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setMonth(m); setYear(y)
  }

  const firstDay     = new Date(year, month, 1).getDay()
  const daysInMonth  = new Date(year, month+1, 0).getDate()
  const daysInPrev   = new Date(year, month, 0).getDate()
  const eventDays    = new Set(EVENTS.map(e => e.day))
  const selectedEvts = selected ? EVENTS.filter(e => e.day === selected) : []

  const cells = []
  for (let i = 0; i < firstDay; i++)
    cells.push({ day: daysInPrev - firstDay + i + 1, other: true })
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, other: false, today: d === now.getDate() && month === now.getMonth() && year === now.getFullYear(), hasEvent: eventDays.has(d) })
  const rem = 42 - cells.length
  for (let i = 1; i <= rem; i++) cells.push({ day: i, other: true })

  return (
    <main className="page-main">
      <div className="section-head"><h2>📅 Care Calendar</h2></div>
      <div style={s.grid}>
        {/* Calendar */}
        <div className="card">
          <div style={s.calNav}>
            <button style={s.arrow} onClick={() => changeMonth(-1)}>‹</button>
            <h3 style={s.monthLabel}>{MONTHS[month]} {year}</h3>
            <button style={s.arrow} onClick={() => changeMonth(1)}>›</button>
          </div>
          <div style={s.weekRow}>
            {DAYS.map(d => <div key={d} style={s.weekDay}>{d}</div>)}
          </div>
          <div style={s.daysGrid}>
            {cells.map((c, i) => (
              <div key={i}
                style={{ ...s.dayCell, opacity: c.other ? 0.3 : 1, background: c.today ? '#8AB82A' : selected===c.day ? '#EFF5C4' : 'transparent', color: c.today ? 'white' : undefined, fontWeight: c.today ? 700 : undefined, border: selected===c.day && !c.today ? '1.5px solid #8AB82A' : '1.5px solid transparent', cursor: 'pointer' }}
                onClick={() => { if (!c.other) { setSelected(c.day); if (eventDays.has(c.day)) onToast(`📅 Day ${c.day}: ${EVENTS.filter(e=>e.day===c.day).map(e=>e.label+' '+e.plant).join(', ')}`, 'success') } }}>
                {c.day}
                {c.hasEvent && !c.other && <span style={{ ...s.eventDot, background: c.today ? '#E8F5A3' : '#E07A5F' }} />}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display:'flex', gap:16, marginTop:20, flexWrap:'wrap' }}>
            {Object.entries(DOT_COLORS).map(([type, color]) => (
              <div key={type} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.8rem', color:'#7A8C3A' }}>
                <span style={{ width:10, height:10, borderRadius:'50%', background:color, display:'inline-block' }} />
                {type.charAt(0).toUpperCase()+type.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Selected day events */}
          {selected && (
            <div className="card">
              <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#5A7A10', marginBottom:16, fontSize:'1.1rem' }}>Day {selected} Events</h3>
              {selectedEvts.length === 0
                ? <p style={{ color:'#7A8C3A', fontSize:'0.88rem' }}>No care tasks this day 🌿</p>
                : selectedEvts.map((e,i) => (
                  <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(138,184,42,0.15)' }}>
                    <span style={{ width:10, height:10, borderRadius:'50%', background:DOT_COLORS[e.type], flexShrink:0 }} />
                    <div>
                      <p style={{ fontWeight:600, fontSize:'0.9rem' }}>{e.plant}</p>
                      <p style={{ fontSize:'0.8rem', color:'#7A8C3A' }}>{e.label} needed</p>
                    </div>
                    <button className="btn-sage" style={{ marginLeft:'auto', fontSize:'0.78rem', padding:'6px 14px' }}>Done ✓</button>
                  </div>
                ))
              }
            </div>
          )}

          {/* Upcoming */}
          <div className="card">
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#5A7A10', marginBottom:16, fontSize:'1.1rem' }}>Upcoming Events</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {EVENTS.slice(0,7).map((e,i) => (
                <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'12px', background:'#F9FCE8', borderRadius:10, cursor:'pointer' }}
                  onClick={() => setSelected(e.day)}>
                  <span style={{ width:10, height:10, borderRadius:'50%', background:DOT_COLORS[e.type], flexShrink:0, marginTop:3 }} />
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600, fontSize:'0.88rem' }}>{e.plant}</p>
                    <p style={{ fontSize:'0.78rem', color:'#7A8C3A' }}>{e.label} needed</p>
                  </div>
                  <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#8AB82A', background:'white', padding:'3px 10px', borderRadius:100 }}>Day {e.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const s = {
  grid: { display:'grid', gridTemplateColumns:'1fr 300px', gap:24 },
  calNav: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 },
  monthLabel: { fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:'#5A7A10' },
  arrow: { background:'none', border:'1.5px solid rgba(138,184,42,0.35)', width:36, height:36, borderRadius:'50%', cursor:'pointer', fontSize:'1.2rem', display:'flex', alignItems:'center', justifyContent:'center', color:'#2A3210' },
  weekRow: { display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:8 },
  weekDay: { textAlign:'center', fontSize:'0.72rem', fontWeight:700, color:'#7A8C3A', padding:'6px 0', textTransform:'uppercase', letterSpacing:'.5px' },
  daysGrid: { display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 },
  dayCell: { aspectRatio:'1', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', borderRadius:8, fontSize:'0.88rem', transition:'all .2s', position:'relative' },
  eventDot: { position:'absolute', bottom:4, width:5, height:5, borderRadius:'50%' },
}
