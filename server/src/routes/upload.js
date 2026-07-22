import { Router } from 'express'
import multer from 'multer'
import { extname, join } from 'path'
import { mkdirSync, existsSync } from 'fs'
import { authenticate } from '../middleware/auth.js'
import { STORAGE_DIR } from '../config.js'

const uploadsDir = join(STORAGE_DIR, 'uploads')
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true })
}

// Magic bytes for allowed image types
const MAGIC_BYTES = {
  '89504e47': '.png',
  'ffd8ffe0': '.jpg',
  'ffd8ffe1': '.jpg',
  'ffd8ffe2': '.jpg',
  '47494638': '.gif',
  '52494646': '.webp',
}

function readMagicBytes(buffer) {
  return buffer.toString('hex', 0, 4)
}

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase()
    const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Invalid file type'), false)
    }
    cb(null, true)
  },
})

const router = Router()

// Only admins can upload images
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' })
  }

  // Verify magic bytes match the claimed extension
  const magic = readMagicBytes(req.file.buffer)
  const expectedExt = MAGIC_BYTES[magic]
  if (!expectedExt) {
    return res.status(400).json({ error: 'File content does not match a valid image type' })
  }

  // Generate filename and write buffer to disk
  const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + expectedExt
  const { writeFileSync } = await import('fs')
  writeFileSync(join(uploadsDir, filename), req.file.buffer)

  res.json({ data: { url: '/uploads/' + filename } })
})

export default router
