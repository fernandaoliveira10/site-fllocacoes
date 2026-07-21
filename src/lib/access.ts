export function canAccessDashboard(role?: string | null) {
  return role === "ADMIN";
}
