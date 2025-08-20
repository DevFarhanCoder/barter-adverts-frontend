// src/components/Footer.tsx
import React from "react";
import { Handshake } from "lucide-react";
import { Link } from "react-router-dom";

type FooterProps = { showCta?: boolean };

const Footer: React.FC<FooterProps> = ({ showCta = true }) => {
  return (
    <>
      {/* CTA (optional) */}
      {showCta && (
        <section className="py-16 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Trading?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Join thousands of businesses already growing through barter advertising. No credit card required to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                >
                  Start Trading Now
                </Link>
                <Link
                  to="/marketplace"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors font-medium text-center"
                >
                  Browse Opportunities
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-indigo-200">Verified Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">₹50L+</div>
                <div className="text-indigo-200">Value Traded Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">95%</div>
                <div className="text-indigo-200">Successful Matches</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <Handshake className="w-8 h-8 text-indigo-400 mr-3" />
                <span className="text-xl font-bold">Barter Adverts</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                India's first unified barter marketplace for advertising. Trade your way to better marketing.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/refund-cancellation" className="hover:text-white transition-colors">Refund & Cancellation</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2024 Barter Adverts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
