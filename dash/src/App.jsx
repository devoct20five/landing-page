import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { RequireAuth, RequireRole } from "@/auth";
import { UserType } from "@/api";
import RoleHome from "@/routes/RoleHome";

import ClientLayout from "@/layouts/ClientLayout";
import Dashboard from "@/pages/client/Dashboard";
import Projects from "@/pages/client/Projects";

import StaffLayout from "@/layouts/StaffLayout";
import StaffProjects from "@/pages/staff/StaffProjects";
import StaffProjectDetail from "@/pages/staff/StaffProjectDetail";
import TaskList from "./pages/staff/TaskList";
import ApprovalList from "./pages/staff/ApprovalList";

import { tasks } from "@/data/mockData";
import ClientList from "./pages/staff/ClientList";

import AdminLayout from "./layouts/AdminLayout";
import AdminClients from "./pages/admin/AdminClient";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProjectDetail from "./pages/admin/AdminProjectDetail";
import ClientSettings from "./pages/client/ClientSettings";
import AdminServices from "./pages/admin/AdminServices";

import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";

import ProjectDetail from "./pages/client/ProjectDetail";
import ClientServices from "./pages/client/ClientServices";
import StaffDashboard from "./pages/staff/StaffDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTasks from "./pages/admin/AdminTasks";
import Profile from "./pages/profile/Profile";
import ClientEvents from "./pages/client/ClientEvents";
import AdminCareer from "./pages/admin/AdminCareer";
import AdminQueries from "./pages/admin/AdminQueries";
import AdminBehindTheWork from "./pages/admin/AdminBehindTheWork";

import ProjectPayment from "./pages/client/ProjectPayment";

import AdminAttendance from "./pages/admin/AdminAttendance";
import StaffAttendance from "./pages/staff/StaffAttendance";

import AdminFiles from "./pages/admin/AdminFiles";
import StaffFiles from "./pages/staff/StaffFiles";

import StaffActivity from "./pages/staff/StaffActivity";
import AdminActivity from "./pages/admin/AdminActivity";
import AdminPayments from "./pages/admin/AdminPayments";

import NoAccess from "./pages/auth/NoAccess";
import AdminClientDetail from "./pages/admin/AdminClientDetail";
import AdminApprovals from "./pages/admin/AdminApprovals";
import AdminEvents from "./pages/admin/AdminEvents";
import ClientApprovals from "./pages/client/ClientApprovals";
import ClientApprovalViewPage from "./pages/client/ClientApprovalViewPage";
import ClientBilling from "./pages/client/BillingPage";
import ClientActivityLog from "./pages/client/ClientActivityLog";
import ClientSupport from "./pages/client/ClientSupportPage";
import ClientQueries from "./pages/client/ClientQueries";
import AdminInvoiceList from "./pages/admin/AdminInvoiceList";
import CreateInvoice from "./pages/admin/CreateInvoice";
import AccountSettings from "./pages/client/AccountSettings";
import BillingInvoices from "./pages/client/BillingInvoices";
import ClientNotifications from "./pages/client/ClientNotifications";
import ClientDocuments from "./pages/client/ClientDocuments";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            AUTH
        ===================================================== */}

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* =====================================================
            ACCESS
        ===================================================== */}

        <Route path="/no-access" element={<NoAccess />} />

        {/* =====================================================
            PUBLIC PROFILE
        ===================================================== */}

        <Route
          path="/u/:id"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        {/* Root: send each user to their own workspace, not the client one */}
        <Route path="/" element={<RoleHome />} />

        {/* =====================================================
            CLIENT
        ===================================================== */}

        <Route
          element={
            <RequireRole allow={[UserType.CLIENT]}>
              <ClientLayout />
            </RequireRole>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/projects" element={<Projects />} />
          <Route path="/approvals" element={<ClientApprovals />} />
          <Route path="/billing" element={<ClientBilling />} />
          <Route path="/activities" element={<ClientActivityLog />} />
          <Route path="/support" element={<ClientSupport />} />
          <Route path="/queries" element={<ClientQueries />} />

          <Route path="/approval/:id" element={<ClientApprovalViewPage />} />

          <Route path="/client/events" element={<ClientEvents />} />

          {/* CLIENT PROJECT DETAIL */}

          <Route path="/project/:projectId" element={<ProjectDetail />} />

          <Route path="/project/:projectId/pay" element={<ProjectPayment />} />

          <Route path="/client/settings" element={<ClientSettings />} />
          <Route path="/settings/account" element={<AccountSettings />} />
          <Route path="/settings/billing" element={<BillingInvoices />} />
          <Route path="/client/services" element={<ClientServices />} />

          {/* Previously linked from the sidebar with no route behind them */}
          <Route path="/notifications" element={<ClientNotifications />} />
          <Route path="/documents" element={<ClientDocuments />} />

          {/* The sidebar links /account/settings; the page lives at /settings/account */}
          <Route
            path="/account/settings"
            element={<Navigate to="/settings/account" replace />}
          />
        </Route>

        {/* =====================================================
            STAFF
        ===================================================== */}

        <Route
          element={
            <RequireRole allow={[UserType.STAFF, UserType.ADMIN]}>
              <StaffLayout />
            </RequireRole>
          }
        >
          <Route path="/staff" element={<StaffDashboard />} />

          <Route path="/staff/files" element={<StaffFiles />} />

          <Route path="/staff/activity" element={<StaffActivity />} />

          <Route path="/staff/projects" element={<StaffProjects />} />

          <Route path="/staff/project/:projectId" element={<StaffProjectDetail />} />

          <Route path="/staff/attendance" element={<StaffAttendance />} />

          <Route path="/staff/tasks" element={<TaskList tasks={tasks} />} />

          <Route path="/staff/clients" element={<ClientList />} />

          <Route path="/staff/approvals" element={<ApprovalList />} />
        </Route>

        {/* =====================================================
            ADMIN
        ===================================================== */}

        <Route
          element={
            <RequireRole allow={[UserType.ADMIN]}>
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin/files" element={<AdminFiles />} />
          <Route path="/admin/invoice/all" element={<AdminInvoiceList />} />
          <Route path="/admin/invoice/:id/workspace" element={<CreateInvoice />} />
          <Route path="/admin/activity" element={<AdminActivity />} />

          <Route path="/admin/payments" element={<AdminPayments />} />

          <Route path="/admin/clients" element={<AdminClients />} />

          <Route path="/admin/attendance" element={<AdminAttendance />} />

          <Route path="/admin/behind-the-work" element={<AdminBehindTheWork />} />

          <Route path="/admin/careers" element={<AdminCareer />} />

          <Route path="/admin/queries" element={<AdminQueries />} />

          <Route path="/admin/team" element={<AdminTeam />} />

          <Route path="/admin/tasks" element={<AdminTasks />} />

          <Route path="/admin/projects" element={<AdminProjects />} />

          <Route path="/admin/project/:projectId" element={<AdminProjectDetail />} />

          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/client/:clientId" element={<AdminClientDetail />} />
          <Route path="/admin/approvals" element={<AdminApprovals />} />
          <Route path="/admin/events" element={<AdminEvents />} />
        </Route>

        {/* =====================================================
            FALLBACK
        ===================================================== */}

        {/* Role-aware: a bad URL used to drop staff and admins on the client dashboard */}
        <Route path="*" element={<RoleHome />} />
      </Routes>
    </BrowserRouter>
  );
}
