import type { APIRoute } from 'astro';
import { verifyToken } from '../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('token')?.value;
  const isAuthenticated = token && await verifyToken(token);

  if (!isAuthenticated) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }

  // In a real application, you would upload this to a storage service
  // For now, we'll create a data URL
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const mimeType = file.type;
  const dataUrl = `data:${mimeType};base64,${base64}`;

  return new Response(JSON.stringify({ url: dataUrl }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};