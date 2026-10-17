import express from 'express';
import { Confession } from '../models/Confession.js';
import { Comment } from '../models/Comment.js';

const router = express.Router();

function formatConfessionNumber(num) {
  if (num < 10) return `No. 00${num}`;
  if (num < 100) return `No. 0${num}`;
  return `No. ${num}`;
}

// GET /api/confessions — Filter, Search, and Browse
router.get('/', async (req, res) => {
  try {
    const { day, category, search, sort = 'latest', page = 1, limit = 50 } = req.query;

    const query = { status: 'published' };

    if (day && day !== 'all') {
      query.day_key = day;
    }

    if (category && category !== 'All' && category !== 'all') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { body: { $regex: term, $options: 'i' } },
        { to_target: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
        { confession_number: { $regex: term, $options: 'i' } }
      ];
    }

    let sortObj = { created_at: -1 };
    if (sort === 'popular') {
      sortObj = { likes: -1, created_at: -1 };
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const confessions = await Confession.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean();

    const total = await Confession.countDocuments(query);

    res.json({
      success: true,
      data: confessions,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10))
    });
  } catch (err) {
    console.error('Error fetching confessions:', err);
    res.status(500).json({ success: false, error: 'Internal server error fetching confessions.' });
  }
});

// GET /api/confessions/:id — Fetch Single Post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Confession.findOne({
      $or: [{ id }, { confession_number: id }]
    }).lean();

    if (!post) {
      return res.status(404).json({ success: false, error: 'Confession not found.' });
    }

    res.json({ success: true, data: post });
  } catch (err) {
    console.error('Error fetching confession:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve confession.' });
  }
});

// POST /api/confessions — Create New Confession
router.post('/', async (req, res) => {
  try {
    const {
      body,
      to_target,
      category = 'General',
      is_anonymous = true,
      author_name = 'Anonymous Student',
      real_author_name = 'Student',
      real_author_email = 'student@college.edu'
    } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, error: 'Confession body cannot be empty.' });
    }

    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = dayNames[now.getDay()];
    const dayLabel = `${dayName}, ${now.getDate()} ${months[now.getMonth()]}`;

    const totalCount = await Confession.countDocuments();
    let sequenceNum = totalCount + 1;
    let confession_number = formatConfessionNumber(sequenceNum);

    // Guarantee unique number even across dates
    let exists = await Confession.exists({ confession_number });
    while (exists) {
      sequenceNum++;
      confession_number = formatConfessionNumber(sequenceNum);
      exists = await Confession.exists({ confession_number });
    }

    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const time_formatted = `${formattedHours}:${minutes} ${ampm}`;

    const newConfession = new Confession({
      id: `confession-${Date.now()}`,
      confession_number,
      date_key: dateKey,
      day_key: 'today',
      day_name: dayName,
      day_label: dayLabel,
      time_formatted,
      exact_time: `${dayName}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} at ${time_formatted}`,
      to_target: to_target ? to_target.trim() : null,
      category: category.trim(),
      body: body.trim(),
      image_url: null,
      likes: 0,
      saved_count: 0,
      comment_count: 0,
      is_anonymous: Boolean(is_anonymous),
      author_name: is_anonymous ? 'Anonymous Student' : author_name,
      author_id: `uuid-${Date.now()}`,
      real_author_name,
      real_author_email,
      status: 'published',
      created_at: now
    });

    await newConfession.save();

    // Return sanitized object without real credentials
    const createdObj = newConfession.toObject();
    delete createdObj.real_author_name;
    delete createdObj.real_author_email;

    res.status(201).json({ success: true, data: createdObj });
  } catch (err) {
    console.error('Error creating confession:', err);
    res.status(500).json({ success: false, error: 'Could not submit confession.' });
  }
});

// POST /api/confessions/:id/like — Toggle Like
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { delta = 1 } = req.body;

    const confession = await Confession.findOneAndUpdate(
      { $or: [{ id }, { confession_number: id }] },
      { $inc: { likes: delta } },
      { returnDocument: 'after' }
    ).lean();

    if (!confession) {
      return res.status(404).json({ success: false, error: 'Confession not found.' });
    }

    res.json({ success: true, likes: confession.likes });
  } catch (err) {
    console.error('Error liking confession:', err);
    res.status(500).json({ success: false, error: 'Failed to update reaction.' });
  }
});

// DELETE /api/confessions/:id — Delete Confession
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Confession.findOneAndDelete({
      $or: [{ id }, { confession_number: id }]
    });

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Confession not found.' });
    }

    // Also remove associated comments
    await Comment.deleteMany({ post_id: deleted.id });

    res.json({ success: true, message: 'Confession successfully deleted.' });
  } catch (err) {
    console.error('Error deleting confession:', err);
    res.status(500).json({ success: false, error: 'Failed to delete confession.' });
  }
});

export default router;
