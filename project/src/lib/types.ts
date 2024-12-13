export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  excerpt?: string;
  publishedAt: string;
  createdAt: string;
}

export interface User {
  username: string;
  password: string;
}