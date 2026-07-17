import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Users,
  Upload,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo"; // adjust path if needed

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Job Descriptions",
    icon: FileText,
    path: "/dashboard/jobs",
  },
  {
    title: "Discover Talent",
    icon: Sparkles,
    path: "/dashboard/discover",
  },
  {
    title: "Talent Pools",
    icon: Users,
    path: "/dashboard/talent-pools",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/dashboard/analytics",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 h-screen border-r border-slate-200 bg-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}

      <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">

        <div
          className={`flex items-center gap-3 overflow-hidden ${
            collapsed ? "justify-center w-full" : ""
          }`}
        >
          <Logo className="h-10 w-10 flex-shrink-0" />

          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                HireIn
              </h2>

              <p className="text-xs text-slate-500">
                AI Recruitment
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute left-1/2 top-24 -translate-x-1/2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm hover:bg-slate-50"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}

      <div className="px-3 py-6">

        <p
          className={`mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400 ${
            collapsed && "hidden"
          }`}
        >
          Workspace
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `
                  flex items-center rounded-xl px-3 py-3 transition-all duration-200

                  ${
                    isActive
                      ? "bg-brand/10 text-brand"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }

                  ${collapsed ? "justify-center" : "gap-3"}
                `
                }
              >
                <Icon size={20} />

                {!collapsed && (
                  <span className="text-sm font-medium">
                    {item.title}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}

      <div className="absolute bottom-0 w-full border-t border-slate-200 p-3">

        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `
            flex items-center rounded-xl px-3 py-3 transition

            ${
              isActive
                ? "bg-brand/10 text-brand"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }

            ${collapsed ? "justify-center" : "gap-3"}
          `
          }
        >
          <Settings size={20} />

          {!collapsed && (
            <span className="text-sm font-medium">
              Settings
            </span>
          )}
        </NavLink>
      </div>
    </aside>
  );
}