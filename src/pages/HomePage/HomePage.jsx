import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
//import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { DataBase } from "../../firebase-config";
import HomepageSidebar from "../../components/HomepageSidebar/HomepageSidebar";
import "./homePage.scss";
import { Link, Navigate } from "react-router-dom";
import '../LandingPage/landingpage.scss'
import { LoggedState } from "../../context/isLoggedContext";

const HomePage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const auth = useAuth();
  const user = auth.currentUser;

  const {isLoggedIn,setisLoggedIn} = LoggedState();
  // console.log(isLoggedIn);
  
  let displayName = "";
  if (user !== null) {
    displayName = user.displayName;
  }

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
          (quiz) => !userData.hasOwnProperty(quiz.ID)
        );

        setQuizzes(filteredQuizzes);
        // console.log(filteredQuizzes, "quiz >> ", quizzes);
      }
    };

    fetchedData();
  }, [user]);

  return (
    <Layout title="Browse 2024 | SARK - Where Imagination Transform To Innovation">
      <div className="homepage-body">
        <HomepageSidebar />
        <div className="hp-container">
          <div className="homepage-body">
            <section className="dashboard-hero">
              <h2>
                Ongoing <span className="event_year">Events</span>
              </h2>
              {user ? (
                <></>
              ) : (
                // <Link to="/register" className="B2H_btn" id="hp_register_btn">
                //   Register
                // </Link>
                <></>
              )}
            </section>
          </div>

          <div className="quizes_container">
            <div className="quiz_cards_stack">
              {user ? (
                quizzes.length > 0 ? (
                  quizzes.map((ele, i) =>
                    // Check if the quiz is public
                    ele.public === "1" ? (
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
                        <p className="quiz_description">
                          {ele.description.length > 100
                            ? `${ele.description.substring(0, 100)}...`
                            : ele.description}
                        </p>
                        <div className="quiz_footer">
                          <p className="quiz_TimeLimit">
                            {ele.timeLimit}{" "}
                            <span style={{ color: "black" }}>min</span>
                          </p>
                          <a
                            className="hp-quiz-btn"
                            href={`/user-rules/${ele.ID}`}
                          >
                            Start
                          </a>
                        </div>
                      </div>
                    ) : null // If the quiz is not public, don't render anything
                  )
                ) : (
                  <div className="Logout_msg_hp">
                    You have no quizzes left. Thank You For Participating.
                  </div>
                )
              ) : (
                // <div className="Logout_msg_hp">
                //   Please Login to Participate in the Quiz
                // </div>
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
