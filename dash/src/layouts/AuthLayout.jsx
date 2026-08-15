import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="theme-light min-h-screen bg-surface-bg">
      <Outlet />
    </div>
  );
}