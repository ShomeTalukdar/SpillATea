import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
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
  reason: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'dismissed', 'deleted'],
    default: 'pending',
    index: true
  },
  resolution_notes: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

export const Report = mongoose.model('Report', reportSchema);
