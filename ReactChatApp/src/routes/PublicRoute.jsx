import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {
  const { userData } = useSelector((state) => state.auth);
  const isLoggedIn = !!userData;

  // If user is logged in, redirect to dashboard
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}