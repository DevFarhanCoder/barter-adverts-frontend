import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';

import SignUp from './pages/SignUp';
import HowItWorks from './components/HowItWorks';
import PricingPlans from './components/PricingPlans';
import { Marketplace } from './components/MarketPlace';
import { About } from './components/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/marketplace" element={<Marketplace searchQuery={''} setSearchQuery={function (query: string): void {
            throw new Error('Function not implemented.');
          }} selectedFilter={''} setSelectedFilter={function (filter: string): void {
            throw new Error('Function not implemented.');
          }} listings={[]} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
