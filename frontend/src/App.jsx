import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import AdministrationHome from './Pages/Administration/Home'
import AdminLog from './Pages/Administration/AdminLog'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/administration" element={<AdministrationHome />} />
        <Route path="/adminlog" element={<AdminLog />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Router>
  )
}

export default App