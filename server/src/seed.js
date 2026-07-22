import bcrypt from 'bcryptjs'
import db from './db.js'

export default function seed() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()
  if (userCount.count > 0) return

  const hash = bcrypt.hashSync('admin123', 10)
  db.prepare('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)').run(
    'admin', 'admin@mc-server.com', hash, 'admin'
  )

  const categories = [
    ['General Discussion', 'Talk about anything related to the server', 1],
    ['Build Showcase', 'Share your epic builds and creations', 2],
    ['Suggestions & Feedback', 'Help us improve the server with your ideas', 3],
    ['Technical Support', 'Get help with connection issues, mods, and more', 4],
  ]

  const insert = db.prepare('INSERT INTO forum_categories (name, description, sort_order) VALUES (?, ?, ?)')
  for (const c of categories) {
    insert.run(...c)
  }

  console.log('Database seeded with admin user and forum categories')
}
