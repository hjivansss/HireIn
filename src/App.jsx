import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Candidate from './pages/Candidate'

function App() {
  const [count, setCount] = useState(0)

  return (<>
     <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/candidate' element={<Candidate />} />
      </Routes>
    </>
  )
}

export default App
