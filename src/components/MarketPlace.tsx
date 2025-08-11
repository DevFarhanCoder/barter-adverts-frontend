import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, MapPin, Star, Shield, User, X, Plus } from "lucide-react";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

type UserRole = "advertiser" | "media_owner";

interface Listing {
  _id?: string;
  ownerRole?: UserRole;  // preferred field saved by backend
  type?: string;         // legacy UI pill text ("Available Barters" | "Advertiser Request" | "Add Barter")
  title: string;
  location: string;
  rating: number;
  description: string;
  seeking: string;
  contact: string;
  verified: boolean;
  image?: string;
}

interface MarketplaceProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
}

const FILTERS = ["All", "Media Owners", "Advertisers"] as const;

// ---------- Robust role detection ----------
function decodeJwtRole(): UserRole | undefined {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const [, payload] = token.split(".");
    if (!payload) return;
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    const r = json?.role;
    if (r === "advertiser" || r === "media_owner") return r;
  } catch {}
}

function readRoleOnce(): UserRole {
  const r = localStorage.getItem("role");
  if (r === "advertiser" || r === "media_owner") return r;
  try {
    const user = JSON.parse(localStorage.getItem("ba_user") || "{}");
    const u = user?.role;
    if (u === "advertiser" || u === "media_owner") return u;
  } catch {}
  const jwt = decodeJwtRole();
  if (jwt) return jwt;
  return "advertiser";
}

/** Keeps role in state and reacts to login/logout across tabs. */
function useRole(): UserRole {
  const [role, setRole] = useState<UserRole>(() => readRoleOnce());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key || ["role", "ba_user", "token"].includes(e.key)) {
        setRole(readRoleOnce());
      }
    };
    const onAuthChanged = () => setRole(readRoleOnce());
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:changed", onAuthChanged as any);
    const t = setTimeout(() => setRole(readRoleOnce()), 0);
    return () => {
      clearTimeout(t);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:changed", onAuthChanged as any);
    };
  }, []);

  return role;
}

// ---------- Utils ----------
const debounce = (fn: (...args: any[]) => void, ms = 300) => {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

const SHOW_DEBUG = false; // flip to true to see counts + detected role

const Marketplace: React.FC<MarketplaceProps> = ({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  listings,
  setListings,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const currentRole = useRole();
  const isMediaOwner = currentRole === "media_owner";

  // Role-aware copy for the form & button
  const formCopy = isMediaOwner
    ? {
        modalTitle: "Add Inventory",
        primaryBtn: "Publish Inventory",
        addBtn: "Add Inventory",
        titlePh: "e.g., 12x8 ft hoarding near Jogeshwari Signal",
        locationPh: "e.g., Jogeshwari, Mumbai",
        descPh: "Size, format, dates available, audience reach…",
        seekingPh: "e.g., Cross‑promo, banner swap, services",
        contactPh: "Business email/phone",
        imagePh: "Public image URL (optional)",
        pillType: "Available Barters" as const,
      }
    : {
        modalTitle: "Post Campaign Need",
        primaryBtn: "Publish Need",
        addBtn: "Post Need",
        titlePh: "e.g., Launch promo for Instantly",
        locationPh: "e.g., Mumbai (Western line)",
        descPh: "Objective, timeline, audience, deliverables…",
        seekingPh: "e.g., Social shoutouts, services, product barter",
        contactPh: "Your email/phone",
        imagePh: "Creative reference URL (optional)",
        pillType: "Advertiser Request" as const,
      };

  const [newListing, setNewListing] = useState<Listing>({
    ownerRole: currentRole,
    title: "",
    location: "",
    rating: 4.5,
    description: "",
    seeking: "",
    contact: "",
    verified: true,
    image: "",
    type: formCopy.pillType,
  });

  // Default the tab based on role (once)
  useEffect(() => {
    setSelectedFilter(isMediaOwner ? "Advertisers" : "Media Owners");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep role/type fresh when modal opens or role changes
  useEffect(() => {
    if (showModal) {
      setNewListing((nl) => ({
        ...nl,
        ownerRole: currentRole,
        type: formCopy.pillType,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, currentRole]);

  // ---- Fetch listings (public) ----
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`${API_BASE}/api/barters`);
        const ct = res.headers.get("content-type") || "";
        const raw = ct.includes("application/json") ? await res.json() : await res.text();
        if (!res.ok)
          throw new Error(
            typeof raw === "string" ? raw : (raw as any)?.message || `API ${res.status}`
          );

        const arr = Array.isArray(raw) ? raw : [];
        const valid = arr.filter(
          (item: any) =>
            item &&
            typeof item.title === "string" &&
            typeof item.location === "string" &&
            typeof item.description === "string" &&
            typeof item.contact === "string"
        );
        if (alive) setListings(valid);
      } catch (e: any) {
        if (alive) setLoadError(e?.message || "Failed to fetch listings");
        console.error("Failed to fetch listings", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [setListings]);

  // ---- Add Listing (auth required) ----
  const handleAddListing = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add a listing.");
      return;
    }

    if (
      !newListing.title?.trim() ||
      !newListing.location?.trim() ||
      !newListing.description?.trim()
    ) {
      alert("Please fill Title, Location and Details.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Listing = {
        ...newListing,
        ownerRole: currentRole, // enforce role
        type: formCopy.pillType, // keep legacy pill for UI
      };

      const res = await fetch(`${API_BASE}/api/barters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : await res.text();

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("ba_user");
        localStorage.removeItem("role");
        return;
      }
      if (!res.ok) {
        console.error("Error saving listing", data);
        alert((data as any)?.message || "Failed to add listing");
        return;
      }

      setListings((prev) => [data as Listing, ...prev]);

      setShowModal(false);
      setNewListing({
        ownerRole: currentRole,
        title: "",
        location: "",
        rating: 4.5,
        description: "",
        seeking: "",
        contact: "",
        verified: true,
        image: "",
        type: formCopy.pillType,
      });

      setSelectedFilter(isMediaOwner ? "Advertisers" : "Media Owners");
    } catch (err) {
      console.error("Error posting listing", err);
      alert("Network error while adding listing");
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Search (debounced) ----
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const debounced = useRef(
    debounce((v: string) => {
      setSearchQuery(v);
    }, 300)
  ).current;

  useEffect(() => {
    debounced(internalSearch);
  }, [internalSearch, debounced]);

  // ---- Filter logic (ownerRole first, fallback to legacy type) ----
  const filteredListings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return listings
      .filter((l) => l && l.title)
      .filter((l) => {
        if (!q) return true;
        const hay = `${l.title} ${l.location} ${l.description} ${l.seeking}`.toLowerCase();
        return hay.includes(q);
      })
      .filter((l) => {
        if (selectedFilter === "All") return true;
        const role = l.ownerRole;
        if (selectedFilter === "Media Owners") {
          return role === "media_owner" || (l.type || "").toLowerCase().includes("available");
        }
        if (selectedFilter === "Advertisers") {
          return role === "advertiser" || /(advertiser|add\s*barter)/i.test(l.type || "");
        }
        return true;
      });
  }, [listings, searchQuery, selectedFilter]);

  // Debug counts (optional)
  const counts = useMemo(() => {
    const mo =
      listings.filter(
        (l) => l.ownerRole === "media_owner" || /available/i.test(l.type || "")
      ).length;
    const ad =
      listings.filter(
        (l) =>
          l.ownerRole === "advertiser" ||
          /advertiser|add\s*barter/i.test(l.type || "")
      ).length;
    return { total: listings.length, mo, ad };
  }, [listings]);

  return (
    <section id="marketplace" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-gray-900">Marketplace</h2>
            <p className="text-lg text-gray-600 mt-2">
              Discover barter deals and advertising opportunities.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors self-start"
          >
            <Plus className="w-4 h-4" />
            {isMediaOwner ? "Add Inventory" : "Post Need"}
          </button>
        </div>

        {/* Search + Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-lg w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for barters..."
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {SHOW_DEBUG && (
          <div className="text-xs text-gray-500 mb-4">
            You are: <b>{currentRole}</b> • Total: {counts.total} • Media Owners: {counts.mo} •{" "}
            Advertisers: {counts.ad}
          </div>
        )}

        {/* Loading / Error */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {loadError && !loading && (
          <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg mb-6">
            {loadError}
          </div>
        )}

        {/* Listings */}
        {!loading && !loadError && (
          <>
            {filteredListings.length === 0 ? (
              <div className="text-center text-gray-600 py-16">
                No results found. Try adjusting filters or search.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing, idx) => {
                  if (!listing || !listing.title) return null;

                  const pill =
                    listing.ownerRole === "media_owner"
                      ? { txt: "Media Owner", cls: "bg-green-100 text-green-800" }
                      : listing.ownerRole === "advertiser"
                      ? { txt: "Advertiser", cls: "bg-blue-100 text-blue-800" }
                      : (listing.type || "").toLowerCase().includes("available")
                      ? { txt: "Media Owner", cls: "bg-green-100 text-green-800" }
                      : { txt: listing.type || "Listing", cls: "bg-gray-100 text-gray-800" };

                  return (
                    <div
                      key={listing._id || idx}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="relative">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          {listing.image ? (
                            <img
                              src={listing.image}
                              alt={listing.title}
                              className="h-48 w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-gray-400 text-6xl">📷</div>
                          )}
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${pill.cls}`}>
                            {pill.txt}
                          </span>
                        </div>
                        {listing.verified && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Verified
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {listing.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{listing.location}</span>
                          <div className="flex items-center gap-1 ml-auto">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">
                              {listing.rating?.toFixed?.(1) ?? listing.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {listing.description}
                        </p>
                        {listing.seeking && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-500 mb-1">Seeking:</p>
                            <p className="text-sm text-gray-700">{listing.seeking}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 break-all">
                              {listing.contact}
                            </span>
                          </div>
                          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Role-aware Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold mb-2">{formCopy.modalTitle}</h3>
              <div className="text-sm text-gray-600 mb-3">
                You’re posting as{" "}
                <span className="font-medium">{isMediaOwner ? "Media Owner" : "Advertiser"}</span>.
              </div>

              <div className="grid gap-2">
                <input
                  className="w-full border rounded p-2"
                  placeholder={formCopy.titlePh}
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                />
                <input
                  className="w-full border rounded p-2"
                  placeholder={formCopy.locationPh}
                  value={newListing.location}
                  onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                />
                <textarea
                  className="w-full border rounded p-2"
                  placeholder={formCopy.descPh}
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                />
                <input
                  className="w-full border rounded p-2"
                  placeholder={formCopy.seekingPh}
                  value={newListing.seeking}
                  onChange={(e) => setNewListing({ ...newListing, seeking: e.target.value })}
                />
                <input
                  className="w-full border rounded p-2"
                  placeholder={formCopy.contactPh}
                  value={newListing.contact}
                  onChange={(e) => setNewListing({ ...newListing, contact: e.target.value })}
                />
                <input
                  className="w-full border rounded p-2"
                  placeholder={formCopy.imagePh}
                  value={newListing.image || ""}
                  onChange={(e) => setNewListing({ ...newListing, image: e.target.value })}
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddListing}
                  disabled={submitting}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-60"
                >
                  {submitting ? "Saving…" : formCopy.primaryBtn}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Marketplace;
