import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { DataBase } from "../../../firebase-config";
import HomepageSidebar from "../../../components/HomepageSidebar/HomepageSidebar";
import "./Profilepage.scss";
import "../homePage.scss";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendSignInLinkToEmail,
  updateEmail,
} from "firebase/auth";
import toast from "react-hot-toast";
// import firebase from 'firebase'

const Profilepage = () => {
  const [user, setUser] = useState([]);
  const [requiredUser, setrequiredUser] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    branchName: "",
    usn: "",
    password: "",
  });
  const [editPhoneNum, setEditPhoneNum] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);

  const auth = useAuth();
  const Currentuser = auth.currentUser;

  let displayName = "";
  if (Currentuser !== null) {
    displayName = Currentuser.email;
  }

  let userCollectionRef;

  useEffect(() => {
    const fetchedData = async () => {
      if (Currentuser) {
        userCollectionRef = doc(
          DataBase,
          process.env.REACT_APP_DB_COLLECTION_NAME_REG,
          Currentuser.uid
        );

        let userDocSnapshot = await getDoc(userCollectionRef);
        let userData = userDocSnapshot.data();

        if (!userData) {
          userCollectionRef = doc(
            DataBase,
            process.env.REACT_APP_DB_COLLECTION_NAME_REG_ADMIN,
            Currentuser.uid
          );

          userDocSnapshot = await getDoc(userCollectionRef);
          userData = userDocSnapshot.data();
        }
        console.log(userData);
        setEditPhoneNum(userData.phoneNumber);
        setEditEmail(userData.email);
        setUser(userData);
      }
    };
    fetchedData();
  }, [Currentuser]);

  //-------------------------------------------------- Edit User ------------------------
const handleUpdate = async () => {
  const loading = toast.loading("Updating Profile...");
  let userCollectionRefForUpdate;
  if (Currentuser) {
    userCollectionRefForUpdate = doc(
      DataBase,
      process.env.REACT_APP_DB_COLLECTION_NAME_REG,
      Currentuser.uid
    );

    try {
      await updateEmail(Currentuser, editEmail);
      await updateDoc(userCollectionRefForUpdate, {
        phoneNumber: editPhoneNum,
        email: editEmail,
      });

      // Update user state with the new phone number
      setUser((prevUser) => ({
        ...prevUser,
        phoneNumber: editPhoneNum,
        email: editEmail,
      }));

      toast.dismiss(loading);
      setIsEditMode(false);
      console.log("Updated");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Please login again in order to update email");
      console.error("Error updating user data:", error);
    }
  } else {
    console.error("userCollectionRef is not defined");
  }
};


  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    // if (isEditMode)
    // window.location.reload();
  };

  return (
    <Layout title="ProFile Page">
      <div className="homepage-body">
        <HomepageSidebar />

        <div className="profile-container">
          <p className="profile-title">Profile</p>
          {isEditMode ? (
            <>
              <label>Phone Number :</label>
              <input
                type="text"
                value={editPhoneNum}
                onChange={(e) => setEditPhoneNum(e.target.value)}
                placeholder="PhoneNumber"
              />
              <label>Email :</label>
              <input
                type="text"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="PhoneNumber"
              />
              <button onClick={handleUpdate}>Save</button>
            </>
          ) : (
            <>
              <label>Full Name :</label>
              <input
                className="profile-input-box"
                type="text"
                value={user.fullName}
                disabled
              />

              <label>Email :</label>
              <input
                className="profile-input-box"
                type="text"
                value={user.email}
                disabled
              />

              <label>Phone Number :</label>
              <input
                className="profile-input-box"
                type="text"
                value={user.phoneNumber}
                disabled
              />

              {user.admin == 0 && (
                <>

                  <label>Branch :</label>
                  <input
                    className="profile-input-box"
                    type="text"
                    value={user.branchName}
                    disabled
                  />

                  <label>USN :</label>
                  <input
                    className="profile-input-box"
                    type="text"
                    value={user.usn}
                    disabled
                  />

                </>
              )}
              <button onClick={toggleEditMode}>Edit</button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profilepage;
