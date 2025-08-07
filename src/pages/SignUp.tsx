import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    userType: 'advertiser',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    companyName: '',
    description: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)

  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUserTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      userType: type
    }))
  }

  const handleSendOtp = async () => {
    if (!formData.phoneNumber) {
      alert('Please enter a phone number')
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${formData.phoneNumber}` }),
      })

      const data = await res.json()
      if (res.ok) {
        alert('OTP sent to your phone')
        setOtpSent(true)
      } else {
        alert(data.message || 'Failed to send OTP')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong while sending OTP')
    }
  }

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phoneNumber }),

      })

      const data = await res.json()
      if (res.ok) {
        alert('OTP verified successfully')
        setOtpVerified(true)
      } else {
        alert(data.message || 'Invalid OTP')
      }
    } catch (err) {
      console.error(err)
      alert('OTP verification failed')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otpVerified) {
      alert('Please verify OTP before signing up')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify({ token: data.token, ...data.user }))
        navigate('/marketplace')
      } else {
        alert(data.message || 'Signup failed')
      }

    } catch (err) {
      console.error('Signup error:', err)
      alert('Something went wrong. Try again later.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-blue-600">Join Barter Adverts today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="advertiser"
                    checked={formData.userType === 'advertiser'}
                    onChange={() => handleUserTypeChange('advertiser')}
                    className="w-4 h-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Advertiser (I want to advertise)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="media_owner"
                    checked={formData.userType === 'media_owner'}
                    onChange={() => handleUserTypeChange('media_owner')}
                    className="w-4 h-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Media Owner (I have ad space)</span>
                </label>
              </div>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                minLength={6}
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                country={'in'}
                enableSearch={true}
                value={formData.phoneNumber}
                onChange={(phone) => setFormData(prev => ({ ...prev, phoneNumber: phone }))}
                inputProps={{
                  name: 'phoneNumber',
                  required: true,
                }}
                inputStyle={{
                  width: '100%',
                  height: '45px',
                  paddingLeft: '48px', // Ensures number doesn't overlap flag
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '16px'
                }}
                buttonStyle={{
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                  border: '1px solid #ccc',
                  background: '#fff'
                }}
                containerStyle={{
                  width: '100%',
                  marginBottom: '0.5rem'
                }}
              />

              <p className="text-xs text-blue-600 mt-1">We'll send an OTP to verify your number</p>
            </div>


            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                placeholder="Tell us about your business and what you're looking to trade..."
              />
            </div>

            {/* OTP Buttons and Input */}
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Send OTP
              </button>
            ) : !otpVerified ? (
              <>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full bg-green-600 text-white py-3 rounded-lg mt-3 hover:bg-green-700"
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Signup'}
              </button>
            )}

            {/* Sign In Link */}
            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <a href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp