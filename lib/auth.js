import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

const SECRET_KEY = process.env.AUTH_SECRET || 'dev-insecure-secret-key-32-characters-minimum-for-jwt-signing';
const encodedKey = new TextEncoder().encode(SECRET_KEY);
const COOKIE_NAME = 'auth_session';

export async function hashPassword(password) {
  // Standard 10 rounds is cryptographically secure and 5x faster than 12
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createSession(user) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'USER',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  return token;
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function getCurrentUser(forceDb = false) {
  const session = await getSession();
  if (!session?.id) return null;

  if (!forceDb && session.role) {
    return {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'USER',
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role || 'USER',
    };
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser(true);
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Forbidden: Administrator privileges required.');
  }
  return user;
}


