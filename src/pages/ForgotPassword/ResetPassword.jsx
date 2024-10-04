import React, { useState } from "react";
// import '../LoginPage/Login.scss'
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
function useQuery() {

  return new URLSearchParams(useLocation().search);

}
function Forgotpage() {

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { resetPassword } = useAuth();
  const query = useQuery();

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      const res = await resetPassword(query.get("oobCode"), password);
      console.log(res);
      toast.success("Password reset successfully");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }

  };

  return (

    <Layout title="Reset password | Browse 2024">
      <div className="container_row">
        <h1 className="login_heading">Reset Password</h1>
        <p className="login_txt">Change Your password</p>
        <div>
          <form onSubmit={handleSubmit} className="input_form">
            <input
              type="password"
              className="Email"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button type="submit" className="Login_btn">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </Layout>

  );
}

export default Forgotpage;
