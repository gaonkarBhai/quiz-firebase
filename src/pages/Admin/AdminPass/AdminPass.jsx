import React from 'react';
import './AdminPass.scss';
import { useAuth } from "../../../context/AuthContext";
const AdminPass = () => {

  const { currentUser } = useAuth();
  
  return (
    <div className='AdminPass_container'>
      {
        currentUser ? <h1>Admin User Successfully Found</h1> : <h1> Admin Role for this User Not Found </h1>
      }
      <a href="/dashboard/admin" className='AdminPass_btn'> Take Me to Admin Dashboard </a>
    </div>
  )
}

export default AdminPass
