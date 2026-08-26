import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import { Route, Routes } from 'react-router-dom';


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
    </Routes>
);
};

export default AppRoutes;