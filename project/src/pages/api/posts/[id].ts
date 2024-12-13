import type { APIRoute } from 'astro';
import { storage } from '../../../lib/storage';
import { verifyToken } from '../../../lib/auth';

export const PUT: APIRoute = async ({ request, cookies, params }) => {
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

  const post = await storage.updatePost(params.id!, {
    title,
    content,
    excerpt,
    image
  });

  if (!post) {
    return new Response('Post not found', { status: 404 });
  }

  return Response.redirect('/admin', 302);
};

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const token = cookies.get('token')?.value;
  const isAuthenticated = token && await verifyToken(token);

  if (!isAuthenticated) {
    return new Response('Unauthorized', { status: 401 });
  }

  const success = await storage.deletePost(params.id!);
  
  if (!success) {
    return new Response('Post not found', { status: 404 });
  }

  return new Response(null, { status: 204 });
};