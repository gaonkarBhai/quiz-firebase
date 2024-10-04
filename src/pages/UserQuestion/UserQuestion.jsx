import "./userQuestion.scss";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { DataBase } from "../../firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Button, Modal } from "antd";

const UserQuestion = () => {
  // useStates
  // Add a state to track if the tab is active or not
  const [isTabActive, setIsTabActive] = useState(true);
  const [finishGame, setFinishGame] = useState(false);
  const [finishGameAlert, setFinishGameAlert] = useState(false);
  // Add a state to track the tab switch count
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  // Add a state to control whether to show the tab changed modal
  const [showTabChangedModal, setShowTabChangedModal] = useState(false);
  const { qid } = useParams();
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [selectedOpt, setSelectedOpt] = useState("");
  const [navQuestion, setNavQuestion] = useState(0);
  const [quizFetched, setQuizFetched] = useState(false);
  const [time, setTime] = useState(getTimeFromLocalStorage());
  const redirect = useNavigate();
  const [isTimeOut, setIsTimeOut] = useState(false);
  // Data base references
  const dbQuestionRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Que
  );
  const dbQuizRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Quiz
  );
  // function will be called after time out
  const handleTimeOut = async () => {
    // Update the database with user's answers when timeout occurs
    await updateAnsNQue();
    // Redirect the user to the answer page
    redirect(`/user-answer/${qid}`);
  };

  // --------------------- fetch questions of corresponding id -------------------
  useEffect(() => {
    const fetchedData = async () => {
      const querySnapshot = await getDocs(
        query(dbQuestionRef, where("ID", "==", qid))
      );
      const filteredData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setQuestions(filteredData);
      console.log(questions);
    };
    fetchedData();
  }, [qid]);

  // -------------------- quiz of corresponding id-----------------------------

  // fetch quizes
  useEffect(() => {
    const fetchedData = async () => {
      const querySnapshot = await getDocs(
        query(dbQuizRef, where("ID", "==", qid))
      );
      const filteredData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setQuiz(filteredData);
      setQuizFetched(true); // Mark that the quiz data has been fetched
    };
    fetchedData();
  }, []);

  // -------------------- timer ----------------------------

  // getting initial time
  useEffect(() => {
    const storedTime = getTimeFromLocalStorage();
    if (storedTime === true) {
      // handleTimeOut();
    } else if (storedTime !== null) {
      setTime(storedTime);
    } else if (quizFetched && quiz) {
      const initialTime =
        quiz.length > 0 ? Number(quiz[0]?.timeLimit) * 60 : 30 * 60;
      setTime(initialTime);
    }
  }, [quiz, quizFetched]);

  // countdown
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTime((prevTime) => {
  //       if (prevTime > 0) {
  //         return prevTime - 1;
  //       } else {
  //         clearInterval(timer);
  //         setIsTimeOut(true); // Set isTimeOut to true when the timer reaches 0
  //         return 0;
  //       }
  //     });
  //   }, 1000);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          setIsTimeOut(true);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (isTimeOut) {
      handleTimeOut();
    }
  }, [isTimeOut]);

  // update timings
  useEffect(() => {
    localStorage.setItem(
      qid,
      JSON.stringify({ qid, time, questionLen: questions.length, quiz })
    );
    // console.log(quiz);
  }, [time, qid]);

  // get time from localstorage [based on quiz id]
  function getTimeFromLocalStorage() {
    const storedTimeData = localStorage.getItem(qid);
    if (storedTimeData) {
      const { qid: storedQid, time: storedTime } = JSON.parse(storedTimeData);

      if (storedTime === 0) {
        return true;
      }

      if (storedQid === qid) {
        return storedTime;
      }
    }
    return null;
  }

  // get formetted time
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // ------------------ handle submit and store answers ------------------------
  // handling selected options
  const handleSelectedOpt = (option) => {
    setSelectedOpt(option);
    console.log(option);
    const storedData =
      JSON.parse(localStorage.getItem("UserSelectedOptions")) || [];

    const navQuestionId = questions[navQuestion]?.id;

    // Check if the question has already been answered and update the corresponding object
    const existingQuestionIndex = storedData.findIndex(
      (item) => item.questionId === navQuestionId
    );
    if (existingQuestionIndex !== -1) {
      storedData[existingQuestionIndex].option = option;
      setSelectedOpt(existingQuestionIndex.option);
    } else {
      // If the question has not been answered yet, add a new object to the array
      storedData.push({ questionId: navQuestionId, option: option });
    }

    // Store the updated array back into localStorage
    localStorage.setItem("UserSelectedOptions", JSON.stringify(storedData));
  };

  // remember previous answered questions
  const optionClass = (option) => {
    const navQuestionId = questions[navQuestion]?.id;
    const storedData =
      JSON.parse(localStorage.getItem("UserSelectedOptions")) || [];
    const answeredQuestion = storedData.find(
      (item) => item.questionId === navQuestionId
    );
    return answeredQuestion?.option === option ? "selected-opt opt" : "opt";
  };

  const updateAnsNQue = async () => {
    const User = JSON.parse(localStorage.getItem("auth"));
    let answeredQuestions = JSON.parse(
      localStorage.getItem("UserSelectedOptions")
    );
    const userCollectionRef = doc(
      DataBase,
      process.env.REACT_APP_DB_COLLECTION_NAME_REG,
      User.uid
    );
    const adminCollectionRef = doc(
      DataBase,
      process.env.REACT_APP_DB_COLLECTION_NAME_REG_ADMIN,
      User.uid
    );

    const getTimeAndQue = JSON.parse(localStorage.getItem(`${qid}`));
    // check in which collect  doc is present
    try {
      const userDocSnapshot = await getDoc(userCollectionRef);
      if (userDocSnapshot.exists()) {
        await updateDoc(userCollectionRef, {
          [qid]: {
            ...answeredQuestions,
            timeTaken: formatTime(
              Number(getTimeAndQue.quiz[0].timeLimit) * 60 - getTimeAndQue.time
            ),
          },
        });
        return;
      } else {
        await updateDoc(adminCollectionRef, {
          [qid]: {
            ...answeredQuestions,
            timeTaken: formatTime(
              Number(getTimeAndQue.quiz[0].timeLimit) * 60 - getTimeAndQue.time
            ),
          },
        });
        return;
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // ------------------- for chrome tab change -----------------------------
  // Add a listener for visibility change
  // Add a listener for visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        setIsTabActive(true);
      } else {
        setIsTabActive(false);
        setTabSwitchCount((count) => count + 1);
        // Save the quiz in the database before redirecting
        await updateAnsNQue();
        // Redirect to the result page if tab switch count is greater than 2
        if (tabSwitchCount >= 2) {
          redirect(`/user-answer/${qid}`);
        } else {
          setShowTabChangedModal(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tabSwitchCount, redirect]);

  // ----- prevent copy paste -----------
  document.addEventListener("copy", (event) => {
    event.preventDefault();
  });
  // ------ turn of dev tools -----------
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // ----- prevent window resize---------
  // not working

  // for finishing game
  const finishTheGame = () => {
    setFinishGameAlert(true);
  };
  const handleFinishGame = () => {
    updateAnsNQue();
    redirect(`/user-answer/${qid}`);
  };
  return (
    <Layout title="Answer the following Questions | Browse 2024">
      <div className="user-ques">
        <div className="ques_btns">
          {questions?.map((ele, i) => (
            <button
              onClick={() => {
                setNavQuestion(i);
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="question-con">
          <div className="Q-no">
            {navQuestion + 1 < 9 ? `0${navQuestion + 1}` : navQuestion + 1}
          </div>
          <div className="question">{questions[navQuestion]?.question}</div>
        </div>

        <hr className="hr" />

        <div className="options">
          <div className="option-sub-cont">
            <div
              className={optionClass("optionA")}
              onClick={() => handleSelectedOpt("optionA")}
            >
              <div className="opt-box"></div>
              <p>{questions[navQuestion]?.optionA}</p>
            </div>
            <div
              className={optionClass("optionB")}
              onClick={() => handleSelectedOpt("optionB")}
            >
              <div className="opt-box"></div>
              <p>{questions[navQuestion]?.optionB}</p>
            </div>
            <div
              className={optionClass("optionC")}
              onClick={() => handleSelectedOpt("optionC")}
            >
              <div className="opt-box"></div>
              <p>{questions[navQuestion]?.optionC}</p>
            </div>
            <div
              className={optionClass("optionD")}
              onClick={() => handleSelectedOpt("optionD")}
            >
              <div className="opt-box"></div>
              <p>{questions[navQuestion]?.optionD}</p>
            </div>
          </div>

          <div className="timer">
            {questions[navQuestion]?.imgUrl && (
              <img
                src={questions[navQuestion]?.imgUrl}
                alt="picture"
                className="ques_img"
              />
            )}

            <p className="time">Time Left: {formatTime(time)}</p>
          </div>
        </div>

        <div className="ques-btns">
          <button
            className="btnss prev"
            onClick={() => {
              navQuestion < 1
                ? setNavQuestion(questions.length - 1)
                : setNavQuestion(navQuestion - 1);
              setSelectedOpt("");
            }}
          >
            Prev
          </button>
          <button
            className="btnss next"
            onClick={() => {
              navQuestion >= 0 && navQuestion < questions.length - 1
                ? setNavQuestion(navQuestion + 1)
                : setNavQuestion(0);
              setSelectedOpt("");
            }}
          >
            Next
          </button>

          <button className="btnss next" onClick={finishTheGame}>
            Finish
          </button>
        </div>
      </div>
      {isTimeOut && (
        <Modal
          title="Time Out!"
          visible={isTimeOut}
          onCancel={() => {
            setIsTimeOut(false);
            redirect(`/user-answer/${qid}`);
          }}
          footer={null}
        >
          <p>Your time is up! Redirecting to the result page...</p>
        </Modal>
      )}
      {/* for triggering tab change modal */}
      {showTabChangedModal && (
        <Modal
          title="Tab Changed!!"
          open={showTabChangedModal}
          closable={false}
          footer={[
            <Button
              key="ok"
              type="primary"
              onClick={() => setShowTabChangedModal(false)}
            >
              OK
            </Button>,
          ]}
        >
          <div>
            You just changed the tab which is not allowed <br />
            Remaining chance {3 - tabSwitchCount}
          </div>
        </Modal>
      )}

      {/* for finish button */}
      {finishGameAlert && (
        <Modal
          title="FINISH GAME"
          open={finishGameAlert}
          closable={false}
          footer={[
            <Button
              key="cancel"
              type="dashed"
              onClick={() => setFinishGameAlert(false)}
            >
              Cancel
            </Button>,
            <Button key="finish" type="primary" onClick={handleFinishGame}>
              Finish
            </Button>,
          ]}
        >
          <div>Do you want to finish the game?</div>
        </Modal>
      )}
    </Layout>
  );
};

export default UserQuestion;
