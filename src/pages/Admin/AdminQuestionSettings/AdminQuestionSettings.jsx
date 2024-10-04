import { useState } from "react";
import Layout from "../../../components/Layout/Layout";
import { AdminNavbar } from "./../../../components/AdminNavBar/AdminNavbar";
import {
  Button,
  Empty,
  Tabs,
  Collapse,
  List,
  Image,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { DataBase } from "../../../firebase-config";
import "./adminQuestionSettings.scss";
import toast from "react-hot-toast";
const { Panel } = Collapse;

const AdminQuestionSettings = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const dbQuizRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Quiz
  );
  const dbQuestionRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_Que
  );

  // extract quiz data
  useEffect(() => {
    async function fetchQuiz() {
      const data = await getDocs(dbQuizRef);

      const quizzesData = data.docs.map((ele) => ({
        ...ele.data(),
        id: ele.id,
      }));
      console.log(quizzesData);
      setQuizzes(quizzesData);
    }
    fetchQuiz();
  }, []);

  // extract question data
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

  const shiftQuizTab = (key) => {
    setActiveTab(key);
  };

  const confirm = async (question) => {
    console.log("delete", question);
    try {
      const data = doc(dbQuestionRef, question.id);
      await deleteDoc(data);
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== question.id)
      );
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Questions | Browse 2024">
      <div>
        <AdminNavbar />

        <section className="dashboard">
          <div className="dash-content">
            <div className="overview">
              <div className="title">
                <h2 className="text">Admin Question Settings</h2>
                <Button
                  type="primary"
                  ghost
                  type="dashed"
                  icon={<PlusOutlined />}
                  href="/dashboard/admin/admin-question-settings/add-question"
                >
                  Create Question
                </Button>
              </div>
            </div>
          </div>

          {quizzes.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 60,
              }}
              description={
                <span className="quiz-settings-desc">
                  Admin can create and manage questions here. <br />
                </span>
              }
            >
              <Link to="/dashboard/admin/admin-question-settings/add-question">
                <Button type="primary">Create Now</Button>
              </Link>
            </Empty>
          ) : (
            <Tabs
              onChange={shiftQuizTab}
              type="card"
              items={quizzes.map((quiz, i) => {
                const matchingQuestions = questions.filter(
                  (question) => question.ID === quiz.ID
                );

                return {
                  label: (
                    <span
                      className={`tab-label ${
                        activeTab === i ? "active-tab" : ""
                      }`}
                    >
                      {quiz.title}
                    </span>
                  ),
                  key: i,
                  children:
                    matchingQuestions.length !== 0 ? (
                      <Collapse
                        expandIcon={({ isActive }) => (
                          <RightCircleOutlined rotate={isActive ? 90 : 0} />
                        )}
                      >
                        {matchingQuestions.map((q, j) => (
                          <Panel
                            header={q.question}
                            key={j}
                            extra={
                              <span className="r-icons">
                                <Popconfirm
                                  placement="leftTop"
                                  title={"Delete Quiz"}
                                  description={
                                    "Do you really want to delete this question..?"
                                  }
                                  onConfirm={() => confirm(q)}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <DeleteOutlined />
                                </Popconfirm>

                                <Link
                                  to={`/dashboard/admin/admin-question-settings/edit-question/${q.id}`}
                                >
                                  <EditOutlined />
                                </Link>
                              </span>
                            }
                          >
                            <List
                              size="large"
                              itemLayout="vertical"
                              dataSource={[q]}
                              renderItem={(item) => (
                                <List.Item
                                  extra={
                                    item.imgUrl && (
                                      <Image
                                        className="quiz-img"
                                        width={272}
                                        src={item.imgUrl}
                                      />
                                    )
                                  }
                                >
                                  {console.log(item)}
                                  <List
                                    size="small"
                                    header={
                                      <div className="list-header">
                                        Question Info
                                      </div>
                                    }
                                    footer={
                                      <span className="list-opt-answer">
                                        Answer : {item.correctAnswer}
                                      </span>
                                    }
                                    bordered
                                    dataSource={[item]}
                                    renderItem={(item) => (
                                      <>
                                        <List.Item>
                                          <span className="list-opt">
                                            Option A : {item.optionA}
                                          </span>
                                        </List.Item>
                                        <List.Item>
                                          <span className="list-opt">
                                            Option B : {item.optionB}
                                          </span>
                                        </List.Item>
                                        <List.Item>
                                          <span className="list-opt">
                                            Option C : {item.optionC}
                                          </span>
                                        </List.Item>
                                        <List.Item>
                                          <span className="list-opt">
                                            Option D : {item.optionD}
                                          </span>
                                        </List.Item>
                                      </>
                                    )}
                                  />
                                </List.Item>
                              )}
                            />
                          </Panel>
                        ))}
                      </Collapse>
                    ) : (
                      <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{
                          height: 60,
                        }}
                        description={
                          <span className="quiz-settings-desc">
                            {quiz.title} has no question <br />
                          </span>
                        }
                      >
                        <Link to="/dashboard/admin/admin-question-settings/add-question">
                          <Button type="primary">Create Now</Button>
                        </Link>
                      </Empty>
                    ),
                };
              })}
              activeKey={activeTab}
            />
          )}

          {/* drawer */}
        </section>
      </div>
    </Layout>
  );
};

export default AdminQuestionSettings;
