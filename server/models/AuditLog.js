import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  moderator_name: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  target_post: {
    type: String,
    required: true
  },
  target_post_id: {
    type: String,
    required: true
  },
  hidden_identity: {
    type: String,
    required: true
  },
  registered_email: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
