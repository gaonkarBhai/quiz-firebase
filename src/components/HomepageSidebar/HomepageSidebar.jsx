import './HomepageSidebar.scss'
import { Link } from 'react-router-dom'

const HomepageSidebar = () => {
  return (
    <div className='Sidebar-grp'>
        <div className='homepage-links'>
        <Link to="/" className='hover link-name a-hover'>Home</Link>
        <Link to="/contest-attended" className='hover link-name a-hover'>Contest Attended</Link>
        <Link to="/profile" className='hover link-name a-hover'>Profile</Link>
        <Link to="/events-certificate" className='hover link-name a-hover'>Certificate</Link>
          {/* <div className='a-hover'><Link to="/contest-attended" className='hover'>Contest Attended</Link></div>
          <div className='a-hover'><Link to="/profile" className='hover'>Profile</Link></div>
          <div className='a-hover'><Link to="/events-certificate" className='hover'>Certificate</Link></div> */}
            {/* <a href="/" className='hover'>Quizzes</a>
            <a href="/results">Results</a>
            <a href="/profile">Profile</a>
            <a href="/dashboard/admin">Admin Page</a> */}
        </div>
    </div>
  )
}

export default HomepageSidebar
