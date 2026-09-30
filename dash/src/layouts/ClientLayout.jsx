import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function ClientLayout() {
  return (
    <div className="flex min-h-screen bg-surface-bg">
      {/* Desktop sidebar - flush to screen edge, no max-width wrapper */}
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 overflow-y-auto border-r border-surface-border px-5 py-8 lg:flex">
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
