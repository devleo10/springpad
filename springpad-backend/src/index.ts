import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import userRoutes from './routes/user.route';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  }),
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/user', userRoutes);
// app.use('/api/v1/investor', investorProfileRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global error', err);
  res.status(500).json({ error: err.message || 'Internal error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
