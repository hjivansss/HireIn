import { getToken } from './auth_api'
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` })

export const uploadResume = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`http://127.0.0.1:8000/api/resume/upload`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${getToken()}` },
    })
    if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Upload failed') }
    return res.json()
}

export const getResumeCandidates = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/resume/candidates`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    })
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
}

export const getResumeFileUrl = (fileName) =>
    `http://127.0.0.1:8000/api/resume/file/${fileName}`