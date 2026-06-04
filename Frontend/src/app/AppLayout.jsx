import React from 'react'
import Nav from '../features/Shared/Components/Nav'
import { Outlet } from 'react-router'
import Footer from '../features/Shared/Components/Footer'

const Applayout = () => {
  return (
    <>   
      <Nav />
      <Outlet />
      <Footer/>
    </>
  )
}

export default Applayout