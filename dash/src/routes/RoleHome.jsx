import { Navigate } from "react-router-dom";
import { useAuth, homeRouteFor } from "@/auth";

/**
 * Sends a user to their own workspace root. Used for "/" and for the catch-all
 * route, which previously hard-redirected everyone to the client dashboard —
 * so a staff member hitting a bad URL landed in the wrong workspace.
 */
export default function RoleHome() {
  const { status, userType } = useAuth();

  if (status === "loading") return null;
  if (status === "anon") return <Navigate to="/login" replace />;

  return <Navigate to={homeRouteFor(userType)} replace />;
}
