import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import authService from "../appwrite/auth"; // your Appwrite service

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-black">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="auth/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;