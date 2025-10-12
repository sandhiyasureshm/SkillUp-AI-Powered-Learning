import React, { useState } from "react";
import { LogIn, Mail, Lock, Loader2, KeyRound } from "lucide-react";
import "../styles/AuthLayout.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("password"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Forgot Password States
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // --- Password Login ---
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://skillup-ai-powered-learning-1.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("✅ Login successful!");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setMessage(data.message || "❌ Invalid email or password.");
      }
    } catch (err) {
      setMessage("⚠️ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- OTP Login ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://skillup-ai-powered-learning-1.onrender.com/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        setMessage(`✅ OTP sent to ${email}`);
      } else {
        setMessage(data.message || "❌ Failed to send OTP.");
      }
    } catch {
      setMessage("⚠️ Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://skillup-ai-powered-learning-1.onrender.com/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("🎉 OTP verified successfully!");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setMessage(data.message || "❌ Invalid OTP.");
      }
    } catch {
      setMessage("⚠️ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- Forgot Password Handlers ---
  const handleSendOtpForReset = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch("https://skillup-ai-powered-learning-1.onrender.com/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetStep(2);
        setMessage("✅ OTP sent to your email!");
      } else setMessage(data.message || "❌ Failed to send OTP.");
    } catch {
      setMessage("⚠️ Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpForReset = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch("https://skillup-ai-powered-learning-1.onrender.com/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetStep(3);
        setMessage("✅ OTP verified! Enter new password.");
      } else setMessage(data.message || "❌ Invalid OTP.");
    } catch {
      setMessage("⚠️ Server error.");
    } finally {
      setLoading(false);
    }
  };

 // --- Forgot Password: Reset Password ---
const handleResetPassword = async () => {
  if (newPassword !== confirmNewPassword) {
    setMessage("❌ Passwords do not match.");
    return;
  }
  if (newPassword.length < 6) {
    setMessage("❌ Password must be at least 6 characters.");
    return;
  }

  setLoading(true);
  setMessage('');

  try {
    const res = await fetch("https://skillup-ai-powered-learning-1.onrender.com/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }), // send OTP along with email and newPassword
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Password reset successful! You can now login.");
      setForgotPassword(false);
      setResetStep(1);
      setNewPassword('');
      setConfirmNewPassword('');
      setOtp('');
    } else {
      setMessage(data.message || "❌ Password reset failed.");
    }
  } catch (err) {
    setMessage("⚠️ Server error.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container min-h-screen flex bg-gray-50">
      {/* Left Section */}
      <div className="auth-left hidden lg:flex flex-col justify-center p-12 w-1/2 bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-2xl">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
          <span className="text-teal-400">✨ Skill Up.</span> Learn. Get Hired.
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Master industry-relevant skills, prepare for interviews, and launch your dream career.
        </p>
        {["All-in-One Learning","Job Preparation Hub","Explore Career Resources"].map((title, index) => (
          <div
            key={index}
            className="feature-card p-4 my-3 bg-gray-800/60 backdrop-blur-sm rounded-lg border-l-4 border-teal-500 shadow-lg hover:bg-gray-800/80 transition"
          >
            <h3 className="text-xl font-bold text-teal-300 mb-1">{title}</h3>
            <p className="text-sm text-gray-400">
              {index === 0 && "Access courses across trending domains—coding, AI, data science."}
              {index === 1 && "Practice mock interviews, solve real-world problems with AI feedback."}
              {index === 2 && "Access curated links to trusted websites for skill-building and certifications."}
            </p>
          </div>
        ))}
      </div>

      {/* Right Section */}
      <div className="auth-right w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-xl shadow-2xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <LogIn className="mr-3 text-teal-600" size={30} /> Log In to Skill Up
          </h2>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-4">
            <button
              className={`px-4 py-2 rounded-l-lg font-semibold ${mode==="password"?"bg-teal-500 text-white":"bg-gray-200 text-gray-600"}`}
              onClick={() => { setMode("password"); setStep(1); setMessage(""); setForgotPassword(false); }}
            >
              Password Login
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg font-semibold ${mode==="otp"?"bg-teal-500 text-white":"bg-gray-200 text-gray-600"}`}
              onClick={() => { setMode("otp"); setStep(1); setMessage(""); setForgotPassword(false); }}
            >
              OTP Login
            </button>
          </div>

          {/* Login Form */}
          {!forgotPassword && (
          <form
            onSubmit={ mode === "password" ? handlePasswordLogin : step===1 ? handleSendOtp : handleVerifyOtp }
            className="auth-form flex flex-col space-y-4"
          >
            <div className="input-group">
              <Mail className="input-icon" />
              <input type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} required disabled={loading}/>
            </div>

            {mode==="password" && (
              <div className="input-group">
                <Lock className="input-icon" />
                <input type="password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} required disabled={loading}/>
              </div>
            )}

            {mode==="otp" && step===2 && (
              <div className="input-group">
                <KeyRound className="input-icon" />
                <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} maxLength={6} required disabled={loading}/>
              </div>
            )}

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mx-auto"/> : mode==="password" ? "Login" : step===1 ? "Send OTP" : "Verify OTP"}
            </button>

            <div className="flex justify-between mt-2">
              <button type="button" className="text-sm text-teal-500 hover:underline" onClick={()=>setForgotPassword(true)}>
                Forgot Password?
              </button>
              <button type="button" className="text-sm text-teal-500 hover:underline" onClick={()=>navigate("/signup")}>
                Sign Up
              </button>
            </div>
          </form>
          )}

          {/* Forgot Password Section */}
          {forgotPassword && (
            <div className="forgot-password-section mt-5 p-5 border rounded-lg bg-gray-50">
              {resetStep===1 && (
                <>
                  <p className="mb-2">Enter your email to reset password:</p>
                  <div className="input-group mb-3">
                    <Mail className="input-icon" />
                    <input type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)}/>
                  </div>
                  <button className="primary-btn" onClick={handleSendOtpForReset}>Send OTP</button>
                </>
              )}

              {resetStep===2 && (
                <>
                  <p className="mb-2">Enter OTP sent to your email:</p>
                  <div className="input-group mb-3">
                    <KeyRound className="input-icon" />
                    <input type="text" placeholder="6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} maxLength={6}/>
                  </div>
                  <button className="primary-btn" onClick={handleVerifyOtpForReset}>Verify OTP</button>
                </>
              )}

              {resetStep===3 && (
                <>
                  <p className="mb-2">Enter new password:</p>
                  <div className="input-group mb-3">
                    <Lock className="input-icon" />
                    <input type="password" placeholder="New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)}/>
                  </div>
                  <div className="input-group mb-3">
                    <Lock className="input-icon" />
                    <input type="password" placeholder="Confirm Password" value={confirmNewPassword} onChange={e=>setConfirmNewPassword(e.target.value)}/>
                  </div>
                  <button className="primary-btn" onClick={handleResetPassword}>Reset Password</button>
                </>
              )}

              <div className="mt-2 text-right">
                <button type="button" className="text-sm text-teal-500 hover:underline" onClick={()=>setForgotPassword(false)}>
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className={`mt-5 p-3 rounded-lg text-sm font-medium ${message.includes("✅") || message.includes("🎉") ? "bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .input-group { display:flex; align-items:center; padding:10px 15px; border:1px solid #e2e8f0; border-radius:8px; background-color:#f7fafc; transition: all 0.2s; }
        .input-group:focus-within { border-color:#38b2ac; box-shadow:0 0 0 3px rgba(56,178,172,0.3);}
        .input-icon { color:#a0aec0; margin-right:10px; }
        .primary-btn { width:100%; padding:12px; background-color:#1abc9c; color:white; font-weight:700; border-radius:8px; transition: background 0.2s, transform 0.2s; display:flex; justify-content:center; align-items:center; }
        .primary-btn:hover { background-color:#149174; }
      `}</style>
    </div>
  );
}
