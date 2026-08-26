import User from '../models/User.js';
import OfficerRole from '../models/OfficerRole.js';

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate('officerRoleId');
      
      if (!user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', details: ['User not found'] } });
      }

      if (user.userType === 'CHAIRMAN') {
        req.user.permissions = ['ALL']; 
        return next();
      }

      let userPermissions = [];
      if (user.userType === 'OFFICER' && user.officerRoleId) {
        userPermissions = user.officerRoleId.permissions;
      }

      req.user.permissions = userPermissions;

      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', details: [`Missing required permission: ${requiredPermission}`] }
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', details: ['Error checking permissions'] } });
    }
  };
};

