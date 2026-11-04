import { useAppSelector } from "@/Redux/Hooks";
import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";

export default function PublicRoute({ children }: PropsWithChildren) {
  const { userData } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!userData;

  // If user is logged in, redirect to dashboard
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}