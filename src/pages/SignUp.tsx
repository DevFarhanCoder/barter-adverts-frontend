// src/pages/SignUp.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { auth } from '../firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  type ConfirmationResult,
  type Auth,
} from 'firebase/auth';

/** Normalize to E.164. Keep "+" if present, else add it to the digits-only string. */
function toE164(raw: string) {
  const s = (raw || '').trim();
  if (s.startsWith('+')) return s;
  const digits = s.replace(/\D/g, '');
  return digits ? `+${digits}` : '';
}

// Backend base URL (e.g. VITE_API_BASE_URL=http://localhost:5000)
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

// Flip to `true` if you want to see the reCAPTCHA widget while debugging.
const DEBUG_VISIBLE_RECAPTCHA = false;

/** Create a single, stable container under <body> for reCAPTCHA. */
function ensureRecaptchaContainer(): HTMLElement {
  let el = document.getElementById('ba-recaptcha-root');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ba-recaptcha-root';
    // keep it out of layout; Firebase still uses it just fine
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    el.style.bottom = '0';
    document.body.appendChild(el);
  }
  return el;
}

/** Create or reuse a singleton RecaptchaVerifier */
function ensureVerifier(a: Auth): RecaptchaVerifier {
  const w = window as any;
  if (w._baRecaptchaVerifier) return w._baRecaptchaVerifier as RecaptchaVerifier;

  const container = ensureRecaptchaContainer(); // HTMLElement
  const v = new RecaptchaVerifier(a, container, {
    size: DEBUG_VISIBLE_RECAPTCHA ? 'normal' : 'invisible',
  });
  w._baRecaptchaVerifier = v;
  return v;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // form & UI
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

  // OTP flow state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // Firebase auth state
  const [firebaseIdToken, setFirebaseIdToken] = useState<string | null>(null);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  // Keep Firebase auth token fresh
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const tok = await u.getIdToken(true);
        setFirebaseIdToken(tok);
        setVerifiedPhone(u.phoneNumber || null);
      }
    });
    return () => unsub();
  }, []);

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
      const v = ensureVerifier(auth);
      await v.render(); // make sure it is mounted before use
      const confirmation = await signInWithPhoneNumber(auth, phone, v);
      confirmationRef.current = confirmation;
      setOtpSent(true);
      alert('OTP sent to your phone');
    } catch (err: any) {
      console.error('firebase send otp error:', err);
      const code = err?.code || '';
      let msg = err?.message || 'Failed to send OTP';
      if (code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please wait a minute and try again.';
      } else if (code === 'auth/invalid-phone-number') {
        msg = 'Invalid phone number format.';
      }
      setError(msg);
      alert(msg);
      // if the verifier broke, clear it so next attempt recreates cleanly
      try { (window as any)._baRecaptchaVerifier?.clear?.(); } catch {}
      (window as any)._baRecaptchaVerifier = null;
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!confirmationRef.current) {
      alert('Please send OTP first');
      return;
    }
    if (!otp) {
      alert('Please enter the OTP you received');
      return;
    }

    try {
      const result = await confirmationRef.current.confirm(otp);
      const u = result.user;
      const idToken = await u.getIdToken(true);
      setFirebaseIdToken(idToken);
      setVerifiedPhone(u.phoneNumber || null);
      setOtpVerified(true);
      alert('OTP verified successfully');
    } catch (err: any) {
      console.error('firebase verify error:', err);
      const code = err?.code || '';
      let msg = err?.message || 'OTP verification failed';
      if (code === 'auth/invalid-verification-code') msg = 'Invalid OTP. Please try again.';
      setError(msg);
      alert(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpVerified || !firebaseIdToken || !verifiedPhone) {
      alert('Please verify OTP before signing up');
      return;
    }

    setLoading(true);
    const phone = toE164(formData.phoneNumber);
    const userType = formData.userType;

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${firebaseIdToken}`,
        },
        body: JSON.stringify({
          userType,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phoneNumber: phone, // must match Firebase verified phone
          companyName: formData.companyName,
          description: formData.description,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json()
        : { message: await res.text() };

      if (res.ok) {
        localStorage.setItem('token', (data as any).token);
        localStorage.setItem('ba_user', JSON.stringify((data as any).user));
        localStorage.setItem('role', (data as any).user?.userType || userType);
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
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg mt-3 hover:bg-green-700"
                  >
                    Verify OTP
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg mt-3 hover:bg-gray-300"
                  >
                    Resend
                  </button>
                </div>
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

            {/* NOTE: We no longer render a recaptcha <div> inside this tree.
                It is mounted once under <body> by ensureRecaptchaContainer(). */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
