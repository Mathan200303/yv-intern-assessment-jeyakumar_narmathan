import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['CHAIRMAN', 'OFFICER', 'MEMBER'],
    required: true,
  },
  officerRoleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OfficerRole',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);
