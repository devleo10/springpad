// src/services/userSync.ts
import admin from 'firebase-admin';
import { prisma } from '../models/prisma';


export async function syncFirebaseUserToDb(uid: string) {
  const firebaseUser = await admin.auth().getUser(uid);

  const user = await prisma.user.upsert({
    where: { id: uid },
    create: {
      id: uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    },
    update: {
      email: firebaseUser.email ?? undefined,
      emailVerified: firebaseUser.emailVerified,
      displayName: firebaseUser.displayName ?? undefined,
      photoURL: firebaseUser.photoURL ?? undefined,
    },
    include: {
      investorProfile: true,
    },
  });

  return user;
}
