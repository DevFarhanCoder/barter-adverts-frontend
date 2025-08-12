import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

/** Normalize to E.164. Keep "+" if present, else add it to the digits-only string. */
function toE164(raw: string) {
  const s = (raw || '').trim();
  if (s.startsWith('+')) return s;
  const digits = s.replace(/\D/g, '');
  return digits ? `+${digits}` : '';
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    userType: 'advertiser' as 'advertiser' | 'media_owner',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    companyName: '',
    description: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // Tokens for OTP flow
  const [otpToken, setOtpToken] = useState<string | null>(null);     // from send-otp
  const [proofToken, setProofToken] = useState<string | null>(null); // from verify-otp

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUserTypeChange = (type: 'advertiser' | 'media_owner') => {
    setFormData((p) => ({ ...p, userType: type }));
  };

  const handleSendOtp = async () => {
    setError('');
    if (!formData.phoneNumber) {
      alert('Please enter a phone number');
      return;
    }
    const phone = toE164(formData.phoneNumber);

    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        setOtpToken(data.otp_token ?? null);
        setOtpSent(true);
        alert('OTP sent to your phone');
      } else {
        setError(data.message || `Failed to send OTP (HTTP ${res.status})`);
        alert(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('send-otp error:', err);
      setError('Something went wrong while sending OTP.');
      alert('Something went wrong while sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!otpToken) {
      setError('Missing OTP token. Please send OTP again.');
      alert('Missing OTP token. Please send OTP again.');
      return;
    }
    if (!otp) {
      alert('Please enter the OTP you received');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp_token: otpToken, otp }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        setOtpVerified(true);
        setProofToken(data.proof_token ?? null);
        alert('OTP verified successfully');
      } else {
        setError(data.message || `OTP verification failed (HTTP ${res.status})`);
        alert(data.message || 'OTP verification failed');
      }
    } catch (err) {
      console.error('verify-otp error:', err);
      setError('OTP verification failed.');
      alert('OTP verification failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpVerified || !proofToken) {
      alert('Please verify OTP before signing up');
      return;
    }

    setLoading(true);
    const phone = toE164(formData.phoneNumber);
    const role = formData.userType; // what backend expects

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,                                 // ✅ send role, not userType
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phoneNumber: phone,
          companyName: formData.companyName,
          description: formData.description,
          proof_token: proofToken,              // from verify-otp
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json()
        : { message: await res.text() };

      if (res.ok) {
        // Persist exactly what the rest of the app reads
        localStorage.setItem('token', (data as any).token);
        const userObj = { ...(data as any).user, role };
        localStorage.setItem('ba_user', JSON.stringify(userObj));
        localStorage.setItem('role', role);
        window.dispatchEvent(new Event('auth:changed'));

        navigate('/marketplace');
      } else {
        setError((data as any).message || `Signup failed (HTTP ${res.status})`);
      }
    } catch (err) {
      console.error('signup error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-blue-600">Join Barter Adverts today</p>
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

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

            {/* Names */}
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

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                country="in"
                enableSearch
                value={formData.phoneNumber}
                onChange={(phone) => setFormData((p) => ({ ...p, phoneNumber: phone }))}
                inputProps={{ name: 'phoneNumber', required: true }}
                inputStyle={{
                  width: '100%',
                  height: '45px',
                  paddingLeft: '48px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                }}
                buttonStyle={{
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                  border: '1px solid #ccc',
                  background: '#fff',
                }}
                containerStyle={{ width: '100%', marginBottom: '0.5rem' }}
              />
              <p className="text-xs text-blue-600 mt-1">We'll send an OTP to verify your number</p>
            </div>

            {/* Company + Desc */}
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

            {/* OTP actions */}
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

            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Log In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
