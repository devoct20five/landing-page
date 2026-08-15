import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="mx-auto flex max-w-[1440px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-surface-border px-5 py-8 lg:flex">
          <Sidebar />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
