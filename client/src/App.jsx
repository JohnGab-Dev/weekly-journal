import { useState } from 'react'
import './App.css'
import { Toaster } from 'react-hot-toast';

import WebRoutes from './BrowserRouter/WebRoutes'

function App() {

  return (
    <>
      <Toaster />
     <WebRoutes />
    </>
  )
}

export default App
