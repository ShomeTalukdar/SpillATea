import express from 'express';
import { Comment } from '../models/Comment.js';
import { Confession } from '../models/Confession.js';

const router = express.Router();

// GET /api/comments/:postId — Retrieve comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post_id: postId })
      .sort({ created_at: -1 })
      .lean();

    res.json({ success: true, data: comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch comments.' });
  }
});

// POST /api/comments/:postId — Add comment to a post
router.post('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { body, author_name = 'Anonymous Student', author_role = 'Student' } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, error: 'Comment body is required.' });
    }

    const comment = new Comment({
      id: `comment-${Date.now()}`,
      post_id: postId,
      author_name: author_name.trim(),
      author_role: author_role.trim(),
      body: body.trim(),
      likes: 0,
      created_at: new Date()
    });

    await comment.save();

    // Increment comment_count on the confession
    await Confession.findOneAndUpdate(
      { $or: [{ id: postId }, { confession_number: postId }] },
      { $inc: { comment_count: 1 } }
    );

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ success: false, error: 'Failed to submit comment.' });
  }
});

export default router;
