const Membership = require('../models/Membership');

const getMembers = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
      query.status = status;
    }

    let userQuery = {};
    if (search) {
      userQuery = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
      const users = await require('../models/User').find(userQuery).select('_id');
      const userIds = users.map(u => u._id);
      query.userId = { $in: userIds };
    }

    const memberships = await Membership.find(query)
      .populate('userId', 'fullName email')
      .populate('membershipTypeId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Membership.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        members: memberships,
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

module.exports = { getMembers };
