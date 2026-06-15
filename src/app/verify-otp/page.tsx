"use client";

import { useState, useRef, KeyboardEvent, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  // Auto-fill OTP inputs when devOtp is set
  const fillOtpInputs = (otpValue: string) => {
    const digits = otpValue.split("");
    const newOtp = Array(6).fill("");
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);
  };

  useEffect(() => {
    if (!email) {
      router.push("/register");
      return;
    }
    // Check for development OTP stored from register page
    const storedOtp = sessionStorage.getItem('dev_otp');
    if (storedOtp) {
      setDevOtp(storedOtp);
      fillOtpInputs(storedOtp);
    }
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current one is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    
    pastedData.forEach((char, index) => {
      if (/^\d+$/.test(char) && index < 6) {
        newOtp[index] = char;
      }
    });
    
    setOtp(newOtp);
    
    // Focus last filled input
    const lastFilledIndex = newOtp.findLastIndex(val => val !== "");
    const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
    inputRefs.current[focusIndex]?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      setApiError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);
      setResendSuccess(null);
      
      const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        
      const res = await axios.post(`${apiURL}/auth/verify-otp`, { email, otp: otpValue });

      // Success! Save user and redirect to home page
      if (res.data.data) {
        localStorage.setItem('luxygalleria_user', JSON.stringify(res.data.data));
      }
      router.push("/");
    } catch (err: any) {
      // Don't log expected OTP errors to console
      const status = err.response?.status;
      if (status === 400 || status === 404) {
        setApiError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
      } else {
        console.error("Verification error:", err);
        setApiError(err.response?.data?.message || "Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      setApiError(null);
      setResendSuccess(null);
      
      const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        
      const response = await axios.post(`${apiURL}/auth/resend-otp`, { email });

      // Check if OTP is returned (development mode)
      if (response.data.data?.otp) {
        const newOtp = response.data.data.otp;
        sessionStorage.setItem('dev_otp', newOtp);
        setDevOtp(newOtp);
        fillOtpInputs(newOtp); // Auto-fill the OTP boxes!
      }

      setResendSuccess("New OTP generated successfully!");
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const status = err.response?.status;
      if (status !== 400 && status !== 404) {
        console.error("Resend OTP error:", err);
      }
      setApiError(err.response?.data?.message || "Something went wrong while resending OTP.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-24">
      {/* ── Left Panel: Brand Context ── */}
      <div className="bg-[#F5F0EB] lg:w-5/12 flex flex-col justify-center px-8 pt-28 pb-16 lg:p-16 xl:p-24 relative overflow-hidden">
        <div className="max-w-md mx-auto relative z-10 w-full">
          <p className="font-sans font-bold text-xs uppercase tracking-[0.25em] text-slate-800 mb-6 lg:mb-8">
            LUXY GALLERIA MEMBERSHIP
          </p>
          
          <h1 className="font-serif font-normal text-4xl lg:text-5xl xl:text-6xl text-[#0A192F] leading-tight mb-6">
            Almost there!
          </h1>
          
          <p className="font-sans text-slate-600 text-base leading-relaxed mb-8 max-w-sm">
            Your verification code is ready. Enter it on the right to complete your account setup.
          </p>

          {/* OTP also shown on left panel */}
          {devOtp && (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-amber-200 mb-8">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Your OTP Code</p>
              <p className="text-4xl font-black text-[#0A192F] tracking-widest">{devOtp}</p>
            </div>
          )}
          
          <div className="flex items-center gap-3 text-slate-700">
            <ShieldCheck size={20} className="text-slate-900" />
            <span className="font-sans font-medium text-sm">Secure Verification</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel: OTP Form ── */}
      <div className="bg-white lg:w-7/12 flex flex-col justify-center px-8 py-16 lg:p-16 xl:p-24 overflow-y-auto">
        <div className="max-w-xl mx-auto w-full">
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-[#0A192F] mb-3">
            Verify Email
          </h2>
          <p className="font-sans text-slate-500 text-base mb-8">
            Enter the 6-digit verification code below
          </p>

          {/* ── OTP Display Box (always visible) ── */}
          <div className={`mb-8 rounded-2xl p-6 text-center border-2 ${devOtp ? 'bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
            {devOtp ? (
              <>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">🔐 Your Verification Code</p>
                <p className="text-5xl font-black text-[#0A192F] tracking-[0.3em] mb-3">{devOtp}</p>
                <p className="text-sm text-amber-700 font-medium">✅ Code auto-filled below — click "Verify & Continue"</p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">⏳ Waiting for OTP</p>
                <p className="text-slate-400 text-base">Click <strong className="text-slate-700">"Get Verification Code"</strong> below</p>
                <button
                  onClick={handleResend}
                  type="button"
                  className="mt-4 bg-[#0A192F] text-white font-bold text-sm rounded-xl px-6 py-3 hover:bg-slate-700 transition-colors"
                >
                  Get Verification Code
                </button>
              </>
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {apiError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {apiError}
              </div>
            )}

            {resendSuccess && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100">
                ✅ {resendSuccess}
              </div>
            )}
            
            {/* OTP Input Fields */}
            <div>
              <label className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-4">
                ENTER OTP CODE
              </label>
              
              <div className="flex items-center justify-between gap-2 sm:gap-4 border-2 border-slate-200 rounded-2xl p-4 sm:p-6 bg-slate-50 shadow-sm" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 sm:w-14 sm:h-16 sm:text-3xl text-2xl text-center font-black text-[#0A192F] bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 placeholder:text-slate-300 transition-all"
                    placeholder="·"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || otp.join("").length !== 6}
              className="w-full bg-[#0A192F] text-white font-bold text-base rounded-xl py-4 sm:py-5 flex items-center justify-center gap-2 group hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#A68B5B]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying..." : "Verify & Continue"} 
              {!isSubmitting && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          {/* Resend & Back */}
          <div className="mt-8 text-center space-y-3">
            <button 
              onClick={handleResend}
              type="button"
              className="font-sans font-bold text-sm text-slate-600 hover:text-[#0A192F] transition-colors underline underline-offset-4"
            >
              🔄 Resend Verification Code
            </button>
            <div className="block">
              <Link 
                href="/register" 
                className="font-sans text-sm text-slate-400 hover:text-slate-900 transition-colors"
              >
                ← Back to Registration
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
