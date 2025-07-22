import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import { Button, Sticky, Label } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Col, Row } from "reactstrap";
import PostPatient from "./PostPatient";
import { Link } from "react-router-dom";
import MatButton from "@material-ui/core/Button";
import { TiArrowBack } from "react-icons/ti";
import { calculate_age } from "../../Utils";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { url as baseUrl, token } from "../../../../../api";
import { Spinner } from "reactstrap";

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "20.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

function PatientCard(props) {
  const { classes } = props;
  const patientObjs = props.patientObj ? props.patientObj : {};
  const [patientObj, setpatientObj] = useState(patientObjs);
  const [modal, setModal] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const toggle = () => setModal(!modal);
  const toggleCheckoutModal = () => setCheckoutModal(!checkoutModal);

  const CurrentStatus = () => {
    return (
      <Label color="blue" size="mini">
        Active
      </Label>
    );
  };

  const getHospitalNumber = (identifier) => {
    const identifiers = identifier;
    const hospitalNumber = identifiers.identifier.find(
      (obj) => obj.type == "HospitalNumber"
    );
    return hospitalNumber ? hospitalNumber.value : "";
  };

  const getPhoneNumber = (identifier) => {
    const identifiers = identifier;
    const phoneNumber = identifiers?.contactPoint?.find(
      (obj) => obj.type == "phone"
    );
    return phoneNumber ? phoneNumber.value : "";
  };

  const getAddress = (identifier) => {
    const identifiers = identifier;
    const address = identifiers.address.find((obj) => obj.city);
    return address ? address.city : "";
  };

  const PostPatientService = (row) => {
    setpatientObj({ ...patientObj, ...row });
    setModal(!modal);
  };

  const checkOutPatient = async () => {
    setCheckingOut(true);

    try {
      await axios.put(
        `${baseUrl}patient/visit/checkout/${patientObj.visitId}`,
        patientObj.visitId,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCheckingOut(false);
      setCheckoutModal(false);

      // Update patient object to reflect checkout status
      setpatientObj({ ...patientObj, checkedOut: true });

      toast.success("Patient checked out successfully.");
    } catch (error) {
      setCheckingOut(false);
      console.error("Checkout error:", error);
      toast.error("Something went wrong during checkout. Please try again.");
    }
  };

  const handleCheckoutClick = (row) => {
    setpatientObj({ ...patientObj, ...row });
    setCheckoutModal(true);
  };

  return (
    <Sticky>
      <div className={classes.root}>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Row>
              <Col md={11}>
                <Row className={"mt-1"}>
                  <Col md={12} className={classes.root2}>
                    <b style={{ fontSize: "25px", color: "rgb(153, 46, 98)" }}>
                      {patientObj.fullname}
                      {patientObj.active === true ? (
                        <span style={{ color: "green" }}>
                          {": " + "Active"}
                        </span>
                      ) : (
                        <span style={{ color: "Red" }}>
                          {": " + "Inactive"}
                        </span>
                      )}
                    </b>
                  </Col>
                  <Col
                    md={4}
                    className={classes.root2}
                    style={{ marginTop: "10px" }}
                  >
                    <span>
                      {" "}
                      Hospital Number :{" "}
                      <b style={{ color: "#0B72AA" }}>
                        {patientObj.hospitalNumber}
                      </b>
                    </span>
                  </Col>

                  <Col
                    md={4}
                    className={classes.root2}
                    style={{ marginTop: "10px" }}
                  >
                    <span>
                      Date Of Birth :{" "}
                      <b style={{ color: "#0B72AA" }}>
                        {patientObj.dateOfBirth}
                      </b>
                    </span>
                  </Col>
                  <Col
                    md={4}
                    className={classes.root2}
                    style={{ marginTop: "10px" }}
                  >
                    <span>
                      {" "}
                      Age :{" "}
                      <b style={{ color: "#0B72AA" }}>
                        {calculate_age(patientObj.dateOfBirth)}
                      </b>
                    </span>
                  </Col>
                  <Col md={4} style={{ marginTop: "10px" }}>
                    <span>
                      {" "}
                      Sex : <b style={{ color: "#0B72AA" }}>{patientObj.sex}</b>
                    </span>
                  </Col>
                  <Col
                    md={4}
                    className={classes.root2}
                    style={{ marginTop: "10px" }}
                  >
                    <span>
                      {" "}
                      Phone Number :{" "}
                      <b style={{ color: "#0B72AA" }}>{patientObj.phone}</b>
                    </span>
                  </Col>
                  <Col
                    md={4}
                    className={classes.root2}
                    style={{ marginTop: "10px" }}
                  >
                    <span>
                      {" "}
                      Address :{" "}
                      <b style={{ color: "#0B72AA" }}>{patientObj.address} </b>
                    </span>
                  </Col>
                </Row>
              </Col>
              <div className="float-end" style={{ floated: "right" }}>
                {" "}
                <Link to={"/"}>
                  <Button floated="right" style={{ padding: "0px" }}>
                    <MatButton
                      variant="contained"
                      floated="right"
                      startIcon={<TiArrowBack />}
                      style={{
                        backgroundColor: "rgb(153, 46, 98)",
                        color: "#fff",
                        height: "35px",
                      }}
                    >
                      <span style={{ textTransform: "capitalize" }}>Back</span>
                    </MatButton>
                  </Button>
                </Link>
                {props.visitVitalExists && (
                  <>
                    {" "}
                    <Button
                      floated="right"
                      style={{
                        backgroundColor: "#014d88",
                        color: "#fff",
                        height: "35px",
                      }}
                      onClick={() => PostPatientService(patientObj)}
                    >
                      Post Patient
                    </Button>
                    <Button
                      floated="right"
                      style={{
                        backgroundColor: "#208001",
                        color: "#fff",
                        height: "35px",
                      }}
                      onClick={() => handleCheckoutClick(patientObj)}
                    >
                      Check-Out Patient
                    </Button>
                  </>
                )}
              </div>
            </Row>
          </ExpansionPanelSummary>
          <Divider />
          <ExpansionPanelActions
            expandIcon={<ExpandMoreIcon />}
          ></ExpansionPanelActions>
        </ExpansionPanel>

        {/* Post Patient Modal */}
        <PostPatient
          toggle={toggle}
          showModal={modal}
          patientObj={patientObj}
        />

        {/* Checkout Confirmation Modal */}
        <Modal
          show={checkoutModal}
          onHide={toggleCheckoutModal}
          className="fade"
          size="md"
        >
          <Modal.Header style={{ backgroundColor: "#fff" }}>
            <Modal.Title style={{ color: "#992E62", fontWeight: "bold" }}>
              Confirm Patient Checkout
            </Modal.Title>
            <button
              type="button"
              className="btn-close"
              onClick={toggleCheckoutModal}
              aria-label="Close"
            ></button>
          </Modal.Header>
          <Modal.Body>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                Are you sure you want to checkout{" "}
                <strong style={{ color: "#0B72AA" }}>
                  {patientObj.fullname}
                </strong>{" "}
                (Hospital No: <strong>{patientObj.hospitalNumber}</strong>)?
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                This action will end the current visit for this patient.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "center" }}>
            <MatButton
              variant="outlined"
              onClick={toggleCheckoutModal}
              style={{
                marginRight: "10px",
                borderColor: "#6c757d",
                color: "#6c757d",
              }}
            >
              Cancel
            </MatButton>
            <MatButton
              variant="contained"
              onClick={checkOutPatient}
              disabled={checkingOut}
              style={{
                backgroundColor: "#208001",
                color: "#fff",
              }}
            >
              {checkingOut ? (
                <>
                  <Spinner size="sm" style={{ marginRight: "8px" }} />
                  Checking Out...
                </>
              ) : (
                "Confirm Checkout"
              )}
            </MatButton>
          </Modal.Footer>
        </Modal>
      </div>
    </Sticky>
  );
}

PatientCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PatientCard);
