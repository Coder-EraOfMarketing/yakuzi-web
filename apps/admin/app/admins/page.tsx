"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Pencil, Trash2, Shield, UserCheck, ChevronRight, Crown } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button, Badge, Input, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  useAdmins,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin,
  useAffirmUserStatus,
  useAccessCatalog,
} from "@/hooks/useAdmin";
import { useAdminAccess } from "@/hooks/useAccess";
import { useAdminAuth } from "@/store";
import {
  ACCESS_GROUPS,
  AccessGroup,
  AccessLevel,
  AdminAccess,
  TabKey,
  levelFor,
} from "@/lib/access";

/**
 * Four levels, in ladder order. `none` first so the row reads left-to-right
 * from least to most access.
 */
const LEVEL_OPTIONS: { value: AccessLevel; label: string; hint: string }[] = [
  { value: "none", label: "None", hint: "No access - the tab is hidden" },
  { value: "view", label: "View", hint: "Can look, cannot change anything" },
  { value: "partial", label: "Partial", hint: "Everyday actions only" },
  { value: "full", label: "Full", hint: "Everything, including the risky actions" },
];

const emptyForm = () => ({
  name: "",
  phone: "",
  department: "General",
  access: { isSuper: false, tabs: {} as Partial<Record<TabKey, AccessLevel>> },
});

type AdminForm = ReturnType<typeof emptyForm>;

/** The level shared by every tab in a group, or null when they differ. */
function groupLevel(access: AdminAccess, group: AccessGroup): AccessLevel | null {
  const levels = group.tabs.map((tab) => levelFor(access, tab.key));
  return levels.every((level) => level === levels[0]) ? levels[0] : null;
}

function countGrantedTabs(access: AdminAccess): number {
  return Object.values(access.tabs ?? {}).filter((level) => level && level !== "none").length;
}

function LevelPicker({
  value,
  options,
  onChange,
  size = "md",
}: {
  value: AccessLevel | null;
  options: { value: AccessLevel; label: string; hint?: string }[];
  onChange: (level: AccessLevel) => void;
  size?: "md" | "sm";
}) {
  return (
    <div
      className={cn(
        "inline-flex rounded-xl bg-muted/40 p-0.5 gap-0.5",
        size === "sm" && "scale-[0.92] origin-right",
      )}
      role="group"
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            title={option.hint}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all whitespace-nowrap",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default function AdminManagementPage() {
  const { data: adminsData, isLoading } = useAdmins();
  const { data: catalog } = useAccessCatalog();
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();
  const updateStatus = useAffirmUserStatus();
  const { isSuper } = useAdminAccess();
  const { user: currentUser } = useAdminAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [form, setForm] = useState<AdminForm>(emptyForm());
  const [expanded, setExpanded] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // The API serves the group definitions so this screen and the server can
  // never disagree about what a level means; the bundled copy is the fallback.
  const groups: AccessGroup[] = catalog?.groups?.length ? catalog.groups : ACCESS_GROUPS;

  const admins: any[] = Array.isArray(adminsData) ? adminsData : (adminsData?.data ?? []);
  const filtered = admins.filter(
    (a: any) =>
      !search ||
      (a.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (a.phone ?? "").includes(search),
  );

  const formAccess: AdminAccess = form.access;
  const editingSelf = editingAdmin?.id && editingAdmin.id === (currentUser as any)?.id;

  const optionsFor = (group: AccessGroup) =>
    group.supportsPartial ? LEVEL_OPTIONS : LEVEL_OPTIONS.filter((o) => o.value !== "partial");

  const setGroup = (group: AccessGroup, level: AccessLevel) => {
    setForm((f) => {
      const tabs = { ...f.access.tabs };
      for (const tab of group.tabs) {
        if (level === "none") delete tabs[tab.key];
        else tabs[tab.key] = level;
      }
      return { ...f, access: { ...f.access, tabs } };
    });
  };

  const setTab = (tab: TabKey, level: AccessLevel) => {
    setForm((f) => {
      const tabs = { ...f.access.tabs };
      if (level === "none") delete tabs[tab];
      else tabs[tab] = level;
      return { ...f, access: { ...f.access, tabs } };
    });
  };

  const openCreate = () => {
    setEditingAdmin(null);
    setForm(emptyForm());
    setExpanded([]);
    setShowModal(true);
  };

  const openEdit = (admin: any) => {
    setEditingAdmin(admin);
    setForm({
      name: admin.name ?? "",
      phone: admin.phone ?? "",
      department: admin.department || "General",
      access: {
        isSuper: !!admin.access?.isSuper,
        tabs: { ...(admin.access?.tabs ?? {}) },
      },
    });
    setExpanded([]);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingAdmin) {
        // Phone is not editable and the API rejects unknown fields.
        const { phone, ...payload } = form;
        await updateAdmin.mutateAsync({ adminId: editingAdmin.id, payload });
        toast.success("Access updated");
      } else {
        await createAdmin.mutateAsync(form);
        toast.success("Admin created");
      }
      setShowModal(false);
    } catch (error: any) {
      // A refused rail (last Super Admin, self-demotion) comes back as a 400
      // with a specific message worth showing instead of a generic failure.
      const message = error?.response?.data?.message;
      if (error?.response?.status !== 403) {
        toast.error(message || (editingAdmin ? "Failed to update admin" : "Failed to create admin"));
      }
    }
  };

  const handleApprove = async (admin: any) => {
    try {
      await updateStatus.mutateAsync({ userId: admin.id, action: "approve" });
      toast.success(`Admin ${admin.phone || admin.name} approved`);
    } catch {
      toast.error("Failed to approve admin");
    }
  };

  const handleDelete = async (admin: any) => {
    if (!window.confirm(`Remove admin "${admin.name}"? They lose access immediately.`)) return;
    try {
      await deleteAdmin.mutateAsync(admin.id);
      toast.success("Admin removed");
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (error?.response?.status !== 403) toast.error(message || "Failed to remove admin");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading admins…</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-2xl text-foreground">Admin Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {admins.length} admin {admins.length === 1 ? "user" : "users"}
            </p>
          </div>
          {isSuper && (
            <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
              Add Admin
            </Button>
          )}
        </div>

        <div className="max-w-sm">
          <Input
            placeholder="Search admins…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  {["Admin", "Phone", "Access", "Department", "Created", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      No admins found
                    </td>
                  </tr>
                ) : (
                  filtered.map((admin: any, i: number) => {
                    const access: AdminAccess = admin.access ?? { isSuper: true, tabs: {} };
                    const granted = countGrantedTabs(access);
                    return (
                      <motion.tr
                        key={admin.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-accent/30 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-9 w-9 rounded-full flex items-center justify-center",
                                access.isSuper ? "bg-purple-500/10" : "bg-primary/10",
                              )}
                            >
                              {access.isSuper ? (
                                <Crown className="h-4 w-4 text-purple-500" />
                              ) : (
                                <Shield className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-foreground">
                                {admin.name ?? "—"}
                              </div>
                              <div className="font-mono text-[10px] text-muted-foreground truncate max-w-[140px]">
                                {admin.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm font-mono text-muted-foreground text-center">
                          {admin.phone ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-center">
                          {access.isSuper ? (
                            <Badge variant="purple">Super Admin</Badge>
                          ) : granted === 0 ? (
                            <Badge>No access</Badge>
                          ) : (
                            <Badge variant="info">
                              {granted} {granted === 1 ? "section" : "sections"}
                            </Badge>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center text-sm text-muted-foreground">
                          {admin.department || "—"}
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground text-center">
                          {admin.createdAt
                            ? new Date(admin.createdAt).toLocaleDateString("en-IN")
                            : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-1">
                            {admin.status === "PENDING" && isSuper && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleApprove(admin)}
                                title="Approve Admin"
                              >
                                <UserCheck className="h-3.5 w-3.5 text-green-500" />
                              </Button>
                            )}
                            {isSuper && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEdit(admin)}
                                  title="Edit access"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(admin)}
                                  title={
                                    admin.id === (currentUser as any)?.id
                                      ? "You cannot remove your own account"
                                      : "Remove admin"
                                  }
                                  disabled={admin.id === (currentUser as any)?.id}
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="max-w-2xl"
        title={editingAdmin ? `Edit ${form.name || "admin"}` : "Add Admin"}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Admin name"
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="10-digit phone"
              disabled={!!editingAdmin}
            />
          </div>
          <Input
            label="Department"
            value={form.department}
            onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            placeholder="e.g. Sales, Operations, Content"
          />

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Access</label>

            <button
              type="button"
              disabled={editingSelf && formAccess.isSuper}
              onClick={() =>
                setForm((f) => ({ ...f, access: { ...f.access, isSuper: !f.access.isSuper } }))
              }
              title={
                editingSelf && formAccess.isSuper
                  ? "You cannot remove your own Super Admin access"
                  : undefined
              }
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3",
                formAccess.isSuper
                  ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900/40"
                  : "bg-muted/30 border-transparent hover:border-border",
                editingSelf && formAccess.isSuper && "opacity-70 cursor-not-allowed",
              )}
            >
              <div
                className={cn(
                  "h-4 w-4 mt-0.5 rounded border flex items-center justify-center flex-shrink-0",
                  formAccess.isSuper ? "bg-purple-600 border-purple-600" : "border-border",
                )}
              >
                {formAccess.isSuper && <span className="text-white text-[10px] leading-none">✓</span>}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Super Admin</div>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  Every section, including any added later, and the ability to grant access to
                  others.
                  {editingSelf && formAccess.isSuper
                    ? " You cannot remove this from your own account."
                    : ""}
                </p>
              </div>
            </button>

            {!formAccess.isSuper && (
              <div className="mt-3 space-y-1.5">
                {groups.map((group) => {
                  const level = groupLevel(formAccess, group);
                  const isOpen = expanded.includes(group.key);
                  return (
                    <div key={group.key} className="rounded-xl border border-border/60">
                      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded((e) =>
                              isOpen ? e.filter((k) => k !== group.key) : [...e, group.key],
                            )
                          }
                          className="flex items-center gap-2 min-w-0 text-left"
                        >
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 text-muted-foreground transition-transform flex-shrink-0",
                              isOpen && "rotate-90",
                            )}
                          />
                          <span className="text-sm font-medium text-foreground whitespace-nowrap">
                            {group.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {level === null
                              ? "mixed"
                              : `${group.tabs.length} ${group.tabs.length === 1 ? "tab" : "tabs"}`}
                          </span>
                        </button>
                        <LevelPicker
                          value={level}
                          options={optionsFor(group)}
                          onChange={(next) => setGroup(group, next)}
                        />
                      </div>

                      {/* Say plainly what the chosen level allows, rather than
                          leaving "partial" to interpretation. */}
                      {level === "partial" && group.partialMeans && (
                        <p className="px-3 pb-2.5 -mt-1 text-[11px] text-muted-foreground">
                          {group.partialMeans}
                        </p>
                      )}
                      {level === "full" && (
                        <p className="px-3 pb-2.5 -mt-1 text-[11px] text-muted-foreground">
                          {group.fullMeans}
                        </p>
                      )}

                      {isOpen && (
                        <div className="border-t border-border/50 divide-y divide-border/30">
                          {group.tabs.map((tab) => (
                            <div
                              key={tab.key}
                              className="flex items-center justify-between gap-3 px-3 py-2 pl-8"
                            >
                              <span className="text-xs text-muted-foreground truncate">
                                {tab.label}
                              </span>
                              <LevelPicker
                                size="sm"
                                value={levelFor(formAccess, tab.key)}
                                options={optionsFor(group)}
                                onChange={(next) => setTab(tab.key, next)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <p className="text-[11px] text-muted-foreground pt-1">
                  The Dashboard is always visible. Granting admin access always requires Super
                  Admin.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={createAdmin.isPending || updateAdmin.isPending}
            >
              {editingAdmin ? "Save access" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
