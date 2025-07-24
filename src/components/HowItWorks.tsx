import React from 'react'
import { UserPlus, Search, MessageSquare, Handshake, TrendingUp, Trophy } from 'lucide-react'

const steps = [
  {
    step: 1,
    title: 'Sign Up & Verify',
    description: 'Create your account and connect your business with us. Access our community.',
    icon: UserPlus,
    color: 'bg-blue-500',
    tasks: [
      'Quick 5-minute registration',
      'Complete business profile',
      'Verify your categories'
    ]
  },
  {
    step: 2,
    title: 'Create Your Listing',
    description: 'Post what you\'re offering or what advertising space you have.',
    icon: Search,
    color: 'bg-green-500',
    tasks: []
  },
  {
    step: 3,
    title: 'Find Perfect Matches',
    description: 'Browse opportunities and discover ideal trading partners.',
    icon: MessageSquare,
    color: 'bg-purple-500',
    tasks: []
  },
  {
    step: 4,
    title: 'Connect & Negotiate',
    description: 'Chat with potential partners and negotiate the perfect deal terms.',
    icon: Handshake,
    color: 'bg-orange-500',
    tasks: []
  },
  {
    step: 5,
    title: 'Finalize the Deal',
    description: 'Agree on terms and create a formal deal agreement.',
    icon: TrendingUp,
    color: 'bg-indigo-500',
    tasks: []
  },
  {
    step: 6,
    title: 'Execute & Grow',
    description: 'Complete the exchange and track your business\'s success.',
    icon: Trophy,
    color: 'bg-pink-500',
    tasks: []
  }
]

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Super Simple
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Barter Adverts<br />
            <span className="text-indigo-600">Actually Works</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From registration to successful deal completion - here's your complete journey in{' '}
            <span className="font-semibold text-indigo-600">6 simple steps</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.step}
                  className="flex items-start space-x-4 group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300"
                >
                  <div className={`${step.color} text-white w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium mr-3">
                        Step {step.step}
                      </span>
                      <h3 className="font-semibold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {step.description}
                    </p>
                    {step.tasks.length > 0 && (
                      <ul className="space-y-1">
                        {step.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="text-sm text-gray-500 flex items-center">
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></div>
                            {task}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="lg:sticky lg:top-8">
            <div className="bg-gray-900 rounded-2xl p-8 text-center">
              <div className="bg-gray-800 rounded-xl p-6 mb-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white font-medium">Watch Demo</p>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  See How It Works in 2 Minutes
                </h4>
                <p className="text-gray-600 text-sm mb-6">
                  Watch our quick demo to see exactly how the platform works and how you can start trading today.
                </p>
                <div className="space-y-3">
                  <a href="/signup" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center block">
                    Play Demo
                  </a>
                  <a href="/signup" className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center block">
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks