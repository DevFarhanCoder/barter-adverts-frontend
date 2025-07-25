import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

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
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/pricing" element={<PricingPlans />} />
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
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

