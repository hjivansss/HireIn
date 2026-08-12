const API = 'http://127.0.0.1:8000/api'

// Upload single resume only
export const uploadResume = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API}/resume/upload`, {
        method: 'POST',
        body: formData,
    })

    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Upload failed')
    }

    return res.json()
}

// Get all uploaded resume candidates
export const getResumeCandidates = async () => {
    const res = await fetch(`${API}/resume/candidates`)
    if (!res.ok) throw new Error('Failed to fetch candidates')
    return res.json()
}