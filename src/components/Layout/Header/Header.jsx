import React, { useEffect, useState } from 'react'
import './header.scss'
import SARK from '../imgs/Sark.svg'
import { onAuthStateChanged } from 'firebase/auth'
import { Auth } from "../../../firebase-config";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";

const Header = () => {

  const Location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const auth = useAuth();
  const user = auth.currentUser;

  let displayName = '';
  if (user !== null) {
    displayName = user.displayName;
  }

  const [logged, setLogged] = useState(true);

  const handleSignIn = () => {
    navigate('/login')
  }

  const handleRegister = () => {
    navigate('/register')
  }

  const handleScreen = () => {
    //Need to figure Out
  }

  useEffect(() => {
    const check = onAuthStateChanged(Auth, async (user) => {
      if (user) {
        //do your logged in user crap here
        setLogged(false)
      } else {
        setLogged(true)
      }
    });
    return () => check();

  }, [])



  return (

    <div className='header' style={{ background: '#0f0f0f' }}>

      {Location.pathname === '/dashboard' ? null : ''}

      {Location.pathname === '/question' ? <img src={SARK} alt="SARK" className='ques_header' /> : ''}


      {Location.pathname === '/' ?

        <>
          <img src={SARK} alt="SARK" />
          {logged ? <button className='header_btn' onClick={handleSignIn}> Sign In </button>
            : <>
              <p className='header_username'>{displayName}</p>
              <button className='header_btn' onClick={logout}> Logout </button>
            </>}
        </>

        : ''}

      {Location.pathname === '/home' ?

        <>
          <img src={SARK} alt="SARK" />
          {
            <p className='header_username Home_page_username'>{displayName}</p>
          }
        </>

        : ''}

      {Location.pathname === '/contest-attended' ?

        <>
          <img src={SARK} alt="SARK" />
          {
            <>
              {logged ? <button className='header_btn' onClick={handleSignIn}> Sign In </button> : <button className='header_btn' onClick={logout}> Logout </button>}
            </>
          }
        </>

        : ''}

      {Location.pathname === '/events-certificate' ?

        <>
          <img src={SARK} alt="SARK" />
          {
              <>
                {logged ? <button className='header_btn' onClick={handleSignIn}> Sign In </button> : <button className='header_btn' onClick={logout}> Logout </button>}
              </>
          }
        </>

        : ''}

      {Location.pathname === '/profile' ?

        <>
          <img src={SARK} alt="SARK" />
          {logged ? <button className='header_btn' onClick={handleSignIn}> Sign In </button> : <button className='header_btn' onClick={logout}> Logout </button>}
        </>

        : ''}

      {Location.pathname === '/user-questions' ? <><img src={SARK} alt="SARK" />  <button className='header_btn' onClick={handleScreen} > Enter FullScreen </button></> : ''}


      {Location.pathname === '/register' ? <> <img src={SARK} alt="SARK" /> <button className='header_btn' onClick={handleSignIn} > Sign In </button> </> : ''}

      {Location.pathname === '/login' ? <> <img src={SARK} alt="SARK" /> <button className='header_btn' onClick={handleRegister} > Register </button> </> : ''}

      {Location.pathname === '/forgot-pass' ? null : null}

    </div>
  )
}
export default Header