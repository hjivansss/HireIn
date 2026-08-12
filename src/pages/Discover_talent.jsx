// DiscoverTalent.jsx
// Select a JD → configure settings → generate talent pool
// Architecture matches Dashboard, JDDiscover, TalentPools pages

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/sidebar'
import {
  Sparkles, Briefcase, Calendar, Layers, CheckCircle,
  AlertCircle, RefreshCw, Loader2, Users, Search,
  ChevronRight, Settings, X, Clock,
} from 'lucide-react'
import { getJobDescriptionsForDiscover, generateTalentPoolForJD } from '../api/discoverTalent_api'

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

const JDSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
    <Skeleton className="h-5 w-40" />
    <div className="flex gap-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="flex gap-1">
      <Skeleton className="h-5 w-14 rounded-full" />
      <Skeleton className="h-5 w-14 rounded-full" />
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
  </div>
)

// ── Toast ─────────────────────────────────────────────────────────────────────

const Toast = ({ toast, onClose }) => {
  if (!toast) return null
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3 shadow-lg
      ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
      {toast.type === 'success'
        ? <CheckCircle className="h-5 w-5 shrink-0" />
        : <AlertCircle className="h-5 w-5 shrink-0" />}
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={onClose}><X className="h-4 w-4 opacity-70 hover:opacity-100" /></button>
    </div>
  )
}

// ── JD Selection Card ─────────────────────────────────────────────────────────

const JDCard = ({ jd, selected, onSelect }) => {
  const isSelected = selected?.id === jd.id
  return (
    <div
      onClick={() => onSelect(jd)}
      className={`cursor-pointer rounded-2xl border-2 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
        ${isSelected ? 'border-brand shadow-brand/10' : 'border-slate-200 hover:border-slate-300'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-slate-900">{jd.job_role || 'Untitled Role'}</h3>
        {isSelected && <CheckCircle className="h-5 w-5 shrink-0 text-brand" />}
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
        {jd.experience_required && (
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{jd.experience_required}</span>
        )}
        {(jd.required_skills || []).length > 0 && (
          <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" />{jd.required_skills.length} skills</span>
        )}
        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(jd.created_at)}</span>
      </div>

      {(jd.required_skills || []).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {jd.required_skills.slice(0, 4).map((s, i) => (
            <span key={i} className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">{s}</span>
          ))}
          {jd.required_skills.length > 4 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">+{jd.required_skills.length - 4}</span>
          )}
        </div>
      )}

      {jd.original_text && (
        <p className="mt-3 line-clamp-2 text-xs text-slate-400">{jd.original_text}</p>
      )}
    </div>
  )
}

// ── Main Content ──────────────────────────────────────────────────────────────

const DiscoverTalentContent = () => {
  const navigate = useNavigate()
  const [jds, setJds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')

  // Generation settings
  const [settings, setSettings] = useState({
    location: 'India',
    limit: 10,
    minScore: 0.4,
    pageSize: 10,
  })

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }

  const loadJDs = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getJobDescriptionsForDiscover()
      setJds(data)
      // Auto-select first JD if available
      if (data.length > 0 && !selected) setSelected(data[0])
    } catch {
      setError('Failed to load job descriptions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadJDs() }, [])

  const handleGenerate = async () => {
    if (!selected || generating) return
    setGenerating(true)
    try {
      const pool = await generateTalentPoolForJD({
        jdId: selected.id,
        location: settings.location,
        limit: settings.limit,
        minScore: settings.minScore,
        pageSize: settings.pageSize,
      })
      showToast('success', `Talent pool generated! ${pool.total_candidates} candidates found for "${selected.job_role}".`)
      setTimeout(() => navigate('/dashboard/talent-pools'), 2000)
    } catch (err) {
      showToast('error', err?.response?.data?.detail || 'Failed to generate talent pool.')
    } finally {
      setGenerating(false)
    }
  }

  const filtered = jds.filter(jd =>
    !search.trim() ||
    (jd.job_role || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Discover Talent</h1>
        <p className="mt-1 text-sm text-slate-500">
          Select a Job Description and generate a ranked AI talent pool.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

        {/* ── Left: JD Selection ──────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Selected JD banner */}
          {selected && (
            <div className="flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand/5 px-5 py-3">
              <CheckCircle className="h-5 w-5 shrink-0 text-brand" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand truncate">
                  Selected: {selected.job_role}
                </p>
                <p className="text-xs text-brand/70">
                  JD ID: {selected.id} · {(selected.required_skills || []).length} skills
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="ml-auto shrink-0 text-brand/50 hover:text-brand"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job descriptions..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Section label */}
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-brand" />
            <h2 className="text-sm font-semibold text-slate-700">
              Recent Job Descriptions
              {!loading && <span className="ml-1.5 text-slate-400 font-normal">({filtered.length})</span>}
            </h2>
          </div>

          {/* Error */}
          {error && (
            <div className="flex flex-col items-center gap-3 py-10">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <p className="text-sm text-slate-600">{error}</p>
              <button onClick={loadJDs}
                className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover">
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
            </div>
          )}

          {/* Skeletons */}
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => <JDSkeleton key={i} />)}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && jds.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Briefcase className="h-10 w-10 text-slate-200" />
              <p className="font-medium text-slate-600">No Job Descriptions Found</p>
              <p className="text-sm text-slate-400">Add a JD first from the Job Descriptions page</p>
              <button
                onClick={() => navigate('/dashboard/jobs')}
                className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
              >
                Go to Job Descriptions <ChevronRight className="h-4 w-4" />
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
                />
              ))}
            </div>
          )}

        </div>

        {/* ── Right: Generate Panel ────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="sticky top-8 space-y-4">

            {/* Generate card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Settings className="h-5 w-5 text-brand" />
                <h2 className="text-base font-semibold text-slate-900">Generation Settings</h2>
              </div>

              {/* Selected JD info */}
              {selected ? (
                <div className="mb-5 rounded-xl bg-brand/5 border border-brand/10 p-4">
                  <p className="text-xs font-medium text-slate-500 mb-1">Selected JD</p>
                  <p className="font-semibold text-slate-900">{selected.job_role}</p>
                  <p className="text-xs text-slate-500 mt-0.5">ID: {selected.id}</p>
                </div>
              ) : (
                <div className="mb-5 rounded-xl bg-slate-50 border border-dashed border-slate-200 p-4 text-center">
                  <p className="text-sm text-slate-400">Select a JD from the left to get started</p>
                </div>
              )}

              {/* Settings fields */}
              <div className="space-y-4">

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Location</label>
                  <input
                    type="text"
                    value={settings.location}
                    onChange={(e) => setSettings(s => ({ ...s, location: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/10"
                    placeholder="e.g. India, Bangalore"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">Candidate Limit</label>
                    <select
                      value={settings.limit}
                      onChange={(e) => setSettings(s => ({ ...s, limit: Number(e.target.value) }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none"
                    >
                      {[5, 10, 15, 20, 30].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">Min Score</label>
                    <select
                      value={settings.minScore}
                      onChange={(e) => setSettings(s => ({ ...s, minScore: Number(e.target.value) }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none"
                    >
                      <option value={0.2}>0.2 — Broad</option>
                      <option value={0.3}>0.3 — Open</option>
                      <option value={0.4}>0.4 — Balanced</option>
                      <option value={0.5}>0.5 — Strict</option>
                      <option value={0.6}>0.6 — Very Strict</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!selected || generating}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                {generating
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating Talent Pool...</>
                  : <><Sparkles className="h-4 w-4" /> Generate Talent Pool</>}
              </button>

              {!selected && (
                <p className="mt-3 text-center text-xs text-slate-400">
                  Select a JD on the left to enable generation
                </p>
              )}
            </div>

          </div>
        </div>

      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </main>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const DiscoverTalent = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <Sidebar />
    <DiscoverTalentContent />
  </div>
)

export default DiscoverTalent