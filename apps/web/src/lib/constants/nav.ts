import type { Role } from '@edumetric/shared';
import {
  LayoutDashboard,
  User,
  Trophy,
  Award,
  LineChart,
  Bell,
  Settings,
  Users,
  CalendarCheck,
  ClipboardList,
  MessageSquare,
  Inbox,
  Shield,
  GraduationCap,
  HeartHandshake,
  AlertTriangle,
  FileText,
  Cog,
  ListChecks,
  Plug,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  /** i18n key — resolves via useT(). */
  labelKey: string;
  /** Fallback English label. */
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  STUDENT: [
    { labelKey: 'nav.dashboard',     label: 'Dashboard',      href: '/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.profile',       label: 'My Profile',     href: '/profile', icon: User },
    { labelKey: 'nav.achievements',  label: 'Achievements',   href: '/achievements', icon: Award },
    { labelKey: 'nav.leaderboard',   label: 'Leaderboard',    href: '/leaderboard', icon: Trophy },
    { labelKey: 'nav.analytics',     label: 'Analytics',      href: '/analytics', icon: LineChart },
    { labelKey: 'nav.notifications', label: 'Notifications',  href: '/notifications', icon: Bell },
    { labelKey: 'nav.settings',      label: 'Settings',       href: '/settings', icon: Settings },
  ],
  MENTOR: [
    { labelKey: 'nav.dashboard',    label: 'Dashboard',   href: '/mentor/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.students',     label: 'Students',    href: '/mentor/students', icon: Users },
    { labelKey: 'nav.attendance',   label: 'Attendance',  href: '/mentor/attendance', icon: CalendarCheck },
    { labelKey: 'nav.assignments',  label: 'Assignments', href: '/mentor/assignments', icon: ClipboardList },
    { labelKey: 'nav.feedback',     label: 'Feedback',    href: '/mentor/feedback', icon: MessageSquare },
    { labelKey: 'nav.analytics',    label: 'Analytics',   href: '/mentor/analytics', icon: LineChart },
    { labelKey: 'nav.leaderboard',  label: 'Leaderboard', href: '/mentor/leaderboard', icon: Trophy },
  ],
  TUTOR: [
    { labelKey: 'nav.dashboard',   label: 'Dashboard',         href: '/tutor/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.students',    label: 'Students',          href: '/tutor/students', icon: Users },
    { labelKey: 'nav.social-eval', label: 'Social Evaluation', href: '/tutor/social-evaluation', icon: HeartHandshake },
    { labelKey: 'nav.recovery',    label: 'Recovery Tasks',    href: '/tutor/recovery-tasks', icon: ListChecks },
    { labelKey: 'nav.discipline',  label: 'Discipline',        href: '/tutor/discipline', icon: Shield },
    { labelKey: 'nav.reports',     label: 'Reports',           href: '/tutor/reports', icon: FileText },
  ],
  ADMIN: [
    { labelKey: 'nav.overview',     label: 'Overview',     href: '/admin/overview', icon: LayoutDashboard },
    { labelKey: 'nav.students',     label: 'Students',     href: '/admin/students', icon: Users },
    { labelKey: 'nav.mentors',      label: 'Mentors',      href: '/admin/mentors', icon: GraduationCap },
    { labelKey: 'nav.tutors',       label: 'Tutors',       href: '/admin/tutors', icon: HeartHandshake },
    { labelKey: 'nav.achievements', label: 'Achievements', href: '/admin/achievements', icon: Award },
    { labelKey: 'nav.approvals',    label: 'Approvals',    href: '/admin/approvals', icon: Inbox },
    { labelKey: 'nav.leaderboard',  label: 'Leaderboard',  href: '/admin/leaderboard', icon: Trophy },
    { labelKey: 'nav.analytics',    label: 'Analytics',    href: '/admin/analytics', icon: LineChart },
    { labelKey: 'nav.penalties',    label: 'Penalties',    href: '/admin/penalties', icon: AlertTriangle },
    { labelKey: 'nav.reports',      label: 'Reports',      href: '/admin/reports', icon: FileText },
    { labelKey: 'nav.settings',     label: 'Settings',     href: '/admin/settings', icon: Settings },
  ],
  SUPER_ADMIN: [
    { labelKey: 'nav.overview',          label: 'Overview',          href: '/admin/overview', icon: LayoutDashboard },
    { labelKey: 'nav.students',          label: 'Students',          href: '/admin/students', icon: Users },
    { labelKey: 'nav.approvals',         label: 'Approvals',         href: '/admin/approvals', icon: Inbox },
    { labelKey: 'nav.leaderboard',       label: 'Leaderboard',       href: '/admin/leaderboard', icon: Trophy },
    { labelKey: 'nav.analytics',         label: 'Analytics',         href: '/admin/analytics', icon: LineChart },
    { labelKey: 'nav.kpi-config',        label: 'KPI Config',        href: '/super-admin/kpi-config', icon: Cog },
    { labelKey: 'nav.api-integrations',  label: 'API Integrations',  href: '/super-admin/api-integrations', icon: Plug },
    { labelKey: 'nav.role-mgmt',         label: 'Role Management',   href: '/super-admin/role-management', icon: Shield },
    { labelKey: 'nav.system-logs',       label: 'System Logs',       href: '/super-admin/system-logs', icon: FileText },
    { labelKey: 'nav.platform-settings', label: 'Platform Settings', href: '/super-admin/platform-settings', icon: Settings },
  ],
  GUEST: [
    { labelKey: 'nav.leaderboard', label: 'Leaderboard', href: '/guest/leaderboard', icon: Trophy },
    { labelKey: 'nav.students',    label: 'Students',    href: '/guest/students', icon: Users },
    { labelKey: 'nav.analytics',   label: 'Statistics',  href: '/guest/statistics', icon: LineChart },
  ],
};
