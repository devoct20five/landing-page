import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, usersApi, getToken, clearToken, AUTH_EXPIRED_EVENT } from "@/api";
import { decodeToken, isExpired } from "./token";

const AuthContext = createContext(null);

/**
 * Session state for the whole app.
 *
 *   login -> token stored -> /users/me -> user.userType -> workspace
 *
 * `status` is what route guards and the app shell read:
 *   "loading"  booting / verifying an existing token
 *   "authed"   user is loaded
 *   "anon"     no valid session
 */
export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState(null);

  const endSession = useCallback(() => {
    clearToken();
    setUser(null);
    setClaims(null);
    setStatus("anon");
  }, []);

  const loadSession = useCallback(async () => {
    const token = getToken();
    const payload = decodeToken(token);

    if (!token || !payload || isExpired(payload)) {
      endSession();
      return;
    }

    try {
      const me = await usersApi.getMe();
      setUser(me);
      setClaims(payload);
      setStatus("authed");
    } catch {
      // http.js already fired AUTH_EXPIRED_EVENT on a 401.
      endSession();
    }
  }, [endSession]);

  // Boot: verify any token we already have.
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // The transport layer tells us when the API rejected our token.
  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, endSession);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, endSession);
  }, [endSession]);

  const login = useCallback(
    async (credentials) => {
      const { accessToken, user: loggedIn } = await authApi.login(credentials);
      setClaims(decodeToken(accessToken));
      setUser(loggedIn);
      setStatus("authed");
      return loggedIn;
    },
    [],
  );

  const logout = useCallback(() => {
    authApi.logout();
    endSession();
  }, [endSession]);

  const value = useMemo(() => {
    const permissions = claims?.permissions ?? [];
    return {
      status,
      user,
      userType: user?.userType ?? claims?.userType ?? null,
      roleSlug: claims?.roleSlug ?? null,
      permissions,
      /** UX-level check only — the API still enforces this server-side. */
      can: (slug) => permissions.includes(slug),
      login,
      logout,
      reload: loadSession,
    };
  }, [status, user, claims, login, logout, loadSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
