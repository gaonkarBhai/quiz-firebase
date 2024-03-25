import { useState } from "react";
import Layout from "../../../../components/Layout/Layout";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { DataBase, Storage } from "../../../../firebase-config";
import "./question.scss";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-hot-toast";
import { Select, Tooltip } from "antd";
import { AdminNavbar } from "../../../../components/AdminNavBar/AdminNavbar";
import { useEffect } from "react";
const { Option } = Select;

const Question = () => {
  const dbRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Que
  );
  const [data, setData] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    ID: "",
    correctAnswer: "",
  });
  const [photo, setPhoto] = useState("");
  const [selectQuiz, setSelectQuiz] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [progressBar, setProgressBar] = useState(0);
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
    };
    fetchedData();
    console.log(quizzes);
  }, []);

  useEffect(() => {
    const uploadPhoto = () => {
      const name = new Date().getTime() + photo.name;
      const storageRef = ref(Storage, name);
      const uploadTask = uploadBytesResumable(storageRef, photo);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressBar(progress);
          console.log(
            "Upload is " + progressBar + "% done",
            snapshot.state,
            progress
          );
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, imgUrl: downloadURL }));
          });
        }
      );
    };
    photo && uploadPhoto();
  }, [photo]);

const createQuestion = async (e) => {
  e.preventDefault();


  if (photo) {
    if (progressBar === 100) {
      // Image is uploaded and progressBar is 100
      // Include the ID and correctAnswer in the data that we add to the database
      const newData = {
        ...data,
        ID: selectQuiz, // Use the selected quiz from the selectQuiz state
        correctAnswer: data.correctAnswer,
      };

      await addDoc(dbRef, newData);

      toast.success("Question added successfully");
      setData({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        imgUrl: "",
        correctAnswer: "",
      });
      setPhoto("");
      setSelectQuiz(""); // Reset the selectQuiz state to an empty string
      console.log(newData);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      // Image is selected but the upload is not complete
      toast.error("Image upload is in progress. Please wait.");
    }
  } else {
    // No photo is selected, continue without the image
    // Include the ID and correctAnswer in the data that we add to the database
    const newData = {
      ...data,
      ID: selectQuiz, // Use the selected quiz from the selectQuiz state
      correctAnswer: data.correctAnswer,
    };
    
    await addDoc(dbRef, newData);

    toast.success("Question added successfully");
    setData({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      imgUrl: "",
      correctAnswer: "",
    });
    setPhoto("");
    setSelectQuiz(""); // Reset the selectQuiz state to an empty string
    console.log(newData);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
};


  return (
    <Layout title="Questions | Browse 2024">
      <AdminNavbar />
      <div className="ques_upload">
        <form className="flex" onSubmit={createQuestion}>
          <h2>Question belongs to:</h2>

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
          <h2>Question:</h2>
          <textarea
            required
            type="text"
            rows="5"
            cols="120"
            id="que"
            onChange={(e) =>
              setData((prev) => ({ ...prev, question: e.target.value }))
            }
            value={data.question}
          />

          <div>
            {photo && (
              <div>
                <img
                  src={URL.createObjectURL(photo)}
                  alt="product photo"
                  height={"200px"}
                  className="img img-responsive"
                />
              </div>
            )}
          </div>
          <Tooltip placement="top" title={"please do not submit immediately after image upload"}>
            <div>
              <label className="sub-btn">
                {photo ? photo?.name : "Upload photo"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => {
                    setPhoto(e.target.files[0]);
                  }}
                  hidden
                />
              </label>
            </div>
          </Tooltip>
          <h2>Options:</h2>

          <input
            required
            type="text"
            placeholder="Option A"
            onChange={(e) =>
              setData((prev) => ({ ...prev, optionA: e.target.value }))
            }
            value={data.optionA}
          />
          <input
            required
            type="text"
            placeholder="Option B"
            onChange={(e) =>
              setData((prev) => ({ ...prev, optionB: e.target.value }))
            }
            value={data.optionB}
          />
          <input
            required
            type="text"
            placeholder="Option C"
            onChange={(e) =>
              setData((prev) => ({ ...prev, optionC: e.target.value }))
            }
            value={data.optionC}
          />
          <input
            required
            type="text"
            placeholder="Option D"
            onChange={(e) =>
              setData((prev) => ({ ...prev, optionD: e.target.value }))
            }
            value={data.optionD}
          />

          <h2>Correct Option:</h2>

          <Select
            bordered={false}
            placeholder="Select correct answer"
            size="large"
            showSearch
            className="input text-white"
            onChange={(value) =>
              setData((prev) => ({ ...prev, correctAnswer: value }))
            }
          >
            <Option value={"optionA"}>Option A</Option>
            <Option value={"optionB"}>Option B</Option>
            <Option value={"optionC"}>Option C</Option>
            <Option value={"optionD"}>Option D</Option>
          </Select>
          <button
            type="submit"
            className={
              data.correctAnswer &&
              data.optionD &&
              data.optionC &&
              data.optionB &&
              data.optionA &&
              data.question
                ? "sub-btn"
                : "sub-btn-not-allowed"
            }
          >
            Add Question
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Question;
