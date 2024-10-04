import { useState } from "react";
import Layout from "../../../components/Layout/Layout";
import { collection, getDocs, query, where } from "firebase/firestore";
import { DataBase, Storage } from "../../../firebase-config";
// import "./question.scss";
import './results.scss';
import { toast } from "react-hot-toast";
import { Select, Table, Modal } from "antd";
import { AdminNavbar } from "../../../components/AdminNavBar/AdminNavbar";
import { useEffect } from "react";
import generateCSV from "../../../utilities/genCSV";
const { Option } = Select;

const Result = () => {
  const [data,setData] = useState([])
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectQuiz, setSelectQuiz] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const dbQuizRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Quiz
  );
  const dbUserRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_REG
  );
  const dbQuestionRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Que
  );
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Correct Answer",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Time Taken",
      dataIndex: "timeTaken",
      key: "timeTaken",
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    },
  ];

  // get quizzes
  useEffect(() => {
    const fetchedData = async () => {
      const data = await getDocs(dbQuizRef);
      const filteredData = data.docs.map((ele) => ({
        ...ele.data(),
        id: ele.id,
      }));
      setQuizzes(filteredData);
      // setSelectQuiz(filteredData[0]?.ID);
    };
    fetchedData();
    console.log(quizzes);
  }, []);

  // get users
  useEffect(() => {
    const fetchedData = async () => {
      const data = await getDocs(dbUserRef);
      const filteredData = data.docs.map((ele) => ({
        ...ele.data(),
        id: ele.id,
      }));
      setUsers(filteredData);
    };
    fetchedData();
  }, []);

  // calculating score
  const calculateAns = async (user) => {
    console.log(selectQuiz,users);
    const querySnapshot = await getDocs(
      query(dbQuestionRef, where("ID", "==", selectQuiz))
    );
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    if (user[selectQuiz]) {
      console.log(user[selectQuiz], filteredData);

      const userAnswers = user[selectQuiz];
      let score = 0;

      for (const questionId in userAnswers) {
        const userAnswerObj = userAnswers[questionId];
        const filteredQuestion = filteredData.find(
          (question) => question.id === userAnswerObj.questionId
        );

        if (
          filteredQuestion &&
          userAnswerObj.option === filteredQuestion.correctAnswer
        ) {
          score++;
        }
      }

      console.log("User:", user.fullName);
      console.log("Quiz ID:", selectQuiz);
      console.log("Score:", score);
      return score;
    }
    return 0;
  };

useEffect(() => {
  const fetchData = async () => {
    const updatedData = await Promise.all(
      users.map(async (ele, i) => {
        if (ele[selectQuiz]) {
          const score = await calculateAns(ele);
          return {
            name: ele.username,
            email: ele.email,
            joined: ele.timeStamp.toDate().toISOString().split("T")[0],
            phone: ele.phoneNumber,
            branch: ele.branchName,
            fullName: ele.fullName,
            usn: ele.usn,
            score,
            timeTaken: ele[selectQuiz]?.timeTaken,
            // rank: i,
          };
        }
        return null;
      })
    );

    // Filter out the null values (users without answers)
    const filteredData = updatedData.filter((user) => user !== null);

    // Sort the data based on score and timeTaken
    filteredData.sort((a, b) => {
      // Sort by score in descending order
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      // If scores are equal, sort by timeTaken in ascending order
      const aTime = convertTimeToSeconds(a.timeTaken);
      const bTime = convertTimeToSeconds(b.timeTaken);
      return aTime - bTime;
    });

    function convertTimeToSeconds(timeTaken) {
      if (!timeTaken) return 0;

      const [minutes, seconds] = timeTaken.split(":").map(Number);
      return minutes * 60 + seconds;
    }

    for (let i = 0; i < filteredData.length; i++) {
      filteredData[i].rank = i+1;
    }
    setData(filteredData); // Update the data state with the new values
  };

  fetchData();
}, [selectQuiz, users]);


  const handleRowClick = (record) => {
    console.log(record);
    setModalVisible(true);
    setSelectedRow(record);
  };
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedRow(null);
  };


  let resultCSV = [];

  data?.map((ele,i)=>{
    resultCSV.push({
      Key:i+1,
      fullName:ele.fullName,
      PhoneNumber:ele.phone,
      Rank:ele.rank,
      USN:ele.usn
    });
  });

  const handleDownloadCSV = () => {
    generateCSV(resultCSV,selectQuiz);
  };
  
  return (
    <Layout title="Questions | Browse 2024">
      <AdminNavbar />
      <div className="ques_upload">
        <Select
          bordered={false}
          placeholder="Select a quiz type"
          size="large"
          showSearch
          className="input text-white"
          onChange={(value) => {
            setSelectQuiz(value);
          }}
        >
          {quizzes?.map((ele) => (
            <Option value={ele.ID}>{ele.title}</Option>
          ))}
        </Select>
      </div>
      <div className="dashboard">
      {selectQuiz && <button className="results_csv" onClick={handleDownloadCSV}>Download CSV</button>}
        {selectQuiz !== ""? 
        <Table
          dataSource={data}
          columns={columns}
          className="red-header-table"
          onRow={(record) => {
            return {
              onClick: () => handleRowClick(record),
            };
          }}
        />:
        <>
          <p className="select_quiz_msg">Please Select a Quiz to See Reults</p>
        </>
        }
        {selectedRow && (
          <Modal
            title="Participate Details"
            open={modalVisible}
            onCancel={handleModalClose}
            footer={null}
          >
            <div>
              <span className="special-span">Full Name :</span>
              <p className="special-para"> {selectedRow.fullName}</p>
            </div>
            <div>
              <span className="special-span">Name :</span>
              <p className="special-para"> {selectedRow.name}</p>
            </div>
            <div>
              <span className="special-span">Email :</span>
              <p className="special-para"> {selectedRow.email}</p>
            </div>
            <div>
              <span className="special-span">Phone Number :</span>
              <p className="special-para"> {selectedRow.phone}</p>
            </div>
            <div>
              <span className="special-span">USN :</span>
              <p className="special-para"> {selectedRow.usn}</p>
            </div>
            <div>
              <span className="special-span">Branch :</span>
              <p className="special-para"> {selectedRow.branch}</p>
            </div>
            <div>
              <span className="special-span">Registered Date :</span>
              <p className="special-para"> {selectedRow.joined}</p>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};
 
export default Result;
