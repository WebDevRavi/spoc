export type Role = "admin" | "staff" | "user";
export type IssueStatus = "open" | "in_progress" | "resolved" | "closed";

export interface Department {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  departmentId?: string; // for staff
}

export interface IssueComment {
  id: string;
  issueId: string;
  userId: string;
  message: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  status: IssueStatus;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // userId
  assignedTo?: string; // userId
  photoUrl?: string;
}

export interface NotificationItem {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface MockDB {
  departments: Department[];
  users: User[];
  issues: Issue[];
  comments: IssueComment[];
  notifications: NotificationItem[];
}

const KEY = "spoc_civic_mock_db_v1";

function seeded<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getDB(): MockDB {
  const existing = seeded<MockDB>(KEY, {
    departments: [],
    users: [],
    issues: [],
    comments: [],
    notifications: [],
  });
  if (existing.departments.length === 0) {
    const departments: Department[] = [
      { id: uid("dep"), name: "Sanitation" },
      { id: uid("dep"), name: "Roads" },
      { id: uid("dep"), name: "Lighting" },
      { id: uid("dep"), name: "Parks" },
    ];

    const admin: User = {
      id: uid("usr"),
      username: "admin",
      email: "admin@city.gov",
      role: "admin",
    };
    const staff1: User = {
      id: uid("usr"),
      username: "rita",
      email: "rita@city.gov",
      role: "staff",
      departmentId: departments[0].id,
    };
    const staff2: User = {
      id: uid("usr"),
      username: "arun",
      email: "arun@city.gov",
      role: "staff",
      departmentId: departments[1].id,
    };
    const citizen: User = {
      id: uid("usr"),
      username: "citizen",
      email: "citizen@example.com",
      role: "user",
    };

    const now = Date.now();
    const issues: Issue[] = [
      {
        id: uid("iss"),
        title: "Overflowing garbage bin",
        description: "Garbage bin on 5th Street is overflowing and smells.",
        location: "5th St & Maple Ave",
        status: "open",
        departmentId: departments[0].id,
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
        updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
        createdBy: citizen.id,
        assignedTo: staff1.id,
        photoUrl: "/placeholder.svg",
      },
      {
        id: uid("iss"),
        title: "Pothole near school",
        description: "Large pothole causing traffic delays.",
        location: "Sunrise Public School Rd",
        status: "in_progress",
        departmentId: departments[1].id,
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 6).toISOString(),
        updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
        createdBy: citizen.id,
        assignedTo: staff2.id,
      },
      {
        id: uid("iss"),
        title: "Street light flickering",
        description: "Lamp post ID L-204 is flickering at night.",
        location: "Central Park East Gate",
        status: "resolved",
        departmentId: departments[2].id,
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(),
        updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
        createdBy: citizen.id,
        assignedTo: staff2.id,
      },
    ];

    const db: MockDB = {
      departments,
      users: [admin, staff1, staff2, citizen],
      issues,
      comments: [],
      notifications: [],
    };
    localStorage.setItem(KEY, JSON.stringify(db));
    return db;
  }
  return existing;
}

export function setDB(db: MockDB) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function registerUser(
  username: string,
  email: string,
  role: Role,
  departmentId?: string,
): User {
  const db = getDB();
  const newUser: User = { id: uid("usr"), username, email, role, departmentId };
  db.users.push(newUser);
  setDB(db);
  return newUser;
}

export function findUserByCredentials(
  username: string,
  email: string,
): User | undefined {
  const db = getDB();
  return db.users.find((u) => u.username === username && u.email === email);
}

export function addIssue(
  partial: Omit<Issue, "id" | "createdAt" | "updatedAt">,
): Issue {
  const db = getDB();
  const now = new Date().toISOString();
  const issue: Issue = {
    id: uid("iss"),
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
  db.issues.push(issue);
  pushNotification(`New issue reported: ${issue.title}`);
  setDB(db);
  return issue;
}

export function updateIssue(id: string, updates: Partial<Issue>) {
  const db = getDB();
  const idx = db.issues.findIndex((i) => i.id === id);
  if (idx === -1) return;
  const next = {
    ...db.issues[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  db.issues[idx] = next;
  if (updates.status)
    pushNotification(`Issue ${id} status updated to ${updates.status}`);
  setDB(db);
}

export function getKPIs() {
  const db = getDB();
  const total = db.issues.length;
  const resolved = db.issues.filter(
    (i) => i.status === "resolved" || i.status === "closed",
  ).length;
  const pending = total - resolved;
  const avgResolutionHours = (() => {
    const resolvedIssues = db.issues.filter(
      (i) => i.status === "resolved" || i.status === "closed",
    );
    if (resolvedIssues.length === 0) return 0;
    const diffs = resolvedIssues.map(
      (i) =>
        (new Date(i.updatedAt).getTime() - new Date(i.createdAt).getTime()) /
        36e5,
    );
    return (
      Math.round((diffs.reduce((a, b) => a + b, 0) / diffs.length) * 10) / 10
    );
  })();
  return { total, resolved, pending, avgResolutionHours };
}

export function getRecentActivity(limit = 6) {
  const db = getDB();
  return db.issues
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);
}

export function getDepartments() {
  return getDB().departments;
}

export function getNotifications(): NotificationItem[] {
  return getDB()
    .notifications.slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function markAllNotificationsRead() {
  const db = getDB();
  db.notifications = db.notifications.map((n) => ({ ...n, read: true }));
  setDB(db);
}

export function pushNotification(message: string) {
  const db = getDB();
  db.notifications.push({
    id: uid("ntf"),
    message,
    createdAt: new Date().toISOString(),
    read: false,
  });
  setDB(db);
}
