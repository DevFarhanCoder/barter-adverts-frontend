import React from 'react';

const Testimonial = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
          <blockquote className="text-center">
            <p className="text-xl md:text-2xl text-white/90 italic mb-8 leading-relaxed">
              "Transformed our media buying strategy completely. We've exchanged ₹2.5 crores worth of advertising space without spending a single rupee in cash. This platform is revolutionary!"
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black">
                RK
              </div>
              <div className="text-left">
                <div className="text-white font-semibold text-lg">Rajesh Kumar</div>
                <div className="text-white/70">CEO, Metro Advertising Network</div>
              </div>
            </div>
          </blockquote>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-white/70">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Verified Media Partners</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Secure Transactions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Global Reach</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;