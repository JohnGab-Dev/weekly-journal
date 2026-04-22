import React from 'react'
import { Link } from 'react-router-dom'
import { ProfileDropdown } from '@/components/dropdown/ProfileDropdown'

function NavBar({user}) {
 
  return (
    <div>
        <header
          className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-2 sm:px-20">
          <div className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6">
            <h1 className='text-gray-700 text-xl' >Report<span className='text-black font-semibold'>Maker</span> </h1>
            <ProfileDropdown user={user} />
          </div>
        </header>
    </div>
  )
}

export default NavBar
