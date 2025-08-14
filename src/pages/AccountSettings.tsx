// src/pages/AccountSettings.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

const API_BASE =
    (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

type BizRole = "advertiser" | "media_owner";
type AuthRole = "user" | "admin";

type AppUser = {
    _id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    phoneNumber?: string;
    companyName?: string;
    description?: string;
    role?: AuthRole;
    userType?: BizRole;
    [k: string]: any;
};

export default function AccountSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pwdSaving, setPwdSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [msg, setMsg] = useState<string | null>(null);

    const [user, setUser] = useState<AppUser | null>(null);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        description: "",
    });

    const [pwd, setPwd] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Load current user
    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Please sign in to view settings.");
                    setLoading(false);
                    return;
                }
                const res = await fetch(`${API_BASE}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data?.message || "Failed to load your profile");
                }
                const u: AppUser = data?.user || data;
                setUser(u);
                setForm({
                    firstName: u.firstName || "",
                    lastName: u.lastName || "",
                    email: u.email || "",
                    phoneNumber: u.phoneNumber || "",
                    companyName: u.companyName || "",
                    description: u.description || "",
                });
            } catch (err: any) {
                setError(err?.message || "Failed to load your profile");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    function updateField<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
        setForm((f) => ({ ...f, [key]: val }));
    }

    async function saveProfile(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setMsg(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not authenticated");

            const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
            const ct = res.headers.get("content-type") || "";
            const data = ct.includes("application/json") ? await res.json() : { message: await res.text() };
            if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);


            const updatedUser: AppUser = data?.user || data;
            setUser(updatedUser);

            // keep localStorage in sync so header/topbar updates immediately
            localStorage.setItem("ba_user", JSON.stringify(updatedUser));
            localStorage.setItem("user", JSON.stringify(updatedUser)); // if anything else reads this
            window.dispatchEvent(new Event("auth:changed"));

            setMsg("Profile updated successfully.");
        } catch (err: any) {
            setError(err?.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    }

    async function savePassword(e: React.FormEvent) {
        e.preventDefault();
        setPwdSaving(true);
        setError(null);
        setMsg(null);
        try {
            if (!pwd.currentPassword || !pwd.newPassword) {
                throw new Error("Please fill current and new password.");
            }
            if (pwd.newPassword !== pwd.confirmPassword) {
                throw new Error("New password and confirmation do not match.");
            }

            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not authenticated");

            const res = await fetch(`${API_BASE}/api/auth/password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: pwd.currentPassword,
                    newPassword: pwd.newPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Failed to update password");
            setMsg("Password updated successfully.");
            setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            setError(err?.message || "Failed to update password");
        } finally {
            setPwdSaving(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-56px)] bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h1>

                {loading ? (
                    <div className="p-4 rounded-xl bg-white shadow-sm">Loading your settings…</div>
                ) : error ? (
                    <div className="p-4 rounded-xl bg-white shadow-sm border border-rose-200 bg-rose-50 text-rose-700">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Alerts */}
                        {msg && (
                            <div className="mb-4 p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">
                                {msg}
                            </div>
                        )}

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Profile Card */}
                            <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Profile</h2>
                                <form onSubmit={saveProfile} className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">First name</label>
                                            <input
                                                className="w-full border rounded-lg px-3 py-2"
                                                value={form.firstName}
                                                onChange={(e) => updateField("firstName", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Last name</label>
                                            <input
                                                className="w-full border rounded-lg px-3 py-2"
                                                value={form.lastName}
                                                onChange={(e) => updateField("lastName", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Email</label>
                                            <input
                                                type="email"
                                                className="w-full border rounded-lg px-3 py-2"
                                                value={form.email}
                                                onChange={(e) => updateField("email", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Phone</label>
                                            <input
                                                className="w-full border rounded-lg px-3 py-2"
                                                value={form.phoneNumber}
                                                onChange={(e) => updateField("phoneNumber", e.target.value)}
                                                placeholder="+91XXXXXXXXXX"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Company</label>
                                        <input
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={form.companyName}
                                            onChange={(e) => updateField("companyName", e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">About</label>
                                        <textarea
                                            className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
                                            value={form.description}
                                            onChange={(e) => updateField("description", e.target.value)}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            {saving ? "Saving…" : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Role & Quick Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Account</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Auth role</span>
                                        <span className="font-medium">
                                            {(user?.role || "user").toString().toLowerCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Business role</span>
                                        <span className="font-medium">
                                            {(user?.userType || "advertiser").replace("_", " ")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email verified</span>
                                        <span className="font-medium">{user?.emailVerified ? "Yes" : "No"}</span>
                                    </div>
                                </div>

                                <div className="mt-6 border-t pt-4">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Password</h3>
                                    <form onSubmit={savePassword} className="space-y-2">
                                        <input
                                            type="password"
                                            className="w-full border rounded-lg px-3 py-2"
                                            placeholder="Current password"
                                            value={pwd.currentPassword}
                                            onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))}
                                        />
                                        <input
                                            type="password"
                                            className="w-full border rounded-lg px-3 py-2"
                                            placeholder="New password"
                                            value={pwd.newPassword}
                                            onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
                                            minLength={6}
                                        />
                                        <input
                                            type="password"
                                            className="w-full border rounded-lg px-3 py-2"
                                            placeholder="Confirm new password"
                                            value={pwd.confirmPassword}
                                            onChange={(e) => setPwd((p) => ({ ...p, confirmPassword: e.target.value }))}
                                            minLength={6}
                                        />
                                        <button
                                            type="submit"
                                            disabled={pwdSaving}
                                            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black disabled:opacity-60"
                                        >
                                            {pwdSaving ? "Updating…" : "Update Password"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Preferences (example) */}
                        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
                            <div className="space-y-3 text-sm">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                                    <span>Send me important updates by email</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="h-4 w-4" />
                                    <span>Show my profile to verified partners</span>
                                </label>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
