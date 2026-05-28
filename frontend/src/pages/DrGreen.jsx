import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios';

const QUICK_QS = [
  { icon:'🍂', text:'Why are my plant leaves turning yellow?' },
  { icon:'💧', text:'How often should I water my Monstera?' },
  { icon:'🕷️', text:'How do I identify and treat spider mites?' },
  { icon:'🌱', text:'What fertilizer is best for tropical plants?' },
  { icon:'🪱', text:'My plant has root rot, what do I do?' },
  { icon:'🐾', text:'Which plants are safe for cats and dogs?' },
  { icon:'🪴', text:'How do I repot a plant correctly?' },
  { icon:'🌑', text:'Best low-light plants for indoors?' },
  { icon:'🥀', text:'My plant leaves are drooping and wilting. What could be wrong?' },
  { icon:'🟫', text:'There are brown crispy tips on my plant leaves. Why?' },
  { icon:'⬜', text:'I see white powdery stuff on my plant leaves. What is it?' },
]

const SYSTEM_PROMPT = `You are Dr. Green 🌿, a friendly and knowledgeable AI plant doctor. You specialize in:
- Diagnosing plant diseases, pests, and nutrient deficiencies
- Watering, fertilizing, and care schedules for all plant types
- Repotting, propagation, and pruning advice
- Indoor and outdoor plant recommendations
- Pet-safe plant guidance

Always be warm, encouraging, and practical. Use plant emojis occasionally. Give clear, actionable advice. If you need more info to diagnose a problem, ask a clarifying question. Keep responses concise but thorough — aim for 3-6 sentences for simple questions, more for complex diagnoses.`

export default function DrGreen({ initialQuestion }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { role:'bot', text:"Hello! I'm **Dr. Green** 🌿, your personal AI plant doctor. I'm here to help with any plant care questions — from identifying pests to perfecting watering schedules. What can I help you with today?" }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const msgsRef               = useRef(null)
  const askedInitial          = useRef(false)

  useEffect(() => {
    if (initialQuestion && !askedInitial.current) {
      askedInitial.current = true
      ask(initialQuestion)
    }
  }, [initialQuestion])

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [messages, loading])

  const ask = async (question) => {
    const q = (question || input).trim()
    if (!q || loading) return
    setInput('')

    setMessages(prev => [...prev, { role:'user', text: q }])
    setLoading(true)

    const historyToSend = history.map(h => ({
      role: h.role === 'bot' ? 'assistant' : 'user',
      content: h.content,
    }))

    try {
      const { data } = await axios.post('/api/ai/consult', {
        message: q,
        history: historyToSend,
      })

      const answer = data.reply || "Dr. Green is resting 🌿 — please try again!"

      setHistory(prev => [
        ...prev,
        { role: 'user',      content: q      },
        { role: 'assistant', content: answer },
      ])
      setMessages(prev => [...prev, { role:'bot', text: answer }])

    } catch (err) {
      console.error('Dr. Green error:', err)
      setMessages(prev => [...prev, {
        role: 'bot',
        text: `🌿 Couldn't reach Dr. Green. Make sure backend is running and MISTRAL_API_KEY is set in your .env`
      }])
    } finally {
      setLoading(false)
    }
  }

  const formatMsg = (text) => text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
  return (
    <main className="page-main">
      <div className="section-head">
        <h2>🤖 Dr. Green — AI Plant Doctor</h2>
        <span style={{ fontSize:'.82rem', color:'#7A8C3A' }}></span>
      </div>

      <div style={s.layout}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <h3 style={s.sideTitle}>Quick Questions</h3>
          {QUICK_QS.map((q,i) => (
            <button key={i} style={s.quickQ} onClick={() => ask(q.text)}
              onMouseEnter={e => e.currentTarget.style.background='#E8F5A3'}
              onMouseLeave={e => e.currentTarget.style.background='#F9FCE8'}>
              {q.icon} {q.text.substring(0, 36)}{q.text.length>36?'…':''}
            </button>
          ))}
        </div>

        {/* Chat */}
        <div style={s.chatWrap}>
          <div style={s.chatHeader}>
            <div style={s.drAvatar}>🌿</div>
            <div>
              <h3 style={{ fontSize:'1.05rem', fontWeight:700 }}>Dr. Green</h3>
              <p style={{ fontSize:'0.78rem', opacity:0.8 }}>AI Plant Specialist · Online</p>
            </div>
            {user && <span style={{ marginLeft:'auto', fontSize:'0.8rem', opacity:0.7 }}>Hi, {user.name.split(' ')[0]}! 👋</span>}
          </div>

          <div ref={msgsRef} style={s.messages}>
            {messages.map((m, i) => (
              <div key={i} style={{ ...s.msgRow, flexDirection: m.role==='user'?'row-reverse':'row' }}>
                <div style={{ ...s.avatar, background: m.role==='user'?'#8AB82A':'#E8F5A3', color: m.role==='user'?'white':'#3D5210' }}>
                  {m.role==='user' ? (user?user.name[0].toUpperCase():'👤') : '🌿'}
                </div>
                <div style={{ ...s.bubble, background: m.role==='user'?'#8AB82A':'#F9FCE8', color: m.role==='user'?'white':undefined, borderBottomRightRadius: m.role==='user'?4:14, borderBottomLeftRadius: m.role==='bot'?4:14 }}
                  dangerouslySetInnerHTML={{ __html: formatMsg(m.text) }} />
              </div>
            ))}
            {loading && (
              <div style={{ ...s.msgRow, flexDirection:'row' }}>
                <div style={{ ...s.avatar, background:'#E8F5A3', color:'#3D5210' }}>🌿</div>
                <div style={{ ...s.bubble, background:'#F9FCE8' }}>
                  <div style={s.typing}>
                    {[0,1,2].map(n => <div key={n} style={{ ...s.dot, animationDelay:`${n*0.2}s` }} />)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={s.inputArea}>
            <input style={s.chatInput} value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask Dr. Green anything about your plants…"
              onKeyDown={e => e.key==='Enter' && !loading && ask(input)} />
            <button className="btn-sage" style={{ padding:'12px 22px', borderRadius:100, flexShrink:0 }}
              onClick={() => ask(input)} disabled={loading || !input.trim()}>
              Send 🌿
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </main>
  )
}

const s = {
  layout: { display:'grid', gridTemplateColumns:'280px 1fr', gap:24, minHeight:500 },
  sidebar: { background:'white', borderRadius:14, padding:20, boxShadow:'0 2px 20px rgba(90,122,16,0.09)', alignSelf:'start' },
  sideTitle: { fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', color:'#5A7A10', marginBottom:14 },
  quickQ: { width:'100%', padding:'10px 12px', background:'#F9FCE8', border:'none', borderRadius:8, fontSize:'0.83rem', cursor:'pointer', marginBottom:6, textAlign:'left', fontFamily:"'DM Sans',sans-serif", color:'#2A3210', transition:'background .15s', lineHeight:1.4 },
  chatWrap: { background:'white', borderRadius:14, boxShadow:'0 2px 20px rgba(90,122,16,0.09)', display:'flex', flexDirection:'column', overflow:'hidden' },
  chatHeader: { padding:'18px 22px', background:'linear-gradient(135deg,#4A6A08,#7BAA1E)', color:'white', display:'flex', alignItems:'center', gap:14 },
  drAvatar: { width:44, height:44, borderRadius:'50%', background:'#E8F5A3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 },
  messages: { flex:1, overflowY:'auto', padding:22, display:'flex', flexDirection:'column', gap:16, minHeight:320, maxHeight:'calc(100vh - 460px)' },
  msgRow: { display:'flex', gap:12, animation:'msgIn .3s ease' },
  avatar: { width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0, fontWeight:700 },
  bubble: { maxWidth:'75%', padding:'13px 17px', borderRadius:16, fontSize:'0.9rem', lineHeight:1.65 },
  inputArea: { padding:'16px 20px', borderTop:'1px solid rgba(138,184,42,0.18)', display:'flex', gap:10 },
  chatInput: { flex:1, padding:'12px 18px', border:'1.5px solid rgba(138,184,42,0.35)', borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontSize:'0.9rem', outline:'none' },
  typing: { display:'flex', gap:5, alignItems:'center', padding:'4px 2px' },
  dot: { width:8, height:8, background:'#7A8C3A', borderRadius:'50%', animation:'bounce .8s ease infinite' },
}