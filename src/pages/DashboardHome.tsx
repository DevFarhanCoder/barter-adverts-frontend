import { useEffect, useState } from "react";
import EngagementRow from "../components/dashboard/EngagementRow";
import TopCategories from "../components/dashboard/TopCategories";
import KPIGrid from "../components/dashboard/KPIGrid";

// Example: import or define bartersQ here
// Replace this with your actual data fetching logic or hook
const bartersQ = { data: [] };

export default function DashboardHome() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (bartersQ.data) {
      setListings(bartersQ.data);
    }
  }, [bartersQ.data]);

  return (
    <div className="space-y-6">
      <KPIGrid listings={listings} />
      <EngagementRow listings={listings} />
      <TopCategories listings={listings} /> {/* ✅ use listings here */}
    </div>
  );
}
