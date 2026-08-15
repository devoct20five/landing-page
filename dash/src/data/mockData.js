// ============================================================
// OCT20FIVE — Mock Data Layer
// Structured as it would arrive from an API so components can
// be swapped over to real data without changing their shape.
// ============================================================

export const currentClient = {
  id: "client-001",
  name: "Acme Corporation",
  shortName: "Acme",
};

export const clients = [
  { id: "client-001", name: "Acme Corporation", shortName: "Acme" },
  { id: "client-002", name: "XYZ Digital", shortName: "XYZ" },
  { id: "client-003", name: "ABC Studios", shortName: "ABC" },
];

export const teamMembers = [
  { id: "team-001", name: "Rahul Mehta", role: "Editor", initials: "RM" },
  { id: "team-002", name: "Priya Nair", role: "Designer", initials: "PN" },
  { id: "team-003", name: "Arjun Rao", role: "3D Artist", initials: "AR" },
  {
    id: "team-004",
    name: "Dhruv Kapoor",
    role: "Web Developer",
    initials: "DK",
  },
  {
    id: "team-005",
    name: "Sana Iyer",
    role: "Project Manager",
    initials: "SI",
  },
];

// The staff member currently viewing the staff experience.
export const currentStaff = teamMembers[0];

export const services = [
  { id: "editing", name: "Editing" },
  { id: "design", name: "Design" },
  { id: "3d", name: "3D" },
  { id: "web", name: "Web Development" },
];

export const projects = [
  {
    id: "project-001",
    name: "Summer Campaign 2026",
    description: "A complete campaign across video, design and 3D.",
    clientId: "client-001",
    clientName: "Acme Corporation",
    services: ["Editing", "Design", "3D"],
    progress: 78,
    status: "client-review",
    completedDeliverables: 12,
    totalDeliverables: 16,
    teamSize: 3,
    attentionReason: "Client review pending",
    currentWork: {
      title: "Hero Campaign Film",
      service: "Editing",
      description:
        "Our editing team has completed the first assembly and is currently working on pacing and transitions.",
    },
    updatedAt: "2 hours ago",
    deadline: "31 Aug 2026",
  },
  {
    id: "project-002",
    name: "Brand Film",
    description: "A cinematic brand story for Acme's flagship product line.",
    clientId: "client-001",
    clientName: "Acme Corporation",
    services: ["Editing", "Design"],
    progress: 45,
    status: "in-progress",
    completedDeliverables: 4,
    totalDeliverables: 9,
    teamSize: 2,
    attentionReason: null,
    currentWork: {
      title: "Interview Cut — Founder Segment",
      service: "Editing",
      description:
        "Rough cut of the founder interview is assembled; the team is now selecting b-roll to interweave.",
    },
    updatedAt: "Yesterday",
    deadline: "22 Sep 2026",
  },
  {
    id: "project-003",
    name: "Website Redesign",
    description: "Full redesign and rebuild of the Acme marketing site.",
    clientId: "client-001",
    clientName: "Acme Corporation",
    services: ["Design", "Web Development"],
    progress: 92,
    status: "client-review",
    completedDeliverables: 11,
    totalDeliverables: 12,
    teamSize: 4,
    attentionReason: "Approval pending",
    currentWork: {
      title: "Homepage — Final QA",
      service: "Web Development",
      description:
        "Homepage is in final cross-browser QA ahead of deployment. One approval remaining.",
    },
    updatedAt: "5 hours ago",
    deadline: "20 Aug 2026",
  },
  {
    id: "project-004",
    name: "Product Launch",
    description: "Launch assets for the Q4 product line across every channel.",
    clientId: "client-001",
    clientName: "Acme Corporation",
    services: ["Design", "3D"],
    progress: 20,
    status: "blocked",
    completedDeliverables: 2,
    totalDeliverables: 10,
    teamSize: 3,
    attentionReason: "Waiting for client assets",
    currentWork: {
      title: "3D Product Animation",
      service: "3D",
      description:
        "Modeling is underway. We're waiting on product photographs and brand guidelines from your team to proceed to texturing.",
    },
    updatedAt: "3 days ago",
    deadline: "10 Oct 2026",
  },
  {
    id: "project-005",
    name: "Social Content Retainer",
    description: "Ongoing monthly social content across Instagram and TikTok.",
    clientId: "client-001",
    clientName: "Acme Corporation",
    services: ["Editing", "Design"],
    progress: 60,
    status: "in-progress",
    completedDeliverables: 9,
    totalDeliverables: 15,
    teamSize: 2,
    attentionReason: null,
    currentWork: {
      title: "Instagram Reel #04",
      service: "Editing",
      description:
        "August's reel batch is in edit. Two of four reels are through internal review.",
    },
    updatedAt: "Yesterday",
    deadline: "31 Aug 2026",
  },
  {
    id: "project-006",
    name: "3D Product Advertisement",
    description: "A 15-second hero 3D advertisement for retail and paid media.",
    clientId: "client-001",
    clientName: "Acme Corporation",
    services: ["3D"],
    progress: 100,
    status: "completed",
    completedDeliverables: 5,
    totalDeliverables: 5,
    teamSize: 2,
    attentionReason: null,
    currentWork: {
      title: "Final Delivery",
      service: "3D",
      description: "All formats delivered and approved. Project closed out.",
    },
    updatedAt: "2 weeks ago",
    deadline: "28 Jul 2026",
  },
  {
    id: "project-007",
    name: "Website Redesign",
    description: "A full marketing site rebuild for XYZ Digital.",
    clientId: "client-002",
    clientName: "XYZ Digital",
    services: ["Design", "Web Development"],
    progress: 64,
    status: "in-progress",
    completedDeliverables: 7,
    totalDeliverables: 11,
    teamSize: 4,
    attentionReason: "Deadline in 2 days",
    currentWork: {
      title: "Product Listing Templates",
      service: "Web Development",
      description:
        "Building out the dynamic product listing template ahead of QA.",
    },
    updatedAt: "1 hour ago",
    deadline: "28 Aug 2026",
  },
  {
    id: "project-008",
    name: "Brand Film",
    description: "A brand story film for ABC Studios' 2026 relaunch.",
    clientId: "client-003",
    clientName: "ABC Studios",
    services: ["Editing"],
    progress: 42,
    status: "blocked",
    completedDeliverables: 3,
    totalDeliverables: 8,
    teamSize: 2,
    attentionReason: "Blocked — waiting for footage",
    currentWork: {
      title: "Assembly Cut",
      service: "Editing",
      description:
        "Assembly is paused pending final footage delivery from the client's shoot.",
    },
    updatedAt: "Yesterday",
    deadline: "25 Aug 2026",
  },
  {
    id: "project-009",
    name: "Product Animation",
    description: "3D animation set for ABC Studios' product catalog.",
    clientId: "client-003",
    clientName: "ABC Studios",
    services: ["3D"],
    progress: 85,
    status: "client-review",
    completedDeliverables: 5,
    totalDeliverables: 6,
    teamSize: 2,
    attentionReason: "Changes requested",
    currentWork: {
      title: "Product Animation — V04",
      service: "3D",
      description:
        "Revised animation addressing client feedback on lighting and camera timing.",
    },
    updatedAt: "2 days ago",
    deadline: "5 Sep 2026",
  },
];

// Deliverables currently awaiting client action — powers the
// "Action Required" section on the dashboard.
export const actionItems = [
  {
    id: "action-001",
    type: "review",
    projectId: "project-001",
    projectName: "Summer Campaign 2026",
    title: "Hero Film — Final Approval",
    description: "Version 03 is ready for your review.",
    cta: "Review",
  },
  {
    id: "action-002",
    type: "input",
    projectId: "project-004",
    projectName: "Product Launch",
    title: "3D Product Animation",
    description: "We need a few things from you to keep moving.",
    needs: ["Product photographs", "Brand guidelines", "Final dimensions"],
    cta: "Provide files",
  },
];

export const activity = [
  {
    id: "activity-001",
    type: "status",
    projectId: "project-001",
    text: "Hero Film moved to Client Review",
    timestamp: "2 hours ago",
    group: "Today",
  },
  {
    id: "activity-002",
    type: "approval",
    projectId: "project-003",
    text: "Campaign Poster #04 approved",
    timestamp: "5 hours ago",
    group: "Today",
  },
  {
    id: "activity-003",
    type: "upload",
    projectId: "project-005",
    text: "12 new assets uploaded",
    timestamp: "Yesterday",
    group: "Yesterday",
  },
  {
    id: "activity-004",
    type: "upload",
    projectId: "project-001",
    text: "Hero Film — Version 02 uploaded",
    timestamp: "Yesterday",
    group: "Yesterday",
  },
  {
    id: "activity-005",
    type: "approval",
    projectId: "project-006",
    text: "3D Advertisement — Final delivery approved",
    timestamp: "2 weeks ago",
    group: "Earlier",
  },
];

export const upcoming = [
  { id: "up-001", title: "Final campaign export", projectId: "project-001" },
  { id: "up-002", title: "Website QA", projectId: "project-003" },
  { id: "up-003", title: "3D animation review", projectId: "project-004" },
];

export const summaryStats = {
  activeProjects: projects.filter(
    (p) => p.clientId === currentClient.id && p.status !== "completed",
  ).length,
  inProgress: 12,
  needsInput: actionItems.length,
  completed: 48,
};

// ============================================================
// STAFF / AGENCY DATA
// ============================================================

export const tasks = [
  {
    id: "task-001",
    title: "Hero Film — Color Grade",
    projectId: "project-001",
    clientId: "client-001",
    service: "Editing",
    assigneeId: "team-001",
    status: "in-progress",
    priority: "high",
    dueDate: "15 Aug 2026",
    dueLabel: "Due Today",
  },
  {
    id: "task-002",
    title: "Campaign Poster #04",
    projectId: "project-001",
    clientId: "client-001",
    service: "Design",
    assigneeId: "team-002",
    status: "client-review",
    priority: "medium",
    dueDate: "16 Aug 2026",
    dueLabel: "Due Tomorrow",
  },
  {
    id: "task-003",
    title: "3D Product Animation — Texturing",
    projectId: "project-004",
    clientId: "client-001",
    service: "3D",
    assigneeId: "team-003",
    status: "blocked",
    priority: "high",
    dueDate: "18 Aug 2026",
    dueLabel: "Due Friday",
  },
  {
    id: "task-004",
    title: "Homepage — Cross-Browser QA",
    projectId: "project-003",
    clientId: "client-001",
    service: "Web Development",
    assigneeId: "team-004",
    status: "in-progress",
    priority: "high",
    dueDate: "15 Aug 2026",
    dueLabel: "Due Today",
  },
  {
    id: "task-005",
    title: "Instagram Reel #04 — Rough Cut",
    projectId: "project-005",
    clientId: "client-001",
    service: "Editing",
    assigneeId: "team-001",
    status: "in-progress",
    priority: "medium",
    dueDate: "17 Aug 2026",
    dueLabel: "Due Monday",
  },
  {
    id: "task-006",
    title: "Product Listing Templates",
    projectId: "project-007",
    clientId: "client-002",
    service: "Web Development",
    assigneeId: "team-004",
    status: "in-progress",
    priority: "high",
    dueDate: "16 Aug 2026",
    dueLabel: "Due Tomorrow",
  },
  {
    id: "task-007",
    title: "Brand Film — Assembly Cut",
    projectId: "project-008",
    clientId: "client-003",
    service: "Editing",
    assigneeId: "team-001",
    status: "blocked",
    priority: "medium",
    dueDate: "20 Aug 2026",
    dueLabel: "Overdue",
  },
  {
    id: "task-008",
    title: "Product Animation — Lighting Revisions",
    projectId: "project-009",
    clientId: "client-003",
    service: "3D",
    assigneeId: "team-003",
    status: "client-review",
    priority: "medium",
    dueDate: "14 Aug 2026",
    dueLabel: "Overdue",
  },
  {
    id: "task-009",
    title: "Founder Interview — Selects",
    projectId: "project-002",
    clientId: "client-001",
    service: "Editing",
    assigneeId: "team-001",
    status: "planned",
    priority: "low",
    dueDate: "22 Aug 2026",
    dueLabel: "Next Week",
  },
  {
    id: "task-010",
    title: "Social Retainer — August Report",
    projectId: "project-005",
    clientId: "client-001",
    service: "Design",
    assigneeId: "team-005",
    status: "not-started",
    priority: "low",
    dueDate: "29 Aug 2026",
    dueLabel: "Next Week",
  },
];

export const approvals = [
  {
    id: "approval-001",
    title: "Hero Film",
    version: "03",
    projectId: "project-001",
    clientId: "client-001",
    status: "pending",
    waitingSince: "6 hours",
  },
  {
    id: "approval-002",
    title: "Homepage Design",
    version: "02",
    projectId: "project-007",
    clientId: "client-002",
    status: "pending",
    waitingSince: "1 day",
  },
  {
    id: "approval-003",
    title: "Product Animation",
    version: "04",
    projectId: "project-009",
    clientId: "client-003",
    status: "changes-requested",
    waitingSince: "2 days",
  },
  {
    id: "approval-004",
    title: "Campaign Poster #04",
    version: "01",
    projectId: "project-001",
    clientId: "client-001",
    status: "approved",
    waitingSince: "5 hours",
  },
  {
    id: "approval-005",
    title: "Instagram Reel #03",
    version: "02",
    projectId: "project-005",
    clientId: "client-001",
    status: "pending",
    waitingSince: "3 hours",
  },
];

export const staffActivity = [
  {
    id: "sactivity-001",
    text: "Rahul uploaded Hero Film V03",
    timestamp: "10 minutes ago",
  },
  {
    id: "sactivity-002",
    text: "Priya moved Campaign Design to Client Review",
    timestamp: "35 minutes ago",
  },
  {
    id: "sactivity-003",
    text: "Acme approved Poster #04",
    timestamp: "1 hour ago",
  },
  {
    id: "sactivity-004",
    text: "Dhruv created Website QA task",
    timestamp: "2 hours ago",
  },
  {
    id: "sactivity-005",
    text: "Arjun updated Product Animation to Client Review",
    timestamp: "2 days ago",
  },
];

export const staffStats = {
  activeProjects: projects.filter((p) => p.status !== "completed").length,
  tasksInProgress: tasks.filter((t) => t.status === "in-progress").length,
  dueToday: tasks.filter((t) => t.dueLabel === "Due Today").length,
  blocked:
    projects.filter((p) => p.status === "blocked").length +
    tasks.filter((t) => t.status === "blocked").length,
  pendingApprovals: approvals.filter((a) => a.status === "pending").length,
};

export function getClientById(clientId) {
  return clients.find((c) => c.id === clientId);
}

export function getProjectById(projectId) {
  return projects.find((p) => p.id === projectId);
}

export function getTeamMemberById(teamMemberId) {
  return teamMembers.find((t) => t.id === teamMemberId);
}
