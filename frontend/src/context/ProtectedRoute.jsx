import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();

  // ★ ADDED — while the initial /api/auth/me check is still running, render
  // nothing rather than redirecting. Without this, a user with a perfectly
  // valid stored token would get bounced to /login for a split second on
  // every page refresh, before rehydration had a chance to confirm they're
  // actually logged in.
  if (isLoading) {
    return null; // swap for a loading spinner/skeleton if you want one
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}