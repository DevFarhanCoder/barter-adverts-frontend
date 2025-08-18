// src/components/PricingPlans.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Users, TrendingUp, Crown, Rocket, X } from "lucide-react";
import Footer from "./Footer";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type BillingCycle = "monthly" | "yearly";
type UserType = "advertisers" | "media_owners";

type Plan = {
  id: string;
  name: string;
  price: number; // monthly in ₹
  description: string;
  icon: React.ComponentType<any>;
  color: string; // Tailwind bg-*
  commission: string;
  dealLimit: string;
  isPopular?: boolean;
  features: string[];
};

const PricingPlans: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [userType, setUserType] = useState<UserType>("advertisers");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // ------- Simple auth helpers -------
  const isAuthenticated = () => !!localStorage.getItem("token");
  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  };

  // ------- Razorpay flow -------
  const handlePayment = async (amountPaise: number, user?: any) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({ amount: amountPaise }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data?.success || !data?.order?.id) {
        throw new Error(data?.error || "Order creation failed");
      }

      const options = {
        key: "rzp_test_qV8BGFcUas9r3A",
        amount: data.order.amount, // paise
        currency: "INR",
        name: "Barter Adverts",
        description: "Subscription Payment",
        order_id: data.order.id,
        handler: function (response: any) {
          alert("Payment successful!");
          console.log("Payment response:", response);
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Please try again.");
    }
  };

  // ------- Static plans -------
  const staticPlans: Plan[] = [
    {
      id: "1",
      name: "Starter",
      price: 999,
      description: "Perfect for small businesses getting started",
      icon: Users,
      color: "bg-green-500",
      commission: "+ 5% commission per deal",
      dealLimit: "Up to 5 deals/month",
      features: [
        "Up to 5 active listings",
        "Basic search & filters",
        "Direct messaging",
        "Email support",
        "Basic analytics",
        "Deal tracking",
        "Priority support",
        "Verified badge",
      ],
    },
    {
      id: "2",
      name: "Growth",
      price: 2499,
      description: "For growing businesses ready to scale",
      icon: TrendingUp,
      color: "bg-blue-500",
      commission: "+ 3% commission per deal",
      dealLimit: "Up to 15 deals/month",
      isPopular: true,
      features: [
        "Up to 15 active listings",
        "Advanced search & filters",
        "Priority messaging",
        "Priority email support",
        "Advanced analytics dashboard",
        "Deal tracking & reporting",
        "Verified business badge",
        "Featured listings (3/month)",
      ],
    },
    {
      id: "3",
      name: "Professional",
      price: 4999,
      description: "For established businesses with high volume",
      icon: Crown,
      color: "bg-purple-500",
      commission: "+ 3% commission per deal",
      dealLimit: "Up to 50 deals/month",
      features: [
        "Up to 50 active listings",
        "AI powered matching",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom analytics dashboard",
        "Premium verified badge",
        "Featured listings (10/month)",
        "API access",
      ],
    },
    {
      id: "4",
      name: "Enterprise",
      price: 9999,
      description: "Custom solutions for large organizations",
      icon: Rocket,
      color: "bg-gray-900",
      commission: "+ 3% commission per deal",
      dealLimit: "Unlimited deals",
      features: [
        "Unlimited active listings",
        "Custom integrations",
        "White label solutions",
        "Dedicated infrastructure",
        "Custom reporting suite",
        "Enterprise SLA",
        "Training & onboarding",
        "Custom contract terms",
      ],
    },
  ];

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Pricing Plans</h2>
            <p className="text-gray-600 max-w-xl mx-auto mt-4">
              Pay a fixed monthly fee plus commission only on successful deals. No hidden
              costs.
            </p>

            {/* Toggle: Audience */}
            <div className="flex justify-center mt-6">
              <button
                className={`px-6 py-2 mr-2 rounded-md ${
                  userType === "advertisers"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border"
                }`}
                onClick={() => setUserType("advertisers")}
              >
                Advertisers
              </button>
              <button
                className={`px-6 py-2 rounded-md ${
                  userType === "media_owners"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border"
                }`}
                onClick={() => setUserType("media_owners")}
              >
                Media Owners
              </button>
            </div>

            {/* Toggle billing cycle */}
            <div className="flex justify-center mt-4">
              <div className="inline-flex rounded-lg border overflow-hidden">
                <button
                  className={`px-4 py-2 text-sm ${
                    billingCycle === "monthly"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => setBillingCycle("monthly")}
                >
                  Monthly
                </button>
                <button
                  className={`px-4 py-2 text-sm ${
                    billingCycle === "yearly"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => setBillingCycle("yearly")}
                >
                  Yearly (save 20%)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staticPlans.map((plan) => {
              const Icon = plan.icon;
              const isYearly = billingCycle === "yearly";
              const yearlyPrice = Math.floor(plan.price * 12 * 0.8); // 20% off
              const displayPrice = isYearly ? yearlyPrice : plan.price;
              const unit = isYearly ? "/year" : "/month";
              const perMonthEq = Math.round(yearlyPrice / 12);

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-2 p-6 relative ${
                    plan.isPopular ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                        ✨ Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div
                      className={`${plan.color} text-white w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 mb-4">
                      {plan.description}
                    </p>

                    {/* Price + unit */}
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{displayPrice} <span className="text-base text-gray-600">{unit}</span>
                    </div>
                    {isYearly && (
                      <p className="text-xs text-gray-500">
                        ≈ ₹{perMonthEq}/month (billed yearly)
                      </p>
                    )}

                    <p className="text-red-500 text-sm mt-1">{plan.commission}</p>
                    <p className="text-gray-500 text-sm mb-4">{plan.dealLimit}</p>

                    <button
                      onClick={() => {
                        if (!isAuthenticated()) {
                          setShowAuthPrompt(true);
                          return;
                        }
                        const user = getCurrentUser();
                        handlePayment(displayPrice * 100, user); // amount in paise
                      }}
                      className="w-full bg-black text-white py-3 rounded-lg mt-2"
                    >
                      Subscribe Now
                    </button>

                    <ul className="mt-6 space-y-2 text-left text-sm text-gray-600">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-1" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Auth required popup */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold mb-2">Sign in required</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please sign in or create an account to subscribe to a plan.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  navigate("/login", { replace: false, state: { from: "/pricing" } });
                }}
                className="flex-1 px-4 py-2 rounded-lg border text-gray-800 hover:bg-gray-50"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  navigate("/signup", { replace: false, state: { from: "/pricing" } });
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default PricingPlans;
