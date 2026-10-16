import React, { useState, Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";
import MatButton from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
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

  const openCaptureVitals = () => {
    setCurrentVitals({});
    setKey("current-Vitals");
  };

  return (
    <Fragment>
      <Row>
        <Col xl={12}>
          <Card style={divStyle}>
            <Card.Body>
              {key === "vitals-history" ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "15px",
                    }}
                  >
                    <MatButton
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={openCaptureVitals}
                      style={{ backgroundColor: "#014d88", color: "#fff" }}
                    >
                      <span style={{ textTransform: "capitalize" }}>
                        Capture Vitals
                      </span>
                    </MatButton>
                  </div>
                  <PatientVitalsHistory
                    patientObj={patientObj}
                    patientList={patientList}
                    setPatientList={setPatientList}
                    setKey={setKey}
                    setCurrentVitals={setCurrentVitals}
                    currentVitals={currentVitals}
                  />
                </>
              ) : (
                <CurrentVitals
                  patientObj={patientObj}
                  setVisitVitalExists={props.setVisitVitalExists}
                  setKey={setKey}
                  setPatientList={setPatientList}
                  currentVitals={currentVitals}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

export default PatientDashboardBody;
