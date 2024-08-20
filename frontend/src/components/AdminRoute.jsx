import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function AdminRoute({ children }) {
  const { userInfo } = useContext(AuthContext);
  const location = useLocation();

  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default AdminRoute;
