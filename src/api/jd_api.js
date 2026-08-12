import axios from 'axios'
import { getToken } from './auth_api'

const API = 'http://127.0.0.1:8000/api'
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` })

export const createJobDescription = async (text) => {
    const res = await axios.post(`${API}/extract_and_save_jd`,
        { job_description: text },
        { headers: authHeader() }
    )
    return res.data
}

export const getAllJobDescriptions = async () => {
    const res = await axios.get(`${API}/jd`, { headers: authHeader() })
    return res.data
}

export const getJobDescriptionById = async (id) => {
    const res = await axios.get(`${API}/jd/${id}`, { headers: authHeader() })
    return res.data
}

export const deleteJobDescription = async (id) => {
    const res = await axios.delete(`${API}/jd/${id}`, { headers: authHeader() })
    return res.data
}

export const getCandidateJDs = getAllJobDescriptions