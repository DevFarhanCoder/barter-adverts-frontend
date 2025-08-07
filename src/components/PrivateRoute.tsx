import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem('user');

  if (!user) {
    // Not logged in — redirect to login
    return <Navigate to="/signin" replace />;
  }

  // User is authenticated — allow access
  return children;
};

export default PrivateRoute;
