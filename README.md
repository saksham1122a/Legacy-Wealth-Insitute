# Legacy Wealth Institute — Full MERN Platform

Production-ready starter for a financial education platform. Includes:

- 🔐 JWT auth (user + admin roles)
- 📚 Course catalog with categories, levels, modules
- 🎓 User dashboard (my courses, progress tracking)
- ⚙️ Admin panel (manage courses, users, leads, view stats)
- 📥 Lead capture funnel ("DM LEGACY" style form)
- 💳 Razorpay payment integration (stubbed — plug in your keys)
- 🎨 Premium navy + gold brand design (Fraunces + Manrope typography)
- 📱 Fully responsive

---

## 📋 Prerequisites

- **Node.js** 18+ (download: https://nodejs.org)
- **MongoDB** — either:
  - Local install: https://www.mongodb.com/try/download/community
  - Or free cloud: https://www.mongodb.com/cloud/atlas (recommended for beginners)
- A code editor (VS Code recommended)

---

## 🚀 Quick Start (5 minutes)

### 1. Install dependencies

Open two terminal windows.

**Terminal 1 — Backend:**
```bash
cd server
npm install
```

**Terminal 2 — Frontend:**
```bash
cd client
npm install
```

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
Should print: `🚀 Legacy Wealth API running on port 5000`

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
Should print: `Local: http://localhost:5173`



---

## 📁 Project Structure

```
legacy-wealth/
├── server/                    # Backend (Node + Express + MongoDB)
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   └── Lead.js
│   ├── middleware/
│   │   ├── auth.js            # JWT protection
│   │   ├── admin.js           # Admin-only access
│   │   └── error.js           # Global error handler
│   ├── routes/
│   │   ├── auth.js            # /api/auth/*
│   │   ├── courses.js         # /api/courses/*
│   │   ├── enrollments.js     # /api/enrollments/*
│   │   ├── admin.js           # /api/admin/*
│   │   ├── leads.js           # /api/leads/*
│   │   └── payment.js         # /api/payment/* (Razorpay)
│   ├── utils/seed.js          # Database seeder
│   ├── server.js              # Entry point
│   └── .env.example
│
└── client/                    # Frontend (React + Vite + Tailwind)
    ├── src/
    │   ├── api/axios.js       # API client w/ JWT interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/        # Navbar, Footer, route guards
    │   ├── pages/             # Home, Courses, Dashboard, Login, etc.
    │   └── pages/admin/       # Admin pages
    ├── tailwind.config.js     # Brand tokens (navy, gold, cream)
    └── vite.config.js         # Proxy /api → backend
```

-

## 🌐 API Reference (Quick)

### Public
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login
- `GET /api/courses` — List published courses
- `GET /api/courses/:slug` — Course detail
- `POST /api/leads` — Submit lead capture form

### User (requires JWT)
- `GET /api/auth/me` — Current user
- `PUT /api/auth/me` — Update profile
- `POST /api/enrollments` — Enroll in a course
- `GET /api/enrollments/me` — My enrollments
- `PUT /api/enrollments/:id/progress` — Update progress

### Admin (requires admin role)
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/users` — All users
- `PUT /api/admin/users/:id` — Update user (role, active)
- `DELETE /api/admin/users/:id` — Delete user
- `GET /api/courses/admin/all` — All courses (incl. drafts)
- `POST /api/courses` — Create course
- `PUT /api/courses/:id` — Update course
- `DELETE /api/courses/:id` — Delete course
- `GET /api/leads` — All leads
- `PUT /api/leads/:id` — Update lead status
- `DELETE /api/leads/:id` — Delete lead

---

## 🚢 Deploying to Production

### Backend (Render / Railway / Fly.io)
1. Push code to GitHub
2. Create a new Web Service, point to `server/` directory
3. Set environment variables (everything from `.env` — but use a real `MONGO_URI` and a strong `JWT_SECRET`)
4. Deploy

### Frontend (Vercel / Netlify)
1. New project, point to `client/` directory
2. Build command: `npm run build`
3. Output directory: `dist`
4. Update `vite.config.js` proxy → replace with deployed backend URL, OR set `VITE_API_URL` env var and update `axios.js` to use it

### Database (MongoDB Atlas)
- Free tier works fine for v1 (512MB storage)
- Whitelist `0.0.0.0/0` in network access (or your server's IP)
- Use a strong DB password

---

## 🛡️ Security Checklist Before Going Live

- [ ] Change `JWT_SECRET` to a long random string
- [ ] Change default admin password
- [ ] Enable HTTPS (handled by hosts like Vercel/Render automatically)
- [ ] Add rate limiting (`express-rate-limit`) on `/api/auth/login` and `/api/leads`
- [ ] Add `helmet` middleware for security headers
- [ ] Validate file uploads (when you add course thumbnail uploads)
- [ ] Set `NODE_ENV=production` on backend
- [ ] Audit npm packages: `npm audit fix`

---

## ⚠️ Important Compliance Notes

This platform is built for **educational content** only. Before going live:

1. **SEBI RIA Registration** required if you provide investment advice for fees in India
2. **FEMA compliance** — only INR-pair currency derivatives on NSE/BSE/MCX can be marketed to Indian residents. Offshore forex/CFDs are illegal.
3. **Risk disclaimers** — already added to footer, but review with a lawyer
4. **Privacy Policy + Terms of Service** — add before collecting payments (templates available on legal SaaS sites)

The "investment dashboard" feature was **intentionally left out** — that requires SEBI portfolio manager / RIA registration plus audited reporting infrastructure. Add it only after registration.

---

## 🧪 Testing the Funnel End-to-End

1. Open http://localhost:5173
2. Fill the homepage "Apply for the 90-Day Cohort" form → submit
3. Login as admin → go to `/admin/leads` → see your submission
4. Sign up as a regular user → go to `/courses` → click any course → enroll
5. Check `/dashboard` to see the enrolled course
6. Go to admin `/admin` to see updated stats

---

## 📝 What's Next (Suggested v2 Features)

- Razorpay frontend integration (checkout flow)
- Email automation on signup + lead capture (use Resend or Brevo)
- Video hosting integration (Vimeo Pro or Bunny.net)
- Module completion tracking with quiz support
- Reviews & ratings on courses
- Referral program (track who referred whom + auto-credit)
- WhatsApp notifications via Wati or AiSensy
- SEO: server-side rendering with Next.js (when traffic justifies it)

---

## 🆘 Troubleshooting

**"MongoDB connection failed"**
→ Check that MongoDB is running locally, OR your Atlas connection string is correct + IP is whitelisted.

**"CORS error in browser"**
→ Make sure `CLIENT_URL` in `server/.env` matches the frontend URL (default `http://localhost:5173`).

**"Port 5000 already in use"**
→ Change `PORT` in `server/.env` to e.g. `5001`, then update the proxy in `client/vite.config.js`.

**"Cannot login as admin"**
→ Run `npm run seed` again (it wipes all data and recreates admin).

---

Made By Saksham for Legacy Wealth Institute. Trade with logic. Invest with patience.
