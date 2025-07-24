import React from 'react';
import { DollarSign, Clock, Shield, Users, TrendingUp, Handshake } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: DollarSign,
      title: 'Zero Cash Investment',
      description: 'Trade products and services directly without spending money on advertising',
      keyBenefit: 'Save up to 80% on marketing costs',
      stat: '₹2.5Cr+ saved by users',
      color: 'bg-green-500',
      rating: 5
    },
    {
      icon: Clock,
      title: 'Quick Deal Closure',
      description: 'Find matches and close deals 5x faster than traditional advertising channels',
      keyBenefit: 'Average deal closure in 7 days',
      stat: '85% deals closed within 2 weeks',
      color: 'bg-blue-500',
      rating: 5
    },
    {
      icon: Shield,
      title: 'Trust & Safety First',
      description: 'Verified users, secure transactions, and dispute resolution for peace of mind',
      keyBenefit: '99.2% successful completion rate',
      stat: '2,500+ verified businesses',
      color: 'bg-purple-500',
      rating: 5
    },
    {
      icon: Users,
      title: 'Diverse Network',
      description: 'Access to all media formats - digital, outdoor, print, radio, and influencers',
      keyBenefit: 'One platform for all advertising needs',
      stat: '15+ media categories available',
      color: 'bg-orange-500',
      rating: 5
    },
    {
      icon: TrendingUp,
      title: 'Better ROI',
      description: 'Get premium advertising exposure while trading excess inventory or services',
      keyBenefit: 'Average 300% better ROI vs paid ads',
      stat: '4.8/5 average satisfaction rating',
      color: 'bg-indigo-500',
      rating: 5
    },
    {
      icon: Handshake,
      title: 'Win-Win Partnerships',
      description: 'Build long-term business relationships through mutually beneficial exchanges',
      keyBenefit: '70% of users make repeat deals',
      stat: '800+ successful partnerships',
      color: 'bg-pink-500',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Why Choose Barter Adverts
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Smart Trading, <span className="text-blue-600">Smarter Growth</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of businesses already growing through strategic bartering. No cash required, just value exchange.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
              {/* Crown icon for popular features */}
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-semibold">
                  👑
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>

              {/* Key Benefit */}
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 text-blue-600 text-sm font-semibold">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Key Benefit</span>
                </div>
                <p className="text-blue-800 font-medium mt-1">{feature.keyBenefit}</p>
              </div>

              {/* Stats and Rating */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">{feature.stat}</div>
                <div className="flex items-center space-x-1">
                  {[...Array(feature.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;