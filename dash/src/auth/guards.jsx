import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { UserType } from "@/api";

/** Where each user type lands after login. */
export const HOME_ROUTE = {
  [UserType.CLIENT]: "/dashboard",
  [UserType.STAFF]: "/staff",
  [UserType.ADMIN]: "/admin",
};

export function homeRouteFor(userType) {
  return HOME_ROUTE[userType] ?? "/login";
}

/** Blocks a route until the session is resolved. */
export function RequireAuth({ children, fallback = null }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return fallback;
  if (status === "anon") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children ?? <Outlet />;
}

/**
 * Keeps a client out of /admin and so on. This is navigation hygiene, not
 * security — the backend guards are what actually protect the data.
 *
 *   <Route element={<RequireRole allow={[UserType.ADMIN]} />}> ... </Route>
 */
export function RequireRole({ allow, children, fallback = null }) {
  const { status, userType } = useAuth();
  const location = useLocation();

  if (status === "loading") return fallback;
  if (status === "anon") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!allow.includes(userType)) return <Navigate to="/no-access" replace />;

  return children ?? <Outlet />;
}
