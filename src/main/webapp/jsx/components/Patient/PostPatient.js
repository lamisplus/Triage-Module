import React, { useState, useEffect } from "react";
import { Form, Row, Card, CardBody } from "reactstrap";
import MatButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { Step, Label, Segment, Icon } from "semantic-ui-react";
import axios from "axios";
import { toast } from "react-toastify";
import { url as baseUrl, token } from "../../../../../api";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { format } from "date-fns";
import "react-summernote/dist/react-summernote.css"; // import styles
import { Spinner } from "reactstrap";
import Select from "react-select";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cardBottom: {
    marginBottom: 20,
  },
  Select: {
    height: 45,
    width: 350,
  },
  button: {
    margin: theme.spacing(1),
  },

  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  error: {
    color: "#f85032",
    fontSize: "11px",
  },
  success: {
    color: "#4BB543 ",
    fontSize: "11px",
  },
}));
let newDate = new Date();

const AddVitals = (props) => {
  const patientObj = props.patientObj;

  const [selectedOption, setSelectedOption] = useState([]);
  let history = useHistory();
  const classes = useStyles();
  const [services, setServices] = useState([]);
  //const [values, setValues] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    ServicesPost();
  }, []);
  ///GET LIST OF Post Services
  async function ServicesPost() {
    axios
      .get(`${baseUrl}opd-setting`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        let data = response.data.filter(
          (a) => a.moduleServiceName.toUpperCase() !== "TRIAGE"
        );

        setServices(
          Object.entries(data).map(([key, value]) => ({
            label: value.moduleServiceName,
            value: value.moduleServiceCode,
          }))
        );
      })
      .catch((error) => {});
    // axios
    //   .get(`${baseUrl}patient/encounter/visit/${patientObj.visitId}`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
    //   .then((response) => {
    
    //     setSelectedOption(_.uniq(_.map(response.data, "serviceCode")));
    //   });
  }
  const createdAt = new Date();

  const [postServices, setPostServices] = useState({
    encounterDate: format(new Date(newDate), "yyyy-MM-dd"),
    facilityId: patientObj.facilityId,
    personId: "",
    serviceCode: "",
    visitId: "",
  });

  /**** Submit Button Processing  */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption.length > 0) {
      setSaving(true);
      let serviceArr = [];

      selectedOption.forEach(function (value, index, array) {
        serviceArr.push(value);
      });
      postServices.personId = patientObj.id;
      postServices.visitId = patientObj.visitId;
      postServices.serviceCode = serviceArr;
      axios
        .post(`${baseUrl}patient/post`, postServices, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
         
          setSaving(false);
          props.patientObj.commenced = true;
          toast.success("Patient posted successfully.");
          props.toggle();
          //props.patientsVitalsSigns()
        })
        .catch((error) => {
          setSaving(false);
          toast.error("Something went wrong");
        });
    } else {
      toast.error("Kindly select a service to post the patient");
    }
  };

  return (
    <div>
      <Modal
        show={props.showModal}
        toggle={props.toggle}
        className="fade"
        size="lg"
      >
        <Modal.Header toggle={props.toggle} style={{ backgroundColor: "#fff" }}>
          <Label
            for="post-services"
            style={{
              backgroundColor: "#fff",
              color: "#014d88",
              fontWeight: "bolder",
              fontSize: "18px",
            }}
          >
            <h5
              style={{ fontWeight: "bold", fontSize: "30px", color: "#992E62" }}
            >
              Post Patient
            </h5>
          </Label>
          <Button
            variant=""
            className="btn-close"
            onClick={props.toggle}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <CardBody>
              <form>
                <div className="row">
                  <DualListBox
                    options={services}
                    onChange={setSelectedOption}
                    selected={selectedOption}
                  />
                  {/*
                                   <Select
                                        onChange={setSelectedOption}
                                        value={selectedOption}
                                        options={services}
                                        isMulti="true"
                                        noOptionsMessage="true"
                                    />
*/}
                </div>

                {saving ? <Spinner /> : ""}
                <br />

                <MatButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  style={{ backgroundColor: "#014d88" }}
                >
                  {!saving ? (
                    <span style={{ textTransform: "capitalize" }}>Save</span>
                  ) : (
                    <span style={{ textTransform: "capitalize" }}>
                      Saving...
                    </span>
                  )}
                </MatButton>
              </form>
            </CardBody>
          </Card>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddVitals;
