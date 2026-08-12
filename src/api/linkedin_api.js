import { getToken } from './auth_api'

export const uploadLinkedinZip = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`http://127.0.0.1:8000/api/linkedin/upload-zip`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${getToken()}` },
    })
    if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Upload failed') }
    return res.json()
}