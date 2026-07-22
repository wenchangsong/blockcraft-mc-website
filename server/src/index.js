import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { join } from 'path'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import authRoutes from './routes/auth.js'
import newsRoutes from './routes/news.js'
import forumRoutes from './routes/forum.js'
import uploadRoutes from './routes/upload.js'
import seed from './seed.js'
import { FRONTEND_ORIGIN, PORT, STORAGE_DIR } from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const isProduction = process.env.NODE_ENV === 'production'

const app = express()

// Security headers
app.use(helmet({
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  } : false,
}))

// CORS — only needed in dev when Vite runs on separate port
if (!isProduction) {
  app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }))
}

app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(join(STORAGE_DIR, 'uploads')))

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
})
app.use('/api', globalLimiter)

seed()

app.use('/api/auth', authRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/forum', forumRoutes)
app.use('/api/upload', uploadRoutes)

// Custom 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: 'Internal server error' })
})

// --- Production: Serve built frontend ---
if (isProduction) {
  const distDir = join(__dirname, '..', '..', 'dist')
  if (existsSync(distDir)) {
    app.use(express.static(distDir))
    // SPA fallback — all non-API routes return index.html
    app.get('*', (req, res) => {
      res.sendFile(join(distDir, 'index.html'))
    })
    console.log('Serving frontend from dist/')
  } else {
    console.warn('dist/ not found. Run "npm run build" first.')
  }
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${isProduction ? 'production' : 'development'}]`)
})
