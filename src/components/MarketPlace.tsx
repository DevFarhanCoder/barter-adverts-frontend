// src/pages/MarketPlace.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Plus, Search, Shield, Star, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* -------------------------- Types & utils -------------------------- */

type BizRole = "advertiser" | "media_owner";

type Listing = {
  _id?: string;
  title: string;
  description?: string;
  location?: string;
  image?: string;
  rating?: number;
  verified?: boolean;
  seeking?: string;

  /** WhatsApp phone number for contact (E.164 or digits) */
  contactPhone?: string;

  /** role flags */
  ownerRole?: BizRole;      // frontend name
  postedByType?: BizRole;   // backend name - normalized to ownerRole
};

const RAW_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "";
const API_BASE = String(RAW_BASE || "").replace(/\/+$/, "") || "";

/** Debounce helper */
const debounce = (fn: (...args: any[]) => void, ms = 300) => {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

function coerceBizRole(v: any): BizRole | null {
  if (!v) return null;
  const s = String(v).toLowerCase().trim();
  if (s === "advertiser" || s === "advertisers") return "advertiser";
  if (s === "media_owner" || s === "mediaowners" || s === "media owners" || s === "media_owners")
    return "media_owner";
  return null;
}

/** Read the logged-in user's role from localStorage (fallback advertiser) */
function readUserRole(): BizRole {
  try {
    const u =
      JSON.parse(localStorage.getItem("ba_user") || "null") ||
      JSON.parse(localStorage.getItem("user") || "null");
    const ut = coerceBizRole(u?.userType);
    if (ut) return ut;
  } catch { /* ignore */ }
  const r = coerceBizRole(localStorage.getItem("role"));
  return r || "advertiser";
}

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

function useUserRole() {
  const [role, setRole] = useState<BizRole>(() => readUserRole());
  useEffect(() => {
    const sync = () => setRole(readUserRole());
    window.addEventListener("auth:changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return role;
}

/** Normalize server item fields into a consistent Listing */
function normalizeItem(raw: any): Listing {
  const role: BizRole | null =
    coerceBizRole(raw?.ownerRole) || coerceBizRole(raw?.postedByType);

  // Contact phone can arrive with various names; normalize to contactPhone
  const contactPhone =
    raw?.contactPhone ||
    raw?.contact ||
    raw?.phoneNumber ||
    raw?.phone ||
    "";

  return {
    _id: raw?._id || raw?.id,
    title: String(raw?.title || "").trim(),
    description: raw?.description || "",
    location: raw?.location || "",
    image: raw?.image || "",
    rating: Number.isFinite(raw?.rating) ? Number(raw?.rating) : 4.5,
    verified: Boolean(raw?.verified),
    seeking: raw?.seeking || "",
    contactPhone: String(contactPhone || ""),
    ownerRole: (role || undefined) as any,
  };
}

/** Convert a phone to digits for https://wa.me/<digits> */
function toWaDigits(raw: string) {
  return String(raw || "").replace(/[^\d]/g, "");
}

/* ------------------------- Component ------------------------- */

const FILTERS = ["All", "Media Owners", "Advertisers"] as const;
type FilterTab = (typeof FILTERS)[number];

export default function MarketPlace() {
  const navigate = useNavigate();
  const userRole = useUserRole();

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>("All");

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);        // create listing modal
  const [showAuthPrompt, setShowAuthPrompt] = useState(false); // auth popup
  const [submitting, setSubmitting] = useState(false);
  const [newListing, setNewListing] = useState<Listing>({
    title: "",
    description: "",
    location: "",
    image: "",
    rating: 4.5,
    verified: true,
    seeking: "",
    contactPhone: "",
    ownerRole: userRole,
  });

  /* ---------- fetch listings ---------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setLoadErr(null);
      try {
        const res = await fetch(`${API_BASE}/api/barters`);
        const ct = res.headers.get("content-type") || "";
        const body = ct.includes("application/json")
          ? await res.json()
          : await res.text();

        if (!res.ok) {
          throw new Error(
            typeof body === "string" ? body : body?.message || `HTTP ${res.status}`
          );
        }

        // backend may return { barters: [...] } or raw array
        const arr = Array.isArray(body)
          ? body
          : Array.isArray((body as any)?.barters)
          ? (body as any).barters
          : [];
        const normalized = arr.map(normalizeItem);
        if (alive) setListings(normalized);
      } catch (e: any) {
        if (alive) setLoadErr(e?.message || "Failed to fetch listings");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ---------- create listing ---------- */
  const onCreate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // defensive check (shouldn’t happen because we gate the modal)
      setShowModal(false);
      setShowAuthPrompt(true);
      return;
    }
    if (
      !newListing.title.trim() ||
      !newListing.location?.trim() ||
      !newListing.description?.trim()
    ) {
      alert("Please fill Title, Location and Description.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...newListing,
        ownerRole: userRole, // keep consistent with the logged in user
        // also send common aliases to support older backends
        contactPhone: newListing.contactPhone,
        contact: newListing.contactPhone,
        phoneNumber: newListing.contactPhone,
      };
      const res = await fetch(`${API_BASE}/api/barters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || `Failed (${res.status})`);
      }

      // backend may return { barter } or the doc directly
      const created = normalizeItem((data as any)?.barter ?? data);
      setListings((prev) => [created, ...prev]);
      setShowModal(false);
      setNewListing({
        title: "",
        description: "",
        location: "",
        image: "",
        rating: 4.5,
        verified: true,
        seeking: "",
        contactPhone: "",
        ownerRole: userRole,
      });
    } catch (e: any) {
      alert(e?.message || "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- search (debounced) ---------- */
  const [internalSearch, setInternalSearch] = useState(search);
  const debounced = useRef(
    debounce((v: string) => setSearch(v), 300)
  ).current;
  useEffect(() => {
    debounced(internalSearch);
  }, [internalSearch, debounced]);

  /* ---------- filtering ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return listings
      .filter((l) => l && l.title) // sane data
      .filter((l) => {
        if (!q) return true;
        const hay = `${l.title} ${l.location || ""} ${l.description || ""} ${
          l.seeking || ""
        }`.toLowerCase();
        return hay.includes(q);
      })
      .filter((l) => {
        if (selectedFilter === "All") return true;
        if (selectedFilter === "Media Owners") return l.ownerRole === "media_owner";
        if (selectedFilter === "Advertisers") return l.ownerRole === "advertiser";
        return true;
      });
  }, [listings, search, selectedFilter]);

  /* ---------- gated “Add / Post Need” click ---------- */
  const handleOpenCreate = () => {
    if (!isAuthenticated()) {
      setShowAuthPrompt(true);
      return;
    }
    setShowModal(true);
  };

  /* ------------------------------ UI ------------------------------ */

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        <h1 className="text-3xl font-semibold text-gray-900">Marketplace</h1>
        <p className="text-gray-500 mt-1">
          Discover barter deals and advertising opportunities.
        </p>

        {/* Search */}
        <div className="mt-6 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          <input
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            placeholder="Search for barters…"
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center gap-2">
          {FILTERS.map((f) => {
            const active = f === selectedFilter;
            return (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1.5 rounded-lg border text-sm ${
                  active
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            );
          })}

          <div className="flex-1" />

          {/* Add button (role-aware label) */}
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            {userRole === "media_owner" ? "Add Inventory" : "Post Need"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-gray-500">Loading…</div>
        ) : loadErr ? (
          <div className="text-red-500">{loadErr}</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            No results found. Try adjusting filters or search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((l) => {
              const wa = l.contactPhone && toWaDigits(l.contactPhone);
              const hasWa = !!(wa && wa.length >= 8);
              return (
                <article
                  key={l._id || `${l.title}-${Math.random()}`}
                  className="rounded-xl border bg-white overflow-hidden hover:shadow-sm transition"
                >
                  {l.image ? (
                    <img
                      src={l.image}
                      alt={l.title}
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gray-100 grid place-items-center text-gray-400">
                      No image
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        {l.ownerRole === "media_owner" ? "Media Owner" : "Advertiser"}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <span className="text-sm text-gray-700">
                          {l.rating ?? 4.5}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {l.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-1 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{l.location || "—"}</span>
                    </div>

                    {l.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {l.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-green-700">
                        {l.verified ? (
                          <>
                            <Shield className="w-4 h-4 text-green-600" />
                            Verified
                          </>
                        ) : (
                          <>
                            <User className="w-4 h-4 text-gray-400" />
                            Unverified
                          </>
                        )}
                      </div>

                      {hasWa ? (
                        <a
                          href={`https://wa.me/${wa}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-sm"
                        >
                          Contact
                        </a>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1.5 rounded-lg text-sm bg-gray-300 text-gray-500 cursor-not-allowed"
                          title="No WhatsApp number provided"
                        >
                          No Contact
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Create listing modal (only when authenticated) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold mb-2">
              {userRole === "media_owner" ? "Add Inventory" : "Post Need"}
            </h3>

            {/* Posting as … */}
            <p className="text-sm text-gray-500 mb-4">
              You are posting as{" "}
              <span className="font-medium">
                {userRole === "media_owner" ? "Media Owner" : "Advertiser"}
              </span>.
            </p>

            <div className="space-y-3">
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Title"
                value={newListing.title}
                onChange={(e) =>
                  setNewListing((p) => ({ ...p, title: e.target.value }))
                }
              />
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Location"
                value={newListing.location || ""}
                onChange={(e) =>
                  setNewListing((p) => ({ ...p, location: e.target.value }))
                }
              />
              <textarea
                className="w-full border rounded-lg px-3 py-2"
                rows={4}
                placeholder="Description"
                value={newListing.description || ""}
                onChange={(e) =>
                  setNewListing((p) => ({ ...p, description: e.target.value }))
                }
              />
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Image URL (optional)"
                value={newListing.image || ""}
                onChange={(e) =>
                  setNewListing((p) => ({ ...p, image: e.target.value }))
                }
              />

              {/* WhatsApp phone input */}
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="WhatsApp phone (incl. country code, e.g., +91XXXXXXXXXX)"
                value={newListing.contactPhone || ""}
                onChange={(e) =>
                  setNewListing((p) => ({ ...p, contactPhone: e.target.value }))
                }
              />
              <p className="text-xs text-gray-500 -mt-2">
                This number is used for the Contact button (opens WhatsApp).
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={onCreate}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
                disabled={submitting}
              >
                {submitting
                  ? "Publishing…"
                  : userRole === "media_owner"
                  ? "Publish Inventory"
                  : "Publish Need"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth required popup */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold mb-2">Sign in required</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please sign in or create an account to post on the marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  navigate("/login", { replace: false });
                }}
                className="flex-1 px-4 py-2 rounded-lg border text-gray-800 hover:bg-gray-50"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  navigate("/signup", { replace: false });
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
