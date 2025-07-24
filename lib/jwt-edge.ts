/**
 * JWT verification utility for Edge Runtime
 * Uses Web Crypto API instead of Node.js crypto module
 */

interface JWTPayload {
  userId?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

function base64UrlDecode(str: string): Uint8Array {
  // Add padding if needed
  str += '='.repeat((4 - str.length % 4) % 4);
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Decode base64
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64UrlEncode(bytes: Uint8Array): string {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function verifyJWT(token: string, secret: string): Promise<JWTPayload> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  
  // Decode payload
  const payloadBytes = base64UrlDecode(payloadB64);
  const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as JWTPayload;
  
  // Check expiration
  if (payload.exp && payload.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }

  // Verify signature
  const encoder = new TextEncoder();
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const secretKey = encoder.encode(secret);
  
  // Import the secret key
  const key = await crypto.subtle.importKey(
    'raw',
    secretKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  
  // Generate expected signature
  const expectedSignatureBytes = await crypto.subtle.sign('HMAC', key, data);
  const expectedSignature = base64UrlEncode(new Uint8Array(expectedSignatureBytes));
  
  // Compare signatures
  if (expectedSignature !== signatureB64) {
    throw new Error('Invalid signature');
  }
  
  return payload;
}

export function isTokenExpired(payload: JWTPayload): boolean {
  return payload.exp ? payload.exp < Date.now() / 1000 : false;
}
