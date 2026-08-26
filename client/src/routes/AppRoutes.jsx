import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import RoleManagement from '../pages/RoleManagement';
import MembersList from '../pages/MembersList';
import AuditLogs from '../pages/AuditLogs';


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = ()=>{
return(
    <Routes>
        <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
         <Route path="roles" element={<RoleManagement />} />
            <Route path="members" element={<MembersList />} />
          <Route path="audit" element={<AuditLogs />} />
            </Route>
    </Routes>
);
};

export default AppRoutes;