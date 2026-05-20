/**
 * EduMetric CRM — seed script
 *
 * Bootstraps a realistic dataset that lets judges immediately see a "system
 * that's been running all semester": 5 role accounts + 17 demo students with
 * varied academic situations, achievements, attendance, penalties, and
 * recovery histories. KPI is recalculated for each student so the leaderboard,
 * analytics, and public dashboard all show live numbers on first load.
 *
 * Idempotent: re-run anytime; existing rows are upserted by stable keys.
 */

import {
  AchievementStatus,
  AchievementType,
  AttendanceStatus,
  EmploymentType,
  PenaltySeverity,
  PenaltyType,
  PrismaClient,
  RecoveryStatus,
  Role,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Password123!';
const SALT_ROUNDS = 12;

const ACTIVITY_POINTS: Record<string, number> = {
  HACKATHON_PARTICIPATION: 1,
  HACKATHON_WINNER: 3,
  STARTUP_PROJECT: 5,
  MENTORING_WEAK_STUDENTS: 3,
  PDP_ONLINE_CERTIFICATE: 2,
  PDP_OFFLINE_CERTIFICATE: 3,
  NATIONAL_IT_CERTIFICATE: 2,
  ENGLISH_CERTIFICATE: 3,
  INTERNATIONAL_IT_CERTIFICATE: 5,
  PDP_ECOSYSTEM_WORK: 2,
};

const PENALTY_POINTS: Record<PenaltySeverity, number> = {
  MINOR: 1,
  MEDIUM: 3,
  MAJOR: 5,
  CRITICAL: 12,
};

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9, 0, 0, 0);
  return d;
}

function currentSemester(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() < 6 ? 'SPRING' : 'FALL'}`;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(Math.max(n, lo), hi);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

interface SeedStudent {
  fullName: string;
  email: string;
  studentId: string;
  faculty: string;
  group: string;
  courseYear: number;
  gpa: number;
  attendance: { present: number; late: number; excused: number; absent: number };
  assignments: Array<{ title: string; subject: string; completion: number; quality: number; originality: number; deadline: number }>;
  achievements: Array<{ type: AchievementType; title: string; pointsKey: keyof typeof ACTIVITY_POINTS; status?: AchievementStatus; hasFile?: boolean }>;
  penalties: Array<{ type: PenaltyType; severity: PenaltySeverity; reason: string }>;
  recoveries: Array<{ task: string; points?: number; status?: RecoveryStatus }>;
  employment?: { company: string; type: EmploymentType; position: string; bonus: number };
  tutorEval?: { ethics: number; communication: number; social: number; discipline: number; motivation: number };
}

const FAC = { SE: 'Software Engineering', CS: 'Computer Science', IT: 'Information Technology' } as const;

const STUDENTS: SeedStudent[] = [
  // Top scorers
  {
    fullName: 'Aziza Karimova', email: 'aziza.karimova@university.uz', studentId: 'SE-2024-001',
    faculty: FAC.SE, group: 'SE-21-01', courseYear: 3, gpa: 95,
    attendance: { present: 38, late: 2, excused: 1, absent: 0 },
    assignments: [
      { title: 'Sorting Algorithms Lab', subject: 'Algorithms', completion: 100, quality: 95, originality: 92, deadline: 100 },
      { title: 'Final Project: API Server', subject: 'Backend Dev', completion: 100, quality: 98, originality: 95, deadline: 95 },
      { title: 'Database Design Doc', subject: 'Databases', completion: 100, quality: 95, originality: 90, deadline: 100 },
    ],
    achievements: [
      { type: 'HACKATHON', title: 'IT Park Hackathon 2025 — 1st Place', pointsKey: 'HACKATHON_WINNER', hasFile: true },
      { type: 'CERTIFICATE', title: 'IELTS Academic 7.5', pointsKey: 'ENGLISH_CERTIFICATE', hasFile: true },
      { type: 'CERTIFICATE', title: 'AWS Certified Cloud Practitioner', pointsKey: 'INTERNATIONAL_IT_CERTIFICATE', hasFile: true },
    ],
    penalties: [], recoveries: [],
    employment: { company: 'IT Park Tashkent', type: 'INTERNSHIP', position: 'Junior Backend Intern', bonus: 4 },
    tutorEval: { ethics: 5, communication: 5, social: 5, discipline: 5, motivation: 5 },
  },
  {
    fullName: 'Jasur Tursunov', email: 'jasur.tursunov@university.uz', studentId: 'SE-2024-002',
    faculty: FAC.SE, group: 'SE-21-01', courseYear: 3, gpa: 92,
    attendance: { present: 36, late: 3, excused: 2, absent: 0 },
    assignments: [
      { title: 'OS Scheduling Simulator', subject: 'Operating Systems', completion: 100, quality: 92, originality: 95, deadline: 90 },
      { title: 'Web App Final', subject: 'Web Dev', completion: 100, quality: 90, originality: 88, deadline: 100 },
    ],
    achievements: [
      { type: 'STARTUP', title: 'Founded EduScan startup', pointsKey: 'STARTUP_PROJECT', hasFile: true },
      { type: 'MENTORING', title: 'Mentored 4 first-year students', pointsKey: 'MENTORING_WEAK_STUDENTS', hasFile: false },
    ],
    penalties: [], recoveries: [],
    employment: { company: 'TechFusion LLC', type: 'PART_TIME', position: 'Frontend Developer', bonus: 6 },
    tutorEval: { ethics: 5, communication: 5, social: 4, discipline: 5, motivation: 5 },
  },
  {
    fullName: 'Madina Yusupova', email: 'madina.yusupova@university.uz', studentId: 'CS-2024-003',
    faculty: FAC.CS, group: 'CS-21-01', courseYear: 3, gpa: 91,
    attendance: { present: 35, late: 4, excused: 1, absent: 1 },
    assignments: [
      { title: 'ML Model Training Report', subject: 'Machine Learning', completion: 95, quality: 92, originality: 90, deadline: 95 },
      { title: 'Linear Algebra Pset 5', subject: 'Math', completion: 100, quality: 95, originality: 100, deadline: 90 },
    ],
    achievements: [
      { type: 'CERTIFICATE', title: 'PDP Online: Python Specialization', pointsKey: 'PDP_ONLINE_CERTIFICATE', hasFile: true },
      { type: 'CERTIFICATE', title: 'Cambridge English FCE B2', pointsKey: 'ENGLISH_CERTIFICATE', hasFile: true },
      { type: 'OTHER', title: 'PDP Ecosystem weekly engagement', pointsKey: 'PDP_ECOSYSTEM_WORK', hasFile: false },
    ],
    penalties: [{ type: 'LATE', severity: 'MINOR', reason: 'Late to morning lecture once' }],
    recoveries: [{ task: 'Volunteered 5h at university open day', status: 'COMPLETED', points: 1 }],
    tutorEval: { ethics: 5, communication: 4, social: 5, discipline: 4, motivation: 5 },
  },
  // Strong / Above-average
  {
    fullName: 'Bekzod Yusupov', email: 'bekzod.yusupov@university.uz', studentId: 'SE-2024-004',
    faculty: FAC.SE, group: 'SE-21-02', courseYear: 3, gpa: 88,
    attendance: { present: 34, late: 3, excused: 2, absent: 2 },
    assignments: [
      { title: 'React Components Lab', subject: 'Frontend', completion: 95, quality: 88, originality: 85, deadline: 90 },
      { title: 'REST API Mini-project', subject: 'Backend Dev', completion: 100, quality: 85, originality: 82, deadline: 95 },
    ],
    achievements: [
      { type: 'HACKATHON', title: 'University Hackathon — Participant', pointsKey: 'HACKATHON_PARTICIPATION', hasFile: true },
      { type: 'CERTIFICATE', title: 'PDP Offline: React Bootcamp', pointsKey: 'PDP_OFFLINE_CERTIFICATE', hasFile: true },
    ],
    penalties: [], recoveries: [],
    tutorEval: { ethics: 4, communication: 4, social: 4, discipline: 4, motivation: 4 },
  },
  {
    fullName: 'Sevara Rakhimova', email: 'sevara.rakhimova@university.uz', studentId: 'IT-2024-005',
    faculty: FAC.IT, group: 'IT-21-01', courseYear: 2, gpa: 86,
    attendance: { present: 33, late: 4, excused: 2, absent: 2 },
    assignments: [
      { title: 'Network Topology Design', subject: 'Networks', completion: 100, quality: 85, originality: 88, deadline: 80 },
      { title: 'Cybersecurity Quiz', subject: 'Security', completion: 90, quality: 82, originality: 95, deadline: 85 },
    ],
    achievements: [
      { type: 'CERTIFICATE', title: 'Cisco IT Essentials National Cert', pointsKey: 'NATIONAL_IT_CERTIFICATE', hasFile: true },
      { type: 'CERTIFICATE', title: 'PDP Online: SQL Mastery', pointsKey: 'PDP_ONLINE_CERTIFICATE', hasFile: false },
    ],
    penalties: [], recoveries: [],
    tutorEval: { ethics: 5, communication: 4, social: 4, discipline: 4, motivation: 4 },
  },
  {
    fullName: 'Diyor Mahmudov', email: 'diyor.mahmudov@university.uz', studentId: 'CS-2024-006',
    faculty: FAC.CS, group: 'CS-21-01', courseYear: 3, gpa: 84,
    attendance: { present: 32, late: 5, excused: 2, absent: 2 },
    assignments: [
      { title: 'Data Structures Implementation', subject: 'Algorithms', completion: 90, quality: 80, originality: 78, deadline: 85 },
    ],
    achievements: [
      { type: 'CERTIFICATE', title: 'PDP Online: Java Fundamentals', pointsKey: 'PDP_ONLINE_CERTIFICATE', hasFile: true },
    ],
    penalties: [{ type: 'PHONE_USAGE', severity: 'MINOR', reason: 'Phone used during lecture' }],
    recoveries: [],
    tutorEval: { ethics: 4, communication: 3, social: 4, discipline: 3, motivation: 4 },
  },
  // Average
  {
    fullName: 'Nilufar Saidova', email: 'nilufar.saidova@university.uz', studentId: 'SE-2024-007',
    faculty: FAC.SE, group: 'SE-21-02', courseYear: 2, gpa: 82,
    attendance: { present: 30, late: 5, excused: 3, absent: 3 },
    assignments: [
      { title: 'HTML/CSS Portfolio', subject: 'Frontend', completion: 85, quality: 75, originality: 70, deadline: 80 },
      { title: 'JavaScript Basics Quiz', subject: 'Programming', completion: 80, quality: 75, originality: 80, deadline: 75 },
    ],
    achievements: [
      { type: 'OTHER', title: 'PDP Ecosystem activity', pointsKey: 'PDP_ECOSYSTEM_WORK', hasFile: false, status: 'PENDING' },
    ],
    penalties: [], recoveries: [],
    tutorEval: { ethics: 4, communication: 4, social: 3, discipline: 4, motivation: 3 },
  },
  {
    fullName: 'Ulugbek Karimov', email: 'ulugbek.karimov@university.uz', studentId: 'IT-2024-008',
    faculty: FAC.IT, group: 'IT-21-01', courseYear: 2, gpa: 81,
    attendance: { present: 28, late: 6, excused: 3, absent: 4 },
    assignments: [
      { title: 'Linux Basics Lab', subject: 'OS', completion: 80, quality: 72, originality: 75, deadline: 70 },
    ],
    achievements: [],
    penalties: [{ type: 'LATE', severity: 'MINOR', reason: 'Repeated tardiness — week 5' }],
    recoveries: [],
    tutorEval: { ethics: 3, communication: 4, social: 3, discipline: 3, motivation: 3 },
  },
  // Borderline / At risk
  {
    fullName: 'Kamola Tashkentova', email: 'kamola.tashkentova@university.uz', studentId: 'SE-2024-009',
    faculty: FAC.SE, group: 'SE-21-01', courseYear: 2, gpa: 80,
    attendance: { present: 25, late: 6, excused: 4, absent: 6 },
    assignments: [
      { title: 'JS Final Project', subject: 'Programming', completion: 70, quality: 65, originality: 60, deadline: 60 },
    ],
    achievements: [],
    penalties: [
      { type: 'ABSENCE', severity: 'MEDIUM', reason: 'Unexcused absence — week 8' },
      { type: 'PHONE_USAGE', severity: 'MINOR', reason: 'Phone use during exam prep' },
    ],
    recoveries: [{ task: 'Mentored 3 first-year students', status: 'COMPLETED', points: 2 }],
    tutorEval: { ethics: 3, communication: 3, social: 3, discipline: 3, motivation: 3 },
  },
  {
    fullName: 'Rustam Abdullaev', email: 'rustam.abdullaev@university.uz', studentId: 'CS-2024-010',
    faculty: FAC.CS, group: 'CS-21-02', courseYear: 2, gpa: 78,
    attendance: { present: 24, late: 7, excused: 3, absent: 7 },
    assignments: [
      { title: 'Database Basics Quiz', subject: 'Databases', completion: 65, quality: 55, originality: 50, deadline: 65 },
    ],
    achievements: [
      { type: 'CERTIFICATE', title: 'PDP Online: Git Basics', pointsKey: 'PDP_ONLINE_CERTIFICATE', hasFile: true, status: 'APPROVED' },
    ],
    penalties: [{ type: 'ABSENCE', severity: 'MEDIUM', reason: 'Three unexcused absences' }],
    recoveries: [{ task: 'University event volunteer', status: 'PENDING' }],
    tutorEval: { ethics: 3, communication: 2, social: 2, discipline: 2, motivation: 3 },
  },
  {
    fullName: 'Gulnoza Ergasheva', email: 'gulnoza.ergasheva@university.uz', studentId: 'IT-2024-011',
    faculty: FAC.IT, group: 'IT-21-02', courseYear: 1, gpa: 75,
    attendance: { present: 22, late: 8, excused: 2, absent: 8 },
    assignments: [
      { title: 'Intro to Programming Lab', subject: 'Programming', completion: 60, quality: 55, originality: 60, deadline: 50 },
    ],
    achievements: [],
    penalties: [], recoveries: [],
    tutorEval: { ethics: 3, communication: 3, social: 2, discipline: 3, motivation: 2 },
  },
  // With major penalties
  {
    fullName: 'Sherzod Nazarov', email: 'sherzod.nazarov@university.uz', studentId: 'SE-2024-012',
    faculty: FAC.SE, group: 'SE-21-02', courseYear: 3, gpa: 85,
    attendance: { present: 30, late: 4, excused: 1, absent: 5 },
    assignments: [
      { title: 'Final Software Project', subject: 'SE', completion: 90, quality: 75, originality: 30, deadline: 80 },
    ],
    achievements: [
      { type: 'HACKATHON', title: 'Local Hackathon — Participant', pointsKey: 'HACKATHON_PARTICIPATION', hasFile: true },
    ],
    penalties: [
      { type: 'PLAGIARISM', severity: 'CRITICAL', reason: 'Final project copied from GitHub' },
      { type: 'ABSENCE', severity: 'MEDIUM', reason: 'Two unexcused absences' },
    ],
    recoveries: [{ task: 'Academic support tutoring (4h)', status: 'COMPLETED', points: 3 }],
    tutorEval: { ethics: 2, communication: 3, social: 3, discipline: 2, motivation: 3 },
  },
  {
    fullName: 'Dilshod Yakubov', email: 'dilshod.yakubov@university.uz', studentId: 'CS-2024-013',
    faculty: FAC.CS, group: 'CS-21-02', courseYear: 2, gpa: 81,
    attendance: { present: 27, late: 6, excused: 2, absent: 6 },
    assignments: [],
    achievements: [],
    penalties: [
      { type: 'PHONE_USAGE', severity: 'MINOR', reason: 'Gaming during class' },
      { type: 'DORMITORY_VIOLATION', severity: 'MINOR', reason: 'Noise complaint' },
      { type: 'DISRESPECT', severity: 'MEDIUM', reason: 'Ignored mentor warning' },
    ],
    recoveries: [{ task: 'Volunteer at sports event', status: 'PENDING' }],
    tutorEval: { ethics: 2, communication: 2, social: 2, discipline: 1, motivation: 2 },
  },
  // Strong achievements
  {
    fullName: 'Lola Iskandarova', email: 'lola.iskandarova@university.uz', studentId: 'SE-2024-014',
    faculty: FAC.SE, group: 'SE-21-01', courseYear: 3, gpa: 87,
    attendance: { present: 33, late: 3, excused: 2, absent: 3 },
    assignments: [
      { title: 'Mobile App Project', subject: 'Mobile Dev', completion: 95, quality: 90, originality: 88, deadline: 92 },
    ],
    achievements: [
      { type: 'CERTIFICATE', title: 'TOEFL iBT 95', pointsKey: 'ENGLISH_CERTIFICATE', hasFile: true },
      { type: 'CERTIFICATE', title: 'Microsoft Azure Fundamentals', pointsKey: 'INTERNATIONAL_IT_CERTIFICATE', hasFile: true },
      { type: 'MENTORING', title: 'Tutored 3 weak students in JS', pointsKey: 'MENTORING_WEAK_STUDENTS', hasFile: false },
    ],
    penalties: [], recoveries: [],
    employment: { company: 'Beeline Uzbekistan', type: 'PART_TIME', position: 'Mobile Developer', bonus: 7 },
    tutorEval: { ethics: 5, communication: 4, social: 5, discipline: 4, motivation: 5 },
  },
  // Full-time employed senior
  {
    fullName: 'Akmal Tokhirov', email: 'akmal.tokhirov@university.uz', studentId: 'CS-2024-015',
    faculty: FAC.CS, group: 'CS-21-01', courseYear: 4, gpa: 89,
    attendance: { present: 30, late: 5, excused: 3, absent: 3 },
    assignments: [
      { title: 'Distributed Systems Paper', subject: 'Systems', completion: 100, quality: 92, originality: 95, deadline: 85 },
    ],
    achievements: [
      { type: 'EMPLOYMENT', title: 'Full-time Backend Engineer at EPAM', pointsKey: 'PDP_OFFLINE_CERTIFICATE', hasFile: true },
    ],
    penalties: [], recoveries: [],
    employment: { company: 'EPAM Systems', type: 'FULL_TIME', position: 'Backend Engineer', bonus: 9 },
    tutorEval: { ethics: 5, communication: 5, social: 4, discipline: 5, motivation: 5 },
  },
  // Pending achievement
  {
    fullName: 'Zarina Komilova', email: 'zarina.komilova@university.uz', studentId: 'IT-2024-016',
    faculty: FAC.IT, group: 'IT-21-02', courseYear: 2, gpa: 83,
    attendance: { present: 31, late: 5, excused: 2, absent: 3 },
    assignments: [
      { title: 'IT Service Management Lab', subject: 'ITSM', completion: 90, quality: 80, originality: 82, deadline: 85 },
    ],
    achievements: [
      { type: 'HACKATHON', title: 'Hack4Climate — Participant', pointsKey: 'HACKATHON_PARTICIPATION', hasFile: true, status: 'PENDING' },
      { type: 'CERTIFICATE', title: 'PDP Online: Web Basics', pointsKey: 'PDP_ONLINE_CERTIFICATE', hasFile: false, status: 'PENDING' },
    ],
    penalties: [], recoveries: [],
    tutorEval: { ethics: 4, communication: 4, social: 4, discipline: 4, motivation: 4 },
  },
  // New entry
  {
    fullName: 'Sardor Bekmurodov', email: 'sardor.bekmurodov@university.uz', studentId: 'SE-2024-017',
    faculty: FAC.SE, group: 'SE-21-02', courseYear: 1, gpa: 90,
    attendance: { present: 18, late: 2, excused: 0, absent: 0 },
    assignments: [], achievements: [], penalties: [], recoveries: [],
    tutorEval: { ethics: 4, communication: 4, social: 4, discipline: 5, motivation: 5 },
  },
];

// One per role
const ROLE_USERS = [
  { fullName: 'Demo Student',     email: 'student@edumetric.dev',    role: Role.STUDENT },
  { fullName: 'Bekzod Yusupov',   email: 'mentor@edumetric.dev',     role: Role.MENTOR },
  { fullName: 'Dilfuza Sodiqova', email: 'tutor@edumetric.dev',      role: Role.TUTOR },
  { fullName: 'Sherzod Admin',    email: 'admin@edumetric.dev',      role: Role.ADMIN },
  { fullName: 'Root Super',       email: 'superadmin@edumetric.dev', role: Role.SUPER_ADMIN },
];

async function ensureRoleUsers(passwordHash: string) {
  const ids: Record<Role, string> = {} as Record<Role, string>;
  for (const u of ROLE_USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { fullName: u.fullName, role: u.role },
      create: { ...u, passwordHash },
    });
    ids[u.role] = user.id;
  }
  return ids;
}

async function ensureMentorTutorProfiles(ids: Record<Role, string>) {
  const mentor = await prisma.mentor.upsert({
    where: { userId: ids.MENTOR },
    update: { assignedGroups: ['SE-21-01', 'SE-21-02', 'CS-21-01'] },
    create: { userId: ids.MENTOR, specialization: 'Software Engineering', assignedGroups: ['SE-21-01', 'SE-21-02', 'CS-21-01'] },
  });
  const tutor = await prisma.tutor.upsert({
    where: { userId: ids.TUTOR },
    update: { assignedGroups: ['SE-21-01', 'SE-21-02', 'IT-21-01', 'IT-21-02', 'CS-21-01', 'CS-21-02'] },
    create: { userId: ids.TUTOR, assignedDormitory: 'Dorm A', assignedGroups: ['SE-21-01', 'SE-21-02', 'IT-21-01', 'IT-21-02', 'CS-21-01', 'CS-21-02'] },
  });
  return { mentor, tutor };
}

async function seedStudent(s: SeedStudent, passwordHash: string, actorIds: Record<Role, string>, mentorId: string, tutorId: string) {
  const user = await prisma.user.upsert({
    where: { email: s.email },
    update: { fullName: s.fullName },
    create: { fullName: s.fullName, email: s.email, passwordHash, role: Role.STUDENT },
  });

  const totalAttended = s.attendance.present + s.attendance.late * 0.5 + s.attendance.excused;
  const totalSessions = s.attendance.present + s.attendance.late + s.attendance.excused + s.attendance.absent;
  const attendancePercent = totalSessions ? round((totalAttended / totalSessions) * 100) : 0;

  const student = await prisma.student.upsert({
    where: { userId: user.id },
    update: { studentId: s.studentId, faculty: s.faculty, group: s.group, courseYear: s.courseYear, gpa: s.gpa, attendancePercent },
    create: { userId: user.id, studentId: s.studentId, faculty: s.faculty, group: s.group, courseYear: s.courseYear, gpa: s.gpa, attendancePercent },
  });

  await prisma.studentAssignment.upsert({
    where: { studentId: student.id },
    update: { mentorId, tutorId },
    create: { studentId: student.id, mentorId, tutorId },
  });

  // Wipe related rows for clean re-seed
  await prisma.$transaction([
    prisma.attendance.deleteMany({ where: { studentId: student.id } }),
    prisma.assignment.deleteMany({ where: { studentId: student.id } }),
    prisma.tutorEvaluation.deleteMany({ where: { studentId: student.id } }),
    prisma.penalty.deleteMany({ where: { studentId: student.id } }),
    prisma.recovery.deleteMany({ where: { studentId: student.id } }),
    prisma.achievement.deleteMany({ where: { studentId: student.id } }),
    prisma.employmentBonus.deleteMany({ where: { studentId: student.id } }),
  ]);

  // Attendance
  const sessions: AttendanceStatus[] = [
    ...Array(s.attendance.present).fill('PRESENT'),
    ...Array(s.attendance.late).fill('LATE'),
    ...Array(s.attendance.excused).fill('EXCUSED'),
    ...Array(s.attendance.absent).fill('ABSENT'),
  ];
  const subjects = ['Algorithms', 'Web Dev', 'Databases', 'Operating Systems', 'Math'];
  for (let i = 0; i < sessions.length; i++) {
    await prisma.attendance.create({
      data: {
        studentId: student.id, subject: subjects[i % subjects.length],
        date: daysAgo(i), status: sessions[i], recordedById: actorIds.MENTOR,
      },
    });
  }

  // Assignments
  for (const a of s.assignments) {
    const total = a.completion * 0.3 + a.quality * 0.3 + a.originality * 0.25 + a.deadline * 0.15;
    await prisma.assignment.create({
      data: {
        studentId: student.id, subject: a.subject, title: a.title,
        completionScore: a.completion, qualityScore: a.quality,
        originalityScore: a.originality, deadlineScore: a.deadline,
        totalScore: round(total), reviewedById: actorIds.MENTOR,
      },
    });
  }

  // Tutor evaluation
  if (s.tutorEval) {
    await prisma.tutorEvaluation.create({
      data: {
        studentId: student.id, tutorId: actorIds.TUTOR,
        ethics: s.tutorEval.ethics, communication: s.tutorEval.communication,
        socialActivity: s.tutorEval.social, discipline: s.tutorEval.discipline,
        motivation: s.tutorEval.motivation, notes: 'End-of-semester tutor evaluation',
      },
    });
  }

  // Penalties
  for (const p of s.penalties) {
    await prisma.penalty.create({
      data: {
        studentId: student.id, type: p.type, severity: p.severity,
        points: PENALTY_POINTS[p.severity], reason: p.reason, issuedById: actorIds.MENTOR,
      },
    });
  }

  // Recoveries
  for (const r of s.recoveries) {
    await prisma.recovery.create({
      data: {
        studentId: student.id, assignedTask: r.task, status: r.status ?? 'PENDING',
        recoveredPoints: r.points ?? 0,
        verifiedById: r.status === 'COMPLETED' ? actorIds.TUTOR : null,
        completedAt: r.status === 'COMPLETED' ? daysAgo(7) : null,
      },
    });
  }

  // Achievements
  for (const a of s.achievements) {
    const status = a.status ?? 'APPROVED';
    await prisma.achievement.create({
      data: {
        studentId: student.id, type: a.type, title: a.title,
        description: `Demo: ${a.title}`,
        fileUrl: a.hasFile ? `https://res.cloudinary.com/demo/${a.pointsKey}.pdf` : null,
        score: status === 'APPROVED' ? ACTIVITY_POINTS[a.pointsKey] ?? 1 : 0,
        status, verifiedById: status !== 'PENDING' ? actorIds.ADMIN : null,
      },
    });
  }

  // Employment bonus
  if (s.employment) {
    await prisma.employmentBonus.create({
      data: {
        studentId: student.id, companyName: s.employment.company,
        employmentType: s.employment.type, position: s.employment.position,
        bonusPoints: s.employment.bonus, approvedById: actorIds.ADMIN,
      },
    });
  }
  return student;
}

async function recomputeKpi(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      achievements: { where: { status: 'APPROVED' } },
      studentAssignments: true,
      tutorEvaluations: true,
      penalties: true,
      recoveries: { where: { status: 'COMPLETED' } },
      employmentBonuses: true,
    },
  });
  if (!student) return;

  const KPI = { ACADEMIC: 40, ATTENDANCE: 20, ASSIGNMENT: 15, ACTIVITY: 10, TUTOR: 5, DISCIPLINE: 10, PENALTY: 20, RECOVERY: 10, EMP: 10 };

  const academicScore = round((student.gpa / 100) * KPI.ACADEMIC);
  const attendanceScore = round((student.attendancePercent / 100) * KPI.ATTENDANCE);

  let assignmentScore = 0;
  if (student.studentAssignments.length) {
    const avg = student.studentAssignments.reduce((s, a) =>
      s + (a.completionScore * 0.3 + a.qualityScore * 0.3 + a.originalityScore * 0.25 + a.deadlineScore * 0.15), 0) / student.studentAssignments.length;
    assignmentScore = round(clamp((avg / 100) * KPI.ASSIGNMENT, 0, KPI.ASSIGNMENT));
  }

  const activityScore = round(clamp(
    student.achievements.reduce((sum, a) => sum + (a.score ?? 0), 0), 0, KPI.ACTIVITY,
  ));

  let tutorScore = 0;
  if (student.tutorEvaluations.length) {
    const latest = [...student.tutorEvaluations].sort((a, b) => +b.createdAt - +a.createdAt)[0];
    tutorScore = round((latest.ethics + latest.communication + latest.socialActivity + latest.discipline + latest.motivation) / 5);
  }

  let discipline = 10;
  for (const p of student.penalties) {
    if (p.type === 'LATE' || p.type === 'PHONE_USAGE') discipline -= 1;
    else if (p.type === 'ABSENCE') discipline -= 3;
    else if (p.type === 'PLAGIARISM') discipline -= 15;
    else discipline -= 3;
  }
  const disciplineScore = Math.max(discipline, 0);

  const penaltyAbs = student.penalties.reduce((acc, p) => acc + Math.abs(p.points), 0);
  const penaltyScore = round(-Math.min(penaltyAbs, KPI.PENALTY));

  const recoveryCap = Math.min(Math.abs(penaltyScore) / 2, KPI.RECOVERY);
  const recoveryRaw = student.recoveries.reduce((s, r) => s + (r.recoveredPoints ?? 0), 0);
  const recoveryScore = round(Math.min(recoveryRaw, recoveryCap));

  const employmentBonus = round(clamp(
    student.employmentBonuses.reduce((s, b) => s + (b.bonusPoints ?? 0), 0), 0, KPI.EMP,
  ));

  const base = academicScore + attendanceScore + assignmentScore + activityScore + tutorScore + disciplineScore;
  const finalScore = round(base + penaltyScore + recoveryScore + employmentBonus);

  let status: 'ELIGIBLE' | 'AT_RISK' | 'REJECTED' = 'ELIGIBLE';
  if (student.gpa < 80) status = 'REJECTED';
  else if (finalScore < 80) status = 'AT_RISK';

  const semester = currentSemester();
  const prev = await prisma.kpiScore.findUnique({
    where: { studentId_semester: { studentId, semester } },
    select: { finalScore: true },
  });

  const breakdown = { academicScore, attendanceScore, assignmentScore, activityScore, tutorScore, disciplineScore, penaltyScore, recoveryScore, employmentBonus, finalScore };

  await prisma.$transaction([
    prisma.kpiScore.upsert({
      where: { studentId_semester: { studentId, semester } },
      create: { studentId, semester, ...breakdown },
      update: { ...breakdown, computedAt: new Date() },
    }),
    prisma.student.update({
      where: { id: studentId },
      data: { overallScore: finalScore, scholarshipStatus: status },
    }),
    prisma.kpiHistory.create({
      data: { studentId, oldScore: prev?.finalScore ?? 0, newScore: finalScore, reason: 'Seed: initial KPI calculation', metadata: breakdown },
    }),
  ]);
}

async function main() {
  console.log('🌱 Seeding EduMetric demo data...');
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS);

  const actorIds = await ensureRoleUsers(passwordHash);
  console.log('  ✓ Role accounts');
  const { mentor, tutor } = await ensureMentorTutorProfiles(actorIds);
  console.log(`  ✓ Mentor / tutor profiles (mentor groups: ${mentor.assignedGroups.length})`);

  // Reroute the "student@edumetric.dev" login → top student's profile
  STUDENTS[0].email = 'student@edumetric.dev';

  console.log(`  ↪ Seeding ${STUDENTS.length} demo students…`);
  for (const s of STUDENTS) {
    await seedStudent(s, passwordHash, actorIds, mentor.id, tutor.id);
    process.stdout.write('.');
  }
  console.log('\n  ✓ Students + attendance + assignments + achievements + penalties + recoveries');

  console.log('  ↪ Computing initial KPI for every student…');
  const all = await prisma.student.findMany({ select: { id: true } });
  for (const s of all) await recomputeKpi(s.id);
  console.log(`  ✓ KPI scores computed for ${all.length} students`);

  console.log(`\n🔑 All demo accounts share password: ${DEMO_PASSWORD}`);
  console.log("   Sign in with student@edumetric.dev to see Aziza Karimova's profile\n");
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
