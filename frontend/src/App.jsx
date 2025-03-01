import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/home/Home'
import Footer from './Components/Footer/Footer';
import Features from './Pages/features/Features';
import Contact from './Pages/contact/Contact'
import {Link} from 'react-router-dom';
import Solutions from './Pages/solutions/Solutions';
import Pricing from './Pages/pricing/Pricing';



const App = () => {
  return (
    <div>
      <div className='app'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/features' element={<Features />} /> 
          <Route path='/solutions' element={<Solutions />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/contact' element={<Contact />} /> 
        </Routes>
      </div>
      <Footer />
    </div>
  )
}


export default App
