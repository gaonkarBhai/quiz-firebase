import React from "react";
import Layout from "../../../../components/Layout/Layout";
import { AdminNavbar } from "../../../../components/AdminNavBar/AdminNavbar";
import { useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { DataBase, Storage } from "../../../../firebase-config";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";
import { useEffect } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import "./editQuiz.scss";
import { Select } from "antd";
const { Option } = Select;




const EditQuiz = () => {
  const { qid } = useParams("");
  const [photo, setPhoto] = useState("");
  const [progressBar, setProgressBar] = useState(0);
  const [quizData, setQuizData] = useState({});
  const { currentUser } = useAuth();
  const [data, setData] = useState({
    title: "",
    description: "",
    numberOfQuestions: "",
    positiveMarking: "",
    negativeMarking: "",
    timeLimit: "",
    startDate: "",
    startTime: "",
    endTime: "",
    fee: "",
    public: "0",
  });

  const navigate = useNavigate();

  const quizCollectionRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Quiz
  );

  useEffect(() => {
    const findQuiz = async () => {
      const queryForID = query(quizCollectionRef, where("ID", "==", qid));
      const quiz = await getDocs(queryForID);
      quiz.forEach((doc) => {
        setQuizData({
          ...doc.data(),
          id: doc.id,
          updated: parseFloat(doc.data().updated) + 1,
        });
        setData((prevData) => ({
          ...prevData,
          public: doc.data().public || "0",
        }));

      });
    };
    findQuiz();
    console.log(quizData);
  }, []);

  useEffect(() => {
    setData(quizData);
    if (quizData && quizData.public) {
      setData((prevData) => ({
        ...prevData,
        public: quizData.public === "1" ? "1" : "0",
      }));
    }
  }, [quizData]);

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
            console.log(downloadURL);
            setData((prev) => ({ ...prev, imgUrl: downloadURL }));
          });
        }
      );
    };
    photo && uploadPhoto();
  }, [photo]);

  const updateQuizTemplate = async (e) => {
    e.preventDefault();
    // Increment the "updated" field by 1
    // const updatedValue = ;
    // console.log(data.updated);
    // Update the "updated" field in the data object

    console.log(data);
    try {
      if (photo) {
        if (progressBar === 100) {
          await updateDoc(
            doc(
              DataBase,
              process.env.REACT_APP_DB_COLLECTION_NAME_Quiz,
              quizData.id
            ),
            data
          );
          console.log(data);
          toast.success("Quize added successfully");
          setData({
            title: "",
            description: "",
            imageLink: "",
            numberOfQuestions: "",
            positiveMarking: "",
            negativeMarking: "",
            timeLimit: "",
            startDate: "",
            startTime: "",
            endTime: "",
            fee: "",
            public: "0",
          });
          navigate("/dashboard/admin/admin-quiz-settings");
        } else {
          toast.error("Photo is not uploaded yet");
        }
      } else {
        console.log(data, quizData.id);

        await updateDoc(
          doc(
            DataBase,
            process.env.REACT_APP_DB_COLLECTION_NAME_Quiz,
            quizData.id
          ),
          data
        );

        toast.success("Quize added successfully");
        setData({
          title: "",
          description: "",
          imageLink: "",
          numberOfQuestions: "",
          positiveMarking: "",
          negativeMarking: "",
          timeLimit: "",
          startDate: "",
          startTime: "",
          endTime: "",
          fee: "",
          public: "0",
        });
        navigate("/dashboard/admin/admin-quiz-settings");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <Layout title="Edit Quiz | Dashboard - SARK">
      <AdminNavbar />
      <div className="ques_upload">
        <form className="flex" onSubmit={updateQuizTemplate}>
          <h2>Admin Quiz Settings / Edit Quiz:</h2>
          <input
            required
            type="text"
            placeholder="Title"
            onChange={(e) =>
              setData((prev) => ({ ...prev, title: e.target.value }))
            }
            value={data.title}
          />
          <textarea
            required
            type="text"
            rows="5"
            cols="120"
            id="que"
            placeholder="Description"
            onChange={(e) =>
              setData((prev) => ({ ...prev, description: e.target.value }))
            }
            value={data.description}
          />
          <div>
            {quizData.imgUrl && (
              <div>
                <img
                  src={quizData.imgUrl}
                  alt="product photo"
                  height={"200px"}
                  className="img img-responsive"
                />
              </div>
            )}
          </div>

          <div>
            <label className="sub-btn">
              {photo ? photo?.name : "Remove & Upload Photo"}
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={(e) => {
                  setPhoto(e.target.files[0]);
                }}
                hidden
              />
              <div
                className="filler"
                style={{ width: `${progressBar}%` }}
              ></div>
            </label>
          </div>

          <input
            required
            type="text"
            placeholder="Number of questions"
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                numberOfQuestions: e.target.value,
              }))
            }
            value={data.numberOfQuestions}
          />
          <input
            required
            type="text"
            placeholder="Positive marking"
            onChange={(e) =>
              setData((prev) => ({ ...prev, positiveMarking: e.target.value }))
            }
            value={data.positiveMarking}
          />
          <input
            required
            type="text"
            placeholder="Negative marking"
            onChange={(e) =>
              setData((prev) => ({ ...prev, negativeMarking: e.target.value }))
            }
            value={data.negativeMarking}
          />
          <input
            required
            type="text"
            placeholder="Time limit"
            onChange={(e) =>
              setData((prev) => ({ ...prev, timeLimit: e.target.value }))
            }
            value={data.timeLimit}
          />
          <input
            required
            type="date"
            placeholder="Competation start date"
            onChange={(e) =>
              setData((prev) => ({ ...prev, startDate: e.target.value }))
            }
            value={data.startDate}
          />
          <input
            required
            type="time"
            placeholder="Competation start time"
            onChange={(e) =>
              setData((prev) => ({ ...prev, startTime: e.target.value }))
            }
            value={data.startTime}
          />
          <input
            required
            type="time"
            placeholder="Competation end time"
            onChange={(e) =>
              setData((prev) => ({ ...prev, endTime: e.target.value }))
            }
            value={data.endTime}
          />
          <input
            required
            type="text"
            placeholder="Fee"
            onChange={(e) =>
              setData((prev) => ({ ...prev, fee: e.target.value }))
            }
            value={data.fee}
          />
          <Select
            bordered={false}
            placeholder="Select a quiz type"
            size="large"
            className="input text-white"
            value={data.public} // Use 'value' instead of 'defaultValue' for controlled components
            onChange={(value) =>
              setData((prev) => ({ ...prev, public: value }))
            }
          >
            <Option value="0">Unpublish</Option>
            <Option value="1">Publish</Option>
          </Select>

          <button type="submit" className="sub-btn">
            Add Question
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditQuiz;
