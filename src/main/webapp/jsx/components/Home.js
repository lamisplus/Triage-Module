import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Tab, Tabs, Spinner } from "react-bootstrap";
import CheckedInPatientList from "./CheckedInPatients/CheckedInPatientsList";
import FindPatientsList from "./FindPatients/FindPatientsList";
import { url as baseUrl } from "./../../../../api";
import { token as token } from "./../../../../api";

const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const Home = () => {
  const [key, setKey] = useState("home");
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const getAccount = async () => {
    await axios
      .get(`${baseUrl}account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const accountRoles = response.data.roles || [];
        const accountPermissions = response.data.permissions || [];
        setRoles(accountRoles);
        setPermissions(accountPermissions);
        localStorage.setItem("permissions", accountPermissions);
        const admin = accountPermissions.includes("all_permission");
        const rde = accountRoles.includes("RDE");
        setKey(admin || rde ? "find-patients" : "home");
        setLoaded(true);
      })
      .catch((error) => {
        setLoaded(true);
      });
  };

  useEffect(() => {
    getAccount();
  }, []);

  const isSuperAdmin = permissions.includes("all_permission");
  const isRDE = roles.includes("RDE");
  const showCheckedIn = isSuperAdmin || !isRDE;
  const showPatients = isSuperAdmin || isRDE;

  return (
    <Fragment>
      <Row>
        <Col xl={12}>
          <Card style={divStyle}>
            <Card.Body>
              {!loaded ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="custom-tab-1">
                  <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                    mountOnEnter
                  >
                    {showCheckedIn && (
                      <Tab eventKey="home" title="Checked-In Patients">
                        <CheckedInPatientList />
                      </Tab>
                    )}
                    {showPatients && (
                      <Tab eventKey="find-patients" title="Patients">
                        <FindPatientsList />
                      </Tab>
                    )}
                  </Tabs>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
