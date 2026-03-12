import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (<div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-32"></div>
        </div>
      </div>); 
  }


  if (isAuthenticated) {
    return <Navigate to="/blog" replace />;
  }

  return children;
};

export default PublicRoute;