import React from 'react'
import { Link } from 'react-router-dom'
import { BriefcaseBusiness } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm">
         <div className="flex items-center gap-2">
            <BriefcaseBusiness  
              size={30} 
              className="text-[#00674F]"
              />
            <h1 className="text-2xl font-bold">Hire<span className="text-[#00674F]">In</span></h1>
         </div>

        {/*Navigation Links*/}
          <div className="flex items-center gap-8 font-medium text-slate-700">
            <Link className="hover:text-[#00674F] transition" to="/">
                Home
            </Link>

            <Link className="hover:text-[#00674F] transition" to="/recruiter">
                For Recruiter
            </Link>

            <Link className="hover:text-[#00674F] transition" to="/candidate">
                For Candidate
            </Link>

            <Link className="hover:text-[#00674F] transition" to="/about">
                About
            </Link>
        </div>
    </nav>
  )
}

export default Navbar
