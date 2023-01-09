import React from 'react'
import { Outlet } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
    <div>navbar</div>
    <div><Outlet/></div>
    </>
  )
}

export default Navbar