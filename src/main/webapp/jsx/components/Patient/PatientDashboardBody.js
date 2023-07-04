import React, { useState, Fragment } from "react";
import { Card, Col, Row, Tab, Tabs } from "react-bootstrap";
import CheckedInPatientList from "../CheckedInPatients/CheckedInPatientsList";
import PatientVitalsHistory from "../PatientVitals/PatientVitalsHistory";
import CurrentVitals from "../PatientVitals/CurrentVitals";

const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};
function PatientDashboardBody(props) {
  const [key, setKey] = useState("vitals-history");
  const [patientObj, setpatientObj] = useState(props.patientObj);
  const [patientList, setPatientList] = useState([]);
  const [currentVitals, setCurrentVitals] = useState({});

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
                  <Tab eventKey="vitals-history" title="History">
                    <PatientVitalsHistory
                      patientObj={patientObj}
                      patientList={patientList}
                      setPatientList={setPatientList}
                      setKey={setKey}
                      setCurrentVitals={setCurrentVitals}
                      currentVitals={currentVitals}
                    />
                  </Tab>
                  <Tab eventKey="current-Vitals" title="Capture Vitals">
                    <CurrentVitals
                      patientObj={patientObj}
                      setVisitVitalExists={props.setVisitVitalExists}
                      setKey={setKey}
                      setPatientList={setPatientList}
                      currentVitals={currentVitals}
                    />
                  </Tab>
                  {/*<Tab eventKey="vitals-charts" title="Charts">
                                        <CurrentVitals patientObj={patientObj} setVisitVitalExists={props.setVisitVitalExists}/>
                                    </Tab>*/}
                </Tabs>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

export default PatientDashboardBody;
