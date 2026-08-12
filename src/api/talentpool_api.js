import axios from 'axios'
import { getToken } from './auth_api'

const API = 'http://127.0.0.1:8000/api'
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` })

export const generateTalentPool = async ({ jdId, location = 'India', limit = 10, minScore = 0.4, page = 1, pageSize = 10 }) => {
    const res = await axios.post(`${API}/talent-pool/generate`, {
        jd_id: jdId, location, limit,
        min_score: minScore, page, page_size: pageSize,
    }, { headers: authHeader() })
    return res.data
}

export const getTalentPoolByJD = async (jdId) => {
    try {
        const res = await axios.get(`${API}/talent-pool/jd/${jdId}/summary`, { headers: authHeader() })
        return res.data
    } catch { return [] }
}

export const getTalentPoolSummary = async (poolId) => {
    const res = await axios.get(`${API}/talent-pool/${poolId}`, { headers: authHeader() })
    return res.data
}