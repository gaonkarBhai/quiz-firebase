import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { DataBase } from "./firebase-config";
import { doc, getDoc } from "firebase/firestore";
import AuthContextProvider, { useAuth } from "./context/AuthContext";
import "./App.scss";

import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Loginpage from "./pages/LoginPage/Loginpage";
import Forgotpage from "./pages/ForgotPassword/Forgotpage";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import RegisterPage from "./pages/RegisterPage/Register";
import Question from "./pages/Admin/AdminQuestionSettings/AddQuestion/Question";
import HomePage from "./pages/HomePage/HomePage";
import UserQuestion from "./pages/UserQuestion/UserQuestion";
import UserRules from "./pages/Userrulespage/UserRules";
import Profilepage from "./pages/HomePage/ProfilePage/Profilepage";
import UserAnswer from "./pages/UserAnswer/UserAnswer";
import AdminRegister from "./pages/Admin/AdminRegister/AdminRegister";
import Result from "./pages/Admin/Result/Result";
import AdminLogin from "./pages/Admin/AdminLogin/AdminLogin";
import AdminPass from "./pages/Admin/AdminPass/AdminPass";
import ContestAttended from "./pages/HomePage/ContestAttended/ContestAttended";
import AdminQuizSettings from "./pages/Admin/AdminQuizSettings/AdminQuizSettings";
import AddQuiz from './pages/Admin/AdminQuizSettings/AddQuiz/AddQuiz';
import EditQuiz from "./pages/Admin/AdminQuizSettings/EditQuiz/EditQuiz";
import AdminQuestionSettings from "./pages/Admin/AdminQuestionSettings/AdminQuestionSettings";
import EditQuestion from "./pages/Admin/AdminQuestionSettings/EditQuestion/EditQuestion";
import { LoggedState } from "./context/isLoggedContext";
import CertificatePage from "./pages/HomePage/CertificatesPage/Certificatepage";

function App() {
  const navigate = useNavigate();
  const {isLoggedIn,setisLoggedIn} = LoggedState();

  const { currentUser } = useAuth();
  // protected routes
  const RequireAuth = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  const RequireHomeAuth = ({children})=>{
     return isLoggedIn ? children : <Navigate to="/login" />;
  }

   
  const RequireAdminAuth = ({ children }) => {
    useEffect(() => {
      const checkAdminStatus = async () => {
        try {
          if (currentUser) {
            // console.log(currentUser);

            const docRef = doc(
              DataBase,
              process.env.REACT_APP_DB_COLLECTION_NAME_REG,
              currentUser.uid
            );
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const isAdmin = docSnap.data();
              if (!isAdmin?.admin) {
                navigate("/");
              }
            } else {
              console.log("No such document!");
            }
          } else {
            navigate("*");
          }
        } catch (error) {
          console.log("Error retrieving document:", error);
        }
      };

      checkAdminStatus();
    }, []);

    return children;
  };

  return (
    <AuthContextProvider>
      <Routes>
        <Route
          path="/dashboard/admin"
          element={
            <RequireAdminAuth>
              <Dashboard />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/dashboard/admin/admin-question-settings/"
          element={
            <RequireAdminAuth>
              <AdminQuestionSettings />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/dashboard/admin/admin-question-settings/add-question"
          element={
            <RequireAdminAuth>
              <Question />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/dashboard/admin/admin-quiz-settings"
          element={
            <RequireAdminAuth>
              <AdminQuizSettings />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/dashboard/admin/admin-quiz-settings/add-quiz"
          element={
            <RequireAdminAuth>
              <AddQuiz />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/dashboard/admin/admin-quiz-settings/edit-quiz/:qid"
          element={
            <RequireAdminAuth>
              <EditQuiz />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/dashboard/admin/admin-question-settings/edit-question/:qid"
          element={
            <RequireAdminAuth>
              <EditQuestion />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/dashboard/admin/result"
          element={
            <RequireAdminAuth>
              <Result />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/user-questions/:qid"
          element={
            <RequireAuth>
              <UserQuestion />
            </RequireAuth>
          }
        />
        <Route
          path="/user-answer/:qid"
          element={
            <RequireAuth>
              <UserAnswer />
            </RequireAuth>
          }
        />
        <Route
          path="/user-rules/:qid"
          element={
            <RequireAuth>
              <UserRules />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profilepage />
            </RequireAuth>
          }
        />
        <Route
          path="/contest-attended"
          element={
            <RequireAuth>
              <ContestAttended />
            </RequireAuth>
          }
        />
        <Route
          path="/events-certificate"
          element={
            <RequireAuth>
              <CertificatePage />
            </RequireAuth>
          }
        />
        <Route 
          path="/" 
          element={
            <RequireHomeAuth>
              <HomePage />
            </RequireHomeAuth>  
          } 
        />
        <Route path="/login" element={<Loginpage />} />
        <Route path="AdminPass" element={<AdminPass />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/forgot-pass" element={<Forgotpage />} />
        <Route path="/reset-pass" element={<ResetPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
