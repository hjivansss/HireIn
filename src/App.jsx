import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'

function App() {
  const [count, setCount] = useState(0)

  return (<>
     <Routes>
        <Route path='/' element={<Landing />} />
      </Routes>
    </>
  )
}

export default App
