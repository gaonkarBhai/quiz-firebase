import React from "react";
import Layout from "../../../../components/Layout/Layout";
import { AdminNavbar } from "../../../../components/AdminNavBar/AdminNavbar";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { DataBase, Storage } from "../../../../firebase-config";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";
import { useEffect } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Tooltip } from "antd";

const AddQuiz = () => {
  const dbRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Quiz
  );
  const { currentUser } = useAuth();
  const [data, setData] = useState({
    title: "",
    ID: "",
    description: "",
    numberOfQuestions: "",
    positiveMarking: "",
    negativeMarking: "",
    timeLimit: "",
    startDate: "",
    startTime: "",
    endTime: "",
    fee: "",
    updated: 0,
    public:"0",
  });
  useEffect(() => {
    if (currentUser) {
      setData((prevData) => ({
        ...prevData,
        createdBy: currentUser.displayName,
      }));
    }
  }, [currentUser]);

  const [photo, setPhoto] = useState("");
  const [progressBar, setProgressBar] = useState(0);

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

  const generateRandomId = (title) => {
    const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string
    const id = `${title.replace(/ /g, "-")}-${randomString}`; // Combine title and random string
    return id;
  };

  const createQuizTemplate = async (e) => {
    e.preventDefault();
    const quizId = generateRandomId(data.title);
    console.log(quizId);
    data.ID = quizId;
    console.log(data);
    try {
      if (photo) {
        if (progressBar === 100) {
          await addDoc(dbRef, data);
          toast.success("Quize added successfully");
          setData({
            title: "",
            ID: "",
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
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error("Photo is not uploaded yet");
        }
      } else {
        // await addDoc(dbRef, data);
        // toast.success("Quize added successfully");
        // setData({
        //   title: "",
        //   ID: "",
        //   description: "",
        //   imageLink: "",
        //   numberOfQuestions: "",
        //   positiveMarking: "",
        //   negativeMarking: "",
        //   timeLimit: "",
        //   startDate: "",
        //   startTime: "",
        //   endTime: "",
        //   fee: "",
        // });
        toast.error("Photo needs to be uploaded");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <Layout title="Add Quiz | Admin Panel">
      <AdminNavbar />
      <div className="ques_upload">
        <form className="flex" onSubmit={createQuizTemplate}>
          <h2>Admin Quiz Settings / Add Quiz:</h2>
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

          <div>
            <label className="sub-btn">
              {photo ? photo?.name : "Upload Photo"}
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
          <Tooltip placement="bottom" title={"event date"}>
            <input
              required
              type="date"
              placeholder="Competation start date"
              onChange={(e) =>
                setData((prev) => ({ ...prev, startDate: e.target.value }))
              }
              value={data.startDate}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"event start time"}>
            <input
              required
              type="time"
              placeholder="Competation start time"
              onChange={(e) =>
                setData((prev) => ({ ...prev, startTime: e.target.value }))
              }
              value={data.startTime}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"event end time"}>
            <input
              required
              type="time"
              placeholder="Competation end time"
              onChange={(e) =>
                setData((prev) => ({ ...prev, endTime: e.target.value }))
              }
              value={data.endTime}
            />
          </Tooltip>
          <input
            required
            type="text"
            placeholder="Fee for participation"
            onChange={(e) =>
              setData((prev) => ({ ...prev, fee: e.target.value }))
            }
            value={data.fee}
          />

          <button type="submit" className="sub-btn">
            Add Question
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddQuiz;
