
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS oct20five
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE oct20five;

-- ============================================================================
-- 1. AUTH / RBAC (shared by Client, Staff, Admin portals)
-- ============================================================================

CREATE TABLE roles (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(60) NOT NULL,               -- Administrator, Manager, Staff, Client
  slug          VARCHAR(60) NOT NULL UNIQUE,         -- admin, manager, staff, client
  description   VARCHAR(255),
  is_system     TINYINT(1) NOT NULL DEFAULT 0,       -- protected/system role, cannot be deleted
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE permissions (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  module        VARCHAR(60) NOT NULL,                -- projects, tasks, payments, team...
  action        VARCHAR(60) NOT NULL,                -- view, create, edit, delete, approve
  slug          VARCHAR(120) NOT NULL UNIQUE,         -- projects.view, payments.edit
  description   VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
  role_id        INT UNSIGNED NOT NULL,
  permission_id  INT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE users (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  uuid              CHAR(36) NOT NULL UNIQUE,
  user_type         ENUM('client','staff','admin') NOT NULL,
  role_id           INT UNSIGNED NOT NULL,
  first_name        VARCHAR(80) NOT NULL,
  last_name         VARCHAR(80),
  initials          VARCHAR(4),
  email             VARCHAR(190) NOT NULL UNIQUE,
  phone             VARCHAR(30),
  password_hash     VARCHAR(255) NOT NULL,
  avatar_url        VARCHAR(500),
  status            ENUM('active','invited','suspended') NOT NULL DEFAULT 'invited',
  last_login_at     DATETIME NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;


-- ============================================================================
-- 2. CLIENTS (client portal accounts / companies)
-- ============================================================================

CREATE TABLE clients (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,               -- "Acme Corporation"
  short_name    VARCHAR(50),                         -- "Acme"
  email         VARCHAR(190),
  phone         VARCHAR(30),
  website       VARCHAR(255),
  industry      VARCHAR(100),
  address       VARCHAR(255),
  logo_url      VARCHAR(500),
  status        ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_by    BIGINT UNSIGNED NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- Contact users belonging to a client company (a company can have several logins)
CREATE TABLE client_contacts (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id     BIGINT UNSIGNED NOT NULL,
  user_id       BIGINT UNSIGNED NOT NULL,
  designation   VARCHAR(100),
  is_primary    TINYINT(1) NOT NULL DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_client_user (client_id, user_id),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ============================================================================
-- 3. STAFF / TEAM (staff portal + admin > team)
-- ============================================================================

CREATE TABLE staff_profiles (
  user_id             BIGINT UNSIGNED PRIMARY KEY,
  department          VARCHAR(100),                  -- Post Production, Design, 3D, Technology, Operations
  designation         VARCHAR(100),                  -- Editor, Designer, 3D Artist, Web Developer, PM
  employment_type     ENUM('full-time','part-time','contract','intern') NOT NULL DEFAULT 'full-time',
  join_date           DATE,
  salary              DECIMAL(12,2),
  currency            VARCHAR(10) DEFAULT 'INR',
  pay_cycle           ENUM('monthly','weekly','biweekly') NOT NULL DEFAULT 'monthly',
  payment_method      VARCHAR(50),                   -- Bank Transfer, UPI
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE attendance (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  staff_id      BIGINT UNSIGNED NOT NULL,
  work_date     DATE NOT NULL,
  status        ENUM('present','late','remote','leave','absent') NOT NULL,
  check_in      TIME NULL,
  check_out     TIME NULL,
  work_mode     ENUM('Office','Remote') NULL,
  hours_worked  DECIMAL(5,2) NULL,
  notes         VARCHAR(255),
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_staff_date (staff_id, work_date),
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payroll (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  staff_id          BIGINT UNSIGNED NOT NULL,
  period_month      TINYINT UNSIGNED NOT NULL,       -- 1-12
  period_year       SMALLINT UNSIGNED NOT NULL,
  salary_amount     DECIMAL(12,2) NOT NULL,
  currency          VARCHAR(10) DEFAULT 'INR',
  payout_status     ENUM('paid','pending','overdue') NOT NULL DEFAULT 'pending',
  payout_date       DATE NULL,
  payment_method    VARCHAR(50),
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_staff_period (staff_id, period_month, period_year),
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 4. SERVICE CATALOG (marketing / client-facing packages)
-- ============================================================================

CREATE TABLE services (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug            VARCHAR(60) NOT NULL UNIQUE,        -- editing, design, 3d, web
  name            VARCHAR(100) NOT NULL,
  hero_headline   VARCHAR(255),
  hero_tag        VARCHAR(100),
  hero_image_url  VARCHAR(500),
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  sort_order      SMALLINT UNSIGNED DEFAULT 0,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE service_plans (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_id        INT UNSIGNED NOT NULL,
  name              VARCHAR(100) NOT NULL,            -- Standard, Advance, Black
  icon              VARCHAR(60),
  price             DECIMAL(12,2),
  total_price       DECIMAL(12,2),
  discount_percent  DECIMAL(5,2) DEFAULT 0,
  is_featured       TINYINT(1) NOT NULL DEFAULT 0,
  is_active         TINYINT(1) NOT NULL DEFAULT 1,
  sort_order        SMALLINT UNSIGNED DEFAULT 0,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE service_plan_packages (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id       INT UNSIGNED NOT NULL,
  label         VARCHAR(50) NOT NULL,                 -- "3 Pack", "7 Pack", "15 Pack"
  sort_order    SMALLINT UNSIGNED DEFAULT 0,
  FOREIGN KEY (plan_id) REFERENCES service_plans(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE service_plan_features (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id       INT UNSIGNED NOT NULL,
  feature_text  VARCHAR(255) NOT NULL,
  sort_order    SMALLINT UNSIGNED DEFAULT 0,
  FOREIGN KEY (plan_id) REFERENCES service_plans(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 5. PROJECTS
-- ============================================================================

CREATE TABLE projects (
  id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id               BIGINT UNSIGNED NOT NULL,
  name                    VARCHAR(150) NOT NULL,
  description             TEXT,
  status                  ENUM('not-started','in-progress','client-review','blocked','completed','cancelled') NOT NULL DEFAULT 'not-started',
  progress_percent        TINYINT UNSIGNED NOT NULL DEFAULT 0,
  team_size               SMALLINT UNSIGNED DEFAULT 0,
  attention_reason        VARCHAR(255) NULL,           -- surfaced on dashboards when project needs attention
  current_work_title      VARCHAR(255) NULL,
  current_work_service_id INT UNSIGNED NULL,
  current_work_description TEXT NULL,
  deadline                DATE NULL,
  created_by              BIGINT UNSIGNED NULL,
  created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (current_work_service_id) REFERENCES services(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE project_services (
  project_id    BIGINT UNSIGNED NOT NULL,
  service_id    INT UNSIGNED NOT NULL,
  PRIMARY KEY (project_id, service_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id)
) ENGINE=InnoDB;

CREATE TABLE project_team_members (
  project_id    BIGINT UNSIGNED NOT NULL,
  staff_id      BIGINT UNSIGNED NOT NULL,
  role_on_project VARCHAR(100),
  assigned_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, staff_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE deliverables (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id    BIGINT UNSIGNED NOT NULL,
  service_id    INT UNSIGNED NULL,
  title         VARCHAR(255) NOT NULL,
  status        ENUM('pending','in-progress','client-review','approved','delivered') NOT NULL DEFAULT 'pending',
  due_date      DATE NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id)
) ENGINE=InnoDB;

-- ============================================================================
-- 6. TASKS
-- ============================================================================

CREATE TABLE tasks (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id    BIGINT UNSIGNED NOT NULL,
  client_id     BIGINT UNSIGNED NOT NULL,
  service_id    INT UNSIGNED NULL,
  assignee_id   BIGINT UNSIGNED NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  status        ENUM('not-started','planned','in-progress','client-review','blocked','completed','cancelled') NOT NULL DEFAULT 'not-started',
  priority      ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  due_date      DATE NULL,
  created_by    BIGINT UNSIGNED NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (assignee_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE task_comments (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id       BIGINT UNSIGNED NOT NULL,
  user_id       BIGINT UNSIGNED NOT NULL,
  comment       TEXT NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================================
-- 7. APPROVALS (client sign-off on deliverable versions)
-- ============================================================================

CREATE TABLE approvals (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id        BIGINT UNSIGNED NOT NULL,
  client_id         BIGINT UNSIGNED NOT NULL,
  deliverable_id    BIGINT UNSIGNED NULL,
  title             VARCHAR(255) NOT NULL,
  version           VARCHAR(20) NOT NULL,
  file_id           BIGINT UNSIGNED NULL,
  status            ENUM('pending','approved','changes-requested','rejected') NOT NULL DEFAULT 'pending',
  feedback          TEXT NULL,
  requested_by      BIGINT UNSIGNED NULL,
  reviewed_by       BIGINT UNSIGNED NULL,
  requested_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at       DATETIME NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (deliverable_id) REFERENCES deliverables(id),
  FOREIGN KEY (requested_by) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================================
-- 8. FILES (asset / document library — client, staff, admin)
-- ============================================================================

CREATE TABLE folders (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id    BIGINT UNSIGNED NULL,
  parent_id     BIGINT UNSIGNED NULL,
  name          VARCHAR(150) NOT NULL,
  created_by    BIGINT UNSIGNED NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE files (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  folder_id     BIGINT UNSIGNED NULL,
  project_id    BIGINT UNSIGNED NULL,
  name          VARCHAR(255) NOT NULL,
  file_type     ENUM('pdf','image','video','spreadsheet','doc','other') NOT NULL DEFAULT 'other',
  mime_type     VARCHAR(120),
  size_bytes    BIGINT UNSIGNED,
  storage_url   VARCHAR(500) NOT NULL,
  version       VARCHAR(20) DEFAULT '01',
  uploaded_by   BIGINT UNSIGNED NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================================
-- 9. ACTIVITY LOG (dashboard activity feeds — client / staff / admin)
-- ============================================================================

CREATE TABLE activity_log (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_id      BIGINT UNSIGNED NULL,
  project_id    BIGINT UNSIGNED NULL,
  client_id     BIGINT UNSIGNED NULL,
  activity_type ENUM('status','approval','upload','task','comment','payment','attendance','other') NOT NULL,
  description   VARCHAR(500) NOT NULL,
  metadata_json JSON NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_id) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id)
) ENGINE=InnoDB;

-- ============================================================================
-- 10. EVENTS / CALENDAR
-- ============================================================================

CREATE TABLE events (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  event_type    ENUM('meeting','review','deadline','internal') NOT NULL DEFAULT 'meeting',
  event_date    DATE NOT NULL,
  start_time    TIME NULL,
  end_time      TIME NULL,
  location      VARCHAR(255) NULL,
  meeting_link  VARCHAR(500) NULL,
  client_id     BIGINT UNSIGNED NULL,
  project_id    BIGINT UNSIGNED NULL,
  status        ENUM('scheduled','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  created_by    BIGINT UNSIGNED NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE event_attendees (
  event_id      BIGINT UNSIGNED NOT NULL,
  user_id       BIGINT UNSIGNED NOT NULL,
  rsvp_status   ENUM('invited','accepted','declined') NOT NULL DEFAULT 'invited',
  PRIMARY KEY (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 11. PAYMENTS / INVOICES (admin billing + client payment screen)
-- ============================================================================

CREATE TABLE invoices (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_number  VARCHAR(40) NOT NULL UNIQUE,        -- INV-2026-001
  client_id       BIGINT UNSIGNED NOT NULL,
  project_id      BIGINT UNSIGNED NULL,
  amount          DECIMAL(14,2) NOT NULL,
  amount_paid     DECIMAL(14,2) NOT NULL DEFAULT 0,
  currency        VARCHAR(10) NOT NULL DEFAULT 'INR',
  status          ENUM('draft','pending','paid','overdue','cancelled') NOT NULL DEFAULT 'pending',
  description     VARCHAR(255),
  issue_date      DATE NULL,
  due_date        DATE NOT NULL,
  created_by      BIGINT UNSIGNED NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE payment_transactions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_id      BIGINT UNSIGNED NOT NULL,
  amount          DECIMAL(14,2) NOT NULL,
  method          VARCHAR(50),                        -- Bank Transfer, UPI, Card
  reference       VARCHAR(100),                        -- TXN-849201 / UPI-982341
  paid_at         DATETIME NULL,
  status          ENUM('pending','success','failed','refunded') NOT NULL DEFAULT 'pending',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 12. SUPPORT / QUERIES (client raised tickets, admin triage)
-- ============================================================================

CREATE TABLE queries (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id     BIGINT UNSIGNED NOT NULL,
  project_id    BIGINT UNSIGNED NULL,
  subject       VARCHAR(255) NOT NULL,
  message       TEXT NOT NULL,
  category      VARCHAR(60),                          -- Project, 3D, Web, Assets...
  priority      ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  status        ENUM('open','in-progress','resolved','closed') NOT NULL DEFAULT 'open',
  assigned_to   BIGINT UNSIGNED NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at   DATETIME NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
) ENGINE=InnoDB;


-- ============================================================================
-- 13. CAREERS (admin job postings + candidate pipeline)
-- ============================================================================

CREATE TABLE job_postings (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(150) NOT NULL,
  department      VARCHAR(100),
  employment_type VARCHAR(50) DEFAULT 'Full-time',
  location        VARCHAR(150),
  description     TEXT,
  status          ENUM('open','paused','closed') NOT NULL DEFAULT 'open',
  posted_at       DATE NULL,
  deadline        DATE NULL,
  created_by      BIGINT UNSIGNED NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE candidates (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id            BIGINT UNSIGNED NOT NULL,
  name              VARCHAR(150) NOT NULL,
  email             VARCHAR(190) NOT NULL,
  phone             VARCHAR(30),
  resume_url        VARCHAR(500),
  experience_years  DECIMAL(4,1),
  stage             ENUM('new','review','shortlisted','interview','hired','rejected') NOT NULL DEFAULT 'new',
  applied_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE candidate_notes (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id  BIGINT UNSIGNED NOT NULL,
  user_id       BIGINT UNSIGNED NOT NULL,
  note          TEXT NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================================
-- 14. BEHIND THE WORK (BTS content / studio showcase, admin managed)
-- ============================================================================

CREATE TABLE behind_the_work (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  content_type  ENUM('photo','video','youtube') NOT NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  project_id    BIGINT UNSIGNED NULL,
  client_id     BIGINT UNSIGNED NULL,
  thumbnail_url VARCHAR(500),
  media_url     VARCHAR(500),                         -- direct upload or youtube link
  status        ENUM('draft','published') NOT NULL DEFAULT 'draft',
  author_id     BIGINT UNSIGNED NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at  DATETIME NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================================
-- 15. NOTIFICATIONS (bell / dropdown, all portals)
-- ============================================================================

CREATE TABLE notifications (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  title         VARCHAR(255) NOT NULL,
  message       VARCHAR(500),
  link_url      VARCHAR(500) NULL,
  is_read       TINYINT(1) NOT NULL DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- INDEXES (query patterns seen across dashboards / list & filter screens)
-- ============================================================================

CREATE INDEX idx_projects_client        ON projects (client_id);
CREATE INDEX idx_projects_status        ON projects (status);
CREATE INDEX idx_tasks_project          ON tasks (project_id);
CREATE INDEX idx_tasks_assignee         ON tasks (assignee_id);
CREATE INDEX idx_tasks_status           ON tasks (status);
CREATE INDEX idx_tasks_due_date         ON tasks (due_date);
CREATE INDEX idx_approvals_project      ON approvals (project_id);
CREATE INDEX idx_approvals_status       ON approvals (status);
CREATE INDEX idx_files_project          ON files (project_id);
CREATE INDEX idx_activity_project       ON activity_log (project_id);
CREATE INDEX idx_activity_created       ON activity_log (created_at);
CREATE INDEX idx_events_date            ON events (event_date);
CREATE INDEX idx_invoices_client        ON invoices (client_id);
CREATE INDEX idx_invoices_status        ON invoices (status);
CREATE INDEX idx_queries_client         ON queries (client_id);
CREATE INDEX idx_queries_status         ON queries (status);
CREATE INDEX idx_candidates_job         ON candidates (job_id);
CREATE INDEX idx_candidates_stage       ON candidates (stage);
CREATE INDEX idx_attendance_date        ON attendance (work_date);
CREATE INDEX idx_behind_work_status     ON behind_the_work (status);
CREATE INDEX idx_notifications_user     ON notifications (user_id, is_read);


SET FOREIGN_KEY_CHECKS = 1;