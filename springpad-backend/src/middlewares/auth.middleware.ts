// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export interface AuthRequest extends Request {
  uid?: string;
  email?: string;
  decoded?: admin.auth.DecodedIdToken;
}

export const verifyFirebaseToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    req.email = decoded.email;
    req.decoded = decoded;
    next();
  } catch (err) {
    console.error('Firebase auth error', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
