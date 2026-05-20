/**
 * Lightweight i18n dictionary. English + Uzbek.
 *
 * Add keys here whenever you introduce new user-visible strings.
 * Falls back to English when a key is missing in another language.
 */

export type Lang = 'en' | 'uz';

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  uz: 'Oʻzbek',
};

type Dict = Record<string, string>;

export const DICTIONARIES: Record<Lang, Dict> = {
  en: {
    // Brand
    'brand.tagline': 'Scholarship intelligence',

    // Auth
    'auth.signin.title': 'Sign in to EduMetric',
    'auth.signin.subtitle': 'Transparent scholarship evaluation.',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signin': 'Sign in',
    'auth.signing-in': 'Signing in…',
    'auth.new-here': 'New here?',
    'auth.create-account': 'Create an account',
    'auth.demo-accounts': 'Demo accounts · click to fill',
    'auth.all-passwords': 'All demo passwords:',

    // Topbar
    'topbar.search': 'Search students, achievements…',
    'topbar.account': 'Account',
    'topbar.settings': 'Settings',
    'topbar.signout': 'Sign out',
    'topbar.notifications': 'Notifications',
    'topbar.theme': 'Toggle theme',
    'topbar.language': 'Language',

    // Nav (student)
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'My Profile',
    'nav.achievements': 'Achievements',
    'nav.leaderboard': 'Leaderboard',
    'nav.analytics': 'Analytics',
    'nav.notifications': 'Notifications',
    'nav.settings': 'Settings',
    // Nav (mentor/tutor/admin)
    'nav.students': 'Students',
    'nav.attendance': 'Attendance',
    'nav.assignments': 'Assignments',
    'nav.feedback': 'Feedback',
    'nav.social-eval': 'Social Evaluation',
    'nav.recovery': 'Recovery Tasks',
    'nav.discipline': 'Discipline',
    'nav.reports': 'Reports',
    'nav.overview': 'Overview',
    'nav.mentors': 'Mentors',
    'nav.tutors': 'Tutors',
    'nav.approvals': 'Approvals',
    'nav.penalties': 'Penalties',
    'nav.kpi-config': 'KPI Config',
    'nav.api-integrations': 'API Integrations',
    'nav.role-mgmt': 'Role Management',
    'nav.system-logs': 'System Logs',
    'nav.platform-settings': 'Platform Settings',

    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.refresh': 'Refresh',
    'common.export': 'Export',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading…',
    'common.no-results': 'No results.',
    'common.optional': 'optional',

    // Status labels
    'status.eligible': 'Eligible',
    'status.at_risk': 'At Risk',
    'status.rejected': 'Rejected',
    'status.under_review': 'Under Review',

    // Public dashboard
    'public.title': 'Scholarship dashboard',
    'public.live': 'Live ranking · auto-refresh every 10s',
  },
  uz: {
    'brand.tagline': 'Stipendiya tahlili',

    'auth.signin.title': 'EduMetric tizimiga kiring',
    'auth.signin.subtitle': 'Shaffof stipendiya baholash.',
    'auth.email': 'Email',
    'auth.password': 'Parol',
    'auth.signin': 'Kirish',
    'auth.signing-in': 'Kirilmoqda…',
    'auth.new-here': 'Yangi foydalanuvchimisiz?',
    'auth.create-account': 'Hisob ochish',
    'auth.demo-accounts': 'Namuna hisoblar · bosing va toʻldiring',
    'auth.all-passwords': 'Barcha namuna parollari:',

    'topbar.search': 'Talabalar, yutuqlar boʻyicha qidirish…',
    'topbar.account': 'Hisobim',
    'topbar.settings': 'Sozlamalar',
    'topbar.signout': 'Chiqish',
    'topbar.notifications': 'Bildirishnomalar',
    'topbar.theme': 'Mavzu',
    'topbar.language': 'Til',

    'nav.dashboard': 'Boshqaruv paneli',
    'nav.profile': 'Mening profilim',
    'nav.achievements': 'Yutuqlar',
    'nav.leaderboard': 'Reyting',
    'nav.analytics': 'Tahlil',
    'nav.notifications': 'Bildirishnomalar',
    'nav.settings': 'Sozlamalar',
    'nav.students': 'Talabalar',
    'nav.attendance': 'Davomat',
    'nav.assignments': 'Topshiriqlar',
    'nav.feedback': 'Fikr-mulohaza',
    'nav.social-eval': 'Ijtimoiy baholash',
    'nav.recovery': 'Tiklash vazifalari',
    'nav.discipline': 'Intizom',
    'nav.reports': 'Hisobotlar',
    'nav.overview': 'Umumiy koʻrinish',
    'nav.mentors': 'Mentorlar',
    'nav.tutors': 'Tyutorlar',
    'nav.approvals': 'Tasdiqlashlar',
    'nav.penalties': 'Jarimalar',
    'nav.kpi-config': 'KPI sozlamalari',
    'nav.api-integrations': 'API integratsiyalari',
    'nav.role-mgmt': 'Rollarni boshqarish',
    'nav.system-logs': 'Tizim jurnali',
    'nav.platform-settings': 'Platforma sozlamalari',

    'common.search': 'Qidirish',
    'common.filter': 'Filtrlash',
    'common.refresh': 'Yangilash',
    'common.export': 'Eksport',
    'common.cancel': 'Bekor qilish',
    'common.save': 'Saqlash',
    'common.delete': 'Oʻchirish',
    'common.confirm': 'Tasdiqlash',
    'common.loading': 'Yuklanmoqda…',
    'common.no-results': 'Natija yoʻq.',
    'common.optional': 'majburiy emas',

    'status.eligible': 'Eligible (Mos)',
    'status.at_risk': 'At Risk (Xavf ostida)',
    'status.rejected': 'Rad etilgan',
    'status.under_review': 'Koʻrib chiqilmoqda',

    'public.title': 'Stipendiya boshqaruv paneli',
    'public.live': 'Jonli reyting · har 10 soniyada yangilanadi',
  },
};
