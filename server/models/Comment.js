import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  post_id: {
    type: String,
    required: true,
    index: true
  },
  author_name: {
    type: String,
    default: 'Anonymous Student'
  },
  author_role: {
    type: String,
    default: 'Student'
  },
  body: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
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

export const Comment = mongoose.model('Comment', commentSchema);
