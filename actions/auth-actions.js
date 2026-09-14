'use server';

import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword, createSession, destroySession, getCurrentUser } from '@/lib/auth';
import { registerSchema, loginSchema } from '@/lib/validations';

export async function registerAction(data) {
  try {
    const validated = registerSchema.parse(data);

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return { success: false, error: 'Email address is already in use.' };
    }

    const hashedPassword = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    await createSession(user);

    return { success: true, user };
  } catch (error) {
    console.error('Register action error:', error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || 'Registration failed.',
    };
  }
}

export async function loginAction(data) {
  try {
    const validated = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return { success: false, error: 'Incorrect email or password.' };
    }

    const isValid = await verifyPassword(validated.password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Incorrect email or password.' };
    }

    const userSafe = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    await createSession(userSafe);

    return { success: true, user: userSafe };
  } catch (error) {
    console.error('Login action error:', error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || 'Authentication failed.',
    };
  }
}

export async function logoutAction() {
  try {
    await destroySession();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to logout' };
  }
}

export async function getMeAction() {
  try {
    const user = await getCurrentUser();
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Not authenticated' };
  }
}
