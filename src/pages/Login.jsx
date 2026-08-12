// Login.jsx — synced with POST /auth/login
// Backend field: username_or_email (handled in auth_api.js)
// On success: saves token + user, redirects based on role

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'
import { login, saveToken, saveUser } from '../api/auth_api'

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
const InputField = ({ label, type = 'text', placeholder, value, onChange, icon: Icon, error, rightElement }) => (
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
  </div>
)

// ── Login Page ────────────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
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
    if (!form.identifier.trim()) e.identifier = 'Username or email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || loading) return
    setLoading(true)
    try {
      // Calls POST /auth/login with { username_or_email, password }
      const data = await login({ identifier: form.identifier.trim(), password: form.password })

      // Save token + user to localStorage
      saveToken(data.access_token)
      saveUser(data.user)

      showToast('success', `Welcome back, ${data.user.username}!`)

      // Redirect based on role
      setTimeout(() => {
        if (data.user.role === 'recruiter') {
          navigate('/dashboard')
        } else {
          navigate('/candidate')
        }
      }, 1000)

    } catch (err) {
      const msg = err?.response?.data?.detail || 'Invalid username/email or password.'
      showToast('error', msg)
      setErrors({ password: msg })
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
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-500">Sign in to your HireIn account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Username or Email"
              placeholder="Enter your username or email"
              value={form.identifier} onChange={set('identifier')}
              icon={Mail} error={errors.identifier}
            />

            <InputField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password} onChange={set('password')}
              icon={Lock} error={errors.password}
              rightElement={
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.remember} onChange={set('remember')}
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium text-brand hover:underline">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3
                text-sm font-semibold text-white transition-all duration-200
                hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60">
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
                : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-medium text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-brand hover:underline">Create an Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
