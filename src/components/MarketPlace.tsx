import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, MapPin, Star, Shield, User, X, Plus } from "lucide-react";
import { UserRole } from "../types"; // adjust path as needed

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

interface Listing {
  _id?: string;
  ownerRole?: UserRole;
  type?: string;
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

function readRoleOnce(): UserRole | undefined {
  const r = localStorage.getItem("role");
  if (r === "advertiser" || r === "media_owner") return r as UserRole;
  try {
    const user = JSON.parse(localStorage.getItem("ba_user") || "{}");
    const u = user?.role;
    if (u === "advertiser" || u === "media_owner") return u as UserRole;
  } catch {}
  const jwt = decodeJwtRole();
  if (jwt) return jwt;
}

function useRole(): UserRole {
  const [role, setRole] = useState<UserRole>(() => readRoleOnce() || "advertiser");

  useEffect(() => {
    async function fetchRoleFromServer() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.role === "advertiser" || data?.role === "media_owner") {
            localStorage.setItem("role", data.role);
            setRole(data.role);
          }
        }
      } catch (err) {
        console.error("Failed to fetch role from server", err);
      }
    }

    fetchRoleFromServer();

    const onStorage = () => setRole(readRoleOnce() || "advertiser");
    const onAuthChanged = () => setRole(readRoleOnce() || "advertiser");

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:changed", onAuthChanged as any);
    return () => {
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

const SHOW_DEBUG = false;

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

  const formCopy = isMediaOwner
    ? {
        modalTitle: "Add Inventory",
        primaryBtn: "Publish Inventory",
        addBtn: "Add Inventory",
        titlePh: "e.g., 12x8 ft hoarding near Jogeshwari Signal",
        locationPh: "e.g., Jogeshwari, Mumbai",
        descPh: "Size, format, dates available, audience reach…",
        seekingPh: "e.g., Cross-promo, banner swap, services",
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

  useEffect(() => {
    setSelectedFilter("All");
  }, [setSelectedFilter]);

  useEffect(() => {
    if (showModal) {
      setNewListing((nl) => ({
        ...nl,
        ownerRole: currentRole,
        type: formCopy.pillType,
      }));
    }
  }, [showModal, currentRole, formCopy.pillType]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`${API_BASE}/api/barters`);
        const ct = res.headers.get("content-type") || "";
        const raw = ct.includes("application/json") ? await res.json() : await res.text();
        if (!res.ok) throw new Error(typeof raw === "string" ? raw : raw?.message || `API ${res.status}`);
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
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [setListings]);

  const handleAddListing = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add a listing.");
      return;
    }
    if (!newListing.title?.trim() || !newListing.location?.trim() || !newListing.description?.trim()) {
      alert("Please fill Title, Location and Details.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Listing = {
        ...newListing,
        ownerRole: currentRole,
        type: formCopy.pillType,
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
        localStorage.clear();
        return;
      }
      if (!res.ok) {
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
      setSelectedFilter("All");
    } catch {
      alert("Network error while adding listing");
    } finally {
      setSubmitting(false);
    }
  };

  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const debounced = useRef(debounce((v: string) => setSearchQuery(v), 300)).current;
  useEffect(() => {
    debounced(internalSearch);
  }, [internalSearch, debounced]);

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
          return role === "advertiser" || /(advertiser|add\s*barter)/i.test(l.type || "");
        }
        return true;
      });
  }, [listings, searchQuery, selectedFilter]);

  // Minimal placeholder render to fix the error
  return (
    <div>
      {/* TODO: Replace this placeholder with your actual component UI */}
      <h2>Marketplace Component</h2>
      {loading && <div>Loading...</div>}
      {loadError && <div style={{ color: "red" }}>{loadError}</div>}
      <ul>
        {filteredListings.map((listing, idx) => (
          <li key={listing._id || idx}>
            <strong>{listing.title}</strong> - {listing.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Marketplace;
