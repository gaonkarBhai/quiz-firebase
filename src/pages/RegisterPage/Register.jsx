import "./register.scss";
import SarkLogo from "../../components/Layout/imgs/Sark.svg";
import login_img from '../../components/Layout/imgs/Login_img.svg'

import { useState } from "react";
import { DataBase } from "../../firebase-config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [branchName, setBranchName] = useState("");
  const [usn, setUsn] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();

  const { register, updateUser } = useAuth();

  const signUP = async (e) => {

    e.preventDefault();
    try {
      
      const User = await register(email, password);

      
      const userCredentials = {
        fullName,
        username,
        branchName,
        usn,
        email,
        phoneNumber,
        password,
        admin: 0,
        id:User.user.uid,
        timeStamp: serverTimestamp(),
      };
      const updatedUser = await updateUser(

        userCredentials.username,
        userCredentials.phoneNumber
      );

      console.log(userCredentials);
      console.log(User, updatedUser);

      await setDoc(
        doc(
          DataBase,
          process.env.REACT_APP_DB_COLLECTION_NAME_REG,
          User.user.uid
        ),
        userCredentials
      );
      
      toast.success("Registered Successfully");

      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {

      console.log(error);
      toast.error(error.message);

    }
  };

  return (
    <Layout title="Register | Browse 2024">
      <div className="login_flex">
      {/* <div>
          <img src={login_img} alt="Pic" className="register_img"/>
      </div> */}
      <div className="container_row">
        {/* <img src={SarkLogo} alt="" className="SarkLogo" /> */}
        <p className="login_txt">Create an account</p>

        <div>
          <form onSubmit={signUP} className="input_form signup-form">
            <input
              type="text"
              className=""
              autoComplete="off"
              onFocus={(event) => { event.target.setAttribute('autocomplete', 'off'); }}
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              type="text"
              className="username"
              autoComplete="off"
              onFocus={(event) => { event.target.setAttribute('autocomplete', 'off'); }}
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="text"
              className=""
              autoComplete="off"
              onFocus={(event) => { event.target.setAttribute('autocomplete', 'off'); }}
              placeholder="Branch Name"
              value={branchName}
              required
              onChange={(e) => setBranchName(e.target.value)}
            />

            <input
              type="text"
              className=""
              autoComplete="off"
              onFocus={(event) => { event.target.setAttribute('autocomplete', 'off'); }}
              placeholder="USN"
              value={usn}
              required
              onChange={(e) => setUsn(e.target.value)}
            />

            <input
              type="email"
              className=""
              autoComplete="off"
              onFocus={(event) => { event.target.setAttribute('autocomplete', 'off'); }}
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <input
              type="number"
              className=""
              autoComplete="off"
              onFocus={(event) => { event.target.setAttribute('autocomplete', 'off'); }}
              placeholder="Phone Number"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <input
              type="password"
              className="password"
              autoComplete="off"
              onFocus={(event) => { event.target.setAttribute('autocomplete', 'off'); }}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <div className=""></div>
            <button type="submit" className="Login_btn">
              Register
            </button>
          </form>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
