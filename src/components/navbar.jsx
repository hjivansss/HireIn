import React from 'react'
import { Link } from 'react-router-dom'
import { BriefcaseBusiness } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-sm sm:px-10">
         <div className="flex items-center gap-2">
            <BriefcaseBusiness  
              size={28} 
              className="text-brand"
              />
            <h1 className="text-xl font-bold sm:text-2xl">Hire<span className="text-brand">In</span></h1>
         </div>

        {/*Navigation Links — hidden below md: with no toggle button, these four
            links don't fit under ~500px and were forcing horizontal scroll on
            the whole page. Hiding them stops that regression, but this is a
            stop-gap: mobile needs a real hamburger menu (toggle state), which
            is a JS change outside this pass's Tailwind-only scope. */}
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex sm:gap-8 sm:text-base">
            <Link className="rounded-md px-1 py-0.5 transition-colors hover:text-brand" to="/">
                Home
            </Link>

            <Link className="rounded-md px-1 py-0.5 transition-colors hover:text-brand" to="/recruiter">
                For Recruiter
            </Link>

            <Link className="rounded-md px-1 py-0.5 transition-colors hover:text-brand" to="/candidate">
                For Candidate
            </Link>

            <Link className="rounded-md px-1 py-0.5 transition-colors hover:text-brand" to="/about">
                About
            </Link>
        </div>
    </nav>
  )
}

export default Navbar
