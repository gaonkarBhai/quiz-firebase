import Layout from "antd/es/layout/layout";
import "./userAnswer.scss";
import { Link, useParams } from "react-router-dom";
// import Congo from './emoji.png';
import qr_code from './QuizGrp.jpg'
const UserAnswer = () => {
  const { qid } = useParams();

  const getTimeAndQue = JSON.parse(localStorage.getItem(`${qid}`));
  const answeredQuestions = JSON.parse(
    localStorage.getItem("UserSelectedOptions")
  );
  // before redirecting to home ....
  const backToHome = async () => {
    localStorage.removeItem("UserSelectedOptions");
    localStorage.removeItem(`${qid}`);
      setTimeout(() => {
        window.location.reload();
      }, 0);

  };
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  return (
    <Layout title="Submitting Quiz | SARK ">
      <div className="Submition-Container">
      <h1 className="Submition-heading">Submitted Succesfully</h1>
      <p className="para">Number of questions : <span className="Sub-result">{getTimeAndQue.questionLen}</span> </p>
      <p className="para">
        Number of attempted questions :
        <span className="Sub-result">{!answeredQuestions?.length ? 0 : answeredQuestions?.length}</span>
      </p>
      <p className="para">
        Number of unattempted questions :
        <span className="Sub-result">{!answeredQuestions?.length
          ? getTimeAndQue.questionLen
          : getTimeAndQue.questionLen - answeredQuestions?.length}</span>
      </p>
      <p className="para">
        Time taken :
        <span className="Sub-result">{formatTime(
          Number(getTimeAndQue.quiz[0].timeLimit) * 60 - getTimeAndQue.time
        )} minutes</span>
      </p>
      <p className="Qr-Name"> Scan the Below QR to Join WhatsApp Group </p>
      <img src={qr_code} alt="QR code for group link" className="QR-Code-Sub" />
      {/* The above img is only for styling purpose for demo .. Render from firebase */}
      <Link to="/" onClick={backToHome} className="B2H_btn">
        Back to home
      </Link>
      </div>
    </Layout>
  );
};

export default UserAnswer;
