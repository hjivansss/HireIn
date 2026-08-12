// talentpool_api.js
// All API calls for Talent Pool operations
import axios from 'axios'

const API = 'http://127.0.0.1:8000/api'

// Generate a talent pool for a JD
export const generateTalentPool = async ({ jdId, location = 'India', limit = 10, minScore = 0.4, page = 1, pageSize = 10 }) => {
    const res = await axios.post(`${API}/talent-pool/generate`, {
        jd_id: jdId,
        location,
        limit,
        min_score: minScore,
        page,
        page_size: pageSize,
    })
    return res.data
}

// Get talent pool summary for a specific JD
export const getTalentPoolByJD = async (jdId) => {
    try {
        const res = await axios.get(`${API}/talent-pool/jd/${jdId}/summary`)
        return res.data
    } catch {
        return []
    }
}

// Get a specific talent pool by pool ID
export const getTalentPoolSummary = async (poolId) => {
    const res = await axios.get(`${API}/talent-pool/${poolId}`)
    return res.data
}