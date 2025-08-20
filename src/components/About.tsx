import React from 'react';
import { Target, Users, Lightbulb, Award, User } from 'lucide-react';

interface Value {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
  avatar: string;
}

export const About: React.FC = () => {
  const values: Value[] = [
    {
      icon: Target,
      title: 'Transparency',
      description: 'We believe in open, honest transactions with clear terms and fair pricing.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a trusted network of businesses that support each other\'s growth.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Pioneering new ways to connect advertisers with media owners efficiently.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to providing the best barter advertising experience in India.'
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      description: 'Former advertising executive with 15+ years experience in media planning and barter advertising.',
      avatar: '/api/placeholder/150/150'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Operations',
      description: 'Expert in marketplace operations and user experience with background in fintech platforms.',
      avatar: '/api/placeholder/150/150'
    },
    {
      name: 'Amit Patel',
      role: 'Head of Technology',
      description: 'Full-stack developer and system architect with expertise in scalable marketplace platforms.',
      avatar: '/api/placeholder/150/150'
    }
  ];

  return (
    <>
    <section id="about" className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">About Barter Adverts</h2>
        <p className="text-xl text-purple-100 mb-16 max-w-3xl mx-auto">
          We're revolutionizing advertising in India by creating the first unified marketplace for barter-based advertising across all media formats.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                To democratize advertising by enabling businesses to trade their products and services for valuable advertising space, eliminating the need for upfront cash investments.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe every business deserves access to quality advertising, regardless of their cash flow situation. Through smart bartering, we're making this vision a reality.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Our Impact</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">₹10Cr+</div>
                  <div className="text-sm text-gray-600">Value Traded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                  <div className="text-sm text-gray-600">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">Our Values</h3>
            <p className="text-gray-600 text-center mb-12">The principles that guide everything we do</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">Meet Our Team</h3>
            <p className="text-gray-600 text-center mb-12">The passionate people behind Barter Adverts</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center bg-gray-50 rounded-xl p-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Story</h3>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-600 leading-relaxed mb-4">
                Barter Adverts was born from a simple observation: thousands of businesses in India have valuable products and services but struggle to afford traditional advertising, while media owners often have unsold inventory that could be put to good use.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our founder, Rajesh Kumar, spent over 15 years in the advertising industry and witnessed this inefficiency firsthand. He saw small restaurants with amazing food but no budget for billboards, and billboard owners with empty spaces during off-peak seasons.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                The idea was simple but revolutionary: what if we could connect these two groups directly? What if a restaurant could trade their catering services for billboard space? What if an influencer could promote a software company in exchange for a premium license?
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, Barter Adverts is India's first and largest barter advertising marketplace, facilitating millions of rupees worth of value exchange every month. We're not just a platform; we're a movement towards more accessible, sustainable, and creative advertising solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};