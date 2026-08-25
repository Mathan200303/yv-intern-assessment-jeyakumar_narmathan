const OfficerRole = require('../models/OfficerRole');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

const createRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', details: ['Role name is required'] } });
    }

    const newRole = new OfficerRole({
      name,
      description,
      permissions: permissions || [],
      createdBy: req.user.id
    });

    await newRole.save();

    res.status(201).json({ success: true, data: newRole, message: 'Role created successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: { code: 'CONFLICT_ERROR', details: ['Role name already exists'] } });
    }
    next(error);
  }
};

const updatePermissions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', details: ['Permissions must be an array'] } });
    }

    const role = await OfficerRole.findByIdAndUpdate(id, { permissions }, { new: true });
    
    if (!role) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', details: ['Role not found'] } });
    }

    await AuditLog.create({
      actorUserId: req.user.id,
      action: 'ROLE_PERMISSIONS_CHANGED',
      entityType: 'OfficerRole',
      entityId: role._id,
      details: { permissions },
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, data: role, message: 'Permissions updated successfully' });
  } catch (error) {
    next(error);
  }
};

const assignRole = async (req, res, next) => {
  try {
    const { id } = req.params; // user id
    const { roleId } = req.body;

    const role = await OfficerRole.findById(roleId);
    if (!role) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', details: ['Role not found'] } });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', details: ['User not found'] } });
    }

    user.userType = 'OFFICER';
    user.officerRoleId = role._id;
    await user.save();

    await AuditLog.create({
      actorUserId: req.user.id,
      action: 'ROLE_ASSIGNED',
      entityType: 'User',
      entityId: user._id,
      details: { roleId: role._id, roleName: role.name },
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, data: { userId: user._id, roleId: role._id }, message: 'Role assigned successfully' });
  } catch (error) {
    next(error);
  }
};

const getPermissionsList = async (req, res, next) => {
  try {
    const keys = [
      'member.view',
      'application.view',
      'application.approve',
      'application.reject',
      'role.manage',
      'audit.view'
    ];
    res.status(200).json({ success: true, data: keys, message: 'Permissions retrieved' });
  } catch (error) {
    next(error);
  }
};

const getRoles = async (req, res, next) => {
  try {
    const roles = await OfficerRole.find().select('name description permissions');
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRole,
  updatePermissions,
  assignRole,
  getPermissionsList,
  getRoles
};
