import React, { useState } from 'react';
import { Handshake, MapPin, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Handshake className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Barter Adverts</h1>
              <p className="text-xs text-gray-500">Media Marketplace</p>
            </div>
          </div>

          {/* Location */}
          <div className="hidden md:flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Mumbai, India</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#marketplace" className="text-gray-700 hover:text-blue-600 font-medium">
              Marketplace
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium">
              Pricing
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">
              About
            </a>
          </nav>

          {/* CTA Button */}
          <button className="hidden md:flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <span>Get Started</span>
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="#marketplace" className="text-gray-700 hover:text-blue-600 font-medium">
                Marketplace
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium">
                Pricing
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">
                About
              </a>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;