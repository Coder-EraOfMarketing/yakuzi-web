"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "@/store";
import { useAdminMe } from "@/hooks/useAdmin";
import { useAdminAccess } from "@/hooks/useAccess";
import { canOpenRoute, firstAccessibleRoute, tabForRoute, TAB_LABELS } from "@/lib/access";
import { Loader2, ShieldAlert } from "lucide-react";

/**
 * Route access now comes from the tab grants the API issues (see lib/access).
 * The old map keyed pages to single letter codes, left most of the sidebar -
 * blogs, SEO, reviews, self ship, homepage sections - completely ungated, and
 * treated a free-text department of "Super Admin" as a full-access backdoor.
 */

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuth, logout } = useAdminAuth();
  const { isLoading: isLoadingMe } = useAdminMe();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { access } = useAdminAccess();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Auto-logout if pending
    if (isAuth && user?.status === "PENDING" && pathname !== "/auth") {
      logout();
      router.replace("/auth");
      return;
    }

    // Redirect to auth if not authenticated and trying to access protected page
    if (!isAuth && pathname !== "/auth") {
      router.replace("/auth");
    }
    
    // Redirect to dashboard if already authenticated and trying to access auth page
    if (isAuth && pathname === "/auth") {
      router.replace("/");
    }

    // "/" force-redirects to /dashboard, which is now a granted tab. An admin
    // without it should land on their first accessible section rather than on
    // an access-denied screen the moment they log in.
    if (isAuth && pathname === "/dashboard" && !canOpenRoute(access, pathname)) {
      const landing = firstAccessibleRoute(access);
      if (landing) router.replace(landing);
    }
  }, [isAuth, user?.status, pathname, mounted, router, logout, access]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Allow auth page regardless
  if (pathname === "/auth") {
    return <>{children}</>;
  }

  // If not authenticated, still show loading while redirect happens
  if (!isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If loading the latest profile/permissions, wait for it
  if (isLoadingMe && !(user as any)?.adminProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check route-level access. The sidebar already hides what an admin cannot
  // open, so reaching this screen means a typed URL or a stale bookmark.
  if (!canOpenRoute(access, pathname)) {
    const tab = tabForRoute(pathname);
    const landing = firstAccessibleRoute(access);
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4 p-6 glass-card max-w-sm rounded-2xl border border-destructive/20 shadow-2xl">
          <ShieldAlert className="h-12 w-12 text-destructive mx-auto animate-pulse" />
          <h2 className="text-lg font-semibold">No access to this section</h2>
          <p className="text-sm text-muted-foreground">
            Your account does not have access to{" "}
            <strong>{tab ? TAB_LABELS[tab] ?? pathname : pathname}</strong>. Ask a Super Admin if you need it.
          </p>
          <div className="pt-2 space-y-2">
            {landing ? (
              <button onClick={() => router.replace(landing)} className="text-sm text-primary underline block w-full">
                Go to {TAB_LABELS[tabForRoute(landing) ?? ""] ?? "your sections"}
              </button>
            ) : (
              <p className="text-xs text-muted-foreground">Your account has no sections yet.</p>
            )}
            <button onClick={() => { logout(); router.replace("/auth"); }} className="text-xs text-muted-foreground hover:text-foreground block w-full mt-2 transition-colors">Logout & Login again</button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
