import type { Post } from './types';

class Storage {
  private posts: Post[] = [];

  async getPublishedPosts(): Promise<Post[]> {
    return this.posts.filter(post => post.publishedAt).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getAllPosts(): Promise<Post[]> {
    return this.posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPost(slug: string): Promise<Post | undefined> {
    return this.posts.find(post => post.slug === slug);
  }

  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'publishedAt'>): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  async updatePost(id: string, data: Partial<Post>): Promise<Post | undefined> {
    const index = this.posts.findIndex(post => post.id === id);
    if (index === -1) return undefined;
    
    this.posts[index] = {
      ...this.posts[index],
      ...data,
      slug: data.title ? slugify(data.title) : this.posts[index].slug
    };
    
    return this.posts[index];
  }

  async deletePost(id: string): Promise<boolean> {
    const index = this.posts.findIndex(post => post.id === id);
    if (index === -1) return false;
    
    this.posts.splice(index, 1);
    return true;
  }
}

export const storage = new Storage();