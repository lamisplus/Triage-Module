import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Tab, Tabs } from "react-bootstrap";
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

  const getAccount = async () => {
    await axios
      .get(`${baseUrl}account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRoles(response.data.roles || []);
        setPermissions(response.data.permissions || []);
        localStorage.setItem("permissions", response.data.permissions);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getAccount();
  }, []);

  useEffect(() => {
    if (roles.length || permissions.length) {
      const admin = permissions.includes("all_permission");
      const rde = roles.includes("RDE");
      setKey(admin || rde ? "find-patients" : "home");
    }
  }, [roles, permissions]);

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
              <div className="custom-tab-1">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
