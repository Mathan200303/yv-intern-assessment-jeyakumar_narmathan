import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { user, logout, hasPermission } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">
          <Link to="/">Yarl Ventures MMS</Link>
        </h1>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
          {(user?.userType === 'CHAIRMAN' || hasPermission('member.view')) && (
            <Link to="/members" className="text-gray-600 hover:text-blue-600">Members</Link>
          )}
          {user?.userType === 'CHAIRMAN' && (
            <>
              <Link to="/roles" className="text-gray-600 hover:text-blue-600">Manage Roles</Link>
              <Link to="/audit" className="text-gray-600 hover:text-blue-600">Audit Logs</Link>
            </>
          )}
          {user && (
            <div className="flex items-center space-x-4 border-l pl-4 border-gray-300">
              <span className="text-sm font-medium text-gray-700">{user.fullName} ({user.userType})</span>
              <button 
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
