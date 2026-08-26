import React, { useState, useEffect, useContext } from 'react';
import { getRoles, createRole, updateRolePermissions, assignRole, getPermissions } from '../services/roleService';
import { getUsers } from '../services/authService';

import { AuthContext } from '../context/AuthContext';

const RoleManagement = () => {
  const { user } = useContext(AuthContext);
  const [permissionsList, setPermissionsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState([]);
  
  const [editRoleId, setEditRoleId] = useState('');
  const [editSelectedPerms, setEditSelectedPerms] = useState([]);
  
  const [userIdToAssign, setUserIdToAssign] = useState('');
  const [roleIdToAssign, setRoleIdToAssign] = useState('');
  
  if (user?.userType !== 'CHAIRMAN') {
    return <div className="p-4 text-red-500">Only Chairman can access this page.</div>;
  }

  const fetchData = async () => {
    try {
      const permsRes = await getPermissions();
      setPermissionsList(permsRes.data.data);

      const usersRes = await getUsers();
      setUsersList(usersRes.data.data);

      const rolesRes = await getRoles();
      setRolesList(rolesRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePermToggle = (perm) => {
    setSelectedPerms(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const createRole = async (e) => {
    e.preventDefault();
    try {
      const res = await createRole({
        name: roleName,
        description: roleDescription,
        permissions: selectedPerms
      });
      alert(`Role created successfully!`);
      setRoleName('');
      setRoleDescription('');
      setSelectedPerms([]);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error?.details?.[0] || 'Error creating role');
    }
  };

  const assignRole = async (e) => {
    e.preventDefault();
    if (!userIdToAssign || !roleIdToAssign) return alert('Please select a user and a role.');
    try {
      await assignRole(userIdToAssign, roleIdToAssign);
      alert('Role assigned successfully!');
      setUserIdToAssign('');
      setRoleIdToAssign('');
    } catch (err) {
      alert(err.response?.data?.error?.details?.[0] || 'Error assigning role');
    }
  };

  const handleEditRoleChange = (e) => {
    const roleId = e.target.value;
    setEditRoleId(roleId);
    if (roleId) {
      const role = rolesList.find(r => r._id === roleId);
      setEditSelectedPerms(role ? role.permissions : []);
    } else {
      setEditSelectedPerms([]);
    }
  };

  const handleEditPermToggle = (perm) => {
    setEditSelectedPerms(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const updateRole = async (e) => {
    e.preventDefault();
    if (!editRoleId) return alert('Please select a role to edit.');
    try {
      await updateRolePermissions(editRoleId, editSelectedPerms);
      alert('Role permissions updated successfully!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error?.details?.[0] || 'Error updating role');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Create Officer Role</h2>
        <form onSubmit={createRole} className="space-y-4">
          <input 
            type="text" placeholder="Role Name" required value={roleName} 
            onChange={e => setRoleName(e.target.value)} className="border p-2 w-full rounded" 
          />
          <input 
            type="text" placeholder="Description" value={roleDescription} 
            onChange={e => setRoleDescription(e.target.value)} className="border p-2 w-full rounded" 
          />
          
          <div>
            <label className="font-semibold block mb-2">Permissions:</label>
            <div className="grid grid-cols-2 gap-2">
              {permissionsList.map(perm => (
                <label key={perm} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={selectedPerms.includes(perm)}
                    onChange={() => handlePermToggle(perm)}
                  />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
          </div>
          
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Role</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Role Permissions</h2>
        <form onSubmit={updateRole} className="space-y-4">
          <select 
            value={editRoleId} 
            onChange={handleEditRoleChange} 
            className="border p-2 w-full rounded bg-white"
            required
          >
            <option value="">Select Role to Edit</option>
            {rolesList.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
          
          {editRoleId && (
            <div>
              <label className="font-semibold block mb-2">Permissions:</label>
              <div className="grid grid-cols-2 gap-2">
                {permissionsList.map(perm => (
                  <label key={`edit-${perm}`} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={editSelectedPerms.includes(perm)}
                      onChange={() => handleEditPermToggle(perm)}
                    />
                    <span>{perm}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">Update Permissions</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Assign Role to User</h2>
        <form onSubmit={assignRole} className="space-x-4 flex">
          <select 
            value={userIdToAssign} 
            onChange={e => setUserIdToAssign(e.target.value)} 
            className="border p-2 rounded flex-grow bg-white"
            required
          >
            <option value="">Select User</option>
            {usersList.map(u => (
              <option key={u._id} value={u._id}>{u.fullName} ({u.email}) - {u.userType}</option>
            ))}
          </select>
          
          <select 
            value={roleIdToAssign} 
            onChange={e => setRoleIdToAssign(e.target.value)} 
            className="border p-2 rounded flex-grow bg-white"
            required
          >
            <option value="">Select Role</option>
            {rolesList.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Assign</button>
        </form>
      </div>
    </div>
  );
};

export default RoleManagement;
