// jd_api.js
// All API calls for Job Description operations
import axios from 'axios'

const API = 'http://127.0.0.1:8000/api'

// Extract + save a new JD from raw text
export const createJobDescription = async (text) => {
    const res = await axios.post(`${API}/extract_and_save_jd`, {
        job_description: text,
    })
    return res.data
}

// Get all saved JDs
export const getAllJobDescriptions = async () => {
    const res = await axios.get(`${API}/jd`)
    return res.data
}

// Get one JD by ID
export const getJobDescriptionById = async (id) => {
    const res = await axios.get(`${API}/jd/${id}`)
    return res.data
}
export const getCandidateJDs = getAllJobDescriptions