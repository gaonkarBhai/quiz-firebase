import React, { useState } from "react";
// import '../LoginPage/Login.scss'
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
function Forgotpage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email);
      console.log(res);
      toast.success("We sent an email to you!");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <Layout title="Forgot password | Browse 2024">
      <div className="container_row">
        <h1 className="login_heading">Forgot Password</h1>
        <p className="login_txt">Enter a valid email address</p>

        <div>
          <form onSubmit={handleSubmit} className="input_form">
            <input
              type="email"
              className="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <button type="submit" className="Login_btn" style={{marginBottom:'1vh',width:'20%'}}>
              submit
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Forgotpage;
