import { Navigate } from "react-router-dom";
// No changes needed here
interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactElement;
}

export default function ProtectedRoute({
  isAuthenticated,
  children,
}: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
