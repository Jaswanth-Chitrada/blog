import type { APIRoute } from 'astro';
import { storage } from '../../lib/storage';
import { slugify } from '../../lib/utils';
import { verifyToken } from '../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('token')?.value;
  const isAuthenticated = token && await verifyToken(token);

  if (!isAuthenticated) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get('title')?.toString();
  const content = formData.get('content')?.toString();
  const excerpt = formData.get('excerpt')?.toString();
  const image = formData.get('image')?.toString();

  if (!title || !content) {
    return new Response('Missing required fields', { status: 400 });
  }

  const post = await storage.createPost({
    title,
    slug: slugify(title),
    content,
    excerpt,
    image
  });

  return Response.redirect('/admin', 302);
};