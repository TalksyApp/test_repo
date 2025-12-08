"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ArrowRight, User as UserIcon, Lock, Mail, LucideIcon } from "lucide-react"

import PhoneMockup from "@/components/auth/phone-mockup"
import WelcomeHero from "@/components/auth/welcome-hero"

/* --- REUSABLE INPUT COMPONENT --- */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon
}

const InputField: React.FC<InputFieldProps> = ({ icon: Icon, ...props }) => (
  <div className="relative group">
    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors duration-300">
      <Icon size={20} />
    </div>
    <input
      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-14 pr-5 text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 focus:bg-zinc-900 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-300 text-base"
      {...props}
    />
  </div>
)

/* --- GOOGLE ICON --- */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [step, setStep] = useState<"basic" | "profile">("basic")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Transition state for the split screen
  const [isAnimating, setIsAnimating] = useState(false)
  const [slideDirection, setSlideDirection] = useState("right")

  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  })

  // We keep the extended form data for the backend, even if we only show basic fields first
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    cityOfBirth: "",
    birthday: "",
    zodiac: "",
    motherTongue: "",
    gender: "",
    currentCity: "",
    school: "",
  })

  // --- MODE SWITCHING ANIMATION ---
  const handleModeSwitch = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSlideDirection(mode === "signup" ? "right" : "left") // If currently signup, we go right to signin

    setTimeout(() => {
      setMode(prev => prev === "signin" ? "signup" : "signin")
      setStep("basic")
      setError("")
      setIsAnimating(false)
    }, 400)
  }

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (mode === "signin") {
      setSigninData((prev) => ({ ...prev, [name]: value }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: signinData.email,
        password: signinData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setLoading(false)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      console.error("Sign in error:", err)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleSignupNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.username && formData.email && formData.password) {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }
      setError("")
      setStep("profile")
    } else {
      setError("Please fill in all required fields")
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create account")
        setLoading(false)
        return
      }

      // Auto sign in after signup
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Account created but sign in failed. Please sign in manually.")
        setLoading(false)
      } else {
        router.push("/")
        router.refresh()
      }

    } catch (err) {
      console.error("Signup error:", err)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-transparent font-sans selection:bg-indigo-500/30 overflow-hidden text-zinc-100">

      {/* --- LEFT SIDE: DYNAMIC HERO (Desktop Only) --- */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-transparent overflow-hidden transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-black/50 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">

          {/* LOGIN MODE: PHONE + LOGO */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 transform ${mode === 'signin' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95 pointer-events-none'}`}>
            <div className="mb-8 text-center relative z-30">
              <h1 className="text-6xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl">Talksy<span className="text-indigo-500">.</span></h1>
              <p className="text-zinc-400 text-lg">Connect with the Void.</p>
            </div>
            <PhoneMockup />
          </div>

          {/* SIGNUP MODE: WELCOME HERO */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 transform ${mode === 'signup' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
            <WelcomeHero />
          </div>

        </div>
      </div>

      {/* --- RIGHT SIDE: AUTH FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-black/60 backdrop-blur-md">
        <div className="absolute inset-0 lg:hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

        <div className="w-full max-w-md space-y-6">

          {/* Mobile Header */}
          <div className="text-center lg:text-left">
            <div className="lg:hidden mb-6 inline-block">
              <h1 className="text-4xl font-black text-white tracking-tighter">Talksy<span className="text-indigo-500">.</span></h1>
            </div>

            <div className={`transition-all duration-500 ease-in-out transform ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {mode === "signup" ? "Create an account" : "Welcome back"}
              </h2>
              <p className="text-zinc-500 text-base">
                {mode === "signup"
                  ? (step === 'basic' ? "Enter your details to join the network." : "Tell us a bit about yourself.")
                  : "Please enter your details to sign in."}
              </p>
            </div>
          </div>

          {/* Google Btn */}
          <button
            type="button"
            className="w-full py-3.5 bg-white text-black rounded-xl flex items-center justify-center gap-3 font-bold text-base hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-900"></div>
            </div>
            <div className="relative bg-transparent px-4 text-xs text-zinc-600 font-medium uppercase tracking-wider">
              Or continue with email
            </div>
          </div>

          {/* Form Container */}
          <div className="relative overflow-hidden">
            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <form
              onSubmit={mode === 'signin' ? handleSigninSubmit : (step === 'basic' ? handleSignupNext : handleProfileSubmit)}
              className={`transition-all duration-500 ease-in-out transform ${isAnimating
                ? (slideDirection === 'left' ? '-translate-x-[20%] opacity-0' : 'translate-x-[20%] opacity-0')
                : 'translate-x-0 opacity-100'
                }`}
            >
              {/* --- SIGN IN FIELDS --- */}
              {mode === 'signin' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <InputField
                    icon={Mail}
                    type="email"
                    name="email"
                    value={signinData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                  />
                  <InputField
                    icon={Lock}
                    type="password"
                    name="password"
                    value={signinData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                  <div className="flex justify-between items-center pt-1">
                    <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer hover:text-white transition-colors">
                      <input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-indigo-500 focus:ring-indigo-500/20" />
                      Remember me
                    </label>
                    <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Forgot Password?</a>
                  </div>
                </div>
              )}

              {/* --- SIGN UP: BASIC FIELDS --- */}
              {mode === 'signup' && step === 'basic' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <InputField
                    icon={UserIcon}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                  />
                  <InputField
                    icon={Mail}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                  />
                  <InputField
                    icon={Lock}
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </div>
              )}

              {/* --- SIGN UP: PROFILE FIELDS (Adapting old fields to new design) --- */}
              {mode === 'signup' && step === 'profile' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself (Bio)"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 focus:bg-zinc-900 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-300 text-sm"
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      icon={UserIcon}
                      name="cityOfBirth"
                      value={formData.cityOfBirth}
                      onChange={handleChange}
                      placeholder="City"
                    />
                    <InputField
                      icon={UserIcon}
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      placeholder="Birthday"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-xl text-lg hover:bg-zinc-800 hover:border-zinc-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
              >
                {loading ? "Processing..." : (
                  <>
                    {mode === 'signup' && step === 'basic' ? "Continue" : (mode === 'signup' ? "Complete Profile" : "Sign In")}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-zinc-500 text-sm">
                  {mode === 'signup' ? "Already have an account?" : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={handleModeSwitch}
                    className="ml-2 text-white font-bold hover:underline underline-offset-4"
                  >
                    {mode === 'signup' ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
