import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Cart({ onAuthOpen, onToast }) {
  const { user } = useAuth()
  const { cart, subtotal, updateQty, removeItem, clearCart } = useCart()
  const navigate = useNavigate()

  const delivery = subtotal >= 1499 ? 0 : 99
  const total    = subtotal + delivery

  const checkout = async () => {
    if (!user) { onAuthOpen('login'); return }
    await clearCart()
    onToast('🎉 Order placed! Your plants are on their way!', 'success')
    navigate('/my-plants')
  }

  const applyPromo = () => {
    const code = document.getElementById('promoInput')?.value?.toUpperCase()
    if (code === 'GREEN10' || code === 'GREENIFY') onToast('🎉 Discount applied!', 'success')
    else onToast('Invalid promo code.', 'error')
  }

  if (!cart.items || cart.items.length === 0) return (
    <main className="page-main">
      <div className="section-head"><h2>🛒 My Cart</h2></div>
      <div className="empty-state">
        <div className="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Browse our plant collection and find your next green friend.</p>
        <button className="btn-sage" style={{ padding:'12px 24px' }} onClick={() => navigate('/shop')}>Shop Plants</button>
      </div>
    </main>
  )

  return (
    <main className="page-main">
      <div className="section-head"><h2>🛒 My Cart</h2></div>
      <div style={s.layout}>
        {/* Items */}
        <div style={s.items}>
          <div style={s.itemsHead}>Your Items ({cart.items.reduce((a,i)=>a+i.qty,0)})</div>
          {cart.items.map(item => (
            <div key={item.product || item._id} style={s.item}>
              <div style={s.itemImg}>{item.emoji}</div>
              <div style={{ flex:1 }}>
                <h4 style={{ fontWeight:600, marginBottom:4 }}>{item.name}</h4>
                <p style={{ fontSize:'0.82rem', color:'#7A8C3A' }}>₹{item.price} each</p>
                <div style={s.qtyRow}>
                  <button style={s.qtyBtn} onClick={() => updateQty(item.product?.toString() || item._id, item.qty-1)}>−</button>
                  <span style={{ fontWeight:700, minWidth:24, textAlign:'center' }}>{item.qty}</span>
                  <button style={s.qtyBtn} onClick={() => updateQty(item.product?.toString() || item._id, item.qty+1)}>+</button>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
                <span style={s.itemPrice}>₹{item.price * item.qty}</span>
                <button style={s.removeBtn} onClick={() => { removeItem(item.product?.toString() || item._id); onToast('Removed from cart.','') }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={s.summary}>
          <h3 style={s.summaryTitle}>Order Summary</h3>
          <div style={s.sumRow}><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div style={s.sumRow}>
            <span>Delivery</span>
            <span style={{ color: delivery===0 ? '#8AB82A':'inherit' }}>{delivery===0?'FREE 🎉':'₹'+delivery}</span>
          </div>
          {delivery > 0 && <p style={{ fontSize:'.78rem', color:'#8AB82A', marginTop:-6, marginBottom:8 }}>Add ₹{1499-subtotal} more for free delivery!</p>}
          <div style={{ ...s.sumRow, fontWeight:700, fontSize:'1.05rem', paddingTop:14, borderTop:'1px solid rgba(138,184,42,0.18)', marginTop:8 }}>
            <span>Total</span><span>₹{total}</span>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:16 }}>
            <input id="promoInput" placeholder="Promo code" style={s.promoInput} />
            <button style={s.promoBtn} onClick={applyPromo}>Apply</button>
          </div>
          <button className="btn-sage" style={{ width:'100%', padding:16, fontSize:'1rem', fontWeight:700, marginTop:20, borderRadius:100 }} onClick={checkout}>
            {user ? 'Proceed to Checkout →' : 'Sign in to Checkout →'}
          </button>
          <p style={{ textAlign:'center', marginTop:14, fontSize:'.78rem', color:'#7A8C3A' }}>🔒 Secure · 🌱 Eco packaging · ✅ Easy returns</p>
        </div>
      </div>
    </main>
  )
}

const s = {
  layout: { display:'grid', gridTemplateColumns:'1fr 340px', gap:28, alignItems:'start' },
  items: { background:'white', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 20px rgba(90,122,16,0.09)' },
  itemsHead: { padding:'20px 24px', borderBottom:'1px solid rgba(138,184,42,0.18)', fontWeight:700, fontSize:'1.1rem' },
  item: { display:'flex', alignItems:'center', gap:18, padding:'18px 24px', borderBottom:'1px solid rgba(138,184,42,0.12)' },
  itemImg: { width:70, height:70, background:'#EFF5C4', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', flexShrink:0 },
  qtyRow: { display:'flex', alignItems:'center', gap:10, marginTop:10 },
  qtyBtn: { width:28, height:28, borderRadius:'50%', border:'1.5px solid rgba(138,184,42,0.35)', background:'white', cursor:'pointer', fontSize:'1rem', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s', color:'#2A3210' },
  itemPrice: { fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:700, color:'#5A7A10' },
  removeBtn: { background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem', padding:4 },
  summary: { background:'white', borderRadius:14, padding:24, boxShadow:'0 2px 20px rgba(90,122,16,0.09)', position:'sticky', top:88 },
  summaryTitle: { fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', marginBottom:20, paddingBottom:14, borderBottom:'1px solid rgba(138,184,42,0.18)' },
  sumRow: { display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:10 },
  promoInput: { flex:1, padding:'10px 14px', border:'1.5px solid rgba(138,184,42,0.35)', borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontSize:'0.85rem', outline:'none', width:'100%' },
  promoBtn: { padding:'10px 16px', background:'#E8F5A3', border:'none', borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontSize:'0.85rem', fontWeight:600, cursor:'pointer', color:'#3D5210', whiteSpace:'nowrap' },
}
