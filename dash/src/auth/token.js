/**
 * The backend embeds role + permission slugs in the JWT payload and does NOT
 * return them from /users/me. So the only way the frontend can read them is
 * to decode the token we were handed.
 *
 * This is for UX only — hiding a button the user can't use. The backend guards
 * (JwtAuthGuard / RolesGuard / PermissionsGuard) remain the real authorization.
 * Never treat a decoded claim as a security decision.
 */

export function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(
      decodeURIComponent(
        json
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(""),
      ),
    );
  } catch {
    return null;
  }
}

export function isExpired(payload) {
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
}
