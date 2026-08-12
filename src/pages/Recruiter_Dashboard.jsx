// Recruiter_Dashboard.jsx
// Sidebar + Dashboard content side by side
// Sidebar is imported unchanged — DO NOT modify sidebar

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/sidebar'
import {
  Briefcase, FolderKanban, FileText, Users, UserCheck,
  Calendar, CheckCircle, BarChart3, ArrowRight,
  AlertCircle, RefreshCw,
} from 'lucide-react'
import { getDashboardSummary, getRecentJobDescriptions, getRecentResumes, getTalentPoolsByJD } from '../api/dashboard_api'

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

const todayStr = () => new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
})

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-slate-100 ${className}`} />
)

const TableSkeleton = ({ rows = 3, cols = 4 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="border-t border-slate-100">
        {Array.from({ length: cols }).map((_, j) => (
          <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
        ))}
      </tr>
    ))}
  </>
)

// ── Reusable UI ───────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, title, count, subtitle, loading }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand">
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div>
      <p className="text-xs text-slate-500">{title}</p>
      {loading
        ? <Skeleton className="mt-1 h-7 w-12" />
        : <p className="text-2xl font-bold text-slate-900">{count ?? 0}</p>}
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  </div>
)

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="h-5 w-5 text-brand" />
    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
  </div>
)

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50">
    {children}
  </th>
)

const Td = ({ children }) => (
  <td className="px-4 py-3 text-sm text-slate-700">{children}</td>
)

const Badge = ({ label, color }) => {
  const colors = {
    green: 'bg-emerald-50 text-emerald-700',
    blue:  'bg-blue-50 text-blue-700',
    slate: 'bg-slate-100 text-slate-600',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color] || colors.slate}`}>
      {label}
    </span>
  )
}

const EmptyRow = ({ cols, message }) => (
  <tr>
    <td colSpan={cols} className="px-4 py-8 text-center text-sm text-slate-400">{message}</td>
  </tr>
)

// ── Dashboard Content ─────────────────────────────────────────────────────────

const DashboardContent = () => {
  const [summary, setSummary]   = useState(null)
  const [jds, setJds]           = useState([])
  const [resumes, setResumes]   = useState([])
  const [pools, setPools]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      // Step 1: fetch JDs, resumes, linkedin in parallel
      const [summaryData, jdData, resumeData] = await Promise.all([
        getDashboardSummary(),
        getRecentJobDescriptions(),
        getRecentResumes(),
      ])

      setSummary(summaryData)
      setJds(jdData)
      setResumes(resumeData)

      // Step 2: fetch talent pool summary for each JD using its ID
      const poolResults = await Promise.all(
        jdData.map(jd => getTalentPoolsByJD(jd.id))
      )
      setPools(poolResults.flat())

    } catch (e) {
      setError('Unable to load dashboard. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>
        <p className="text-slate-600">{error}</p>
        <button onClick={load}
          className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Recruiter Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here's an overview of your recruitment activity.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
          <Calendar className="h-4 w-4 text-brand" />
          {todayStr()}
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Briefcase}    title="Job Descriptions"  count={summary?.totalJDs}          subtitle="JDs saved"           loading={loading} />
        <StatCard icon={FolderKanban} title="Talent Pools"      count={pools.length}               subtitle="Pools generated"     loading={loading} />
        <StatCard icon={FileText}     title="Resumes"           count={summary?.totalResumes}       subtitle="Resumes uploaded"    loading={loading} />
        <StatCard icon={Users}        title="LinkedIn Profiles" count={summary?.totalLinkedIn}      subtitle="Profiles imported"   loading={loading} />
        <StatCard icon={UserCheck}    title="Total Candidates"  count={summary?.totalCandidates}    subtitle="Across all sources"  loading={loading} />
      </div>

      {/* ── Recent Job Descriptions ─────────────────────────────────────────── */}
      <div>
       <div className="mb-4 flex items-center justify-between">
            <SectionHeader icon={Briefcase} title="Recent Job Descriptions" />
          <button
              onClick={() => navigate("/dashboard/jobs")}
              className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-hover">
              Show More
              <ArrowRight className="h-4 w-4" />
            </button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead><tr>
              <Th>Job Title</Th>
              <Th>Required Skills</Th>
              <Th>Experience</Th>
              <Th>Created Date</Th>
              <Th>Status</Th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? <TableSkeleton rows={3} cols={5} />
                : jds.length === 0
                  ? <EmptyRow cols={5} message="No job descriptions found." />
                  : jds.slice(0, 3).map((jd, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <Td><span className="font-medium text-slate-900">{jd.job_role || '—'}</span></Td>
                      <Td>
                        <div className="flex flex-wrap gap-1">
                          {(jd.required_skills || []).slice(0, 3).map((s, j) => (
                            <span key={j} className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">{s}</span>
                          ))}
                          {(jd.required_skills || []).length > 3 && (
                            <span className="text-xs text-slate-400">+{jd.required_skills.length - 3}</span>
                          )}
                        </div>
                      </Td>
                      <Td>{jd.experience_required || '—'}</Td>
                      <Td>{formatDate(jd.created_at)}</Td>
                      <Td><Badge label="Active" color="green" /></Td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Talent Pool Summary by Pool ID ──────────────────────────────────── */}
      <div>
       <div className="mb-4 flex items-center justify-between">
                <SectionHeader icon={FolderKanban} title="Talent Pool Summary" />

              <button
                onClick={() => navigate("/dashboard/talent-pools")}
                className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-hover"
              >
                Show More
                <ArrowRight className="h-4 w-4" />
              </button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead><tr>
              <Th>Pool ID</Th>
              <Th>Job Role</Th>
              <Th>JD ID</Th>
              <Th>Total Candidates</Th>
              <Th>Tier 1</Th>
              <Th>Tier 2</Th>
              <Th>Tier 3</Th>
              <Th>Generated</Th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? <TableSkeleton rows={3} cols={8} />
                : pools.length === 0
                  ? <EmptyRow cols={8} message="No talent pools generated yet." />
                  : pools.slice(0,3).map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <Td>
                        <span className="font-mono text-xs font-bold text-brand">
                          #{p.pool_id}
                        </span>
                      </Td>
                      <Td><span className="font-medium text-slate-900">{p.job_role || '—'}</span></Td>
                      <Td><span className="font-mono text-xs text-slate-400">JD-{p.jd_id}</span></Td>
                      <Td><span className="font-semibold text-slate-900">{p.total_candidates}</span></Td>
                      <Td><Badge label={String(p.tier1_count ?? 0)} color="green" /></Td>
                      <Td><Badge label={String(p.tier2_count ?? 0)} color="blue" /></Td>
                      <Td><Badge label={String(p.tier3_count ?? 0)} color="slate" /></Td>
                      <Td>{formatDate(p.generated_at)}</Td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Recent Resume Uploads ────────────────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
                  <SectionHeader icon={FileText} title="Recent Resume Uploads" />
          </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead><tr>
              <Th>Candidate Name</Th>
              <Th>Email</Th>
              <Th>Current Role</Th>
              <Th>Skills</Th>
              <Th>Status</Th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? <TableSkeleton rows={3} cols={5} />
                : resumes.length === 0
                  ? <EmptyRow cols={5} message="No resumes uploaded yet." />
                  : resumes.slice(0, 3).map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <Td><span className="font-medium text-slate-900">{r.full_name || '—'}</span></Td>
                      <Td>{r.email || '—'}</Td>
                      <Td>{r.current_role || '—'}</Td>
                      <Td>
                        <div className="flex flex-wrap gap-1">
                          {(r.skills || []).slice(0, 3).map((s, j) => (
                            <span key={j} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{s}</span>
                          ))}
                          {(r.skills || []).length > 3 && (
                            <span className="text-xs text-slate-400">+{r.skills.length - 3}</span>
                          )}
                        </div>
                      </Td>
                      <Td><Badge label="Uploaded" color="blue" /></Td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Quick Statistics ─────────────────────────────────────────────────── */}
      <div>
        <SectionHeader icon={BarChart3} title="Quick Statistics" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4 text-brand" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Latest JD</p>
            </div>
            {loading ? <Skeleton className="h-5 w-32" />
              : <p className="text-sm font-medium text-slate-900">{jds[0]?.job_role || 'No JDs yet'}</p>}
            {!loading && jds[0] && <p className="mt-1 text-xs text-slate-400">{formatDate(jds[0]?.created_at)}</p>}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <FolderKanban className="h-4 w-4 text-brand" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Latest Pool</p>
            </div>
            {loading ? <Skeleton className="h-5 w-32" />
              : <p className="text-sm font-medium text-slate-900">{pools[pools.length - 1]?.job_role || 'No pools yet'}</p>}
            {!loading && pools[pools.length - 1] && (
              <p className="mt-1 text-xs text-slate-400">Pool #{pools[pools.length - 1]?.pool_id}</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-brand" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Latest Resume</p>
            </div>
            {loading ? <Skeleton className="h-5 w-32" />
              : <p className="text-sm font-medium text-slate-900">{resumes[resumes.length - 1]?.full_name || 'No resumes yet'}</p>}
            {!loading && resumes[resumes.length - 1] && (
              <p className="mt-1 text-xs text-slate-400">{resumes[resumes.length - 1]?.current_role || '—'}</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-brand" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Candidates</p>
            </div>
            {loading ? <Skeleton className="h-7 w-16" />
              : <p className="text-2xl font-bold text-slate-900">
                  {pools.length > 0
                    ? Math.round(pools.reduce((sum, p) => sum + (p.total_candidates || 0), 0) / pools.length)
                    : 0}
                </p>}
            <p className="mt-1 text-xs text-slate-400">Per talent pool</p>
          </div>

        </div>
      </div>

    </main>
  )
}




const Recruiter = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar/>
      <DashboardContent />
    </div>
  )
}

export default Recruiter
