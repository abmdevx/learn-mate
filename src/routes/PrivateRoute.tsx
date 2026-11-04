import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { PropsWithChildren } from "react";

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { userData, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-black">
        Checking authentication...
      </div>
    );
  }

  if (!userData) {
    return <Navigate to="auth/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;