import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  const isProd = process.env.NODE_ENV === 'production';
  
  // In production, prioritize MONGODB_PROD_URI; in local dev, prioritize MONGODB_DEV_URI
  const uri = isProd
    ? (process.env.MONGODB_PROD_URI || process.env.MONGODB_URI)
    : (process.env.MONGODB_DEV_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/spillatea_dev');

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri);
    const dbName = conn.connection.name;
    const modeLabel = isProd ? '🔴 PRODUCTION (Live User Data)' : '🟢 DEVELOPMENT (Dummy/Test Data)';

    console.log(`[MongoDB] Environment: ${modeLabel}`);
    console.log(`[MongoDB] Active Database: ${dbName} on ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`[MongoDB] Connection error: ${err.message}`);
    return null;
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Warning: Database connection lost.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Connection restored.');
});
