import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import confessionsRouter from './routes/confessions.js';
import commentsRouter from './routes/comments.js';
import reportsRouter from './routes/reports.js';
import adminRouter from './routes/admin.js';
import statsRouter from './routes/stats.js';
import { Confession } from './models/Confession.js';
import { Comment } from './models/Comment.js';
import { INITIAL_CONFESSIONS, INITIAL_COMMENTS } from './data/initialData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow Vite frontend during development
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/confessions', confessionsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/stats', statsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const isProd = process.env.NODE_ENV === 'production';

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SpillATea Express API',
    environment: isProd ? 'production' : 'development',
    database: states[dbState] || 'unknown',
    databaseName: mongoose.connection.name || 'none',
    isDbConnected: dbState === 1
  });
});

// Auto-seed function if DB is connected and empty
async function autoSeedIfEmpty() {
  try {
    const count = await Confession.countDocuments();
    if (count === 0) {
      console.log('[AutoSeed] Empty database detected. Populating initial confessions...');
      await Confession.insertMany(INITIAL_CONFESSIONS);
      await Comment.insertMany(INITIAL_COMMENTS);
      console.log(`[AutoSeed] Seeded ${INITIAL_CONFESSIONS.length} confessions and ${INITIAL_COMMENTS.length} comments.`);
    }
  } catch (err) {
    console.warn('[AutoSeed] Could not auto-seed database:', err.message);
  }
}

// Start Server & Connect MongoDB
async function startServer() {
  console.log('[SpillATea Backend] Initializing Express server...');
  const conn = await connectDB();
  if (conn) {
    await autoSeedIfEmpty();
  }

  app.listen(PORT, () => {
    console.log(`[SpillATea Backend] Server running on http://localhost:${PORT}`);
    console.log(`[SpillATea Backend] API Health: http://localhost:${PORT}/api/health`);
    console.log(`[SpillATea Backend] Confessions API: http://localhost:${PORT}/api/confessions`);
  });
}

startServer();
