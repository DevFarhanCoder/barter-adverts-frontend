import StatCard from "./StatCard";
import { listings, trades } from "../data/mock";

export default function KPIGrid() {
  const totalListings = listings.length;
  const activeOffers = listings.filter((l: { status: string; }) => l.status === "active").length;
  const openRequests = trades.filter((t: { status: string; }) => ["proposed","countered"].includes(t.status)).length;
  const verifiedUsers = 575; // placeholder

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Listings" value={totalListings} delta={{ value: 12, trend: "up" }} />
      <StatCard title="Active Offers" value={activeOffers} delta={{ value: 8, trend: "up" }} />
      <StatCard title="Open Requests" value={openRequests} delta={{ value: 5, trend: "down" }} />
      <StatCard title="Verified Users" value={verifiedUsers} delta={{ value: 3, trend: "up", caption: "vs 20d" }} />
    </div>
  );
}
