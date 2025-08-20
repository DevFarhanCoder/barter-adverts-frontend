import React from "react";

const allStories = [
  {
    company: "TechStart Solutions",
    industry: "SaaS",
    deal: "Traded ₹25,000 software licenses for prime billboard space",
    result: "40% increase in brand awareness",
    testimonial: "Barter Adverts helped us save costs and still expand visibility.",
  },
  {
    company: "Cafe Mocha",
    industry: "Food & Beverage",
    deal: "Exchanged coffee vouchers for influencer marketing",
    result: "200% boost in foot traffic",
    testimonial: "We never imagined coffee vouchers could buy us so much marketing power!",
  },
  {
    company: "FitLife Gym",
    industry: "Fitness",
    deal: "Bartered gym memberships for radio advertising",
    result: "150 new members in 30 days",
    testimonial: "The barter system gave us massive exposure and filled our gym quickly.",
  },
  {
    company: "GreenLeaf Organics",
    industry: "Retail",
    deal: "Swapped organic produce for magazine features",
    result: "Featured in 5 top lifestyle magazines",
    testimonial: "A win-win trade that gave us credibility in the health space.",
  },
  {
    company: "UrbanTech Hub",
    industry: "Co-working",
    deal: "Shared workspace vouchers for social media promotion",
    result: "500+ signups in 2 weeks",
    testimonial: "Bartering fueled our growth faster than paid ads could.",
  },
];

const AllSuccessStories = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">All Success Stories</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover how businesses across industries are winning through Barter Adverts.
          </p>
        </div>

        {/* Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {allStories.map((story, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold text-gray-800">
                    {story.company.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{story.company}</h3>
                  <p className="text-white/70 text-sm">{story.industry}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-semibold">The Deal:</h4>
                  <p className="text-white/80">{story.deal}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Result:</h4>
                  <p className="text-green-300 font-semibold">{story.result}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Testimonial:</h4>
                  <p className="text-white/70 italic">“{story.testimonial}”</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllSuccessStories;
