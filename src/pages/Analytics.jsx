// Analytics.jsx
// Deep analytics page — shows insights NOT present on Dashboard:
// - Top skills across all candidates
// - Candidate source breakdown (GitHub / LinkedIn / Resume)
// - Tier distribution across all pools
// - Top scoring candidates
// - Skill gap analysis (most common missing skills)
// - JD role distribution
// - Score distribution histogram
// - Location breakdown

import { useState, useEffect, useMemo } from 'react'
import Sidebar from '../components/sidebar'
import {
  BarChart3, Users, Layers, TrendingUp, AlertCircle,
  RefreshCw, Award, Target, MapPin, GitBranch,
  FileText, CheckCircle, XCircle, Briefcase,
} from 'lucide-react'
import { getAnalyticsData } from '../api/analytics_api'

// ── Helpers ───────────────────────────────────────────────────────────────────

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-slate-100 ${className}`} />
)

const CardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
    <Skeleton className="h-5 w-32" />
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>
  </div>
)

// ── Section Header ────────────────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
      <Icon className="h-5 w-5 text-brand" />
    </div>
    <div>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  </div>
)

// ── Bar Chart Row ─────────────────────────────────────────────────────────────

const BarRow = ({ label, count, max, color = 'bg-brand', rank }) => {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      {rank && (
        <span className="w-5 shrink-0 text-right text-xs font-bold text-slate-400">#{rank}</span>
      )}
      <span className="w-32 shrink-0 truncate text-sm text-slate-700">{label}</span>
      <div className="flex-1 rounded-full bg-slate-100 h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-sm font-semibold text-slate-700">{count}</span>
    </div>
  )
}

// ── Donut-style Stat ──────────────────────────────────────────────────────────

const PieSlice = ({ label, count, total, color }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className={`h-3 w-3 rounded-full shrink-0 ${color}`} />
      <span className="flex-1 text-sm text-slate-700">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{count}</span>
      <span className="w-10 text-right text-xs text-slate-400">{pct}%</span>
    </div>
  )
}

// ── Score Badge ───────────────────────────────────────────────────────────────

const ScoreBadge = ({ score }) => {
  if (score >= 75) return <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">{score}</span>
  if (score >= 50) return <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">{score}</span>
  return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">{score}</span>
}

// ── Analytics Content ─────────────────────────────────────────────────────────

const AnalyticsContent = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getAnalyticsData()
      setData(result)
    } catch {
      setError('Failed to load analytics data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // ── Computed analytics ─────────────────────────────────────────────────────

  const analytics = useMemo(() => {
    if (!data) return null
    const { resumes, linkedin, jds, allPools, allCandidates } = data

    // 1. Top skills across all candidates (resume + linkedin)
    const skillCount = {}
    const allProfiles = [...resumes, ...linkedin]
    allProfiles.forEach(p => {
      (p.skills || []).forEach(s => {
        const key = s.trim().toLowerCase()
        skillCount[key] = (skillCount[key] || 0) + 1
      })
    })
    const topSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }))

    // 2. Candidate source breakdown from pools
    const sources = { github: 0, linkedin_zip: 0, linkedin_manual: 0, resume: 0 }
    allCandidates.forEach(c => {
      (c.sources || []).forEach(s => {
        if (sources[s] !== undefined) sources[s]++
        else sources[s] = 1
      })
    })

    // 3. Tier distribution
    const tiers = { 1: 0, 2: 0, 3: 0 }
    allCandidates.forEach(c => {
      if (c.tier) tiers[c.tier] = (tiers[c.tier] || 0) + 1
    })

    // 4. Top candidates by fit score
    const topCandidates = [...allCandidates]
      .filter(c => c.overall_fit_score)
      .sort((a, b) => b.overall_fit_score - a.overall_fit_score)
      .slice(0, 8)

    // 5. Most common skill gaps
    const gapCount = {}
    allCandidates.forEach(c => {
      (c.skill_gaps || []).forEach(g => {
        const key = (g.skill || g).toLowerCase()
        gapCount[key] = (gapCount[key] || 0) + 1
      })
    })
    const topGaps = Object.entries(gapCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count }))

    // 6. JD role distribution
    const roleCount = {}
    jds.forEach(jd => {
      const role = jd.job_role || 'Unknown'
      roleCount[role] = (roleCount[role] || 0) + 1
    })
    const roleDistribution = Object.entries(roleCount)
      .sort((a, b) => b[1] - a[1])
      .map(([role, count]) => ({ role, count }))

    // 7. Score distribution buckets
    const scoreBuckets = { '0-25': 0, '26-50': 0, '51-75': 0, '76-100': 0 }
    allCandidates.forEach(c => {
      const s = c.overall_fit_score || 0
      if (s <= 25) scoreBuckets['0-25']++
      else if (s <= 50) scoreBuckets['26-50']++
      else if (s <= 75) scoreBuckets['51-75']++
      else scoreBuckets['76-100']++
    })

    // 8. Location breakdown from pool candidates
    const locationCount = {}
    allCandidates.forEach(c => {
      const loc = (c.location || 'Unknown').split(',')[0].trim()
      locationCount[loc] = (locationCount[loc] || 0) + 1
    })
    const topLocations = Object.entries(locationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([location, count]) => ({ location, count }))

    return {
      topSkills, sources, tiers, topCandidates,
      topGaps, roleDistribution, scoreBuckets, topLocations,
      totalCandidatesInPools: allCandidates.length,
      totalProfiles: allProfiles.length,
    }
  }, [data])

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Deep insights across all candidates, pools, and job descriptions.
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-40">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center gap-4 py-16">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-slate-600">{error}</p>
          <button onClick={load}
            className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Analytics Grid */}
      {!loading && !error && analytics && (
        <div className="space-y-8">

          {/* ── Row 1: Source + Tier + Score Dist ──────────────────────────── */}
          <div className="grid gap-6 md:grid-cols-3">

            {/* Candidate Source Breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader icon={GitBranch} title="Candidate Sources" subtitle="Where candidates come from" />
              <div className="space-y-3">
                {[
                  { label: 'GitHub', key: 'github', color: 'bg-slate-800', icon: '⌥' },
                  { label: 'LinkedIn ZIP', key: 'linkedin_zip', color: 'bg-blue-600', icon: '💼' },
                  { label: 'LinkedIn Manual', key: 'linkedin_manual', color: 'bg-blue-400', icon: '📝' },
                  { label: 'Resume', key: 'resume', color: 'bg-brand', icon: '📄' },
                ].map(({ label, key, color, icon }) => (
                  <PieSlice
                    key={key}
                    label={`${icon} ${label}`}
                    count={analytics.sources[key] || 0}
                    total={analytics.totalCandidatesInPools}
                    color={color}
                  />
                ))}
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-400">Total in pools: <span className="font-semibold text-slate-700">{analytics.totalCandidatesInPools}</span></p>
                </div>
              </div>
            </div>

            {/* Tier Distribution */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader icon={Award} title="Tier Distribution" subtitle="Candidate quality breakdown" />
              <div className="space-y-4">
                <div className="rounded-xl bg-emerald-50 p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-700">{analytics.tiers[1] || 0}</p>
                  <p className="text-xs font-medium text-emerald-600 mt-1">Tier 1 — Strong Match</p>
                  <p className="text-xs text-emerald-500">Score ≥ 75</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-center">
                    <p className="text-2xl font-bold text-blue-700">{analytics.tiers[2] || 0}</p>
                    <p className="text-xs text-blue-600 mt-0.5">Tier 2</p>
                    <p className="text-xs text-blue-400">Score 50–74</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3 text-center">
                    <p className="text-2xl font-bold text-slate-700">{analytics.tiers[3] || 0}</p>
                    <p className="text-xs text-slate-600 mt-0.5">Tier 3</p>
                    <p className="text-xs text-slate-400">Score &lt; 50</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Distribution */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader icon={BarChart3} title="Score Distribution" subtitle="Fit score buckets" />
              <div className="space-y-3">
                {[
                  { label: '76–100', key: '76-100', color: 'bg-emerald-500' },
                  { label: '51–75', key: '51-75', color: 'bg-blue-500' },
                  { label: '26–50', key: '26-50', color: 'bg-amber-400' },
                  { label: '0–25', key: '0-25', color: 'bg-red-400' },
                ].map(({ label, key, color }) => (
                  <BarRow
                    key={key}
                    label={label}
                    count={analytics.scoreBuckets[key] || 0}
                    max={Math.max(...Object.values(analytics.scoreBuckets))}
                    color={color}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* ── Row 2: Top Skills + Skill Gaps ─────────────────────────────── */}
          <div className="grid gap-6 md:grid-cols-2">

            {/* Top Skills */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader icon={Layers} title="Top Skills in Talent Pool" subtitle="Most common skills across all candidates" />
              {analytics.topSkills.length === 0
                ? <p className="text-sm text-slate-400 text-center py-6">No skill data yet</p>
                : (
                  <div className="space-y-3">
                    {analytics.topSkills.map(({ skill, count }, i) => (
                      <BarRow
                        key={skill}
                        label={skill.charAt(0).toUpperCase() + skill.slice(1)}
                        count={count}
                        max={analytics.topSkills[0]?.count || 1}
                        color="bg-brand"
                        rank={i + 1}
                      />
                    ))}
                  </div>
                )}
            </div>

            {/* Skill Gaps */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader icon={Target} title="Most Common Skill Gaps" subtitle="Skills candidates are frequently missing" />
              {analytics.topGaps.length === 0
                ? <p className="text-sm text-slate-400 text-center py-6">No skill gap data yet — generate a talent pool first</p>
                : (
                  <div className="space-y-3">
                    {analytics.topGaps.map(({ skill, count }, i) => (
                      <BarRow
                        key={skill}
                        label={skill.charAt(0).toUpperCase() + skill.slice(1)}
                        count={count}
                        max={analytics.topGaps[0]?.count || 1}
                        color="bg-red-400"
                        rank={i + 1}
                      />
                    ))}
                  </div>
                )}
            </div>

          </div>

          {/* ── Row 3: Top Candidates ───────────────────────────────────────── */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader icon={TrendingUp} title="Top Performing Candidates" subtitle="Highest fit scores across all talent pools" />
            {analytics.topCandidates.length === 0
              ? <p className="text-sm text-slate-400 text-center py-6">No candidates yet — generate a talent pool first</p>
              : (
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Rank</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Candidate</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Source</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Matched Skills</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analytics.topCandidates.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-bold text-slate-400">#{i + 1}</span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-slate-900">{c.name || '—'}</p>
                            {c.location && <p className="text-xs text-slate-400">{c.location}</p>}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{c.current_role || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {(c.sources || []).map((s, j) => (
                                <span key={j} className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">{s}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {(c.matched_skills || []).slice(0, 3).map((s, j) => (
                                <span key={j} className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">✓ {s}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <ScoreBadge score={c.overall_fit_score} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>

          {/* ── Row 4: JD Roles + Locations ─────────────────────────────────── */}
          <div className="grid gap-6 md:grid-cols-2">

            {/* JD Role Distribution */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader icon={Briefcase} title="JD Role Distribution" subtitle="Job roles you have hired for" />
              {analytics.roleDistribution.length === 0
                ? <p className="text-sm text-slate-400 text-center py-6">No JDs yet</p>
                : (
                  <div className="space-y-3">
                    {analytics.roleDistribution.map(({ role, count }, i) => (
                      <BarRow
                        key={role}
                        label={role}
                        count={count}
                        max={analytics.roleDistribution[0]?.count || 1}
                        color="bg-blue-500"
                        rank={i + 1}
                      />
                    ))}
                  </div>
                )}
            </div>

            {/* Location Breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader icon={MapPin} title="Candidate Locations" subtitle="Where your candidates are based" />
              {analytics.topLocations.length === 0
                ? <p className="text-sm text-slate-400 text-center py-6">No location data yet</p>
                : (
                  <div className="space-y-3">
                    {analytics.topLocations.map(({ location, count }, i) => (
                      <BarRow
                        key={location}
                        label={location}
                        count={count}
                        max={analytics.topLocations[0]?.count || 1}
                        color="bg-amber-400"
                        rank={i + 1}
                      />
                    ))}
                  </div>
                )}
            </div>

          </div>

        </div>
      )}

      {/* Empty state */}
      {!loading && !error && !analytics && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <BarChart3 className="h-12 w-12 text-slate-200" />
          <p className="font-medium text-slate-600">No analytics data yet</p>
          <p className="text-sm text-slate-400">Generate a talent pool first to see insights here</p>
        </div>
      )}

    </main>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const Analytics = () => (
  <div className="flex h-screen overflow-hidden bg-slate-50">
    <Sidebar />
    <AnalyticsContent />
  </div>
)

export default Analytics