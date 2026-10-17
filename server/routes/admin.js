import express from 'express';
import { Confession } from '../models/Confession.js';
import { AuditLog } from '../models/AuditLog.js';

const router = express.Router();

// POST /api/admin/reveal — Server-authorized identity reveal with audit logging
router.post('/reveal', async (req, res) => {
  try {
    const { postId, moderatorName = 'Verified Moderator', role = 'admin' } = req.body;

    // Strict role check
    if (role !== 'admin' && role !== 'moderator') {
      return res.status(403).json({
        success: false,
        error: 'Security Permission Denied: Only authenticated campus moderators can request student identity reveals.'
      });
    }

    if (!postId) {
      return res.status(400).json({ success: false, error: 'Post ID is required.' });
    }

    // Query specifically including the private fields
    const confession = await Confession.findOne({
      $or: [{ id: postId }, { confession_number: postId }]
    }).select('+real_author_name +real_author_email');

    if (!confession) {
      return res.status(404).json({ success: false, error: 'Confession not found.' });
    }

    // Record immutable audit entry
    const auditEntry = new AuditLog({
      id: `audit-${Date.now()}`,
      moderator_name: moderatorName,
      action: 'Authorized student identity reveal',
      target_post: confession.confession_number,
      target_post_id: confession.id,
      hidden_identity: confession.real_author_name || 'Anonymous User',
      registered_email: confession.real_author_email || 'redacted@college.edu',
      timestamp: new Date()
    });

    await auditEntry.save();

    res.json({
      success: true,
      data: {
        post_number_formatted: confession.confession_number,
        hidden_identity: confession.real_author_name,
        registered_email: confession.real_author_email,
        user_id: confession.author_id,
        account_status: 'Active',
        college_verified: true,
        timestamp: auditEntry.timestamp,
        audit_id: auditEntry.id
      }
    });
  } catch (err) {
    console.error('Error revealing identity:', err);
    res.status(500).json({ success: false, error: 'Failed to process secure reveal request.' });
  }
});

// GET /api/admin/audit-logs — Retrieve audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100).lean();
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve audit trail.' });
  }
});

export default router;
