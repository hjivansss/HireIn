// LogoutButton.jsx — calls logout() from auth_api and redirects to landing

import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { logout } from '../api/auth_api'

const LogoutButton = ({ variant = 'navbar' }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()          // clears token + user from localStorage
    navigate('/')     // back to landing page
  }

  if (variant === 'navbar') {
    return (
      <button onClick={handleLogout}
        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2
          text-sm font-medium text-slate-600 transition-all duration-200
          hover:border-red-200 hover:bg-red-50 hover:text-red-600">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    )
  }

  // Sidebar variant
  return (
    <button onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5
        text-sm font-medium text-slate-500 transition-all duration-200
        hover:bg-red-50 hover:text-red-600">
      <LogOut className="h-4 w-4 shrink-0" />
      Logout
    </button>
  )
}

export default LogoutButton
