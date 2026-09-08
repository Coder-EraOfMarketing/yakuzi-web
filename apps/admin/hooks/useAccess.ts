"use client";
import { useMemo } from "react";
import { useAdminAuth } from "@/store";
import {
  AccessLevel,
  AdminAccess,
  TabKey,
  can as canAccess,
  levelFor as levelForTab,
  readAccess,
} from "@/lib/access";

/**
 * What the signed-in admin is allowed to do, for hiding tabs and actions.
 *
 * This is presentation only - the API enforces the same rules on every admin
 * endpoint, so a hidden button is a courtesy, not the security boundary.
 */
export function useAdminAccess() {
  const { user } = useAdminAuth();
  const access: AdminAccess = useMemo(() => readAccess(user), [user]);

  return useMemo(
    () => ({
      access,
      isSuper: access.isSuper,
      levelFor: (tab: TabKey) => levelForTab(access, tab),
      can: (tab: TabKey, required: AccessLevel = "view") => canAccess(access, tab, required),
    }),
    [access],
  );
}

/** Convenience for a single check inside a component. */
export function useCan(tab: TabKey, required: AccessLevel = "view"): boolean {
  const { can } = useAdminAccess();
  return can(tab, required);
}
