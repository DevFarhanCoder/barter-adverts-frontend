import Header from './components/Header';
import Hero from './components/Hero';
import Testimonial from './components/Testimonial';
import Features from './components/Features';
import SuccessStories from './components/SuccessStories';
import MediaTypes from './components/MediaTypes';
import FeaturedOpportunities from './components/FeaturedOpportunities';
import HowItWorks from './components/HowItWorks';
import PricingPlans from './components/PricingPlans';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Testimonial />
      <Features />
      <SuccessStories />
      <MediaTypes />
      <FeaturedOpportunities />
      <HowItWorks />
      <PricingPlans />
      <Footer />
    </div>
  );
}

export default App;