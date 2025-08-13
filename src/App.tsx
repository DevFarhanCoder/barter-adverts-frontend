// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import HowItWorks from "./components/HowItWorks";
import PricingPlans from "./components/PricingPlans";
import Marketplace from "./components/MarketPlace";
import { About } from "./components/About";
import UserDashboard from "./pages/UserDashboard";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./pages/SignIn";
import DashboardHome from "./pages/DashboardHome";
import Listings from "./pages/Listings";

// NEW: Admin imports
import AdminLayout from "./admin/AdminLayout";
import AdminOverview from "./admin/pages/AdminOverview";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminListings from "./admin/pages/AdminListings";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";

type UserRole = "advertiser" | "media_owner";

export interface Listing {
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

const queryClient = new QueryClient();
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function AppContent() {
  const [listings, setListings] = useState<Marketplace.Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<"All" | "Media Owners" | "Advertisers">("All");

  const location = useLocation();

  // UPDATED: also hide layout on /admin
  const hideLayout = ["/dashboard", "/login", "/admin"].some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/barters`);
        const data = await res.json();
        if (alive && Array.isArray(data)) setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings", error);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/pricing" element={<PricingPlans />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/marketplace"
          element={
            <Marketplace
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              listings={listings}
              setListings={setListings}
            />
          }
        />

        {/* Existing user dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="listings" element={<Listings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* NEW: admin routes */}
        <Route
          path="/admin"
          element={
            // optionally protect with a different guard if needed
            // <AdminRoute><AdminLayout /></AdminRoute>
            <AdminLayout />
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="listings" element={<AdminListings />} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

// Allow Marketplace to import the Listing type from here if needed
export namespace Marketplace {
  export type Listing = Listing;
}
