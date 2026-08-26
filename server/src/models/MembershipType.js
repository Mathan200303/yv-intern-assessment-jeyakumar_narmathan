import mongoose from 'mongoose';

const membershipTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  applicableTo: {
    type: String,
    enum: ['INDIVIDUAL', 'COMPANY'],
    required: true,
  },
  annualFee: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
});

export default mongoose.model('MembershipType', membershipTypeSchema);
