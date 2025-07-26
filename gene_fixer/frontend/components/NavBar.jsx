import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl 2xl:max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-orange-400">
          <Link to="/">GENESYS</Link>
        </div>
        <div className="flex space-x-6 text-gray-700 font-medium">
          <Link to="/gene-fix" className="hover:text-blue-500 transition-all">
            Home
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
