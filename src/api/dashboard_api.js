// dashboard_api.js
import axios from 'axios'

const API = 'http://127.0.0.1:8000/api'

// Get all job descriptions
export const getRecentJobDescriptions = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/jd')
    const data = await res.json()
    return data
}

// Get talent pool summary for one JD by its ID
// Returns [] if no pools exist for that JD (404 case)
export const getTalentPoolsByJD = async (jdId) => {
    try {
        const res = await axios.get(`${API}/talent-pool/jd/${jdId}/summary`)
        return res.data
    } catch {
        return []
    }
}

// Get all resume candidates
export const getRecentResumes = async () => {
    const res = await axios.get(`${API}/resume/candidates`)
    return res.data
}

// Get all LinkedIn candidates
export const getLinkedInCandidates = async () => {
    const res = await axios.get(`${API}/linkedin/candidates`)
    return res.data
}

// Main summary — fetches everything needed for stat cards
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
        jds,
        resumes,
        linkedin,
    }
}