import mongoose from 'mongoose';

const confessionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  confession_number: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  date_key: {
    type: String,
    required: true,
    index: true
  },
  day_key: {
    type: String,
    default: 'today'
  },
  day_name: {
    type: String,
    default: 'Today'
  },
  day_label: {
    type: String
  },
  time_formatted: {
    type: String
  },
  exact_time: {
    type: String
  },
  to_target: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  body: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    default: null
  },
  likes: {
    type: Number,
    default: 0
  },
  saved_count: {
    type: Number,
    default: 0
  },
  comment_count: {
    type: Number,
    default: 0
  },
  is_anonymous: {
    type: Boolean,
    default: true
  },
  author_name: {
    type: String,
    default: 'Anonymous Student'
  },
  author_id: {
    type: String,
    required: true
  },
  // Private identity fields: excluded from normal queries for student privacy
  real_author_name: {
    type: String,
    select: false
  },
  real_author_email: {
    type: String,
    select: false
  },
  status: {
    type: String,
    enum: ['published', 'flagged', 'removed'],
    default: 'published',
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Confession = mongoose.model('Confession', confessionSchema);
