// ProtectedRoute.jsx
// Checks localStorage for token before rendering protected pages
// Redirects to /login if not authenticated

import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../api/auth_api'

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute