import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { DataBase } from "../../firebase-config";
import "./UserRules.scss";

const UserRules = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [fullscreen, setfullscreen] = useState(false);
  const [particularquiz, setparticularquiz] = useState({
    ID: "",
    createdBy: "",
    description: "",
    endTime: "",
    fee: "",
    id: "",
    imgUrl: "",
    negativeMarking: "",
    numberOfQuestions: "",
    positiveMarking: "",
    startDate: "",
    startTime: "",
    timeLimit: "",
    title: "",
  });
  const { qid } = useParams("");

  const dbQuizRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Quiz
  );
  useEffect(() => {
    const fetchedData = async () => {
      const data = await getDocs(dbQuizRef);
      const filteredData = data.docs.map((ele) => ({
        ...ele.data(),
        id: ele.id,
      }));
      setQuizzes(filteredData);
      //console.log(filteredData, "quiz >> ", quizzes);
    };
    fetchedData();
  }, []);

  useEffect(() => {
    //console.log(quizzes);
    //console.log(qid);
    const particularquizz = () => {
      const data = quizzes.map((item) =>
        item.ID === qid ? setparticularquiz(item) : null
      );
      console.log(particularquiz);
    };
    particularquizz();
  }, [quizzes]);

  const handleKeyDown = (event) => {
    if (event.keyCode === 122) {
      setfullscreen(!fullscreen);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    // cleanup this component
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Layout title="Browse 2024 | Team SARK">
      {/* Styles are done for seeing the output of fuctionalities its not the actual Style */}
      <div className="rules-container">
        <h1>{particularquiz.title}</h1>
        <p>Negative Marking : <span style={{color:'red'}}>{particularquiz.negativeMarking}</span></p>
        <p> Positive Marking : <span style={{color:'red'}}>{particularquiz.positiveMarking}</span></p>
        <p>Number of Questions : <span style={{color:'red'}}>{particularquiz.numberOfQuestions}</span></p>
        <p> Start Time : <span style={{color:'red'}}>{particularquiz.startTime}</span></p>
        <p>Time Limit : <span style={{color:'red'}}>{particularquiz.timeLimit}</span></p>
        {fullscreen === true ? (
          <>
            <Link to={`/user-questions/${particularquiz.ID}`}>
              <button className="rules_btn"> Start Quiz </button>
            </Link>
            <div>Make sure you are in fullscreen mode during the game</div>
          </>
        ) : (
          <h2>Press <span style={{color:'red'}}>F11</span> to Start Quiz</h2>
        )}
      </div>
    </Layout>
  );
};

export default UserRules;
