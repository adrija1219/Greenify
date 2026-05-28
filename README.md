# 🌿 Greenify — Full Stack Plant Care App

React + Node.js + Express + MongoDB + JWT Auth

## Project Structure

```
greenify/
├── frontend/          ← React + Vite
│   ├── src/
│   │   ├── components/    (Navbar, AuthModal, Footer, Toast)
│   │   ├── context/       (AuthContext, CartContext)
│   │   ├── hooks/         (useToast)
│   │   ├── pages/         (Home, Shop, MyPlants, Cart, DrGreen, Calendar)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── backend/           ← Node + Express + MongoDB
    ├── models/        (User, Plant, Product, Cart)
    ├── routes/        (auth, plants, shop, cart)
    ├── middleware/    (auth - JWT protect)
    ├── server.js
    ├── .env
    └── package.json
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) OR a MongoDB Atlas URI

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/greenify
JWT_SECRET=your_secret_key_here
```

```bash
npm run dev        # starts on http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 JWT Auth | Register / Login with bcrypt hashing + 30-day tokens |
| 🪴 My Plants | CRUD plant collection stored in MongoDB per user |
| 🛍️ Shop | 12 products, filter by category, search, add to cart |
| 🛒 Cart | Per-user cart in MongoDB, qty controls, promo codes |
| 🤖 Dr. Green | AI chat powered by Claude (Anthropic API) |
| 📅 Calendar | Interactive care schedule with event tracking |
| 📱 Responsive | Works on mobile, tablet, desktop |

---

## 🔑 API Endpoints

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| GET | `/api/auth/profile` | ✅ | Get current user |

### Plants
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/plants` | ✅ | Get user's plants |
| POST | `/api/plants` | ✅ | Add plant |
| PUT | `/api/plants/:id` | ✅ | Update plant |
| PATCH | `/api/plants/:id/water` | ✅ | Mark watered |
| DELETE | `/api/plants/:id` | ✅ | Delete plant |

### Shop
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/shop` | ❌ | List products (filter: `?category=indoor&search=monstera`) |
| GET | `/api/shop/:id` | ❌ | Single product |

### Cart
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/cart` | ✅ | Get user cart |
| POST | `/api/cart/add` | ✅ | Add item |
| PUT | `/api/cart/update` | ✅ | Update quantity |
| DELETE | `/api/cart/remove/:productId` | ✅ | Remove item |
| DELETE | `/api/cart/clear` | ✅ | Clear cart |

---

## 🛒 Promo Codes
- `GREEN10` — 10% discount
- `GREENIFY` — Welcome discount

---

## 🤖 Dr. Green AI Setup
The Dr. Green chat uses Anthropic's Claude API directly from the browser.
The API key is handled server-side via Vite proxy when you add it.

To enable:
1. Get your key from https://console.anthropic.com
2. The current setup calls the API from the frontend (works for development).
3. For production, move the API call to a backend route `/api/drgreen` to keep the key secret.

---

## 🌐 Tech Stack
- **Frontend**: React 18, React Router v6, Axios, Vite
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **AI**: Anthropic Claude API (claude-sonnet-4)
- **Fonts**: Playfair Display + DM Sans (Google Fonts)
