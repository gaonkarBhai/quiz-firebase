import React from 'react'
import './footer.scss'
import { useLocation } from 'react-router-dom';
const Footer = () => {

  const Location = useLocation();

  return (
    <>

    {Location.pathname === '/' ? <div className='footer'><p>© 2023 All rights reserved.</p></div>  : <></>}

    </>
  )
}

export default Footer