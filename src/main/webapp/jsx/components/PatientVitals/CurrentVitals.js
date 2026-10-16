import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Spinner,
} from "reactstrap";
import MatButton from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import axios from "axios";
import { token, url as baseUrl } from "../../../../../api";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { getHeightRangeWarning, getWeightRangeWarning, getAgeInYears, getRespiratoryRateRangeWarning } from "../../Utils";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    "& .input-group-text": {
      fontSize: "0.75rem",
    },
  },
  input: {
    border: "2px solid #014d88",
    borderRadius: "4px",
    fontSize: "16px",
    color: "#000",
  },
  error: {
    color: "#f85032",
    fontSize: "11px",
    marginTop: "4px",
    display: "block",
  },
  success: {
    color: "#4BB543",
    fontSize: "11px",
  },
  inputGroupText: {
    backgroundColor: "#014d88",
    fontWeight: "bolder",
    color: "#fff",
    borderRadius: "4px 0 0 4px",
    border: "2px solid #014d88",
    borderRight: "none",
  },
  inputGroupTextRight: {
    backgroundColor: "#992E62",
    fontWeight: "bolder",
    color: "#fff",
    borderRadius: "4px 0 0 4px",
    border: "2px solid #992E62",
    borderRight: "none",
  },
  inputRightBorder: {
    border: "2px solid #992E62",
    borderRadius: "0 4px 4px 0",
    fontSize: "16px",
    color: "#000",
  },
  label: {
    fontSize: "1rem",
    color: "rgb(153, 46, 98)",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  bmiBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "38px",
    backgroundColor: "#f8f9fa",
    border: "2px solid #014d88",
    borderRadius: "4px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#014d88",
  },
}));

function CurrentVitals(props) {
  const patientObj = props.patientObj;
  const patientAge = getAgeInYears(patientObj.dateOfBirth);

  const classes = useStyles();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [bmi, setBMI] = useState(0);
  const [visitVitalStatus, setVisitVitalStatus] = useState(false);
  const [visitStartDate, setVisitStartDate] = useState(
      new Date().toISOString().substr(0, 10).replace("T", " ")
  );
  const [currentVitalId, setCurrentVitalId] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [today, setToday] = useState(moment().format("YYYY-MM-DDTHH:mm"));

  const [vital, setVitalSignDto] = useState({
    bodyWeight: "",
    diastolic: "",
    captureDate: moment().format("YYYY-MM-DDTHH:mm"),
    height: "",
    personId: props.patientObj.id,
    pulse: "",
    respiratoryRate: "",
    systolic: "",
    temperature: "",
    oxygenSaturation: "",
    levelOfConsciousness: "",
    visitId: props.patientObj.visitId,
  });

  const handleInputChangeVitalSignDto = (e) => {
    const { name, value } = e.target;

    setVitalSignDto({
      ...vital,
      [name]: value,
    });

    if (name === "bodyWeight" || name === "height") {
      const height = Number(name === "height" ? value : vital.height);
      const weight = Number(name === "bodyWeight" ? value : vital.bodyWeight);

      if (height > 0 && weight > 0) {
        const calculatedBMI = Math.round(weight / Math.pow(height / 100, 2));
        setBMI(calculatedBMI);
      } else {
        setBMI("");
      }
    }
  };

  async function patientsVitalsSigns() {
    axios
        .get(`${baseUrl}patient/vital-sign/person/${patientObj.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          props.setPatientList(response.data);
        })
        .catch((error) => {});
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedCaptureDate = moment(vital.captureDate, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DD HH:mm"
    );

    const vitalPayload = {
      ...vital,
      captureDate: formattedCaptureDate,
      oxygenSaturation: vital.oxygenSaturation,
      levelOfConsciousness: vital.levelOfConsciousness,
    };

    setSaving(true);

    const request = visitVitalStatus
        ? axios.put(`${baseUrl}patient/vital-sign/${currentVitalId}`, vitalPayload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        : axios.post(`${baseUrl}patient/vital-sign/`, { ...vitalPayload, visitId: null }, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
        .then((response) => {
          setSaving(false);
          props.patientObj.commenced = true;
          toast.success(visitVitalStatus ? "Vital signs updated successfully" : "Vital signs saved successfully");
          patientsVitalsSigns();
          props.setVisitVitalExists(true);
          props.setKey("vitals-history");
        })
        .catch((error) => {
          setSaving(false);
          toast.error("Something went wrong");
        });
  };

  useEffect(() => {
    patientsVitalsSigns();
    if (props.currentVitals && props.currentVitals.id) {
      getLatestVitals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios
      .get(`${baseUrl}account`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setPermissions(response.data.permissions || []))
      .catch(() => {});
  }, []);

  const canEditVitals =
    permissions.includes("view_triage") || permissions.includes("all_permission");
  const readOnly = visitVitalStatus && !canEditVitals;

  useEffect(() => {
    if (props.currentVitals && props.currentVitals.id) {
      setCurrentVitalId(props.currentVitals.id);
      setVisitVitalStatus(true);
      setVitalSignDto((prev) => ({
        ...prev,
        ...props.currentVitals,
        captureDate: moment(props.currentVitals.captureDate).format("YYYY-MM-DDTHH:mm"),
      }));
      const w = Number(props.currentVitals.bodyWeight);
      const h = Number(props.currentVitals.height);
      setBMI(h > 0 && w > 0 ? Math.round(w / Math.pow(h / 100, 2)) : "");
    }
  }, [props.currentVitals]);

  async function getLatestVitals() {
    const visitId = props.currentVitals?.visitId || props.patientObj.visitId;

    axios
        .get(`${baseUrl}patient/visit/${visitId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setVisitStartDate(
              new Date(response.data.checkInDate).toISOString().substr(0, 10).replace("T", " ")
          );
        });

    axios
        .get(`${baseUrl}patient/vital-sign/visit/${visitId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setVitalSignDto(response.data);
          setBMI(Math.round(response.data.bodyWeight / Math.pow(response.data.height / 100, 2)));
          setVisitVitalStatus(true);
          setCurrentVitalId(response.data.id);

          // Fixed direct state mutation here
          setVitalSignDto(prev => ({
            ...prev,
            captureDate: moment(response.data.captureDate).format("YYYY-MM-DDTHH:mm")
          }));

          props.setVisitVitalExists(true);
        })
        .catch((error) => {});
  }

  const weightWarning = useMemo(
      () => getWeightRangeWarning(vital.bodyWeight, patientAge),
      [vital.bodyWeight, patientAge]
  );

  const heightWarning = useMemo(
      () => getHeightRangeWarning(vital.height),
      [vital.height]
  );

  const respiratoryRateWarning = useMemo(
      () => getRespiratoryRateRangeWarning(vital.respiratoryRate),
      [vital.respiratoryRate]
  );

  return (
      <div className={classes.root}>
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <fieldset disabled={readOnly} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
              {/* ROW 1: Date & Pulse */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormGroup>
                    <Label className={classes.label}>Date Of Vital Sign *</Label>
                    <InputGroup>
                      <Input
                          type="datetime-local"
                          name="captureDate"
                          id="captureDate"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.captureDate}
                          className={classes.input}
                          max={today}
                          min={moment(visitStartDate).format("YYYY-MM-DDTHH:mm")}
                          required
                      />
                    </InputGroup>
                  </FormGroup>
                </div>

                <div className="col-md-6 mb-3">
                  <FormGroup>
                    <Label className={classes.label}>Pulse *</Label>
                    <InputGroup>
                      <InputGroupText className={classes.inputGroupText}>bpm</InputGroupText>
                      <Input
                          type="text"
                          name="pulse"
                          id="pulse"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.pulse}
                          className={classes.input}
                          required
                          onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); }}
                      />
                    </InputGroup>
                    {(vital.pulse > 150 || vital.pulse < 40) && vital.pulse !== "" && (
                        <span className={classes.error}>Pulse must be between 40 and 150</span>
                    )}
                  </FormGroup>
                </div>
              </div>

              {/* ROW 2: Respiratory Rate & Temperature */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormGroup>
                    <Label className={classes.label}>Respiratory Rate *</Label>
                    <InputGroup>
                      <InputGroupText className={classes.inputGroupText}>bpm</InputGroupText>
                      <Input
                          type="text"
                          name="respiratoryRate"
                          id="respiratoryRate"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.respiratoryRate}
                          className={classes.input}
                          onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); }}
                      />
                    </InputGroup>
                    {respiratoryRateWarning && (
                        <Alert severity="warning" style={{ fontSize: "11px", marginTop: "4px", padding: "4px 8px" }}>
                          {respiratoryRateWarning}
                        </Alert>
                    )}
                  </FormGroup>
                </div>

                <div className="col-md-6 mb-3">
                  <FormGroup>
                    <Label className={classes.label}>Temperature *</Label>
                    <InputGroup>
                      <InputGroupText className={classes.inputGroupText}><sup>o</sup>C</InputGroupText>
                      <Input
                          type="text"
                          name="temperature"
                          id="temperature"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.temperature}
                          className={classes.input}
                          onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); }}
                      />
                    </InputGroup>
                    {(vital.temperature > 47 || vital.temperature < 35) && vital.temperature !== "" && (
                        <span className={classes.error}>Temperature must be between 35 and 47</span>
                    )}
                  </FormGroup>
                </div>
              </div>

              {/* ROW 3: Blood Pressure (Split into two proper columns) */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormGroup>
                    <Label className={classes.label}>Blood Pressure (Systolic) *</Label>
                    <InputGroup>
                      <InputGroupText className={classes.inputGroupText}>mmHg</InputGroupText>
                      <Input
                          type="text"
                          name="systolic"
                          id="systolic"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.systolic}
                          className={classes.input}
                          onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); }}
                      />
                    </InputGroup>
                    {vital.systolic > 200 && vital.systolic !== "" && (
                        <span className={classes.error}>Systolic cannot be greater than 200</span>
                    )}
                    {vital.systolic < 60 && vital.systolic !== "" && (
                        <span className={classes.error}>Systolic cannot be less than 60</span>
                    )}
                  </FormGroup>
                </div>

                <div className="col-md-6 mb-3">
                  <FormGroup>
                    <Label className={classes.label}>Blood Pressure (Diastolic) *</Label>
                    <InputGroup>
                      <InputGroupText className={classes.inputGroupTextRight}>mmHg</InputGroupText>
                      <Input
                          type="text"
                          name="diastolic"
                          id="diastolic"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.diastolic}
                          className={classes.inputRightBorder}
                          onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); }}
                      />
                    </InputGroup>
                    {vital.diastolic > 200 && vital.diastolic !== "" && (
                        <span className={classes.error}>Diastolic cannot be greater than 200</span>
                    )}
                    {vital.diastolic < 60 && vital.diastolic !== "" && (
                        <span className={classes.error}>Diastolic cannot be less than 60</span>
                    )}
                  </FormGroup>
                </div>
              </div>

              {/* ROW 4: Body Weight & Height */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormGroup>
                    <Label className={classes.label}>Body Weight *</Label>
                    <InputGroup>
                      <InputGroupText className={classes.inputGroupText}>kg</InputGroupText>
                      <Input
                          type="text"
                          name="bodyWeight"
                          id="bodyWeight"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.bodyWeight}
                          className={classes.input}
                          onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); }}
                      />
                    </InputGroup>
                    {vital.bodyWeight < 1 && vital.bodyWeight !== "" && (
                        <span className={classes.error}>Body Weight cannot be less than 1.</span>
                    )}
                    {weightWarning && (
                        <Alert severity="warning" style={{ fontSize: "11px", marginTop: "4px", padding: "4px 8px" }}>
                          {weightWarning}
                        </Alert>
                    )}
                  </FormGroup>
                </div>

                <div className="col-md-6 mb-3">
                  <FormGroup>
                    <Label className={classes.label}>Height *</Label>
                    <InputGroup>
                      <InputGroupText className={classes.inputGroupText}>cm</InputGroupText>
                      <Input
                          type="text"
                          name="height"
                          id="height"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.height}
                          className={classes.input}
                          onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); }}
                      />
                      <InputGroupText className={classes.inputGroupTextRight} style={{ borderLeft: "none" }}>
                        {vital.height ? (vital.height / 100).toFixed(2) + " M" : "0.00 M"}
                      </InputGroupText>
                    </InputGroup>
                    {vital.height < 1 && vital.height !== "" && (
                        <span className={classes.error}>Height cannot be less than 1.</span>
                    )}
                    {heightWarning && (
                        <Alert severity="warning" style={{ fontSize: "11px", marginTop: "4px", padding: "4px 8px" }}>
                          {heightWarning}
                        </Alert>
                    )}
                  </FormGroup>
                </div>
              </div>

              {/* ROW 5: BMI Display & Oxygen Saturation */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormGroup>
                    <Label className={classes.label}>Body Mass Index (BMI)</Label>
                    <div className={classes.bmiBox}>
                      BMI : <span style={{ color: "#992E62", marginLeft: "8px" }}>{bmi || "0"}</span>
                    </div>
                  </FormGroup>
                </div>

                <div className="col-md-6 mb-3">
                  <FormGroup>
                    <Label className={classes.label}>Oxygen Saturation *</Label>
                    <InputGroup>
                      <InputGroupText className={classes.inputGroupText}>SpO2</InputGroupText>
                      <Input
                          type="text"
                          name="oxygenSaturation"
                          id="oxygenSaturation"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.oxygenSaturation}
                          className={classes.input}
                          onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); }}
                      />
                    </InputGroup>
                    {vital.oxygenSaturation > 100 && vital.oxygenSaturation !== "" && (
                        <span className={classes.error}>Oxygen saturation cannot be greater than 100.</span>
                    )}
                  </FormGroup>
                </div>
              </div>

              {/* ROW 6: Level of Consciousness */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormGroup>
                    <Label className={classes.label}>Level of Consciousness *</Label>
                    <InputGroup>
                      <InputGroupText className={classes.inputGroupText}>AVPU/GCS</InputGroupText>
                      <Input
                          type="text"
                          name="levelOfConsciousness"
                          id="levelOfConsciousness"
                          onChange={handleInputChangeVitalSignDto}
                          value={vital.levelOfConsciousness}
                          className={classes.input}
                          onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); }}
                      />
                    </InputGroup>
                  </FormGroup>
                </div>

                {/* Empty column to maintain the 2-per-row grid alignment */}
                <div className="col-md-6 mb-3"></div>
              </div>

              </fieldset>
              <div className="row mt-3">
                <div className="col-12 d-flex align-items-center">
                  {saving && <Spinner className="mr-3" />}
                  {!readOnly && (
                  <MatButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={<SaveIcon />}
                      style={{
                        backgroundColor: visitVitalStatus ? "green" : "#014d88",
                        color: "#fff",
                      }}
                      disabled={saving}
                  >
                    {saving ? (visitVitalStatus ? "Updating..." : "Saving...") : (visitVitalStatus ? "Update" : "Save")}
                  </MatButton>
                  )}

                  <MatButton
                      variant="contained"
                      className={classes.button}
                      startIcon={<CancelIcon />}
                      style={{ backgroundColor: "rgb(153, 46, 98)", color: "#fff" }}
                      disabled={saving}
                      onClick={() => props.setKey("vitals-history")}
                  >
                    Cancel
                  </MatButton>
                </div>
              </div>

            </form>
          </CardBody>
        </Card>
      </div>
  );
}

export default CurrentVitals;
