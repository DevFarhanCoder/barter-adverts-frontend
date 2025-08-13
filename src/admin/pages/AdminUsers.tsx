// src/admin/pages/AdminUsers.tsx
import { useEffect, useMemo, useState } from "react";
import { api } from "../../utils/api";

type Role = "all" | "user" | "admin";
type Status = "all" | "active" | "suspended";
type UType = "all" | "advertiser" | "media_owner";

type User = {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  userType: "advertiser" | "media_owner";
  role?: "user" | "admin";
  status?: "active" | "suspended";
  createdAt?: string;
};

export default function AdminUsers() {
  const [rows, setRows] = useState<User[]>([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<Role>("all");
  const [status, setStatus] = useState<Status>("all");
  const [uType, setUType] = useState<UType>("all");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "200");
      if (q.trim()) params.set("q", q.trim());
      if (role !== "all") params.set("role", role);
      if (status !== "all") params.set("status", status);
      if (uType !== "all") params.set("userType", uType);

      const r = await api.get<{ users: User[] }>(`/api/admin/users?${params.toString()}`);
      setRows(r.users);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, role, status, uType]);

  const changeStatus = async (id: string, to: "active" | "suspended") => {
    await api.patch(`/api/admin/users/${id}/status`, { status: to });
    setRows((prev) => prev.map((u) => (u._id === id ? { ...u, status: to } : u)));
  };

  const countText = useMemo(() => {
    const total = rows.length;
    return loading ? "Loading…" : `Showing ${total} user${total === 1 ? "" : "s"}`;
  }, [rows.length, loading]);

  return (
    <div className="w-full">
      {/* Header + Filters */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Users</h1>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users…"
            className="w-full sm:w-72 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by role"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by status"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={uType}
            onChange={(e) => setUType(e.target.value as UType)}
            className="rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by type"
          >
            <option value="all">All types</option>
            <option value="media_owner">Media Owner</option>
            <option value="advertiser">Advertiser</option>
          </select>
        </div>
      </div>

      <div className="mb-2 text-xs md:text-sm text-gray-600 dark:text-neutral-400">{countText}</div>

      {/* Responsive table wrapper */}
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <table className="min-w-[1000px] w-full text-sm md:text-base table-auto">
          <colgroup>
            <col /> {/* Name */}
            <col className="w-[260px]" /> {/* Email */}
            <col className="w-[160px]" /> {/* Phone */}
            <col className="w-[140px]" /> {/* Type */}
            <col className="w-[120px]" /> {/* Role */}
            <col className="w-[130px]" /> {/* Status */}
            <col className="w-[170px]" /> {/* Actions */}
          </colgroup>

          <thead className="bg-gray-50 dark:bg-neutral-900/60 border-b border-gray-200 dark:border-neutral-800">
            <tr className="[&>th]:py-3 [&>th]:px-4 [&>th]:text-left [&>th]:font-semibold text-gray-600 dark:text-neutral-300 uppercase tracking-wide text-xs md:text-sm">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="[&>tr:nth-child(even)]:bg-gray-50/60 dark:[&>tr:nth-child(even)]:bg-neutral-900/50">
            {rows.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-gray-100/80 dark:hover:bg-neutral-800/70 transition-colors border-b border-gray-100 dark:border-neutral-800"
              >
                <td className="px-4 py-3 font-medium">
                  {u.firstName} {u.lastName || ""}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-neutral-300">{u.email}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-neutral-300">{u.phone || "—"}</td>
                <td className="px-4 py-3 capitalize">{u.userType.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs md:text-sm " +
                      (u.role === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white")
                    }
                  >
                    {u.role || "user"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs md:text-sm " +
                      (u.status === "suspended"
                        ? "bg-rose-600 text-white"
                        : "bg-emerald-600 text-white")
                    }
                  >
                    {u.status || "active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  {/* Professional destructive/restore button */}
                  {u.status === "suspended" ? (
                    <button
                      onClick={() => changeStatus(u._id, "active")}
                      className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs md:text-sm font-medium shadow-sm bg-emerald-600 text-white hover:bg-emerald-500"
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => changeStatus(u._id, "suspended")}
                      className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs md:text-sm font-medium shadow-sm bg-rose-600 text-white hover:bg-rose-500"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-500 dark:text-neutral-400">
                  {loading ? "Loading…" : "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
