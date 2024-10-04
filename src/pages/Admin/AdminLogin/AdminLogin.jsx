import '../../LoginPage/Login.scss'
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import login_img from '../../../components/Layout/imgs/Login_img.svg'

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const signIN = async (e) => {
    e.preventDefault();
    console.log(email, password);

    try {
      await login(email, password);


      toast.success("Logged in Successfully");

      setTimeout(() => {
        navigate("/AdminPass");
      },1000);
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials");
    }
  };

  return (
    <Layout title="Login | Browse 2024">

      <div className="login_flex">
      <div >
          <img src={login_img} alt="Pic" className="login_img"/>
      </div>

      <div className="container_row">
        {/* <img src={SarkLogo} alt="" className="SarkLogo" /> */}
        <p className="login_txt">Welcome Admin</p>

        <div>
          <form onSubmit={signIN} className="input_form">
            <input
              required
              type="email"
              className=""
              autoComplete="off"
              onFocus={(event) => { event.target.setAttribute('autocomplete', 'off'); }}
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              type="password"
              className="password"
              autoComplete="off"
              onFocus={(event) => { event.target.setAttribute('autocomplete', 'off'); }}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <Link to={"/forgot-pass"} className="Link">
              <p className="forgot_pass">Forgot password?</p>
            </Link>
            <button type="submit" className="Login_btn">
              Login
            </button>
          </form>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
