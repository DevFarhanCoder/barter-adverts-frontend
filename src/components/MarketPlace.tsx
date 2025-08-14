// src/components/MarketPlace.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapPin, Plus, Search, Shield, Star, User, X } from "lucide-react";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

type BizRole = "advertiser" | "media_owner";

interface Listing {
  _id?: string;
  ownerRole?: BizRole;
  type?: string; // legacy UI label
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
  setSearchQuery: (v: string) => void;
  selectedFilter: string;
  setSelectedFilter: (v: string) => void;
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
}

const FILTERS = ["All", "Media Owners", "Advertisers"] as const;

// ---------- role helpers ----------
function coerceBizRole(v: any): BizRole | null {
  if (!v) return null;
  const s = String(v).toLowerCase();
  if (s === "advertiser" || s === "media_owner") return s;
  if (s === "media_owners") return "media_owner";
  if (s === "advertisers") return "advertiser";
  return null;
}

function readBizRole(): BizRole {
  try {
    const u =
      JSON.parse(localStorage.getItem("ba_user") || "null") ||
      JSON.parse(localStorage.getItem("user") || "null");
    const ut = coerceBizRole(u?.userType);
    if (ut) return ut;
  } catch {}
  // fallback: infer from role if someone stored it wrong
  const r = coerceBizRole(localStorage.getItem("role"));
  return r || "advertiser";
}

function useBizRole() {
  const [role, setRole] = useState<BizRole>(() => readBizRole());
  useEffect(() => {
    const sync = () => setRole(readBizRole());
    window.addEventListener("auth:changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return role;
}

// ---------- utils ----------
const debounce = (fn: (...args: any[]) => void, ms = 300) => {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

const Marketplace: React.FC<MarketplaceProps> = ({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  listings,
  setListings,
}) => {
  const bizRole = useBizRole(); // "advertiser" | "media_owner"
  const isMO = bizRole === "media_owner";

  // `?view=` preselects filter after a switch
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const v = params.get("view");
    if (v === "media_owner") setSelectedFilter("Media Owners");
    else if (v === "advertiser") setSelectedFilter("Advertisers");
    else setSelectedFilter("All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Copy for modal & button
  const copy = isMO
    ? {
        addBtn: "Add Inventory",
        modalTitle: "Add Inventory",
        primary: "Publish Inventory",
        titlePh: "e.g., 12x8 ft hoarding near Jogeshwari Signal",
        locationPh: "e.g., Jogeshwari, Mumbai",
        descPh: "Size, format, dates available, audience reach…",
        seekingPh: "e.g., Cross-promo, banner swap, services",
        contactPh: "Business email/phone",
        imagePh: "Public image URL (optional)",
        pillType: "Available Barters",
      }
    : {
        addBtn: "Post Need",
        modalTitle: "Post Campaign Need",
        primary: "Publish Need",
        titlePh: "e.g., Launch promo for Instantly",
        locationPh: "e.g., Mumbai (Western line)",
        descPh: "Objective, timeline, audience, deliverables…",
        seekingPh: "e.g., Social shoutouts, services, product barter",
        contactPh: "Your email/phone",
        imagePh: "Creative reference URL (optional)",
        pillType: "Advertiser Request",
      };

  // UI state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Listing form
  const [newListing, setNewListing] = useState<Listing>({
    ownerRole: bizRole,
    title: "",
    location: "",
    rating: 4.5,
    description: "",
    seeking: "",
    contact: "",
    verified: true,
    image: "",
    type: copy.pillType,
  });

  // keep form aligned to current role when opening / role changes
  useEffect(() => {
    if (!showModal) return;
    setNewListing((nl) => ({
      ...nl,
      ownerRole: bizRole,
      type: copy.pillType,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bizRole, showModal]);

  // Fetch listings (public)
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`${API_BASE}/api/barters`);
        const ct = res.headers.get("content-type") || "";
        const raw = ct.includes("application/json") ? await res.json() : await res.text();
        if (!res.ok) throw new Error(typeof raw === "string" ? raw : (raw as any)?.message || `API ${res.status}`);
        const arr = Array.isArray(raw) ? raw : [];
        const valid = arr.filter(
          (i: any) =>
            i &&
            typeof i.title === "string" &&
            typeof i.location === "string" &&
            typeof i.description === "string" &&
            typeof i.contact === "string"
        );
        if (alive) setListings(valid);
      } catch (e: any) {
        if (alive) setLoadError(e?.message || "Failed to fetch listings");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [setListings]);

  // Add listing (auth)
  const handleAddListing = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add a listing.");
      return;
    }

    if (!newListing.title.trim() || !newListing.location.trim() || !newListing.description.trim()) {
      alert("Please fill Title, Location and Details.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Listing = {
        ...newListing,
        ownerRole: bizRole,
        type: copy.pillType,
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
      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("ba_user");
        localStorage.removeItem("role");
        return;
      }
      if (!res.ok) {
        alert(data?.message || "Failed to add listing");
        return;
      }

      setListings((prev) => [data as Listing, ...prev]);
      setShowModal(false);
      setNewListing({
        ownerRole: bizRole,
        title: "",
        location: "",
        rating: 4.5,
        description: "",
        seeking: "",
        contact: "",
        verified: true,
        image: "",
        type: copy.pillType,
      });
      // After posting, auto-focus opposite side to encourage matches
      setSelectedFilter(isMO ? "Advertisers" : "Media Owners");
    } catch (err) {
      alert("Network error while adding listing");
    } finally {
      setSubmitting(false);
    }
  };

  // search debounce
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const debounced = useRef(
    debounce((v: string) => setSearchQuery(v), 300)
  ).current;
  useEffect(() => {
    debounced(internalSearch);
  }, [internalSearch, debounced]);

  // Filters
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
        const t = (l.type || "").toLowerCase();

        if (selectedFilter === "Media Owners") {
          return role === "media_owner" || /available|add\s*barter/.test(t);
        }
        if (selectedFilter === "Advertisers") {
          return role === "advertiser" || /advertiser/.test(t);
        }
        return true;
      });
  }, [listings, searchQuery, selectedFilter]);

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
            {copy.addBtn}
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
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === f
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

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
                    <div key={listing._id || idx} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          {listing.image ? (
                            <img src={listing.image} alt={listing.title} className="h-48 w-full object-cover" loading="lazy" />
                          ) : (
                            <div className="text-gray-400 text-6xl">📷</div>
                          )}
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${pill.cls}`}>{pill.txt}</span>
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{listing.location}</span>
                          <div className="flex items-center gap-1 ml-auto">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{listing.rating?.toFixed?.(1) ?? listing.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{listing.description}</p>
                        {listing.seeking && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-500 mb-1">Seeking:</p>
                            <p className="text-sm text-gray-700">{listing.seeking}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 break-all">{listing.contact}</span>
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold mb-2">{copy.modalTitle}</h3>
              <div className="text-sm text-gray-600 mb-3">
                You’re posting as <span className="font-medium">{isMO ? "Media Owner" : "Advertiser"}</span>.
              </div>

              <div className="grid gap-2">
                <input
                  className="w-full border rounded p-2"
                  placeholder={copy.titlePh}
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                />
                <input
                  className="w-full border rounded p-2"
                  placeholder={copy.locationPh}
                  value={newListing.location}
                  onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                />
                <textarea
                  className="w-full border rounded p-2"
                  placeholder={copy.descPh}
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                />
                <input
                  className="w-full border rounded p-2"
                  placeholder={copy.seekingPh}
                  value={newListing.seeking}
                  onChange={(e) => setNewListing({ ...newListing, seeking: e.target.value })}
                />
                <input
                  className="w-full border rounded p-2"
                  placeholder={copy.contactPh}
                  value={newListing.contact}
                  onChange={(e) => setNewListing({ ...newListing, contact: e.target.value })}
                />
                <input
                  className="w-full border rounded p-2"
                  placeholder={copy.imagePh}
                  value={newListing.image || ""}
                  onChange={(e) => setNewListing({ ...newListing, image: e.target.value })}
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleAddListing}
                  disabled={submitting}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-60"
                >
                  {submitting ? "Saving…" : copy.primary}
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
