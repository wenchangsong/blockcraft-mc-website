import { Router } from 'express'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import db from '../db.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const window = new JSDOM('').window
const purify = DOMPurify(window)

const cleanHTML = (html) => purify.sanitize(html, {
  ALLOWED_TAGS: ['b', 'i', 'u', 's', 'strong', 'em', 'h2', 'h3', 'p', 'br', 'img', 'font', 'div', 'span'],
  ALLOWED_ATTR: ['size', 'color', 'src', 'alt'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'link', 'meta', 'style'],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp):\/\/|\/)[^\s]*$/i,
})

const router = Router()

router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10))
  const offset = (page - 1) * limit

  const total = db.prepare('SELECT COUNT(*) as count FROM news').get().count
  const articles = db.prepare(`
    SELECT n.*, u.username as author_username
    FROM news n JOIN users u ON n.author_id = u.id
    ORDER BY n.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset)

  const data = articles.map((a) => ({
    ...a,
    excerpt: a.content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').substring(0, 200),
  }))

  res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) })
})

router.get('/:id', (req, res) => {
  const article = db.prepare(`
    SELECT n.*, u.username as author_username
    FROM news n JOIN users u ON n.author_id = u.id
    WHERE n.id = ?
  `).get(req.params.id)

  if (!article) {
    return res.status(404).json({ error: 'Article not found' })
  }
  res.json({ data: article })
})

router.post('/', authenticate, requireAdmin, (req, res) => {
  const { title, content, image_url } = req.body
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' })
  }

  const sanitized = purify.sanitize(content)
  const result = db.prepare('INSERT INTO news (title, content, image_url, author_id) VALUES (?, ?, ?, ?)').run(title, sanitized, image_url || null, req.user.id)
  const article = db.prepare(`
    SELECT n.*, u.username as author_username
    FROM news n JOIN users u ON n.author_id = u.id
    WHERE n.id = ?
  `).get(result.lastInsertRowid)

  res.status(201).json({ data: article, message: 'Article created' })
})

router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const { title, content, image_url } = req.body
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' })
  }

  const article = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id)
  if (!article) {
    return res.status(404).json({ error: 'Article not found' })
  }

  const sanitized = purify.sanitize(content)
  db.prepare("UPDATE news SET title = ?, content = ?, image_url = ?, updated_at = datetime('now') WHERE id = ?").run(title, sanitized, image_url || article.image_url, req.params.id)

  const updated = db.prepare(`
    SELECT n.*, u.username as author_username
    FROM news n JOIN users u ON n.author_id = u.id
    WHERE n.id = ?
  `).get(req.params.id)

  res.json({ data: updated, message: 'Article updated' })
})

router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const article = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id)
  if (!article) {
    return res.status(404).json({ error: 'Article not found' })
  }

  db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id)
  res.json({ message: 'Article deleted' })
})

export default router
