import "./dashboard.scss";
import Layout from "../../../components/Layout/Layout";
import { useAuth } from "../../../context/AuthContext";
import { AdminNavbar } from "../../../components/AdminNavBar/AdminNavbar";
import { Table, Modal } from "antd";
import { DataBase } from "../../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import generateCSV from "../../../utilities/genCSV";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const auth = useAuth();
  const user = auth.currentUser;
  // console.log(user);

  let displayName = "";
  if (user !== null) {
    displayName = user.displayName;
  }

  const dbRef = collection(
    DataBase,
    process.env.REACT_APP_DB_COLLECTION_NAME_REG
  );

  let data = [];
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchedData = async () => {
      const data = await getDocs(dbRef);
      const filteredData = data.docs.map((ele) => ({
        ...ele.data(),
        id: ele.id,
      }));
      setUsers(filteredData);
    };
    fetchedData();
  }, []);

  users?.map((ele, i) => {
    users.sort((a, b) => b.timeStamp - a.timeStamp);
    data.push({
      key: i + 1,
      name: ele.username,
      email: ele.email,
      joined: ele.timeStamp.toDate().toISOString().split("T")[0],
      phone: ele.phoneNumber,
      Branch: ele.branchName,
      FullName: ele.fullName,
      usn: ele.usn,
    });
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Joined",
      dataIndex: "joined",
      key: "joined",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  const todaysRegistration = data.filter(
    (obj) => obj.joined === new Date().toISOString().split("T")[0]
  ).length;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().split("T")[0];

  const yesterdaysRegistration = data.filter(
    (obj) => obj.joined === yesterdayDate
  ).length;
  const handleRowClick = (record) => {
    // console.log(record);
    setModalVisible(true);
    setSelectedRow(record);
  };
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedRow(null);
  };

  // Call this function when you want to download the CSV
  const handleDownloadCSV = () => {
    generateCSV(data);
  };
  return (
    <Layout title="Dashboard">
      <div>
        <AdminNavbar />

        <section className="dashboard">
          <div className="dash-content">
            <div className="overview">
              <div className="title">
                <h2 className="text">Hey {displayName}! </h2>
              </div>
              <div className="boxes">
                <div className="box box1">
                  <i className="uil uil-thumbs-up" />
                  <span className="text">Total Registrations</span>
                  <span className="number">{data?.length}</span>
                </div>
                <div className="box box2">
                  <i className="uil uil-comments" />
                  <span className="text">Today's Registrations</span>
                  <span className="number">{todaysRegistration}</span>
                </div>
                <div className="box box3">
                  <i className="uil uil-share" />
                  <span className="text">Yesterday's Registrations</span>
                  <span className="number">{yesterdaysRegistration}</span>
                </div>
              </div>
            </div>
            <div className="activity">
              <div className="title">
                <span className="text">Recent Registration</span>
                <button onClick={handleDownloadCSV}>Download CSV</button>
              </div>
              <Table
                dataSource={data}
                columns={columns}
                className="red-header-table"
                onRow={(record) => {
                  return {
                    onClick: () => handleRowClick(record),
                  };
                }}
              />
              {selectedRow && (
                <Modal
                  title="Participate Details"
                  open={modalVisible}
                  onCancel={handleModalClose}
                  footer={null}
                >
                  <div>
                    <span className="special-span">Full Name :</span>
                    <p className="special-para"> {selectedRow.FullName}</p>
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
                    <p className="special-para"> {selectedRow.Branch}</p>
                  </div>
                  <div>
                    <span className="special-span">Registered Date :</span>
                    <p className="special-para"> {selectedRow.joined}</p>
                  </div>
                </Modal>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
