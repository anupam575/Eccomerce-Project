export const ROLES = {
  ADMIN: 1,
  EMPLOYEE: 2,
  HR: 3,
  REPORTING: 4,
  REVIEWING: 5,
};

export const ROLE_NAMES = {
  1: "Admin",
  2: "Employee login",
  3: "HR Department",
  4: "Reporting Officer",
  5: "Reviewing Officer",
};

export const ROLE_OPTIONS = Object.entries(ROLE_NAMES).map(
  ([id, name]) => ({
    id: Number(id),
    name,
  })
);