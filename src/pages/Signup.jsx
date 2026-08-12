// Signup.jsx — synced with POST /auth/register and POST /auth/register/candidate
// Role is determined by which tab the user selects (Recruiter / Candidate)

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, Check, X, CheckCircle } from 'lucide-react'
import { registerRecruiter, registerCandidate, saveToken, saveUser } from '../api/auth_api'

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3 shadow-xl
      ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
      {toast.type === 'success'
        ? <CheckCircle className="h-5 w-5 shrink-0" />
        : <AlertCircle className="h-5 w-5 shrink-0" />}
      <p className="text-sm font-medium">{toast.message}</p>
    </div>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
const InputField = ({ label, type = 'text', placeholder, value, onChange, icon: Icon, error, rightElement, hint }) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-800
          placeholder-slate-400 outline-none transition-all duration-200
          focus:border-brand focus:ring-2 focus:ring-brand/10
          ${error ? 'border-red-400 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'}`}
      />
      {rightElement && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>}
    </div>
    {error && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{error}</p>}
    {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
)

// ── Password Strength ─────────────────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'One uppercase letter',  pass: /[A-Z]/.test(password) },
    { label: 'One lowercase letter',  pass: /[a-z]/.test(password) },
    { label: 'One number',            pass: /\d/.test(password) },
    { label: 'One special character', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const passed = checks.filter(c => c.pass).length
  const strength = passed <= 1 ? 'Weak' : passed <= 3 ? 'Fair' : passed === 4 ? 'Good' : 'Strong'
  const barColor = { Weak: 'bg-red-500', Fair: 'bg-amber-400', Good: 'bg-brand', Strong: 'bg-emerald-500' }
  const barWidth = { Weak: 'w-1/5', Fair: 'w-2/5', Good: 'w-3/5', Strong: 'w-full' }
  if (!password) return null
  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${barColor[strength]} ${barWidth[strength]}`} />
        </div>
        <span className={`text-xs font-medium ${
          strength === 'Strong' ? 'text-emerald-600' : strength === 'Good' ? 'text-brand' :
          strength === 'Fair' ? 'text-amber-500' : 'text-red-500'}`}>{strength}</span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c, i) => (
          <div key={i} className={`flex items-center gap-1.5 text-xs ${c.pass ? 'text-emerald-600' : 'text-slate-400'}`}>
            {c.pass ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
            {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Signup Page ───────────────────────────────────────────────────────────────
const Signup = () => {
  const navigate = useNavigate()
  // Role tab: 'recruiter' → POST /auth/register
  //           'candidate' → POST /auth/register/candidate
  const [role, setRole] = useState('recruiter')
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', agreeTerms: false })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required'
    else if (form.username.trim().length < 3) e.username = 'Minimum 3 characters'
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Only letters, numbers, underscores'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the Terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || loading) return
    setLoading(true)
    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      }

      // Call correct endpoint based on selected role tab
      const data = role === 'recruiter'
        ? await registerRecruiter(payload)   // POST /auth/register
        : await registerCandidate(payload)   // POST /auth/register/candidate

      // Save token + user (backend returns token immediately on register)
      saveToken(data.access_token)
      saveUser(data.user)

      showToast('success', `Account created! Welcome, ${data.user.username}!`)

      // Redirect based on role
      setTimeout(() => {
        navigate(role === 'recruiter' ? '/dashboard' : '/candidate')
      }, 1200)

    } catch (err) {
      const msg = err?.response?.data?.detail || 'Registration failed. Please try again.'
      showToast('error', msg)
      // Map backend conflict errors to specific fields
      if (typeof msg === 'string') {
        if (msg.toLowerCase().includes('email')) setErrors(er => ({ ...er, email: msg }))
        else if (msg.toLowerCase().includes('username')) setErrors(er => ({ ...er, username: msg }))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Toast toast={toast} />
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-5 py-3
            shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
              <span className="text-lg font-black text-white">N</span>
            </div>
            <div className="text-left">
              <p className="text-base font-bold text-slate-900 leading-none">HireIn</p>
              <p className="text-xs text-slate-400 leading-none mt-0.5">AI Recruitment</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Create Your Account</h1>
            <p className="mt-2 text-sm text-slate-500">Join the AI Talent Intelligence Platform</p>
          </div>

          {/* Role tabs — determines which backend endpoint is called */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            {['recruiter', 'candidate'].map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`rounded-lg py-2 text-sm font-semibold capitalize transition-all duration-200
                  ${role === r ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {r === 'recruiter' ? '🏢 Recruiter' : '👤 Candidate'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField label="Username" placeholder="Choose a username"
              value={form.username} onChange={set('username')} icon={User}
              error={errors.username} hint="Letters, numbers, underscores only" />

            <InputField label="Email Address" type="email" placeholder="Enter your email"
              value={form.email} onChange={set('email')} icon={Mail} error={errors.email} />

            <div>
              <InputField label="Password" type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={form.password} onChange={set('password')} icon={Lock}
                error={errors.password}
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                } />
              <PasswordStrength password={form.password} />
            </div>

            <InputField label="Confirm Password" type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={form.confirmPassword} onChange={set('confirmPassword')} icon={Lock}
              error={errors.confirmPassword}
              rightElement={
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="text-slate-400 hover:text-slate-600">
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              } />

            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.agreeTerms} onChange={set('agreeTerms')}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" />
                <span className="text-sm text-slate-600">
                  I agree to the <a href="#" className="font-medium text-brand hover:underline">Terms of Service</a>
                  {' '}and <a href="#" className="font-medium text-brand hover:underline">Privacy Policy</a>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3.5 w-3.5" />{errors.agreeTerms}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3
                text-sm font-semibold text-white transition-all duration-200
                hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60">
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
                : <>Create {role === 'recruiter' ? 'Recruiter' : 'Candidate'} Account <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
