import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Candidate from './pages/Candidate'

import Recruiter from './pages/Recruiter_Dashboard'
import Job_description from './pages/Job_description'
import TalentPools from './pages/TalentPools'
import Discover_talent from './pages/Discover_talent'
import Analytics from './pages/Analytics'



const ComingSoon = ({ page }) => (
  <div className="flex h-screen overflow-hidden">
    <div className="w-64 shrink-0 border-r border-slate-200 bg-white" />
    <div className="flex flex-1 items-center justify-center bg-slate-50">
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-900">{page}</p>
        <p className="mt-2 text-slate-500">Coming soon</p>
      </div>
    </div>
  </div>
)

function App() {
  return (
    <Routes>

      {/* ── Public routes ─────────────────────────────────────── */}
      <Route path='/'        element={<Landing />} />
      <Route path='/login'   element={<Login />} />
      <Route path='/signup'  element={<Signup />} />

      {/* Candidate page — (candidates upload resumes , linkedin zip) */}
      <Route path='/candidate' element={
        <ProtectedRoute> <Candidate /> </ProtectedRoute>} />

      {/* ── Protected recruiter routes ────────────────────────── */}
      <Route path='/recruiters' element={
        <ProtectedRoute><Recruiter /></ProtectedRoute>
      } />
      <Route path='/dashboard' element={
        <ProtectedRoute><Recruiter /></ProtectedRoute>
      } />
      <Route path='/dashboard/jobs' element={
        <ProtectedRoute><Job_description /></ProtectedRoute>
      } />
      <Route path='/dashboard/discover' element={
        <ProtectedRoute><Discover_talent /></ProtectedRoute>
      } />
      <Route path='/dashboard/talent-pools' element={
        <ProtectedRoute><TalentPools /></ProtectedRoute>
      } />
      <Route path='/dashboard/analytics' element={
        <ProtectedRoute><Analytics /></ProtectedRoute>
      } />
      <Route path='/dashboard/settings' element={
        <ProtectedRoute><ComingSoon page="Settings" /></ProtectedRoute>
      } />
      <Route path='/dashboard/*' element={
        <ProtectedRoute><Recruiter /></ProtectedRoute>
      } />

    </Routes>
  )
}

export default App

