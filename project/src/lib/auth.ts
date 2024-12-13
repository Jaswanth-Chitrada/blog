import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode('your-secret-key');
const alg = 'HS256';

export async function createToken(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg })
    .setExpirationTime('2h')
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function verifyCredentials(username: string, password: string) {
  // In production, replace with proper credential verification
  return username === "Manoj Kumar Ponduru" && password === "vlsi_engineer_2024";
}