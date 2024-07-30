import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Tab, Tabs } from "react-bootstrap";
import CheckedInPatientList from "./CheckedInPatients/CheckedInPatientsList";
import { url as baseUrl } from "./../../../../api";
import { token as token } from "./../../../../api";

const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const Home = () => {
  const [key, setKey] = useState("home");
  const getPermissions = async () => {
    await axios
      .get(`${baseUrl}account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        localStorage.setItem("permissions", response.data.permissions);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getPermissions();
  }, []);

  return (
    <Fragment>
      <Row>
        <Col xl={12}>
          <Card style={divStyle}>
            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                >
                  <Tab eventKey="home" title="Checked-In Patients">
                    <CheckedInPatientList />
                  </Tab>
                  {/*<Tab eventKey="find-patient" title="Checked-Out Patients">
                        <CheckedInPatientList setKey={setKey}/>
                    </Tab>*/}
                </Tabs>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
