const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

   
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          details: ['fullName, email, and password are required']
        }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONFLICT_ERROR', details: ['Email already in use'] }
      });
    }

    const salt = await bcrypt.genSalt(10);
    console.log("Key",salt);
    
    const passwordHash = await bcrypt.hash(password, salt);

    
    const newUser = new User({
      fullName,
      email,
      passwordHash,
      userType: 'MEMBER'
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      data: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        userType: newUser.userType
      },
      message: 'Registration successful'
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', details: ['email and password are required'] }
      });
    }

    const user = await User.findOne({ email }).populate('officerRoleId');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_ERROR', details: ['Invalid credentials or inactive account'] }
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_ERROR', details: ['Invalid credentials'] }
      });
    }

    let permissions = [];
    if (user.userType === 'CHAIRMAN') {
      permissions = ['ALL'];
    } else if (user.userType === 'OFFICER' && user.officerRoleId) {
      permissions = user.officerRoleId.permissions;
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType, officerRoleId: user.officerRoleId?._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        profile: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
          permissions
        }
      },
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash').populate('officerRoleId');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', details: ['User not found'] }
      });
    }

    let permissions = [];
    if (user.userType === 'CHAIRMAN') {
      permissions = ['ALL'];
    } else if (user.userType === 'OFFICER' && user.officerRoleId) {
      permissions = user.officerRoleId.permissions;
    }

    res.status(200).json({
      success: true,
      data: {
        profile: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
          isActive: user.isActive
        },
        permissions: permissions
      },
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};


const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ userType: { $ne: 'CHAIRMAN' } }).select('fullName email userType');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  getUsers
};
