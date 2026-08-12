import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { logout } from '../api/auth_api'

// Accepts both variant='navbar' and collapsed prop (used by sidebar)
const LogoutButton = ({ variant = 'sidebar', collapsed = false }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
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

  // Sidebar variant — respects collapsed state
  return (
    <button onClick={handleLogout}
      className={`flex w-full items-center rounded-xl px-3 py-2.5
        text-sm font-medium text-slate-500 transition-all duration-200
        hover:bg-red-50 hover:text-red-600
        ${collapsed ? 'justify-center' : 'gap-3'}`}>
      <LogOut size={20} className="shrink-0" />
      {!collapsed && <span>Logout</span>}
    </button>
  )
}

export default LogoutButton

