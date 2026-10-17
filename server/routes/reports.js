import express from 'express';
import { Report } from '../models/Report.js';

const router = express.Router();

// GET /api/reports — Fetch moderation reports (moderator queue)
router.get('/', async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const query = status === 'all' ? {} : { status };
    const reports = await Report.find(query).sort({ created_at: -1 }).lean();
    res.json({ success: true, data: reports });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve reports.' });
  }
});

// POST /api/reports — Submit a content report
router.post('/', async (req, res) => {
  try {
    const { postId, reason, notes = '' } = req.body;

    if (!postId || !reason) {
      return res.status(400).json({ success: false, error: 'Post ID and reason are required.' });
    }

    const report = new Report({
      id: `rep-${Date.now()}`,
      post_id: postId,
      reason,
      notes,
      status: 'pending',
      created_at: new Date()
    });

    await report.save();
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    console.error('Error submitting report:', err);
    res.status(500).json({ success: false, error: 'Failed to file report.' });
  }
});

// PATCH /api/reports/:id/action — Moderator resolution action
router.patch('/:id/action', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes = '' } = req.body;

    const report = await Report.findOneAndUpdate(
      { id },
      { status: action, resolution_notes: notes },
      { returnDocument: 'after' }
    );

    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found.' });
    }

    res.json({ success: true, data: report });
  } catch (err) {
    console.error('Error resolving report:', err);
    res.status(500).json({ success: false, error: 'Failed to update report status.' });
  }
});

export default router;
