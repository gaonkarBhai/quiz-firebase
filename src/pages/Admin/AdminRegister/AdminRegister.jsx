import SarkLogo from "../../../components/Layout/imgs/Sark.svg";

import {  useEffect, useState } from "react";
import { DataBase } from "../../../firebase-config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Layout from "../../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

const AdminRegister = () => {
  const [fullName, setFullName] = useState("");
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
        email,
        phoneNumber,
        password,
        admin: 1,
        id: User.user.uid,
        timeStamp: serverTimestamp(),
      };
      const updatedUser = await updateUser(
        userCredentials.fullName,
        userCredentials.phoneNumber
      );

      console.log(userCredentials);
      console.log(User, updatedUser);

      await setDoc(
        doc(
          DataBase,
          process.env.REACT_APP_DB_COLLECTION_NAME_REG_ADMIN,
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
    <Layout title="Admin Register | Browse 2024">
            <div className="container_row">
              <img src={SarkLogo} alt="" className="SarkLogo" />
              <p className="login_txt">Create an admin account</p>

              <div>
                <form onSubmit={signUP} className="input_form">
                  <input
                    type="text"
                    className=""
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />

                  <input
                    type="email"
                    className=""
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
                    placeholder="Phone Number"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />

                  <input
                    type="password"
                    className="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setpassword(e.target.value);
                    }}
                  />
                  <button type="submit" className="Login_btn">
                    Register
                  </button>
                </form>
              </div>
            </div>
         
    </Layout>
  );
};

export default AdminRegister;
