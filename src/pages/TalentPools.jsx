// TalentPools.jsx
// Shows all generated talent pools with candidate details
// Architecture matches Dashboard and Job_description pages

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/sidebar'
import {
  Users, Briefcase, Calendar, ChevronDown, AlertCircle,
  RefreshCw, Star, TrendingUp, Award, Search, X,
  CheckCircle, XCircle, MinusCircle,
} from 'lucide-react'
import { getAllJobDescriptions } from '../api/jd_api'
import { getTalentPoolByJD, getTalentPoolSummary } from '../api/talentpool_api'

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

const PoolCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-5 w-16" />
    </div>
    <div className="flex gap-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="grid grid-cols-3 gap-3">
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-16 rounded-xl" />
    </div>
  </div>
)

// ── Tier Badge ────────────────────────────────────────────────────────────────

const TierBadge = ({ tier }) => {
  const styles = {
    1: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    2: 'bg-blue-50 text-blue-700 border border-blue-200',
    3: 'bg-slate-100 text-slate-600 border border-slate-200',
  }
  const labels = { 1: 'Tier 1', 2: 'Tier 2', 3: 'Tier 3' }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[tier] || styles[3]}`}>
      {labels[tier] || `Tier ${tier}`}
    </span>
  )
}

// ── Recommendation Badge ──────────────────────────────────────────────────────

const RecommendationBadge = ({ rec }) => {
  if (!rec) return null
  const lower = rec.toLowerCase()
  if (lower.includes('strong')) return (
    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      <CheckCircle className="h-3 w-3" /> Strong Match
    </span>
  )
  if (lower.includes('partial')) return (
    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
      <MinusCircle className="h-3 w-3" /> Partial Match
    </span>
  )
  return (
    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      <XCircle className="h-3 w-3" /> {rec}
    </span>
  )
}

// ── Candidate Row ─────────────────────────────────────────────────────────────

const CandidateRow = ({ candidate, index }) => (
  <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-white hover:border-slate-200">
    {/* Rank */}
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
      #{index + 1}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-semibold text-slate-900">{candidate.name || '—'}</p>
        <TierBadge tier={candidate.tier} />
        <RecommendationBadge rec={candidate.recommendation} />
      </div>

      <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
        {candidate.current_role && <span>{candidate.current_role}</span>}
        {candidate.location && <span>📍 {candidate.location}</span>}
        {candidate.total_experience_years && (
          <span>{candidate.total_experience_years} yrs exp</span>
        )}
      

{candidate.email && (
  <a
    href={`mailto:${candidate.email}`}
    className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200 transition-colors"
  >
    ✉ Contact
  </a>
)}
      </div>

      {/* Skills */}
      {(candidate.matched_skills || []).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {candidate.matched_skills.slice(0, 4).map((s, i) => (
            <span key={i} className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
              ✓ {s}
            </span>
          ))}
        </div>
      )}

      {/* Justification */}
      {candidate.justification && (
        <p className="mt-2 text-xs text-slate-500 line-clamp-2">{candidate.justification}</p>
      )}
    </div>

    {/* Score */}
    <div className="shrink-0 flex flex-col items-end gap-2">

  <div className="text-right">
    <p className="text-2xl font-bold text-brand">
      {candidate.overall_fit_score}
    </p>
    <p className="text-xs text-slate-400">Fit Score</p>
  </div>

  {candidate.sources?.includes("resume") && (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
      📄 Resume
    </span>
  )}

  {candidate.sources?.includes("linkedin_zip") && (
    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
      💼 LinkedIn
    </span>
  )}

  {candidate.github_url && (
    <a
      href={candidate.github_url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white hover:bg-black"
    >
      🐙 GitHub ↗
    </a>
  )}

</div>
  </div>
)

// ── Pool Card ─────────────────────────────────────────────────────────────────

const PoolCard = ({ pool }) => {
  const [expanded, setExpanded] = useState(false)
  const [detail, setDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const handleExpand = async () => {
    if (!expanded && !detail) {
      setLoadingDetail(true)
      try {
        const data = await getTalentPoolSummary(pool.pool_id)
        setDetail(data)
      } catch {
        setDetail(null)
      } finally {
        setLoadingDetail(false)
      }
    }
    setExpanded(!expanded)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Pool Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand">#{pool.pool_id}</span>
              <span className="text-xs text-slate-400">JD-{pool.jd_id}</span>
            </div>
            <h3 className="mt-1 text-lg font-bold text-slate-900">{pool.job_role || '—'}</h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(pool.generated_at)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {pool.total_candidates} candidates
              </span>
            </div>
          </div>

          {/* Score summary */}
          <div className="shrink-0 text-right">
            <p className="text-3xl font-bold text-slate-900">{pool.total_candidates}</p>
            <p className="text-xs text-slate-400">total candidates</p>
          </div>
        </div>

        {/* Tier breakdown */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-center">
            <p className="text-xl font-bold text-emerald-700">{pool.tier1_count ?? 0}</p>
            <p className="text-xs text-emerald-600">Tier 1</p>
            <p className="text-xs text-emerald-500">Strong Match</p>
          </div>
          <div className="rounded-xl bg-blue-50 p-3 text-center">
            <p className="text-xl font-bold text-blue-700">{pool.tier2_count ?? 0}</p>
            <p className="text-xs text-blue-600">Tier 2</p>
            <p className="text-xs text-blue-500">Partial Match</p>
          </div>
          <div className="rounded-xl bg-slate-100 p-3 text-center">
            <p className="text-xl font-bold text-slate-700">{pool.tier3_count ?? 0}</p>
            <p className="text-xs text-slate-600">Tier 3</p>
            <p className="text-xs text-slate-500">Low Match</p>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={handleExpand}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:border-brand hover:text-brand"
        >
          {expanded ? 'Hide Candidates' : 'View Candidates'}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded candidates list */}
      {expanded && (
        <div className="border-t border-slate-100 px-6 pb-6 pt-4">
          {loadingDetail && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          )}
          {!loadingDetail && detail && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-500 mb-3">
                {detail.candidates?.length || 0} candidates ranked by fit score
              </p>
              {(detail.candidates || []).map((c, i) => (
                <CandidateRow key={i} candidate={c} index={i} />
              ))}
            </div>
          )}
          {!loadingDetail && !detail && (
            <p className="text-center text-sm text-slate-400 py-4">Failed to load candidates.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Content ──────────────────────────────────────────────────────────────

const TalentPoolsContent = () => {
  const [pools, setPools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      // Get all JDs first
      const jds = await getAllJobDescriptions()

      // Fetch pools for each JD in parallel
      const poolResults = await Promise.all(
        jds.map(jd => getTalentPoolByJD(jd.id))
      )

      // Flatten + sort by pool_id descending (newest first)
      const all = poolResults.flat().sort((a, b) => b.pool_id - a.pool_id)
      setPools(all)
    } catch {
      setError('Failed to load talent pools.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Filter by search
  const filtered = pools.filter(p =>
    !search.trim() ||
    (p.job_role || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Talent Pools</h1>
          <p className="mt-1 text-sm text-slate-500">
            All generated talent pools with ranked candidates.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
          <Users className="h-4 w-4 text-brand" />
          {pools.length} Pool{pools.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Stat cards */}
      {!loading && pools.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Pools</p>
              <p className="text-2xl font-bold text-slate-900">{pools.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Candidates</p>
              <p className="text-2xl font-bold text-slate-900">
                {pools.reduce((sum, p) => sum + (p.total_candidates || 0), 0)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Avg Candidates / Pool</p>
              <p className="text-2xl font-bold text-slate-900">
                {pools.length > 0
                  ? Math.round(pools.reduce((sum, p) => sum + (p.total_candidates || 0), 0) / pools.length)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {!loading && pools.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job role..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-slate-600">{error}</p>
          <button onClick={load}
            className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <PoolCardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && pools.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Users className="h-9 w-9 text-slate-300" />
          </div>
          <p className="text-lg font-semibold text-slate-700">No Talent Pools Yet</p>
          <p className="text-sm text-slate-400">Go to Job Descriptions and click "Generate Talent Pool"</p>
        </div>
      )}

      {/* Pool cards */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((pool, i) => (
            <PoolCard key={pool.pool_id || i} pool={pool} />
          ))}
        </div>
      )}

    </main>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const TalentPools = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <Sidebar />
    <TalentPoolsContent />
  </div>
)

export default TalentPools