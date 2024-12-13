import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('blog.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    excerpt TEXT,
    publishedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Initialize admin user if not exists
const adminUsername = "Manoj Kumar Ponduru";
const adminPassword = "vlsi_engineer_2024"; // Change this in production

const admin = db.prepare('SELECT * FROM users WHERE username = ?').get(adminUsername);
if (!admin) {
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(adminUsername, hashedPassword);
}

export function getPublishedPosts() {
  return db.prepare(`
    SELECT * FROM posts 
    WHERE publishedAt IS NOT NULL 
    ORDER BY publishedAt DESC
  `).all();
}

export function getPost(slug: string) {
  return db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug);
}

export function createPost(post: {
  title: string;
  slug: string;
  content: string;
  image?: string;
  excerpt?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO posts (title, slug, content, image, excerpt, publishedAt)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  return stmt.run(post.title, post.slug, post.content, post.image, post.excerpt);
}

export function verifyUser(username: string, password: string) {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return false;
  return bcrypt.compareSync(password, user.password);
}