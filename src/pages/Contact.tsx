import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    role: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      alert("Message sent successfully! We'll get back to you within 24 hours.")
      setFormData({
        fullName: '',
        emailAddress: '',
        phoneNumber: '',
        role: '',
        subject: '',
        message: ''
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about barter advertising? We're here to help you get started.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Office Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Address</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>A-605, Range Height, Link Road</p>
                    <p>Opp Kajupada, Near Oshiwara Metro Station</p>
                    <p>Behrambaug, Jogeshwari West</p>
                    <p>Mumbai 400102, India</p>
                    <p>
                      <a 
                        href="https://maps.app.goo.gl/uS2qsMHdiLBMYtXc7?g_st=awb" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View on Google Maps
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Rajesh Modi: <a href="tel:+919867477227" className="text-green-600 font-medium">9867477227</a></p>
                    <p>Srinivas Shetti: <a href="tel:+919820540202" className="text-green-600 font-medium">9820540202</a></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                  <div className="text-gray-600 space-y-1">
                    <p><span className="font-medium">General:</span> barteradverts@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                  <div className="text-gray-600 space-y-1">
                    <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 7:00 PM</p>
                    <p><span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM</p>
                    <p><span className="font-medium">Sunday:</span> Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {/* (Form code remains the same) */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
            {/* ...existing form code... */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
