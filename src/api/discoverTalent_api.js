// discover_api.js
// API calls specifically for the Discover Talent page

import axios from 'axios'
import { getToken } from './auth_api'

const API = 'http://127.0.0.1:8000/api'

// Authentication header
const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`
})

// Fetch all JDs to show in the selection panel
export const getJobDescriptionsForDiscover = async () => {
  const res = await axios.get(`${API}/jd`, {
    headers: authHeader()
  })

  return res.data
}

// Generate talent pool using selected JD ID + settings
export const generateTalentPoolForJD = async ({
  jdId,
  location,
  limit,
  minScore,
  pageSize
}) => {
  const res = await axios.post(
    `${API}/talent-pool/generate`,
    {
      jd_id: jdId,
      location: location || 'India',
      limit: limit || 10,
      min_score: minScore || 0.4,
      page: 1,
      page_size: pageSize || 10,
    },
    {
      headers: authHeader()
    }
  )

  return res.data
}