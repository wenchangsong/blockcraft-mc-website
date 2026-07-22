import { Router } from 'express'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { JWT_SECRET } from '../config.js'
const router = Router()

// --- Categories ---

router.get('/categories', (req, res) => {
  const categories = db.prepare(`
    SELECT c.*, COUNT(t.id) as topic_count
    FROM forum_categories c
    LEFT JOIN forum_topics t ON c.id = t.category_id
    GROUP BY c.id
    ORDER BY c.sort_order
  `).all()
  res.json({ data: categories })
})

router.post('/categories', authenticate, requireAdmin, (req, res) => {
  const { name, description, sort_order } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }
  const result = db.prepare('INSERT INTO forum_categories (name, description, sort_order) VALUES (?, ?, ?)').run(name, description || '', sort_order || 0)
  const category = db.prepare('SELECT * FROM forum_categories WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json({ data: category, message: 'Category created' })
})

router.delete('/categories/:id', authenticate, requireAdmin, (req, res) => {
  const category = db.prepare('SELECT * FROM forum_categories WHERE id = ?').get(req.params.id)
  if (!category) {
    return res.status(404).json({ error: 'Category not found' })
  }
  db.prepare('DELETE FROM forum_categories WHERE id = ?').run(req.params.id)
  res.json({ message: 'Category deleted' })
})

// --- Topics ---

router.get('/categories/:id/topics', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20))
  const offset = (page - 1) * limit

  const category = db.prepare('SELECT * FROM forum_categories WHERE id = ?').get(req.params.id)
  if (!category) {
    return res.status(404).json({ error: 'Category not found' })
  }

  const total = db.prepare('SELECT COUNT(*) as count FROM forum_topics WHERE category_id = ?').get(req.params.id).count
  const topics = db.prepare(`
    SELECT t.*, u.username as author_username,
      (SELECT COUNT(*) FROM forum_posts WHERE topic_id = t.id) as post_count,
      (SELECT created_at FROM forum_posts WHERE topic_id = t.id ORDER BY created_at DESC LIMIT 1) as last_post_at
    FROM forum_topics t
    JOIN users u ON t.author_id = u.id
    WHERE t.category_id = ?
    ORDER BY t.updated_at DESC
    LIMIT ? OFFSET ?
  `).all(req.params.id, limit, offset)

  res.json({ data: topics, category, total, page, limit, totalPages: Math.ceil(total / limit) })
})

router.get('/topics/:id', (req, res) => {
  const topic = db.prepare(`
    SELECT t.*, u.username as author_username, c.name as category_name, c.id as category_id
    FROM forum_topics t
    JOIN users u ON t.author_id = u.id
    JOIN forum_categories c ON t.category_id = c.id
    WHERE t.id = ?
  `).get(req.params.id)

  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' })
  }
  res.json({ data: topic })
})

router.post('/categories/:id/topics', authenticate, (req, res) => {
  const { title, content, image_url } = req.body
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' })
  }
  if (typeof content !== 'string' || content.length > 10000) {
    return res.status(400).json({ error: 'Content too long (max 10000 characters)' })
  }

  const category = db.prepare('SELECT * FROM forum_categories WHERE id = ?').get(req.params.id)
  if (!category) {
    return res.status(404).json({ error: 'Category not found' })
  }

  const createTopic = db.transaction(() => {
    const topicResult = db.prepare('INSERT INTO forum_topics (category_id, title, author_id) VALUES (?, ?, ?)').run(req.params.id, title, req.user.id)
    db.prepare('INSERT INTO forum_posts (topic_id, author_id, content, image_url) VALUES (?, ?, ?, ?)').run(topicResult.lastInsertRowid, req.user.id, content, image_url || null)
    return topicResult.lastInsertRowid
  })

  const topicId = createTopic()
  const topic = db.prepare(`
    SELECT t.*, u.username as author_username, c.name as category_name
    FROM forum_topics t
    JOIN users u ON t.author_id = u.id
    JOIN forum_categories c ON t.category_id = c.id
    WHERE t.id = ?
  `).get(topicId)

  res.status(201).json({ data: topic, message: 'Topic created' })
})

router.delete('/topics/:id', authenticate, (req, res) => {
  const topic = db.prepare('SELECT * FROM forum_topics WHERE id = ?').get(req.params.id)
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' })
  }
  if (req.user.role !== 'admin' && req.user.id !== topic.author_id) {
    return res.status(403).json({ error: 'Not authorized to delete this topic' })
  }

  db.prepare('DELETE FROM forum_topics WHERE id = ?').run(req.params.id)
  res.json({ message: 'Topic deleted' })
})

// --- Like helper ---

function attachLikes(posts, userId) {
  return posts.map((p) => {
    const likes = db.prepare('SELECT COUNT(*) as count FROM forum_post_likes WHERE post_id = ?').get(p.id)
    let liked = false
    if (userId) {
      liked = !!db.prepare('SELECT 1 FROM forum_post_likes WHERE post_id = ? AND user_id = ?').get(p.id, userId)
    }
    return { ...p, likes_count: likes.count, liked_by_user: liked }
  })
}

// --- Posts ---

router.get('/topics/:id/posts', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20))
  const offset = (page - 1) * limit

  let userId = null
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.split(' ')[1], JWT_SECRET)
      userId = payload.id
    } catch {}
  }

  const total = db.prepare('SELECT COUNT(*) as count FROM forum_posts WHERE topic_id = ?').get(req.params.id).count
  const posts = db.prepare(`
    SELECT p.*, u.username as author_username, u.role as author_role
    FROM forum_posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.topic_id = ?
    ORDER BY p.created_at ASC
    LIMIT ? OFFSET ?
  `).all(req.params.id, limit, offset)

  const result = attachLikes(posts, userId)
  if (!userId) {
    for (const p of result) delete p.author_role
  }
  res.json({ data: result, total, page, limit, totalPages: Math.ceil(total / limit) })
})

router.post('/topics/:id/posts', authenticate, (req, res) => {
  const { content, image_url } = req.body
  if (!content) {
    return res.status(400).json({ error: 'Content is required' })
  }
  if (typeof content !== 'string' || content.length > 10000) {
    return res.status(400).json({ error: 'Content too long (max 10000 characters)' })
  }

  const topic = db.prepare('SELECT * FROM forum_topics WHERE id = ?').get(req.params.id)
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' })
  }

  const result = db.prepare('INSERT INTO forum_posts (topic_id, author_id, content, image_url) VALUES (?, ?, ?, ?)').run(req.params.id, req.user.id, content, image_url || null)
  db.prepare("UPDATE forum_topics SET updated_at = datetime('now') WHERE id = ?").run(req.params.id)

  const post = db.prepare(`
    SELECT p.*, u.username as author_username, u.role as author_role
    FROM forum_posts p JOIN users u ON p.author_id = u.id
    WHERE p.id = ?
  `).get(result.lastInsertRowid)

  res.status(201).json({ data: { ...post, likes_count: 0, liked_by_user: false }, message: 'Reply posted' })
})

router.put('/posts/:id', authenticate, (req, res) => {
  const post = db.prepare('SELECT * FROM forum_posts WHERE id = ?').get(req.params.id)
  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }
  if (req.user.id !== post.author_id) {
    return res.status(403).json({ error: 'Not authorized to edit this post' })
  }

  const { content } = req.body
  if (!content) {
    return res.status(400).json({ error: 'Content is required' })
  }

  db.prepare("UPDATE forum_posts SET content = ?, updated_at = datetime('now') WHERE id = ?").run(content, req.params.id)

  const updated = db.prepare(`
    SELECT p.*, u.username as author_username, u.role as author_role
    FROM forum_posts p JOIN users u ON p.author_id = u.id
    WHERE p.id = ?
  `).get(req.params.id)

  const likes = db.prepare('SELECT COUNT(*) as count FROM forum_post_likes WHERE post_id = ?').get(req.params.id)
  const liked = !!db.prepare('SELECT 1 FROM forum_post_likes WHERE post_id = ? AND user_id = ?').get(req.params.id, req.user.id)

  res.json({ data: { ...updated, likes_count: likes.count, liked_by_user: liked }, message: 'Post updated' })
})

router.delete('/posts/:id', authenticate, (req, res) => {
  const post = db.prepare('SELECT * FROM forum_posts WHERE id = ?').get(req.params.id)
  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }
  if (req.user.role !== 'admin' && req.user.id !== post.author_id) {
    return res.status(403).json({ error: 'Not authorized to delete this post' })
  }

  db.prepare('DELETE FROM forum_posts WHERE id = ?').run(req.params.id)
  res.json({ message: 'Post deleted' })
})

// --- Likes ---

router.post('/posts/:id/like', authenticate, (req, res) => {
  const post = db.prepare('SELECT * FROM forum_posts WHERE id = ?').get(req.params.id)
  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }

  const existing = db.prepare('SELECT 1 FROM forum_post_likes WHERE post_id = ? AND user_id = ?').get(req.params.id, req.user.id)
  if (existing) {
    db.prepare('DELETE FROM forum_post_likes WHERE post_id = ? AND user_id = ?').run(req.params.id, req.user.id)
    const count = db.prepare('SELECT COUNT(*) as count FROM forum_post_likes WHERE post_id = ?').get(req.params.id).count
    res.json({ data: { liked: false, likes_count: count } })
  } else {
    db.prepare('INSERT INTO forum_post_likes (post_id, user_id) VALUES (?, ?)').run(req.params.id, req.user.id)
    const count = db.prepare('SELECT COUNT(*) as count FROM forum_post_likes WHERE post_id = ?').get(req.params.id).count
    res.json({ data: { liked: true, likes_count: count } })
  }
})

export default router
