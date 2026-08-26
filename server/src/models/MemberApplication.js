import mongoose from 'mongoose';

const memberApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicantType: {
    type: String,
    enum: ['INDIVIDUAL', 'COMPANY'],
    required: true,
  },
  fullName: { 
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  membershipTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MembershipType',
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  rejectionReason: {
    type: String,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  }
}, { timestamps: true });

export default mongoose.model('MemberApplication', memberApplicationSchema);
