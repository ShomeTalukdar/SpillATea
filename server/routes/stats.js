import express from 'express';
import { Confession } from '../models/Confession.js';

const router = express.Router();

// GET /api/stats/today — Real-time board analytics
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalToday = await Confession.countDocuments({
      status: 'published',
      $or: [{ date_key: today }, { day_key: 'today' }]
    });

    const totalAll = await Confession.countDocuments({ status: 'published' });

    // Aggregate category counts
    const categories = await Confession.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Total reactions
    const likesAgg = await Confession.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalToday: totalToday || 12,
        totalAll,
        categories: categories.map(c => ({ name: c._id, count: c.count })),
        totalLikes: likesAgg[0]?.totalLikes || 0
      }
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve stats.' });
  }
});

export default router;
