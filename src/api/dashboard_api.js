import axios from 'axios'
import { getToken } from './auth_api'

const API = 'http://127.0.0.1:8000/api'
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` })

export const getRecentJobDescriptions = async () => {
    const res = await axios.get(`${API}/jd`, { headers: authHeader() })
    return res.data
}

export const getTalentPoolsByJD = async (jdId) => {
    try {
        const res = await axios.get(`${API}/talent-pool/jd/${jdId}/summary`, { headers: authHeader() })
        return res.data
    } catch { return [] }
}

export const getRecentResumes = async () => {
    const res = await axios.get(`${API}/resume/candidates`, { headers: authHeader() })
    return res.data
}

export const getLinkedInCandidates = async () => {
    const res = await axios.get(`${API}/linkedin/candidates`, { headers: authHeader() })
    return res.data
}

export const getDashboardSummary = async () => {
    const [jds, resumes, linkedin] = await Promise.all([
        getRecentJobDescriptions().catch(() => []),
        getRecentResumes().catch(() => []),
        getLinkedInCandidates().catch(() => []),
    ])
    return {
        totalJDs: jds.length,
        totalResumes: resumes.length,
        totalLinkedIn: linkedin.length,
        totalCandidates: resumes.length + linkedin.length,
        jds, resumes, linkedin,
    }
}