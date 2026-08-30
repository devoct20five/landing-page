import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ClientLayout from "@/layouts/ClientLayout";
import Dashboard from "@/pages/client/Dashboard";
import Projects from "@/pages/client/Projects";

import StaffLayout from "@/layouts/StaffLayout";
import StaffProjects from "@/pages/staff/StaffProjects";
import TaskList from "./pages/staff/TaskList";
import ApprovalList from "./pages/staff/ApprovalList";

import { tasks, approvals } from "@/data/mockData";
import ClientList from "./pages/staff/ClientList";

import AdminLayout from "./layouts/AdminLayout";
import AdminClients from "./pages/admin/AdminClient";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminProjects from "./pages/admin/AdminProjects";
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

        <Route path="/u/:id" element={<Profile />} />

        {/* =====================================================
            CLIENT
        ===================================================== */}

        <Route element={<ClientLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

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

          <Route path="/client/services" element={<ClientServices />} />
        </Route>

        {/* =====================================================
            STAFF
        ===================================================== */}

        <Route element={<StaffLayout />}>
          <Route path="/staff" element={<StaffDashboard />} />

          <Route path="/staff/files" element={<StaffFiles />} />

          <Route path="/staff/activity" element={<StaffActivity />} />

          <Route path="/staff/projects" element={<StaffProjects />} />

          <Route path="/staff/attendance" element={<StaffAttendance />} />

          <Route path="/staff/tasks" element={<TaskList tasks={tasks} />} />

          <Route path="/staff/clients" element={<ClientList />} />

          <Route path="/staff/approvals" element={<ApprovalList approvals={approvals} />} />
        </Route>

        {/* =====================================================
            ADMIN
        ===================================================== */}

        <Route element={<AdminLayout />}>
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

          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/client/:clientId" element={<AdminClientDetail />} />
          <Route path="/admin/approvals" element={<AdminApprovals />} />
          <Route path="/admin/events" element={<AdminEvents />} />
        </Route>

        {/* =====================================================
            FALLBACK
        ===================================================== */}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
