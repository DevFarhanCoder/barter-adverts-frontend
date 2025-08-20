import React from "react";
import { Link } from "react-router-dom";

const HelpCenter: React.FC = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 py-16">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-white px-6">
        <h1 className="text-4xl font-bold mb-6">Help Center</h1>
        <p className="text-white/80 mb-8">Quick answers to common questions.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
            <ul className="list-disc ml-6 text-white/80 space-y-1">
              <li><Link to="/how-it-works" className="underline">How Barter Adverts works</Link></li>
              <li>Creating your first listing</li>
              <li>Messaging & negotiating</li>
            </ul>
          </div>
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Billing & Plans</h3>
            <ul className="list-disc ml-6 text-white/80 space-y-1">
              <li><Link to="/pricing" className="underline">Pricing & features</Link></li>
              <li><Link to="/refund-cancellation" className="underline">Refund & cancellation</Link></li>
            </ul>
          </div>
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Legal</h3>
            <ul className="list-disc ml-6 text-white/80 space-y-1">
              <li><Link to="/privacy-policy" className="underline">Privacy Policy</Link></li>
              <li><Link to="/terms" className="underline">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Contact</h3>
            <p className="text-white/80">Need more help? <Link className="underline" to="/contact">Contact us</Link>.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpCenter;
