import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import HowItWorks from './components/HowItWorks';
import PricingPlans from './components/PricingPlans';
import Marketplace from './components/MarketPlace';
import { About } from './components/About';
import UserDashboard from './pages/UserDashboard';
import PrivateRoute from './components/PrivateRoute';
import SignIn from './pages/SignIn';
import DashboardHome from './pages/DashboardHome';
import AppointmentTable from './components/AppointmentTable';

interface Listing {
  id: number;
  type: string;
  title: string;
  location: string;
  rating: number;
  description: string;
  seeking: string;
  contact: string;
  verified: boolean;
  image: string;
}

function AppContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const location = useLocation();

  // Hide header and footer for dashboard and login pages
  const hideLayout = ['/dashboard', '/login'].some(path =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('https://barter-adverts-backend.onrender.com/api/barters');
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch listings', error);
      }
    };
    fetchListings();
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
        <Route path="/signin" element={<SignIn />} />
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
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="appointments" element={<AppointmentTable />} />
          {/* Add more nested routes as needed */}
        </Route>

      </Routes>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
