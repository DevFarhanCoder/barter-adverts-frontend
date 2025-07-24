import React from 'react'
import Header from '../components/Header'
import FeaturedOpportunities from '../components/FeaturedOpportunities'
import HowItWorks from '../components/HowItWorks'
import PricingPlans from '../components/PricingPlans'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <FeaturedOpportunities />
      <HowItWorks />
      <PricingPlans />
      <Footer />
    </div>
  )
}

export default Home