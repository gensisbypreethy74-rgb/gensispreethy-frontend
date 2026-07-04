"use client";

import { useState, useRef, KeyboardEvent, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, RefreshCw, Copy, Check, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const codeFromUrl = searchParams.get("code") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(true);

  const getApiURL = () =>
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  // Auto-fill OTP inputs from a string
  const fillOtpInputs = (otpValue: string) => {
    const newOtp = Array(6).fill("");
    otpValue.split("").forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);
  };

  // Copy OTP code to clipboard
  const handleCopy = async () => {
    if (!devOtpCode) return;
    try {
      await navigator.clipboard.writeText(devOtpCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  useEffect(() => {
    if (!email) {
      router.push("/register");
      return;
    }

    const initOtp = async () => {
      setLoadingOtp(true);

      // Priority 1: OTP passed directly in URL (right after registration)
      if (codeFromUrl && codeFromUrl.trim().length === 6) {
        setDevOtpCode(codeFromUrl);
        fillOtpInputs(codeFromUrl);
        sessionStorage.setItem("dev_otp", codeFromUrl);
        setLoadingOtp(false);
        return;
      }

      // Priority 2: OTP cached in sessionStorage (page refresh)
      const storedOtp = sessionStorage.getItem("dev_otp");
      if (storedOtp && storedOtp.trim().length === 6) {
        setDevOtpCode(storedOtp);
        fillOtpInputs(storedOtp);
        setLoadingOtp(false);
        return;
      }

      // Priority 3: Auto-resend to get a new OTP from backend
      try {
        const response = await axios.post(
          `${getApiURL()}/auth/resend-otp`,
          { email },
          { timeout: 10000 }
        );

        if (response.data.success && response.data.data?.otp) {
          const newOtp = String(response.data.data.otp).trim();
          if (newOtp.length === 6 && /^\d+$/.test(newOtp)) {
            setDevOtpCode(newOtp);
            fillOtpInputs(newOtp);
            sessionStorage.setItem("dev_otp", newOtp);
          }
        }
      } catch (err: any) {
        // If the user is already verified, redirect to login
        if (
          err.response?.status === 400 &&
          err.response?.data?.message?.toLowerCase().includes("already verified")
        ) {
          router.push("/sign-in");
          return;
        }
        setApiError(
          "Could not retrieve your verification code. Use 'Resend Code' below."
        );
      } finally {
        setLoadingOtp(false);
      }
    };

    initOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, codeFromUrl]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    const newOtp = [...otp];
    digits.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const lastFilled = newOtp.findLastIndex((v) => v !== "");
    inputRefs.current[lastFilled < 5 ? lastFilled + 1 : 5]?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setApiError("Please enter the complete 6-digit code.");
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);
      setResendSuccess(null);

      const res = await axios.post(`${getApiURL()}/auth/verify-otp`, {
        email,
        otp: otpValue,
      });

      if (res.data.data) {
        localStorage.setItem("genesis_boutique_user", JSON.stringify(res.data.data));
      }
      sessionStorage.removeItem("dev_otp");
      router.push("/");
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 400 || status === 404) {
        setApiError(
          err.response?.data?.message ||
            "Invalid or expired code. Please try again."
        );
      } else {
        console.error("Verification error:", err);
        setApiError(
          err.response?.data?.message || "Something went wrong. Please try again."
        );
      }
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendSuccess(null);
      setApiError(null);
      setDevOtpCode(null);
      setOtp(Array(6).fill(""));

      const response = await axios.post(`${getApiURL()}/auth/resend-otp`, {
        email,
      });

      if (response.data.data?.otp) {
        const newOtp = String(response.data.data.otp);
        setDevOtpCode(newOtp);
        fillOtpInputs(newOtp);
        sessionStorage.setItem("dev_otp", newOtp);
        setResendSuccess("New verification code sent! Check your email.");
      } else {
        setResendSuccess("Verification code sent to your email!");
      }
    } catch (err: any) {
      setApiError(
        err.response?.data?.message || "Could not resend code. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-24">
      {/* ── Left Panel ── */}
      <div className="bg-[#0D0D0D] lg:w-5/12 flex flex-col justify-center px-8 pt-28 pb-16 lg:p-16 xl:p-24 relative overflow-hidden border-r border-[#222]">
        <div className="max-w-md mx-auto relative z-10 w-full">
          <p className="font-sans font-bold text-xs uppercase tracking-[0.25em] text-[#C5A866] mb-6 lg:mb-8">
            GENESIS BY PREETHY MEMBERSHIP
          </p>

          <h1 className="font-serif font-normal text-4xl lg:text-5xl xl:text-6xl text-[#C5A866] leading-tight mb-6">
            Almost there!
          </h1>

          <p className="font-sans text-slate-400 text-base leading-relaxed mb-8 max-w-sm">
            We&apos;ve sent a 6-digit verification code to your email. Enter it
            to activate your account.
          </p>

          {/* Email indicator */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail size={18} className="text-[#C5A866]" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Sent to
              </p>
            </div>
            <p className="text-base font-bold text-[#0A192F] break-all">
              {email}
            </p>
          </div>

          {/* Dev-mode OTP display */}
          {devOtpCode && (
            <div className="bg-amber-50 rounded-2xl p-5 shadow-sm border-2 border-amber-300 mb-6">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">
                🔐 Dev Mode — Your OTP
              </p>
              <div className="flex items-center gap-3">
                <p className="text-4xl font-black text-[#0A192F] tracking-widest">
                  {devOtpCode}
                </p>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-amber-200 hover:bg-amber-300 transition-colors"
                  title="Copy OTP"
                >
                  {copied ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} className="text-amber-700" />
                  )}
                </button>
              </div>
              <p className="text-xs text-amber-600 mt-2">
                Also sent to your email address above.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 text-slate-300">
            <ShieldCheck size={20} className="text-[#C5A866]" />
            <span className="font-sans font-medium text-sm">
              Secure Verification
            </span>
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
            Enter the 6-digit code we sent to{" "}
            <strong className="text-slate-700">{email}</strong>
          </p>

          {/* Status Box */}
          {loadingOtp ? (
            <div className="mb-8 rounded-2xl p-6 text-center border-2 bg-blue-50 border-blue-200">
              <div className="flex justify-center mb-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
              </div>
              <p className="text-blue-700 font-semibold text-sm">
                Sending your verification code...
              </p>
            </div>
          ) : devOtpCode ? (
            <div className="mb-8 rounded-2xl p-5 border-2 bg-green-50 border-green-300">
              <div className="flex items-center gap-2 mb-1">
                <Check size={18} className="text-green-600" />
                <p className="text-sm font-bold text-green-700">
                  Code ready! Auto-filled below.
                </p>
              </div>
              <p className="text-xs text-green-600 ml-6">
                Click &quot;Verify &amp; Continue&quot; to activate your account.
              </p>
            </div>
          ) : apiError ? (
            <div className="mb-8 rounded-2xl p-5 border-2 bg-red-50 border-red-300">
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={18}
                  className="text-red-500 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-sm font-bold text-red-700 mb-2">
                    Could not retrieve code
                  </p>
                  <p className="text-xs text-red-600 mb-3">{apiError}</p>
                  <button
                    onClick={handleResend}
                    type="button"
                    className="bg-[#0A192F] text-white font-bold text-sm rounded-xl px-5 py-2.5 hover:bg-slate-700 transition-colors"
                  >
                    Send New Code
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 rounded-2xl p-5 border-2 bg-amber-50 border-amber-200">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-amber-600" />
                <p className="text-sm font-semibold text-amber-700">
                  Check your email for the verification code.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {resendSuccess && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-200 flex items-center gap-2">
                <Check size={16} />
                {resendSuccess}
              </div>
            )}

            {/* OTP Input Fields */}
            <div>
              <label className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-4">
                Enter 6-Digit Code
              </label>

              <div
                className="grid grid-cols-6 gap-2 sm:gap-3"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-full aspect-square text-2xl sm:text-3xl text-center font-black text-[#0A192F] bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
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
              {!isSubmitting && (
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          {/* Resend & Back */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-slate-500">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResend}
              type="button"
              className="font-sans font-bold text-sm text-slate-600 hover:text-[#0A192F] transition-colors underline underline-offset-4 inline-flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Resend Verification Code
            </button>
            <div className="block pt-2">
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
