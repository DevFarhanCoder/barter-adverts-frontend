import { Navigate } from 'react-router-dom';

import React from 'react';

const PrivateRoute: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
