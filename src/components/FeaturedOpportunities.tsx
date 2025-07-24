import React, { useState, useEffect } from 'react'
import { MapPin, Users, Star } from 'lucide-react'

type Opportunity = {
  id: string
  title: string
  description: string
  category: string
  location: string
  followers_count: number
  price_range: string
}

const dummyOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Instagram Influencer Deal',
    description: 'Reach 50K+ followers through a verified influencer.',
    category: 'Influencer Marketing',
    location: 'Mumbai',
    followers_count: 52000,
    price_range: '₹15,000 - ₹25,000',
  },
  {
    id: '2',
    title: 'FM Radio Spot - Mumbai',
    description: '30-sec ad slots on 93.5 Red FM for 1 week.',
    category: 'Audio Advertising',
    location: 'Mumbai',
    followers_count: 0,
    price_range: '₹10,000',
  },
  {
    id: '3',
    title: 'Billboard - Andheri Station',
    description: 'Prime location billboard available for 7 days.',
    category: 'Advertising',
    location: 'Mumbai',
    followers_count: 0,
    price_range: '₹50,000',
  }
]

const FeaturedOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOpportunities(dummyOpportunities)
      setLoading(false)
    }, 500)
  }, [])

  const getCategoryColor = (category: string) => {
    const colors = {
      'Advertising': 'bg-green-100 text-green-800',
      'Influencer Marketing': 'bg-blue-100 text-blue-800',
      'Audio Advertising': 'bg-purple-100 text-purple-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.default
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-24 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Opportunities
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hot deals available right now - grab them before they're gone!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(opportunity.category)}`}>
                    {opportunity.category}
                  </span>
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>

                <div className="bg-gray-100 rounded-lg p-4 mb-6 group-hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {opportunity.title}
                    </h3>
                    {opportunity.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {opportunity.description}
                      </p>
                    )}
                    {opportunity.location && (
                      <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {opportunity.location}
                      </div>
                    )}
                    {opportunity.followers_count > 0 && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {opportunity.followers_count.toLocaleString()} followers
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-xl font-bold text-gray-900">
                      {opportunity.price_range}
                    </p>
                  </div>
                  <a
                    href="/contact"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Contact Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="/signup"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-flex items-center"
          >
            Browse All Opportunities
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default FeaturedOpportunities
