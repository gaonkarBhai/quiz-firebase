import { Link } from "react-router-dom";
import SarkLogo from "..//Layout/imgs/Sark.svg";
import { useAuth } from "../../context/AuthContext";

export const AdminNavbar = () => {
  const { logout } = useAuth();

  return (
    <>
      <nav>
        <div className="logo-name">
          <div>
            <img src={SarkLogo} alt="logo" className="SarkLogo" />
          </div>
        </div>
        <div className="menu-items">
          <ul className="nav-links">
            <li>
              <Link to="/dashboard/admin">
                <i className="uil uil-estate" />
                <span className="link-name">Dahsboard</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/admin/admin-quiz-settings">
                <i className="uil uil-chart" />
                <span className="link-name">Quizzes</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/admin/admin-question-settings">
                <i className="uil uil-chart" />
                <span className="link-name">Questions</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/admin/result">
                <i className="uil uil-chart" />
                <span className="link-name">Result</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                <i className="uil uil-chart" />
                <span className="link-name">Home</span>
              </Link>
            </li>
          </ul>
          <ul className="logout-mode">
            <li>
              <Link to="/login">
                <i className="uil uil-signout" />
                <span
                  onClick={() => {
                    logout();
                    console.log("logout successfully!!");
                  }}
                  className="link-name "
                >
                  Logout
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};
