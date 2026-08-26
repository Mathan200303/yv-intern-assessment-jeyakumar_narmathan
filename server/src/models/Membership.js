import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MemberApplication',
    required: true,
  },
  membershipNumber: {
    type: String,
    required: true,
    unique: true,
  },
  membershipTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MembershipType',
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'EXPIRED'],
    default: 'ACTIVE',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  }
});

membershipSchema.index({ membershipNumber: 1 });

export default mongoose.model('Membership', membershipSchema);
