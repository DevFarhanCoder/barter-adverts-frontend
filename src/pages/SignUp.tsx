// src/pages/SignUp.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/** Normalize to E.164. Keep "+" if present, else add it to the digits-only string. */
function normalizePhone(raw: string, defaultCountry: "IN" | "US" = "IN") {
  // remove spaces, dashes, parentheses
  const s = String(raw || "").replace(/[^\d+]/g, "");

  // already E.164?
  if (s.startsWith("+")) return s;

  // strip leading zeros
  const digits = s.replace(/^0+/, "");

  if (defaultCountry === "IN") {
    // India: valid mobile has 10 digits, starts with 6/7/8/9
    if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
    // sometimes react-phone-input-2 returns 12 digits like "9198......"
    if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
  }

  // Generic: if it already includes country code (>=11 digits), just add +
  if (/^\d{11,15}$/.test(digits)) return `+${digits}`;

  // Fallback – let the caller handle the error message
  return "";
}

// Backend base URL (e.g. VITE_API_BASE_URL=http://localhost:5000)
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // form & UI
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    userType: "advertiser" as "advertiser" | "media_owner",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    companyName: "",
    description: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Twilio OTP flow state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // Tokens from backend
  const [otpToken, setOtpToken] = useState<string | null>(null); // from /send-otp
  const [proofToken, setProofToken] = useState<string | null>(null); // from /verify-otp

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUserTypeChange = (type: "advertiser" | "media_owner") => {
    setFormData((p) => ({ ...p, userType: type }));
  };

  const handleSendOtp = async () => {
    setError("");
    if (!formData.phoneNumber) {
      alert("Please enter a phone number");
      return;
    }
    const phone = normalizePhone(formData.phoneNumber, "IN");
    if (!phone) {
      setError("Please enter a valid Indian mobile number (e.g., +91 9876543210).");
      alert("Please enter a valid Indian mobile number (e.g., +91 9876543210).");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to send OTP");

      setOtpToken(data.otp_token);
      setOtpSent(true);
      alert("OTP sent to your phone");
    } catch (err: any) {
      console.error("send-otp error:", err);
      setError(err?.message || "Failed to send OTP");
      alert(err?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!otpToken) {
      alert("Please send OTP first");
      return;
    }
    if (!otp) {
      alert("Please enter the OTP you received");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp_token: otpToken, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "OTP verification failed");

      setProofToken(data.proof_token);
      setOtpVerified(true);
      alert("OTP verified successfully");
    } catch (err: any) {
      console.error("verify-otp error:", err);
      setError(err?.message || "OTP verification failed");
      alert(err?.message || "OTP verification failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpVerified || !proofToken) {
      alert("Please verify OTP before signing up");
      return;
    }

    setLoading(true);
    const phone = normalizePhone(formData.phoneNumber, "IN"); // <-- FIXED (was toE164)
    if (!phone) {
      setError("Invalid phone number. Please re-enter and verify again.");
      setLoading(false);
      return;
    }
    const userType = formData.userType;

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${proofToken}`, // Twilio proof token
        },
        body: JSON.stringify({
          userType,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phoneNumber: phone, // must match the verified number
          companyName: formData.companyName,
          description: formData.description,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: await res.text() };

      if (res.ok) {
        // Persist session
        localStorage.setItem("token", (data as any).token);
        localStorage.setItem("ba_user", JSON.stringify((data as any).user));
        localStorage.setItem(
          "role",
          ((data as any).user?.role || "user").toLowerCase()
        );
        window.dispatchEvent(new Event("auth:changed"));

        // Route by role or to marketplace
        const role = ((data as any).user?.role || "user").toLowerCase();
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/marketplace", { replace: true });
        }
      } else {
        setError((data as any).message || `Signup failed (HTTP ${res.status})`);
      }
    } catch (err) {
      console.error("signup error:", err);
      setError("Something went wrong. Please try again later.");
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

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a:
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="advertiser"
                    checked={formData.userType === "advertiser"}
                    onChange={() => handleUserTypeChange("advertiser")}
                    className="w-4 h-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">
                    Advertiser (I want to advertise)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="media_owner"
                    checked={formData.userType === "media_owner"}
                    onChange={() => handleUserTypeChange("media_owner")}
                    className="w-4 h-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">
                    Media Owner (I have ad space)
                  </span>
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
                onChange={(phone) =>
                  setFormData((p) => ({ ...p, phoneNumber: phone }))
                }
                inputProps={{ name: "phoneNumber", required: true }}
                inputStyle={{
                  width: "100%",
                  height: "45px",
                  paddingLeft: "48px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
                buttonStyle={{
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  border: "1px solid #ccc",
                  background: "#fff",
                }}
                containerStyle={{ width: "100%", marginBottom: "0.5rem" }}
              />
              <p className="text-xs text-blue-600 mt-1">
                We'll send an OTP to verify your number
              </p>
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
                {loading ? "Creating Account..." : "Complete Signup"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
