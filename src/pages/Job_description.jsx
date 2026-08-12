// Job_description.jsx
// Job Description Discover page — Add JD + Browse/Select previous JDs
// Architecture matches Dashboard.jsx — Sidebar + Content side by side
// API calls are in jd_api.js and talentpool_api.js

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/sidebar'
import {
  FileText, Plus, Search, ChevronDown, CheckCircle,
  AlertCircle, RefreshCw, Loader2, Briefcase, Calendar,
  Layers, Sparkles, X, Clock,
} from 'lucide-react'
import { createJobDescription, getAllJobDescriptions } from '../api/jd_api'
import { generateTalentPool } from '../api/talentpool_api'

// ── Constants ─────────────────────────────────────────────────────────────────

const JOB_ROLES = [
  'All Roles', 'Backend Developer', 'Frontend Developer', 'Full Stack Developer',
  'Python Developer', 'Java Developer', 'React Developer', 'AI/ML Engineer',
  'Data Scientist', 'Data Analyst', 'DevOps Engineer', 'Cloud Engineer',
  'Software Engineer', 'QA Engineer', 'Mobile App Developer', 'UI/UX Designer',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-slate-100 ${className}`} />
)

const JDCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
    <Skeleton className="h-6 w-48" />
    <div className="flex gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-9 w-28" />
      <Skeleton className="h-9 w-36" />
    </div>
  </div>
)

// ── Toast ─────────────────────────────────────────────────────────────────────

const Toast = ({ toast, onClose }) => {
  if (!toast) return null
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3 shadow-lg transition-all duration-300
      ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
      {toast.type === 'success'
        ? <CheckCircle className="h-5 w-5 shrink-0" />
        : <AlertCircle className="h-5 w-5 shrink-0" />}
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// ── Add JD Card ───────────────────────────────────────────────────────────────

const AddJDCard = ({ onSuccess }) => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSubmit = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    try {
      await createJobDescription(text.trim())
      setText('')
      showToast('success', 'Job Description analyzed and saved successfully!')
      onSuccess()  // refresh JD list
    } catch (err) {
      showToast('error', err?.response?.data?.detail || 'Failed to save JD. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add New Job Description</h2>
            <p className="text-sm text-slate-500">Paste a JD and AI will extract structured requirements</p>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            placeholder="Paste the complete Job Description here..."
            rows={8}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-colors duration-200 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-50"
          />
          {/* Character counter */}
          <span className="absolute bottom-3 right-3 text-xs text-slate-400">
            {text.length} characters
          </span>
        </div>

        {/* Submit */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            AI will extract: role, skills, experience, tools, and more
          </p>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            className="flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
              : <><Sparkles className="h-4 w-4" /> Analyze & Save JD</>}
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  )
}

// ── JD Card ───────────────────────────────────────────────────────────────────

const JDCard = ({ jd, selected, onSelect, onGenerate, generating }) => {
  const isSelected = selected?.id === jd.id

  return (
    <div
      onClick={() => onSelect(jd)}
      className={`relative cursor-pointer rounded-2xl border-2 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
        ${isSelected
          ? 'border-brand shadow-md shadow-brand/10'
          : 'border-slate-200 hover:border-slate-300'
        }`}
    >
      {/* Selected check */}
      {isSelected && (
        <div className="absolute right-4 top-4">
          <CheckCircle className="h-5 w-5 text-brand" />
        </div>
      )}

      {/* Job Role */}
      <h3 className="text-lg font-bold text-slate-900 pr-8">
        {jd.job_role || 'Untitled Role'}
      </h3>

      {/* Meta row */}
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {jd.experience_required && (
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {jd.experience_required}
          </span>
        )}
        {(jd.required_skills || []).length > 0 && (
          <span className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            {jd.required_skills.length} skills
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(jd.created_at)}
        </span>
        {jd.seniority_level && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {jd.seniority_level}
          </span>
        )}
      </div>

      {/* Skills preview */}
      {(jd.required_skills || []).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {jd.required_skills.slice(0, 5).map((s, i) => (
            <span key={i} className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
              {s}
            </span>
          ))}
          {jd.required_skills.length > 5 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
              +{jd.required_skills.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* JD text preview */}
      {jd.original_text && (
        <p className="mt-3 line-clamp-2 text-sm text-slate-500">
          {jd.original_text}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onSelect(jd)}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200
            ${isSelected
              ? 'bg-brand text-white'
              : 'border border-slate-200 text-slate-600 hover:border-brand hover:text-brand'
            }`}
        >
          {isSelected ? <><CheckCircle className="h-3.5 w-3.5" /> Selected</> : 'Select JD'}
        </button>

        <button
          onClick={() => onGenerate(jd)}
          disabled={generating === jd.id}
          className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating === jd.id
            ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...</>
            : <><Sparkles className="h-3.5 w-3.5" /> Generate Talent Pool</>}
        </button>
      </div>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

const EmptyState = ({ onAddClick }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
      <FileText className="h-9 w-9 text-slate-300" />
    </div>
    <div>
      <p className="text-lg font-semibold text-slate-700">No Job Descriptions Available</p>
      <p className="mt-1 text-sm text-slate-400">Add your first JD to get started</p>
    </div>
    <button
      onClick={onAddClick}
      className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
    >
      <Plus className="h-4 w-4" /> Add Your First JD
    </button>
  </div>
)
// ── Main Page Content ─────────────────────────────────────────────────────────

const Job_descriptionContent = () => {
  const navigate = useNavigate()
  const [jds, setJds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [generating, setGenerating] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [toast, setToast] = useState(null)
  const textareaRef = useState(null)

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  // Load all JDs
  const loadJDs = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllJobDescriptions()
      setJds(data)
    } catch {
      setError('Failed to load job descriptions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadJDs() }, [])

  // Filter JDs by search + role dropdown
  const filtered = useMemo(() => {
    return jds.filter((jd) => {
      const matchRole = roleFilter === 'All Roles' ||
        (jd.job_role || '').toLowerCase().includes(roleFilter.toLowerCase())
      const matchSearch = !search.trim() ||
        (jd.job_role || '').toLowerCase().includes(search.toLowerCase()) ||
        (jd.original_text || '').toLowerCase().includes(search.toLowerCase())
      return matchRole && matchSearch
    })
  }, [jds, search, roleFilter])

  // Generate talent pool for a JD
  const handleGenerate = async (jd) => {
    setGenerating(jd.id)
    try {
      const pool = await generateTalentPool({ jdId: jd.id })
      showToast('success', `Talent pool generated! ${pool.total_candidates} candidates found.`)
      // Navigate to talent pools page after short delay
      setTimeout(() => navigate('/dashboard/talent-pools'), 1500)
    } catch (err) {
      showToast('error', err?.response?.data?.detail || 'Failed to generate talent pool.')
    } finally {
      setGenerating(null)
    }
  }

  const handleSelect = (jd) => {
  if (selected?.id === jd.id) {
    setSelected(null); // Unselect
  } else {
    setSelected(jd); // Select
  }
};

  // Scroll to add section
  const scrollToAdd = () => {
    document.getElementById('add-jd-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-8">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Descriptions</h1>
          <p className="mt-1 text-sm text-slate-500">
            Add and manage job descriptions — AI extracts structured requirements automatically.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
          <Briefcase className="h-4 w-4 text-brand" />
          {jds.length} Job Description{jds.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Section 1: Add New JD ────────────────────────────────────────────── */}
      <div id="add-jd-section">
        <AddJDCard onSuccess={loadJDs} />
      </div>

      {/* ── Section 2: Previous JDs ──────────────────────────────────────────── */}
      <div>
        {/* Section header */}
        <div className="flex items-center gap-2 mb-5">
          <FileText className="h-5 w-5 text-brand" />
          <h2 className="text-base font-semibold text-slate-900">Previous Job Descriptions</h2>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-5">

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job role or description..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Role filter dropdown */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-700 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 cursor-pointer"
            >
              {JOB_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && jds.length > 0 && (
          <p className="mb-4 text-xs text-slate-400">
            Showing {filtered.length} of {jds.length} job descriptions
            {search && ` for "${search}"`}
            {roleFilter !== 'All Roles' && ` in ${roleFilter}`}
          </p>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>
            <p className="text-slate-600">{error}</p>
            <button onClick={loadJDs}
              className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <JDCardSkeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && jds.length === 0 && (
          <EmptyState onAddClick={scrollToAdd} />
        )}

        {/* No results after filter */}
        {!loading && !error && jds.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Search className="h-10 w-10 text-slate-200" />
            <p className="text-slate-500">No JDs match your search.</p>
            <button
              onClick={() => { setSearch(''); setRoleFilter('All Roles') }}
              className="text-sm font-medium text-brand hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* JD Cards grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((jd) => (
              <JDCard
                key={jd.id}
                jd={jd}
                selected={selected}
                onSelect={setSelected}
                onGenerate={handleGenerate}
                generating={generating}
              />
            ))}
          </div>
        )}
      </div>

      {/* Global toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </main>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const Job_description = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <Sidebar />
    <Job_descriptionContent />
  </div>
)

export default Job_description