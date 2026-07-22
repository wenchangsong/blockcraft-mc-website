import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const JWT_SECRET = process.env.JWT_SECRET || (
  process.env.NODE_ENV === 'production'
    ? (() => { console.error('FATAL: JWT_SECRET must be set in production'); process.exit(1); })()
    : 'mc-dev-secret-not-for-production'
)

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
const PORT = process.env.PORT || 3001
const STORAGE_DIR = process.env.STORAGE_DIR || join(__dirname, '..', '..', 'data')

export { JWT_SECRET, FRONTEND_ORIGIN, PORT, STORAGE_DIR }
