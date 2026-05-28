import { useState, useCallback } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { useToast } from './hooks/useToast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import ToastContainer from './components/Toast'
import Home from './pages/Home'
import Shop from './pages/Shop'
import MyPlants from './pages/MyPlants'
import Cart from './pages/Cart'
import DrGreen from './pages/DrGreen'
import Calendar from './pages/Calendar'

function AppInner() {
  const [authMode, setAuthMode]         = useState(null)   // null | 'login' | 'signup'
  const [drGreenQ, setDrGreenQ]         = useState(null)
  const { toasts, toast }               = useToast()
  const navigate                        = useNavigate()

  const openAuth  = useCallback((mode) => setAuthMode(mode), [])
  const closeAuth = useCallback(() => setAuthMode(null), [])

  const askDrGreen = useCallback((q) => {
    setDrGreenQ(q)
    navigate('/dr-green')
  }, [navigate])

  return (
    <>
      <Navbar onAuthOpen={openAuth} />

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={closeAuth}
          onSuccess={(msg) => toast(msg, 'success')}
        />
      )}

      <ToastContainer toasts={toasts} />

      <Routes>
        <Route path="/"          element={<Home      onAuthOpen={openAuth} onToast={toast} />} />
        <Route path="/shop"      element={<Shop      onAuthOpen={openAuth} onToast={toast} />} />
        <Route path="/my-plants" element={<MyPlants  onAuthOpen={openAuth} onToast={toast} onAskDrGreen={askDrGreen} />} />
        <Route path="/cart"      element={<Cart      onAuthOpen={openAuth} onToast={toast} />} />
        <Route path="/dr-green"  element={<DrGreen   initialQuestion={drGreenQ} />} />
        <Route path="/calendar"  element={<Calendar  onToast={toast} />} />
        <Route path="*"          element={
          <main className="page-main" style={{ textAlign:'center', padding:'80px 20px' }}>
            <div style={{ fontSize:'4rem', marginBottom:16 }}>🌿</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", color:'#5A7A10', marginBottom:10 }}>Page Not Found</h2>
            <p style={{ color:'#7A8C3A', marginBottom:24 }}>Looks like this page got lost in the garden.</p>
            <button className="btn-sage" style={{ padding:'12px 28px' }} onClick={() => navigate('/')}>Go Home</button>
          </main>
        } />
      </Routes>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  )
}
