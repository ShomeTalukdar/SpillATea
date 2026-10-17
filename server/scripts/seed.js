import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Confession } from '../models/Confession.js';
import { Comment } from '../models/Comment.js';
import { INITIAL_CONFESSIONS, INITIAL_COMMENTS } from '../data/initialData.js';

dotenv.config();

async function seedDatabase() {
  console.log('[Seed] Connecting to MongoDB...');
  const conn = await connectDB();
  if (!conn) {
    console.error('[Seed] Database connection failed. Please check MONGODB_URI.');
    process.exit(1);
  }

  try {
    const existingCount = await Confession.countDocuments();
    const force = process.argv.includes('--force');

    if (existingCount > 0 && !force) {
      console.log(`[Seed] Database already contains ${existingCount} confessions. Use --force to re-seed.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    if (force) {
      console.log('[Seed] Clearing existing collections...');
      await Confession.deleteMany({});
      await Comment.deleteMany({});
    }

    console.log(`[Seed] Inserting ${INITIAL_CONFESSIONS.length} confessions...`);
    await Confession.insertMany(INITIAL_CONFESSIONS);

    console.log(`[Seed] Inserting ${INITIAL_COMMENTS.length} initial comments...`);
    await Comment.insertMany(INITIAL_COMMENTS);

    console.log('[Seed] Database successfully seeded with campus confessions!');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedDatabase();
