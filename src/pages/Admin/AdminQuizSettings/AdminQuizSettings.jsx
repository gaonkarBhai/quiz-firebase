import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import { AdminNavbar } from "../../../components/AdminNavBar/AdminNavbar";
import {
  Button,
  Empty,
  Avatar,
  List,
  Space,
  Drawer,
  Image,
  Tag,
  Badge,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeTwoTone,
  EyeInvisibleTwoTone,
} from "@ant-design/icons";
import "./adminQuizSettings.scss";
import { DataBase } from "../../../firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import genQuizTemp from "../../../utilities/genQuizTemp";

const AdminQuizSettings = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [questions, setQuestions] = useState([]);

  const dbQuestionRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Que
  );
  const dbQuizRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Quiz
  );
  const showDrawer = (quiz) => {
    console.log(quiz);
    setSelectedQuiz(quiz);
    setDrawerOpen(true);
  };

  const onClose = () => {
    setSelectedQuiz(null);
    setDrawerOpen(false);
  };

  // Define the function to fetch quiz data and count questions

  // Call the function once when the component mounts, not in an infinite loop
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const data = await getDocs(dbQuizRef);
        const quizzesData = data.docs.map((ele) => ({
          ...ele.data(),
          id: ele.id,
        }));
        const quizzesWithCount = await Promise.all(
          quizzesData.map(async (quiz) => {
            const count = await countQuestions(quiz);
            return { ...quiz, questionsCount: count };
          })
        );
        setQuizzes(quizzesWithCount);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuizData();
  }, []);

  // fetch questions
  useEffect(() => {
    async function fetchQuestion() {
      const data = await getDocs(dbQuestionRef);

      const questionsData = data.docs.map((ele) => ({
        ...ele.data(),
        id: ele.id,
      }));
      console.log(questionsData);
      setQuestions(questionsData);
    }
    fetchQuestion();
  }, []);

  // fetch questions related to quiz
  const countQuestions = async (quiz) => {
    const rawQuestions = query(dbQuestionRef, where("ID", "==", quiz.ID));
    const docs = await getDocs(rawQuestions);
    let count = 0;
    docs.forEach((doc) => {
      count++;
    });
    return count;
  };
  const confirm = async (quiz) => {
    console.log(quiz);
    try {
      // delete quiz
      const data = doc(dbQuizRef, quiz.id);
      await deleteDoc(data);
      setQuizzes((prevQuizzes) => prevQuizzes.filter((q) => q.id !== quiz.id));

      // delete question related to quiz
      const rawQuestions = query(dbQuestionRef, where("ID", "==", quiz.ID));
      const docs = await getDocs(rawQuestions);
      docs.forEach((doc) => {
        deleteDoc(doc.ref);
      });
      setDrawerOpen(false);
      toast.success("Quiz deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting quiz");
    }
  };

  return (
    <Layout title="Admin Quiz Settings | Dashboard - SARK">
      <div>
        <AdminNavbar />

        <section className="dashboard">
          <div className="dash-content">
            <div className="overview">
              <div className="title">
                <h2 className="text">Admin Quiz Settings</h2>
                <Button
                  type="primary"
                  ghost
                  type="dashed"
                  icon={<PlusOutlined />}
                  href="/dashboard/admin/admin-quiz-settings/add-quiz"
                >
                  Create Quiz
                </Button>
              </div>
            </div>
          </div>
          {!quizzes.length ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 60,
              }}
              description={
                <span className="quiz-settings-desc">
                  Admin can create and manage quizzes here. <br />
                </span>
              }
            >
              <Link to="/dashboard/admin/admin-quiz-settings/add-quiz">
                <Button type="primary">Create Now</Button>
              </Link>
            </Empty>
          ) : (
            <List
              className="list-container"
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              dataSource={quizzes}
              renderItem={(item, index) => (
                <>
                  <List.Item
                    className="list-item"
                    key={item.id}
                    onClick={() => showDrawer(item)}
                    extra={<img width={272} alt="logo" src={item.imgUrl} />}
                  >
                    <List.Item.Meta
                      avatar={<Avatar className="avatar">{index + 1}</Avatar>}
                      title={<span className="quiz-title">{item.title}</span>}
                      description={
                        <span className="sub-quiz-title">
                          {item.description}
                        </span>
                      }
                    />
                    {item.content}
                    <div className="list-footer">
                      <Tag color="success">
                        Created By @
                        {item?.createdBy
                          ? item.createdBy.toLowerCase().replace(" ", "")
                          : ""}
                      </Tag>

                      {item.updated !== 0 && (
                        <Tag color="blue">Updates {item?.updated}</Tag>
                      )}
                      <Tooltip placement="bottom" title={"Question ratio"}>
                        <Badge
                          className="site-badge-count-109"
                          count={`${parseInt(
                            item.questionsCount || 0
                          )}/${parseInt(item.numberOfQuestions)}`}
                          color={
                            parseInt(item.questionsCount) ==
                            parseInt(item.numberOfQuestions)
                              ? "green"
                              : "red"
                          }
                        />
                      </Tooltip>

                      <Tooltip
                        placement="rightTop"
                        title={"downlad Quiz Template"}
                      >
                        <DownloadOutlined
                          onClick={() => {
                            genQuizTemp(item, questions);
                            setDrawerOpen(false);
                          }}
                        />
                      </Tooltip>

                      <Tooltip
                        placement="rightTop"
                        title={
                          item?.public === "0" ? "Unpublished" : "Published"
                        }
                      >
                        {item?.public === "0" ? (
                          <EyeInvisibleTwoTone />
                        ) : (
                          <EyeTwoTone />
                        )}
                      </Tooltip>
                    </div>
                  </List.Item>
                </>
              )}
            />
          )}
          <Drawer
            width={640}
            placement="right"
            closable={false}
            onClose={onClose}
            open={isDrawerOpen}
            className="drawer"
          >
            {selectedQuiz && (
              <div className="r-side">
                {console.log(selectedQuiz.public)}
                <h2 className="title">{selectedQuiz.title}</h2>
                <Image
                  className="quiz-img"
                  width={200}
                  src={selectedQuiz.imgUrl}
                />
                <span className="visibility">
                  {selectedQuiz.public === "0" ? "Unpublished" : "Published"}
                </span>
                <Space class="vertical-space">
                  <div className="sec-r-side">
                    <p>
                      <strong>ID:</strong>
                      <span>{selectedQuiz.ID}</span>
                    </p>
                    <p>
                      <strong>Number of Questions:</strong>
                      <span>{selectedQuiz.numberOfQuestions}</span>
                    </p>
                  </div>
                  <p>
                    <strong>Description:</strong>
                    <span>{selectedQuiz.description}</span>
                  </p>
                  <div className="sec-r-side">
                    <p>
                      <strong>Positive Marking:</strong>
                      <span>{selectedQuiz.positiveMarking}</span>
                    </p>
                    <p>
                      <strong>Negative Marking:</strong>
                      <span>{selectedQuiz.negativeMarking}</span>
                    </p>
                  </div>
                  <div className="sec-r-side">
                    <p>
                      <strong>Time Limit:</strong>
                      <span>{selectedQuiz.timeLimit}</span>
                    </p>
                    <p>
                      <strong>Fee:</strong>
                      <span>{selectedQuiz.fee}</span>
                    </p>
                  </div>
                  <p>
                    <strong>Start Date:</strong>
                    <span>{selectedQuiz.startDate}</span>
                  </p>
                  <div className="sec-r-side">
                    <p>
                      <strong>Start Time:</strong>
                      <span>{selectedQuiz.startTime}</span>
                    </p>
                    <p>
                      <strong>End Time:</strong>
                      <span>{selectedQuiz.endTime}</span>
                    </p>
                  </div>
                </Space>
                <Link
                  to={`/dashboard/admin/admin-quiz-settings/edit-quiz/${selectedQuiz.ID}`}
                >
                  <Button
                    type="primary"
                    ghost
                    type="default"
                    icon={<EditOutlined />}
                    className="button"
                  >
                    Edit Quiz
                  </Button>
                </Link>
                <Popconfirm
                  placement="leftTop"
                  title={"Delete Quiz"}
                  description={
                    "By deleting this quiz all the questions related to this will be deleted!"
                  }
                  onConfirm={() => confirm(selectedQuiz)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="primary"
                    ghost
                    type="default"
                    icon={<DeleteOutlined />}
                    className="button"
                  >
                    Delete Quiz
                  </Button>
                </Popconfirm>
              </div>
            )}
          </Drawer>
        </section>
      </div>
    </Layout>
  );
};

export default AdminQuizSettings;
