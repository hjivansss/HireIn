// analytics_api.js
// API calls for Analytics page
// Fetches data not shown on Dashboard — skills, sources, tiers, top candidates
import axios from 'axios'

const API = 'http://127.0.0.1:8000/api'

// Get all resumes — for skill frequency analysis
export const getResumesForAnalytics = async () => {
    const res = await axios.get(`${API}/resume/candidates`)
    return res.data
}

// Get all LinkedIn profiles — for source breakdown
export const getLinkedInForAnalytics = async () => {
    const res = await axios.get(`${API}/linkedin/candidates`)
    return res.data
}

// Get all JDs — for role distribution
export const getJDsForAnalytics = async () => {
    const res = await axios.get(`${API}/jd`)
    return res.data
}

// Get talent pool summary for one JD
export const getPoolsByJD = async (jdId) => {
    try {
        const res = await axios.get(`${API}/talent-pool/jd/${jdId}/summary`)
        return res.data
    } catch {
        return []
    }
}

// Get full talent pool detail (with candidates) by pool ID
export const getPoolDetail = async (poolId) => {
    try {
        const res = await axios.get(`${API}/talent-pool/${poolId}`)
        return res.data
    } catch {
        return null
    }
}

// Aggregate all analytics data in one call
export const getAnalyticsData = async () => {
    const [resumes, linkedin, jds] = await Promise.all([
        getResumesForAnalytics().catch(() => []),
        getLinkedInForAnalytics().catch(() => []),
        getJDsForAnalytics().catch(() => []),
    ])

    // Fetch all pools for all JDs
    const poolResults = await Promise.all(jds.map(jd => getPoolsByJD(jd.id)))
    const allPools = poolResults.flat()

    // Fetch candidate details for all pools
    const poolDetails = await Promise.all(allPools.map(p => getPoolDetail(p.pool_id)))
    const validDetails = poolDetails.filter(Boolean)

    // All candidates across all pools
    const allCandidates = validDetails.flatMap(d => d.candidates || [])

    return { resumes, linkedin, jds, allPools, allCandidates }
}