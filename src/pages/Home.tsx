import React from 'react'
import FeaturedOpportunities from '../components/FeaturedOpportunities'
import PricingPlans from '../components/PricingPlans'
import Hero from '../components/Hero'
import Testimonial from '../components/Testimonial'
import Features from '../components/Features'
import SuccessStories from '../components/SuccessStories'
import MediaTypes from '../components/MediaTypes'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Testimonial />
      <Features />
      <SuccessStories />
      <MediaTypes />
      <FeaturedOpportunities />
      <PricingPlans />
    </div>
  )
}

export default Home