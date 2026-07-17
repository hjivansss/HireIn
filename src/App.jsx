import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Candidate from './pages/Candidate'

import Recruiter from './pages/Recruiter_Dashboard'
function App() {
  const [count, setCount] = useState(0)

  return (<>
     <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/candidates' element={<Candidate />} />
        <Route path='/recruiters' element={<Recruiter />} />
      </Routes>
    </>
  )
}

export default App
