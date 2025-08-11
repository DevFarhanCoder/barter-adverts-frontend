import React, { useEffect, useState } from 'react';
import { Monitor, MapPin, Newspaper, Mail, Users, Mic, Plane } from 'lucide-react';

const MediaTypes = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'popular'>('all');
  const [visibleCount, setVisibleCount] = useState(3);

  const mediaTypes = [
    { id: 'digital', icon: Monitor, title: 'Digital Advertising', description: 'Websites, apps, social media ads, and online banners', reach: 'Avg. Reach: 50K-2M', platforms: ['Google Ads', 'Facebook Ads'], popular: true, color: 'bg-blue-500', stats: '+2 more' },
    { id: 'outdoor', icon: MapPin, title: 'Outdoor Media', description: 'Billboards, hoardings, transit ads, and street furniture', reach: 'Avg. Reach: 100K-5M', platforms: ['Billboards', 'Bus Shelters'], popular: true, color: 'bg-green-500', stats: '+2 more' },
    { id: 'influencer', icon: Users, title: 'Influencer Marketing', description: 'Social media influencers across all platforms and niches', reach: 'Avg. Reach: 10K-1M', platforms: ['Instagram Posts', 'YouTube Videos'], popular: true, color: 'bg-pink-500', stats: '+2 more' },
    { id: 'audio', icon: Mic, title: 'Audio Advertising', description: 'Radio stations, podcasts, and audio streaming platforms', reach: 'Avg. Reach: 25K-500K', platforms: ['FM Radio', 'Podcasts'], popular: true, color: 'bg-purple-500', stats: '+2 more' },
    { id: 'print', icon: Newspaper, title: 'Print Media', description: 'Newspapers, magazines, brochures, and print publications', reach: 'Avg. Reach: 20K-300K', platforms: ['Newspapers', 'Magazines'], popular: false, color: 'bg-orange-500', stats: '+2 more' },
    { id: 'direct', icon: Mail, title: 'Direct Marketing', description: 'Email campaigns, SMS marketing, and direct mail', reach: 'Avg. Reach: 5K-100K', platforms: ['Email Newsletters', 'SMS Campaigns'], popular: false, color: 'bg-cyan-500', stats: '+2 more' },
    { id: 'transit', icon: Plane, title: 'Transit & Travel Media', description: 'Branding in airports, flights, trains and ride-share ads.', reach: 'Avg. Reach: 50K-2M', platforms: ['Cab & Auto Wraps', 'Airport Boards'], popular: false, color: 'bg-yellow-500', stats: '+2 more' },
    { id: 'event', icon: Users, title: 'Event & Sponsorships Media', description: 'Brand Placements at live events, expos and sponsorships.', reach: 'Avg. Reach: 1K-500K', platforms: ['Sports Branding', 'Festivals...'], popular: true, color: 'bg-gray-500', stats: '+2 more' },
    { id: 'app', icon: Monitor, title: 'App & Game Advertising', description: 'Promotions within apps, games and mobile platforms.', reach: 'Avg. Reach: 10K-1M', platforms: ['In-game Ads', 'App Splash Screen'], popular: false, color: 'bg-red-500', stats: '+2 more' },
  ];

  const filteredTypes =
    activeTab === 'all' ? mediaTypes : mediaTypes.filter(t => t.popular);

  // Always start at 3 visible when tab changes
  useEffect(() => {
    setVisibleCount(6);
  }, [activeTab]);

  const listToRender = filteredTypes.slice(0, visibleCount);
  const canShowMore = visibleCount < filteredTypes.length;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            All Media Types Available
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Every Advertising Format
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">
            Under One Roof
          </h3>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            From traditional billboards to modern influencer marketing - find the perfect advertising medium for your brand on our unified platform.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              All Media Types
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${activeTab === 'popular' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Most Popular
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {listToRender.map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1 relative"
            >
              {type.popular && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                  👑 Popular
                </div>
              )}

              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{type.description}</p>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-gray-500 text-xs font-semibold mb-1">📊 {type.reach}</div>
                <div className="flex flex-wrap gap-2">
                  {type.platforms.map((p, i) => (
                    <span key={i} className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700">
                      {p}
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 px-2 py-1">{type.stats}</span>
                </div>
              </div>

              <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                <span>Explore Options</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Show All CTA (hidden when everything is visible) */}
        {canShowMore && (
          <div className="text-center">
            <button
              onClick={() =>
                setVisibleCount(v => Math.min(v + 3, filteredTypes.length))
              }
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Show All Media Types →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MediaTypes;
