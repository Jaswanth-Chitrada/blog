import type { APIRoute } from 'astro';
import { verifyCredentials, createToken } from '../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();

  if (!username || !password) {
    return new Response('Missing credentials', { status: 400 });
  }

  const isValid = await verifyCredentials(username, password);
  if (!isValid) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const token = await createToken(username);
  cookies.set('token', token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  return Response.redirect('/admin', 302);
};