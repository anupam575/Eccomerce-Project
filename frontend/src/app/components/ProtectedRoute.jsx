"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const PUBLIC_ROUTES = ["/auth", "/forgot-password"];

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { user, authChecked, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  const isRedirectingRef = useRef(false);

  useEffect(() => {
    if (!authChecked) return;

    if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) return;

    // 🔐 not logged in
    if (!isAuthenticated && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      router.replace("/");
      return;
    }

    // 🔥 role_key based check
    const roleKey = user?.role?.key;

    if (
      isAuthenticated &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(roleKey) &&
      !isRedirectingRef.current
    ) {
      isRedirectingRef.current = true;
      router.replace("/");
    }
  }, [authChecked, isAuthenticated, user, allowedRoles, pathname]);

  // ⏳ loading
  if (!authChecked || loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        ⏳ Checking authorization...
      </div>
    );
  }

  // ✅ allowed
  const roleKey = user?.role?.key;

  if (
    isAuthenticated &&
    (allowedRoles.length === 0 || allowedRoles.includes(roleKey))
  ) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;