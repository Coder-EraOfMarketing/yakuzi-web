"use client";
import { AccessLevel, TabKey } from "@/lib/access";
import { useCan } from "@/hooks/useAccess";

/**
 * Renders its children only when the signed-in admin holds at least `level`
 * on `tab`.
 *
 * For hiding actions the admin cannot take, so they are not offered a button
 * that fails on click. The API enforces the same rule, so this is presentation
 * only - never the thing standing between a restricted admin and the action.
 */
export function Can({
  tab,
  level = "view",
  children,
  fallback = null,
}: {
  tab: TabKey;
  level?: AccessLevel;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return <>{useCan(tab, level) ? children : fallback}</>;
}
