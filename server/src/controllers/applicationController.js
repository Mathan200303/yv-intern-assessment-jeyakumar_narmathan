const MemberApplication = require('../models/MemberApplication');
const Membership = require('../models/Membership');
const MembershipType = require('../models/MembershipType');
const AuditLog = require('../models/AuditLog');

const submitApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const existingPending = await MemberApplication.findOne({ userId, status: 'PENDING' });
    if (existingPending) {
      return res.status(409).json({ success: false, error: { code: 'CONFLICT', details: ['You already have a pending application.'] } });
    }

    const { applicantType, fullName, nic, email, phone, address, membershipTypeId } = req.body;

    const application = new MemberApplication({
      userId,
      applicantType,
      fullName,
      nic,
      email,
      phone,
      address,
      membershipTypeId,
      status: 'PENDING'
    });

    await application.save();

    res.status(201).json({ success: true, data: application, message: 'Application submitted successfully.' });
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
      query.status = status;
    }

    if (req.user.userType === 'MEMBER') {
      query.userId = req.user.id;
    }

    const applications = await MemberApplication.find(query)
      .populate('membershipTypeId')
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MemberApplication.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const approveApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const application = await MemberApplication.findById(id);
    if (!application || application.status !== 'PENDING') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', details: ['Pending application not found.'] } });
    }

    application.status = 'APPROVED';
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();
    await application.save();

    const year = new Date().getFullYear();
    const count = await Membership.countDocuments();
    const sequence = String(count + 1).padStart(6, '0');
    const membershipNumber = `YV-${year}-${sequence}`;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const membership = new Membership({
      userId: application.userId,
      applicationId: application._id,
      membershipNumber,
      membershipTypeId: application.membershipTypeId,
      status: 'ACTIVE',
      startDate,
      endDate
    });

    await membership.save();

    await AuditLog.create({
      actorUserId: req.user.id,
      action: 'APPLICATION_APPROVED',
      entityType: 'MemberApplication',
      entityId: application._id,
      details: { membershipNumber },
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, data: membership, message: 'Application approved.' });
  } catch (error) {
    next(error);
  }
};

const rejectApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', details: ['Rejection reason is required.'] } });
    }

    const application = await MemberApplication.findById(id);
    if (!application || application.status !== 'PENDING') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', details: ['Pending application not found.'] } });
    }

    application.status = 'REJECTED';
    application.rejectionReason = reason;
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();
    await application.save();

    await AuditLog.create({
      actorUserId: req.user.id,
      action: 'APPLICATION_REJECTED',
      entityType: 'MemberApplication',
      entityId: application._id,
      details: { reason },
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, data: application, message: 'Application rejected.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getApplications,
  approveApplication,
  rejectApplication
};
