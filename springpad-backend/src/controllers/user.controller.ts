// src/controllers/userController.ts
import { Response } from 'express';
import { prisma } from '../config/prismaClient';
import { AuthRequest } from '../middlewares/auth.middleware';

/** GET /api/user/me */
export const getProfile = async (req: AuthRequest, res: Response) => {
  if (!req.uid) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = await prisma.user.upsert({
      where: { id: req.uid },
      create: {
        id: req.uid,
        email: req.email,
        emailVerified: req.emailVerified ?? false,
        displayName: req.name,
        photoURL: req.picture,
      },
      update: {
        email: req.email ?? undefined,
        emailVerified: req.emailVerified ?? undefined,
        displayName: req.name ?? undefined,
        photoURL: req.picture ?? undefined,
      },
      include: {
        investorProfile: true,
      },
    });
    res.json({ user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to get or create user' });
  }
};

/** PATCH /api/user/me */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  if (!req.uid) return res.status(401).json({ error: 'Unauthorized' });
  const { displayName, photoURL, email } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: req.uid },
      data: {
        displayName: displayName ?? undefined,
        photoURL: photoURL ?? undefined,
        email: email ?? undefined,
      },
      include: { investorProfile: true },
    });
    res.json({ user: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/** DELETE /api/user/me */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  if (!req.uid) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await prisma.user.delete({ where: { id: req.uid } });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
