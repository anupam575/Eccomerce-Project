"use client";

import DashboardLayout from "../components/DashboardLayout";
import { adminMenu } from "../components/menuItems/adminMenu";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}> {/* role 1 = Admin */}
      <DashboardLayout
        menuItems={adminMenu}
        title="Admin Dashboard" // ✅ Pass dynamic title
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}