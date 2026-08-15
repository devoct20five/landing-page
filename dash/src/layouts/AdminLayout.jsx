import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="theme-light min-h-screen bg-surface-bg">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-surface-border px-5 py-8 lg:flex">
          <AdminSidebar />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />

          <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}