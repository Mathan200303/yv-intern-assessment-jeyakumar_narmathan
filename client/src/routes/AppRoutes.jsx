import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import RoleManagement from '../pages/RoleManagement';


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
         <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}></Route>
           <Route path="/register" element={<Register />} />
            <Route index element={<Dashboard />} />
         <Route path="roles" element={<RoleManagement />} />
    </Routes>
);
};

export default AppRoutes;