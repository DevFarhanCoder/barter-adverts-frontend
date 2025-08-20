import { useNavigate } from "react-router-dom";
import React from "react";

const SuccessStories = () => {
  const navigate = useNavigate();

  const stories = [
    {
      company: 'TechStart Solutions',
      industry: 'SaaS',
      deal: 'Traded ₹25,000 software licenses for prime billboard space',
      result: '40% increase in brand awareness',
    },
    {
      company: 'Cafe Mocha',
      industry: 'F&B',
      deal: 'Exchanged coffee vouchers for influencer marketing',
      result: '200% boost in foot traffic',
    },
    {
      company: 'FitLife Gym',
      industry: 'Fitness',
      deal: 'Bartered gym memberships for radio advertising',
      result: '150 new members in 30 days',
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Real Success Stories
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            See how businesses like yours are thriving through smart bartering
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stories.map((story, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
              <div className="mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-gray-800">
                    {story.company.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{story.company}</h3>
                <span className="text-white/70 text-sm">{story.industry}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">The Deal:</h4>
                  <p className="text-white/80 text-sm">{story.deal}</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Result:</h4>
                  <p className="text-green-300 font-semibold">{story.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/success-stories")}
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            View All Success Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
