"use client";

import React, { useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useActivityLog, useActivityFilters } from "@/hooks/useAdmin";
import { Badge, Pagination, EmptyState } from "@/components/ui";
import { TAB_LABELS } from "@/lib/access";
import { format } from "date-fns";
import { Activity, X, ShieldCheck, ChevronDown, ChevronRight } from "lucide-react";

/**
 * The admin activity log.
 *
 * Read-only by construction — there is deliberately no clear, delete or purge
 * control anywhere on this screen, because the API offers none. That is the
 * point of the feature: an entry an admin can remove is not evidence.
 *
 * Both filters the log was asked for are here: by admin (the list grows as
 * more admins are added, so it is driven by who actually appears in the log)
 * and by section, matching the sidebar tabs.
 */

const METHOD_TONE: Record<string, string> = {
  POST: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  PATCH: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
  PUT: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
  DELETE: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400",
};

/** "orders" -> "Orders", falling back to the raw key for unmapped sections. */
function sectionLabel(section: string): string {
  if (section === "other") return "Other";
  return TAB_LABELS[section] ?? section;
}

const PAGE_SIZE = 25;

interface Filters {
  adminUserId?: string;
  section?: string;
  method?: string;
  success?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export default function AdminActivityPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const setFilter = (key: keyof Filters, value: string) => {
    setPage(1);
    setFilters((f) => {
      const next = { ...f };
      if (!value) delete next[key];
      else next[key] = value;
      return next;
    });
  };

  const activeFilterCount = Object.keys(filters).length;

  const { data: filterData } = useActivityFilters();
  const admins: { adminUserId: string | null; adminName: string; count: number }[] =
    filterData?.admins ?? [];
  const sections: { section: string; count: number }[] = filterData?.sections ?? [];

  const query = useMemo(
    () => ({ page, limit: PAGE_SIZE, ...filters }),
    [page, filters],
  );

  const { data, isLoading } = useActivityLog(query);
  const entries = data?.data ?? [];
  const meta = data?.meta;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-semibold text-2xl text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activity Log
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Every action admins take in this panel, newest first.
            </p>
          </div>
          {/* Stated on the screen, not just in the code: the people being
              recorded should be able to see that it cannot be edited. */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
            <span>
              Permanent record — entries cannot be edited or deleted by anyone.
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border shadow-sm rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              value={filters.search ?? ""}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Search action, admin or record…"
              aria-label="Search activity"
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
            />

            <select
              value={filters.adminUserId ?? ""}
              onChange={(e) => setFilter("adminUserId", e.target.value)}
              aria-label="Filter by admin"
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">All admins</option>
              {admins.map((a) => (
                <option key={a.adminUserId ?? a.adminName} value={a.adminUserId ?? ""}>
                  {a.adminName} ({a.count})
                </option>
              ))}
            </select>

            <select
              value={filters.section ?? ""}
              onChange={(e) => setFilter("section", e.target.value)}
              aria-label="Filter by section"
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">All sections</option>
              {sections.map((s) => (
                <option key={s.section} value={s.section}>
                  {sectionLabel(s.section)} ({s.count})
                </option>
              ))}
            </select>

            <select
              value={filters.success ?? ""}
              onChange={(e) => setFilter("success", e.target.value)}
              aria-label="Filter by result"
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">Any result</option>
              <option value="true">Succeeded</option>
              <option value="false">Failed or refused</option>
            </select>

            <select
              value={filters.method ?? ""}
              onChange={(e) => setFilter("method", e.target.value)}
              aria-label="Filter by action type"
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">Any action</option>
              <option value="POST">Created</option>
              <option value="PATCH">Updated</option>
              <option value="DELETE">Deleted</option>
            </select>

            <input
              type="date"
              value={filters.dateFrom ?? ""}
              onChange={(e) => setFilter("dateFrom", e.target.value)}
              aria-label="From date"
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
            />
            <input
              type="date"
              value={filters.dateTo ?? ""}
              onChange={(e) => setFilter("dateTo", e.target.value)}
              aria-label="To date"
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
            />
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setFilters({});
                setPage(1);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <X className="h-3 w-3" /> Clear {activeFilterCount} filter
              {activeFilterCount > 1 ? "s" : ""}
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">When</th>
                  <th className="px-4 py-3 text-left font-semibold">Admin</th>
                  <th className="px-4 py-3 text-left font-semibold">Section</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                  <th className="px-4 py-3 text-left font-semibold">Result</th>
                  <th className="px-4 py-3 text-right font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      Loading activity…
                    </td>
                  </tr>
                )}

                {!isLoading && entries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10">
                      <EmptyState
                        icon={Activity}
                        title={
                          activeFilterCount > 0
                            ? "No activity matches these filters"
                            : "No activity recorded yet"
                        }
                        description={
                          activeFilterCount > 0
                            ? "Try widening the date range or clearing a filter."
                            : "Actions will appear here as admins use the panel."
                        }
                      />
                    </td>
                  </tr>
                )}

                {entries.map((entry: any) => {
                  const isOpen = expanded === entry.id;
                  return (
                    <React.Fragment key={entry.id}>
                      <tr className="border-t border-border hover:bg-muted/20">
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                          <div>{format(new Date(entry.createdAt), "d MMM yyyy")}</div>
                          <div className="text-xs">
                            {format(new Date(entry.createdAt), "h:mm a")}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{entry.adminName}</div>
                          {/* A deleted admin keeps their name on the row but loses
                              the link back to an account — worth showing, since it
                              changes how you read the entry. */}
                          {!entry.adminUserId && (
                            <div className="text-xs text-muted-foreground">account removed</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge>{sectionLabel(entry.section)}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-bold ${
                                METHOD_TONE[entry.method] ??
                                "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {entry.method}
                            </span>
                            <span className="text-foreground">{entry.description}</span>
                          </div>
                          {entry.targetLabel && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {entry.targetLabel}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {entry.success ? (
                            <span className="text-green-600 dark:text-green-400 text-xs font-medium">Succeeded</span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 text-xs font-medium">
                              Failed ({entry.statusCode})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setExpanded(isOpen ? null : entry.id)}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            aria-expanded={isOpen}
                          >
                            {isOpen ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                            {isOpen ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr className="border-t border-border bg-muted/20">
                          <td colSpan={6} className="px-4 py-4">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                              <Detail label="Request">
                                {entry.method} {entry.path}
                              </Detail>
                              <Detail label="Admin email">{entry.adminEmail ?? "—"}</Detail>
                              <Detail label="Record type">{entry.targetType ?? "—"}</Detail>
                              <Detail label="Record id">{entry.targetId ?? "—"}</Detail>
                              <Detail label="IP address">{entry.ipAddress ?? "—"}</Detail>
                              <Detail label="Status code">{entry.statusCode}</Detail>
                            </dl>

                            {entry.changes && (
                              <div className="mt-3">
                                <div className="text-xs font-semibold text-muted-foreground mb-1">
                                  Submitted values
                                </div>
                                <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-background p-3 text-[11px] leading-relaxed">
                                  {JSON.stringify(entry.changes, null, 2)}
                                </pre>
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  Passwords, tokens, bank details and documents are
                                  removed before anything is stored.
                                </p>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="border-t border-border px-4 py-3">
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>

        {meta && (
          <p className="text-xs text-muted-foreground">
            {meta.total.toLocaleString()} entr{meta.total === 1 ? "y" : "ies"}
            {activeFilterCount > 0 ? " matching these filters" : " recorded"}.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted-foreground shrink-0">{label}:</dt>
      <dd className="text-foreground break-all">{children}</dd>
    </div>
  );
}
