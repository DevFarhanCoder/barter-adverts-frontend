declare global {
  interface Window {
    Razorpay: any;
  }
}
import React, { useState } from 'react'
import { Check, Users, TrendingUp, Crown, Rocket } from 'lucide-react'
import Footer from './Footer';
import { requireLogin } from "../utils/requireLogin";

const PricingPlans: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [userType, setUserType] = useState<'advertisers' | 'media_owners'>('advertisers')

const handlePayment = async (amount: number) => {
  const user = requireLogin();
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    const options = {
      key: 'rzp_test_qV8BGFcUas9r3A',
      amount: data.order.amount,
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Subscription Payment',
      order_id: data.order.id,
      handler: function (response: any) {
        alert('Payment successful!');
        console.log('Payment response:', response);
      },
      prefill: {
        name: user.name || '',
        email: user.email || '',
        contact: user.phone || ''
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Payment failed:', error);
  }
};


  const staticPlans = [
    {
      id: '1',
      name: 'Starter',
      price: 999,
      description: 'Perfect for small businesses getting started',
      icon: Users,
      color: 'bg-green-500',
      commission: '+ 5% commission per deal',
      dealLimit: 'Up to 5 deals/month',
      features: [
        'Up to 5 active listings',
        'Basic search & filters',
        'Direct messaging',
        'Email support',
        'Basic analytics',
        'Deal tracking',
        'Priority support',
        'Verified badge'
      ]
    },
    {
      id: '2',
      name: 'Growth',
      price: 2499,
      description: 'For growing businesses ready to scale',
      icon: TrendingUp,
      color: 'bg-blue-500',
      commission: '+ 3% commission per deal',
      dealLimit: 'Up to 15 deals/month',
      isPopular: true,
      features: [
        'Up to 15 active listings',
        'Advanced search & filters',
        'Priority messaging',
        'Priority email support',
        'Advanced analytics dashboard',
        'Deal tracking & reporting',
        'Verified business badge',
        'Featured listings (3/month)'
      ]
    },
    {
      id: '3',
      name: 'Professional',
      price: 4999,
      description: 'For established businesses with high volume',
      icon: Crown,
      color: 'bg-purple-500',
      commission: '+ 3% commission per deal',
      dealLimit: 'Up to 50 deals/month',
      features: [
        'Up to 50 active listings',
        'AI powered matching',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom analytics dashboard',
        'Premium verified badge',
        'Featured listings (10/month)',
        'API access'
      ]
    },
    {
      id: '4',
      name: 'Enterprise',
      price: 9999,
      description: 'Custom solutions for large organizations',
      icon: Rocket,
      color: 'bg-gray-900',
      commission: '+ 3% commission per deal',
      dealLimit: 'Unlimited deals',
      features: [
        'Unlimited active listings',
        'Custom integrations',
        'White label solutions',
        'Dedicated infrastructure',
        'Custom reporting suite',
        'Enterprise SLA',
        'Training & onboarding',
        'Custom contract terms'
      ]
    }
  ]



  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Pricing Plans</h2>
            <p className="text-gray-600 max-w-xl mx-auto mt-4">
              Pay a fixed monthly fee plus commission only on successful deals. No hidden costs.
            </p>

            <div className="flex justify-center mt-6">
              <button
                className={`px-6 py-2 mr-2 rounded-md ${userType === 'advertisers' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
                onClick={() => setUserType('advertisers')}
              >
                Advertisers
              </button>
              <button
                className={`px-6 py-2 rounded-md ${userType === 'media_owners' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
                onClick={() => setUserType('media_owners')}
              >
                Media Owners
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staticPlans.map((plan) => {
              const Icon = plan.icon
              const isPopular = plan.isPopular
              const yearlyPrice = Math.floor(plan.price * 12 * 0.8)
              const displayPrice = billingCycle === 'yearly' ? yearlyPrice : plan.price

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-2 p-6 relative ${isPopular ? 'ring-2 ring-blue-500' : ''
                    }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                        ✨ Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className={`${plan.color} text-white w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mt-2 mb-4">{plan.description}</p>
                    <div className="text-2xl font-bold text-gray-900">₹{displayPrice}</div>
                    <p className="text-red-500 text-sm">{plan.commission}</p>
                    <p className="text-gray-500 text-sm mb-4">{plan.dealLimit}</p>

<button
  onClick={() => {
    const user = requireLogin();
    console.log("[Subscribe Now] User =", user);

    if (!user) {
      console.log("User not logged in. Popup should appear.");
      return;
    }

    handlePayment(displayPrice * 100);
  }}


                    <ul className="mt-6 space-y-2 text-left text-sm text-gray-600">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-1" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default PricingPlans
