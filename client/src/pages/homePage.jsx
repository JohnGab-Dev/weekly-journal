import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { TitleRender } from '@/utils/TitleRender'
function HomePage() {
  TitleRender("ReportMaker | Home")
  
  return (
    <div className='bg-muted min-h-screen flex flex-col items-center justify-center gap-4'>
      
      <h1 className='text-gray-700 text-7xl' >Report<span className='text-black font-semibold'>Maker</span> </h1>
      <h2 className='text-gray-600 '>Record and Export your Weekly Report Just by a Click.</h2>

      <div className='flex items-center justify-center gap-4'>
        <Link to="/login"><Button variant='' className='cursor-pointer'>Login</Button></Link>
        <Link to="/signup"><Button variant='outline' className='cursor-pointer'>Signup</Button></Link>
      </div>
      
    </div>
  )
}

export default HomePage
