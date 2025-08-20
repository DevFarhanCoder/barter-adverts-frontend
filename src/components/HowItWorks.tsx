import React from 'react'
import {
  Search,
  MessageSquare,
  Handshake,
  TrendingUp,
  Trophy,
  User,
  FileText,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Choose Your Role',
    description: 'Register as an Advertiser or Media Owner and set up your profile.',
    icon: User,
    features: [
      'Quick 2-minute onboarding',
      'Pick your category & role',
      'Complete your business profile',
    ],
    color: 'bg-blue-500',
  },
  {
    number: 2,
    title: 'Create Your Listing',
    description: 'Post what you\'re offering or what ad space you have.',
    icon: FileText,
    features: [
      'Add product/service details',
      'Upload visuals',
      'Set estimated value',
    ],
    color: 'bg-green-500',
  },
  {
    number: 3,
    title: 'Find Perfect Matches',
    description: 'Browse barter opportunities that fit your business.',
    icon: Search,
    features: [
      'Advanced filters for targeting',
      'Smart match suggestions',
    ],
    color: 'bg-purple-500',
  },
  {
    number: 4,
    title: 'Connect & Negotiate',
    description: 'Chat directly and finalize your barter terms.',
    icon: MessageSquare,
    features: [
      'Secure messaging',
      'Deal customization',
    ],
    color: 'bg-orange-500',
  },
  {
    number: 5,
    title: 'Make It Official',
    description: 'Finalize your barter agreement.',
    icon: Handshake,
    features: [
      'Digital agreement templates',
      'Transaction logging',
    ],
    color: 'bg-indigo-500',
  },
  {
    number: 6,
    title: 'Execute & Grow',
    description: 'Complete the exchange and build your growth.',
    icon: Trophy,
    features: [
      'Track barter success',
      'Get reviewed & rated',
    ],
    color: 'bg-pink-500',
  },
]

const HowItWorks: React.FC = () => {
  return (
    <>
    <section id="how-it-works" className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">How Barter Adverts Works</h2>
        <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto">
          Transform your business growth through smart bartering. No cash, just value exchange.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          <a href="/how-it-works" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Start Exploring
          </a>
          <a href="#faq" className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors">
            Learn More
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-purple-600 mb-4">6 Simple Steps to Success</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From onboarding to barter deal completion — here’s how it works.
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col lg:flex-row items-start gap-8">
                <div className="flex items-center gap-4 lg:w-1/3">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 mb-4">{step.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {step.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:flex items-center">
                    <ArrowRight className="w-6 h-6 text-purple-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default HowItWorks
