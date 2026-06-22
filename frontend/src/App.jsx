import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import About from './components/About'
import Contact from './components/Contact'
import AdministrationHome from './Pages/Administration/Home'
import AdminProducts from './Pages/Administration/Products'
import ProductSlug from './Pages/ProductSlug'
import AdminLog from './Pages/Administration/AdminLog'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'

import { Toaster } from 'sonner'

const App = () => {
  return (
    <Router>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products/:slug" element={<ProductSlug />} />
        <Route path="/administration" element={<AdministrationHome />} />
        <Route path="/administration/products" element={<AdminProducts />} />
        <Route path="/adminlog" element={<AdminLog />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Router>
  )
}

export default App