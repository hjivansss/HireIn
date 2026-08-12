import axios from 'axios'
import { getToken } from './auth_api'

const API = 'http://127.0.0.1:8000/api'
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` })

export const getResumesForAnalytics = async () => {
    const res = await axios.get(`${API}/resume/candidates`, { headers: authHeader() })
    return res.data
}

export const getLinkedInForAnalytics = async () => {
    const res = await axios.get(`${API}/linkedin/candidates`, { headers: authHeader() })
    return res.data
}

export const getJDsForAnalytics = async () => {
    const res = await axios.get(`${API}/jd`, { headers: authHeader() })
    return res.data
}

export const getPoolsByJD = async (jdId) => {
    try {
        const res = await axios.get(`${API}/talent-pool/jd/${jdId}/summary`, { headers: authHeader() })
        return res.data
    } catch { return [] }
}

export const getPoolDetail = async (poolId) => {
    try {
        const res = await axios.get(`${API}/talent-pool/${poolId}`, { headers: authHeader() })
        return res.data
    } catch { return null }
}

export const getAnalyticsData = async () => {
    const [resumes, linkedin, jds] = await Promise.all([
        getResumesForAnalytics().catch(() => []),
        getLinkedInForAnalytics().catch(() => []),
        getJDsForAnalytics().catch(() => []),
    ])
    const poolResults = await Promise.all(jds.map(jd => getPoolsByJD(jd.id)))
    const allPools = poolResults.flat()
    const poolDetails = await Promise.all(allPools.map(p => getPoolDetail(p.pool_id)))
    const validDetails = poolDetails.filter(Boolean)
    const allCandidates = validDetails.flatMap(d => d.candidates || [])
    return { resumes, linkedin, jds, allPools, allCandidates }
}