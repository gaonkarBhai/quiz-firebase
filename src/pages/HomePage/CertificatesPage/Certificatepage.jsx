import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import HomepageSidebar from "../../../components/HomepageSidebar/HomepageSidebar";
import Layout from "../../../components/Layout/Layout";
import "../homePage.scss";
import { DataBase } from "../../../firebase-config";
import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";

import './Certificate.scss';
import generateCerti from "../../../utilities/Certificate";

const CertificatePage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const auth = useAuth();
    const user = auth.currentUser;
    const dbQuizRef = collection(
      DataBase,
      process.env.REACT_APP_DB_COLLECTION_NAME_Quiz
    );
    useEffect(() => {
      const fetchedData = async () => {
        if (user) {
          let userCollectionRef = doc(
            DataBase,
            process.env.REACT_APP_DB_COLLECTION_NAME_REG,
            user.uid
          );

          let userDocSnapshot = await getDoc(userCollectionRef);
          let userData = userDocSnapshot.data();

          if (!userData) {
            userCollectionRef = doc(
              DataBase,
              process.env.REACT_APP_DB_COLLECTION_NAME_REG_ADMIN,
              user.uid
            );

            userDocSnapshot = await getDoc(userCollectionRef);
            userData = userDocSnapshot.data();
          }
          const data = await getDocs(dbQuizRef);

          const quizzesData = data.docs.map((ele) => ({
            ...ele.data(),
            id: ele.id,
          }));

          // Filter the quizzes to exclude those where the 'ID' field matches any key in 'userData'
          const filteredQuizzes = quizzesData.filter(
            (quiz) => userData.hasOwnProperty(quiz.ID)
          );

          setQuizzes(filteredQuizzes);
          //console.log(filteredQuizzes, "quiz >> ", quizzes);
        }
      };
      fetchedData();
    }, [user]);

    const handleGetCertificate = (EventName) =>{
        //console.log(EventName);
        generateCerti(user.displayName,EventName,EventName)
    }

  return (
    <Layout title="Browse 2024 | SARK - Where Imagination Transform To Innovation">
      <div className="homepage-body">
        <HomepageSidebar />
        <div className="hp-container">
          <div className="quizes_container">
            <h1 className="quiz_con_heading">Event Certificates</h1>
            {/* <div className="quiz_cards_stack">
              {user ? (
                quizzes.length > 0 ? (
                  quizzes.map((ele, i) => (
                    <div className="quiz-box" key={i}>
                      <img
                        src={ele.imgUrl}
                        alt={ele.title}
                        className="quiz-img"
                      />
                      <div className="quiz_start">
                        <p>Start time :</p>
                        <p className="quiz_time">{ele.startTime}</p>
                      </div>
                      <h4 className="hp-quiz-title">{ele.title}</h4>
                      <p className="quiz_description">{
                          ele.description.length > 100 ?
                          `${ele.description.substring(0, 100)}...`: ele.description
                        }</p>
                      <div className="quiz_footer_certificate">
                        <div>
                            <button 
                                className="getCertificate"
                                onClick={()=>handleGetCertificate(ele.title)} 
                            >
                                Get Certificate
                            </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="Logout_msg">
                    Not yet participated in any quiz
                  </div>
                )
              ) : (
                <div className="Logout_msg">
                  Please Login to Participate in the Quiz
                </div>
              )}
            </div> */}
            <p>Come back soon</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CertificatePage;
