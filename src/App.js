import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProductsPage from './pages/ProductsPage'
import ProductDetailsPage from './pages/ProductDetailsPage '

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProductsPage/>}/>
        <Route path="/product/:id" element={<ProductDetailsPage />} />

      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App