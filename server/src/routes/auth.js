import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'
import { JWT_SECRET } from '../config.js'
const router = Router()

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again after 15 minutes' },
})

// --- CAPTCHA (before rate limiter so bots can't exhaust it) ---

router.get('/captcha', (req, res) => {
  const a = Math.floor(Math.random() * 15) + 1
  const b = Math.floor(Math.random() * 15) + 1
  const operators = ['+', '-', '*']
  const op = operators[Math.floor(Math.random() * operators.length)]
  let answer
  switch (op) {
    case '+': answer = a + b; break
    case '-': answer = a - b; break
    case '*': answer = a * b; break
  }

  const token = jwt.sign({ answer }, JWT_SECRET, { expiresIn: '3m' })
  res.json({ data: { question: `${a} ${op} ${b} = ?`, token } })
})

router.use(authLimiter)

// --- Register ---

router.post('/register', (req, res) => {
  const { username, email, password, captchaToken, captchaAnswer } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  // Verify CAPTCHA
  if (!captchaToken || captchaAnswer === undefined || captchaAnswer === null || captchaAnswer === '') {
    return res.status(400).json({ error: 'Please answer the math question' })
  }
  try {
    const payload = jwt.verify(captchaToken, JWT_SECRET)
    if (parseInt(captchaAnswer) !== payload.answer) {
      return res.status(400).json({ error: 'Incorrect answer, please try again' })
    }
  } catch {
    return res.status(400).json({ error: 'CAPTCHA expired, please refresh and try again' })
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username)
  if (existing) {
    return res.status(409).json({ error: 'Username or email already taken' })
  }

  const hash = bcrypt.hashSync(password, 10)
  const result = db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run(username, email, hash)

  res.status(201).json({
    data: { id: result.lastInsertRowid, username, email, role: 'user' },
    message: 'Registration successful',
  })
})

// --- Login ---

router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  if (!bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

  res.json({
    data: {
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    },
    message: 'Login successful',
  })
})

router.get('/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?').get(req.user.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.json({ data: user })
})

export default router
