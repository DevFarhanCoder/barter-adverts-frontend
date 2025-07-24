import React from 'react';
import { TrendingUp, Users, Zap, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-semibold text-sm flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>🏆 WORLD'S NO.1 MEDIA MARKETPLACE FOR BARTER</span>
          </div>
        </div>

        {/* Main heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Barter. Connect. Grow.
          </h1>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Trade Media Assets, Not Just Money.
          </h2>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-12">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-pink-400" />
            <span className="font-semibold">📈 Reach Millions</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-white/30"></div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-yellow-400" />
            <span className="font-semibold">🤝 Build Brand Partnerships</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-white/30"></div>
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            <span className="font-semibold">⚡ Exchange Ad Value Instantly</span>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <p className="text-xl md:text-2xl mb-6 text-white/90 leading-relaxed">
            The world's largest platform for trading advertising space, media assets, and marketing services.
          </p>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            Connect with media owners globally and exchange value without cash transactions.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 flex items-center space-x-2">
            <span>Start Trading Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 transition-all border border-white/30">
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">10,000+</div>
            <div className="text-white/80">Media Partners</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">₹100Cr+</div>
            <div className="text-white/80">Media Value Traded</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">50+</div>
            <div className="text-white/80">Countries</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">4.9⭐</div>
            <div className="text-white/80">Global Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;