import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateProfile,
} from "firebase/auth";

import { createContext, useContext, useEffect, useState } from "react";
import { Auth } from "../firebase-config";
import { toast } from "react-hot-toast";
import { LoggedState } from "./isLoggedContext";

const AuthContext = createContext({
  currentUser: JSON.parse(localStorage.getItem("auth")) || null,
  register: () => Promise,
  login: () => Promise,
  logout: () => Promise,
  forgotPassword: () => Promise,
  resetPassword: () => Promise,
  updateUser: () => Promise,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const {isLoggedIn,setisLoggedIn} = LoggedState();

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(Auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      unSubscribe();
    };
  }, []);
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(Auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      unSubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(currentUser));
  }, [currentUser]);

  function register(email, password) {
    return createUserWithEmailAndPassword(Auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(Auth, email, password);
  }
  function forgotPassword(email) {
    return sendPasswordResetEmail(Auth, email, {
      url: process.env.REACT_APP_RESET_PASSWORD_URL,
    });
  }
  function updateUser(displayName, phoneNumber) {
    const updateData = {
      displayName,
      phoneNumber, //idk phoneNumber is not updating
    };
    return updateProfile(Auth.currentUser, updateData);
  }
  async function logout() {
    try{
      await signOut(Auth);
      setisLoggedIn(false);
      localStorage.setItem('log', JSON.stringify(false));
      toast.success('Logged Out suceesfully')
    }
    catch(err){
      console.log(err)
    }
  }
  function resetPassword(oobCode, newPassword) {
    return confirmPasswordReset(Auth, oobCode, newPassword);
  }

  const value = {
    currentUser,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
