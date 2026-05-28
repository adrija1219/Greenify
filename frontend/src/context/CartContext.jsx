import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart]       = useState({ items: [] })
  const [cartLoading, setCartLoading] = useState(false)

  const totalQty = cart.items.reduce((s, i) => s + i.qty, 0)
  const subtotal  = cart.items.reduce((s, i) => s + i.price * i.qty, 0)

  // Load cart when user logs in
  useEffect(() => {
    if (user) fetchCart()
    else setCart({ items: [] })
  }, [user])

  const fetchCart = async () => {
    try {
      setCartLoading(true)
      const { data } = await axios.get('/api/cart')
      setCart(data)
    } catch (err) {
      console.error(err)
    } finally {
      setCartLoading(false)
    }
  }

  const addToCart = async (product) => {
    if (!user) return false   // caller should prompt login
    try {
      const { data } = await axios.post('/api/cart/add', {
        productId: product._id,
        name: product.name,
        price: product.price,
        emoji: product.emoji,
      })
      setCart(data)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const updateQty = async (productId, qty) => {
    try {
      const { data } = await axios.put('/api/cart/update', { productId, qty })
      setCart(data)
    } catch (err) { console.error(err) }
  }

  const removeItem = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/cart/remove/${productId}`)
      setCart(data)
    } catch (err) { console.error(err) }
  }

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear')
      setCart({ items: [] })
    } catch (err) { console.error(err) }
  }

  return (
    <CartContext.Provider value={{ cart, totalQty, subtotal, cartLoading, addToCart, updateQty, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
