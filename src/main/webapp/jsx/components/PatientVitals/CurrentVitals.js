import React, { useEffect, useState } from 'react'
import {Card, CardBody, FormGroup, Input, InputGroup, InputGroupText, Label, Spinner} from "reactstrap";
import MatButton from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {token, url as baseUrl} from "../../../../../api";
import {toast} from "react-toastify";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "semantic-ui-react";
import {Link} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height: 45,
        width: 350
    },
    button: {
        margin: theme.spacing(1)
    },

    root: {
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    input: {
        border:'2px solid #014d88',
        borderRadius:'0px',
        fontSize:'16px',
        color:'#000'
    },
    error: {
        color: "#f85032",
        fontSize: "11px",
    },
    success: {
        color: "#4BB543 ",
        fontSize: "11px",
    },
    inputGroupText:{
        backgroundColor:'#014d88',
        fontWeight:"bolder",
        color:'#fff',
        borderRadius:'0px'
    },
    label:{
        fontSize:'16px',
        color:'rgb(153, 46, 98)',
        fontWeight:'600'
    }
}))



function CurrentVitals(props) {
    const patientObj = props.patientObj;
    const [permissions, setPermissions] = useState([]);
    let history = useHistory();
    const classes = useStyles()
    //const [values, setValues] = useState([]);
    const [currentVitals, setCurrentVitals] = useState([]);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [bmi, setBMI] = useState(0);
    const [visitVitalStatus, setVisitVitalStatus] = useState(false);
    const [currentVitalId, setCurrentVitalId]=useState(null);

    const [vital, setVitalSignDto]= useState({
        bodyWeight: "",
        diastolic: "",
        encounterDate: "",
        facilityId: 1,
        height: "",
        personId: props.patientObj.id,
        pulse: "",
        respiratoryRate: "",
        systolic:"",
        temperature: "",
        visitId:props.patientObj.visitId
    })

    const handleInputChangeVitalSignDto = e => {
        setVitalSignDto ({...vital,  [e.target.name]: e.target.value});
        if(e.target.name =='bodyWeight' || e.target.name == 'height'){
            let height = e.target.name == 'height'? e.target.value:vital.height;
            let weight = e.target.name == 'bodyWeight'? e.target.value:vital.bodyWeight;
            setBMI(Math.round(weight/Math.pow(height,2)))
        }
    }

    //FORM VALIDATION
    const validate = () => {
        let temp = { ...errors }
        //temp.name = details.name ? "" : "This field is required"
        //temp.description = details.description ? "" : "This field is required"
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }

    /**** Submit Button Processing  */
    const handleSubmit = (e) => {
        e.preventDefault();
        //If visit has a vital sign update else create new
        if(visitVitalStatus){
            setSaving(true);
            axios.put(`${baseUrl}patient/vital-sign/${currentVitalId}`, vital,
                { headers: {"Authorization" : `Bearer ${token}`}},

            ).then(response => {
                    setSaving(false);
                    props.patientObj.commenced=true
                    toast.success("Vital signs update successful");
                    props.toggle()
                    props.patientsVitalsSigns()

                })
                .catch(error => {
                    setSaving(false);
                    toast.error("Something went wrong");

                });
        }else{
            setSaving(true);
            axios.post(`${baseUrl}patient/vital-sign/`, vital,
                { headers: {"Authorization" : `Bearer ${token}`}},

            )
                .then(response => {
                    setSaving(false);
                    props.patientObj.commenced=true
                    toast.success("Vital signs save successful");
                    props.toggle()
                    props.patientsVitalsSigns()

                })
                .catch(error => {
                    setSaving(false);
                    toast.error("Something went wrong");

                });
        }


    }
    const userPermission =()=>{
        axios
            .get(`${baseUrl}account`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setPermissions(response.data.permissions);

            })
            .catch((error) => {
            });

    }

    useEffect(() => {

        getLatestVitals()
    }, []);
    ///GET LIST OF Patients
    async function getLatestVitals() {
        axios
            .get(`${baseUrl}patient/vital-sign/visit/${props.patientObj.visitId}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                console.log('current vitals')
                console.log(response.data)
                console.log('current vitals')
                setVitalSignDto(response.data);
                setBMI(Math.round(response.data.bodyWeight/Math.pow(response.data.height,2)));
                setVisitVitalStatus(true);
                setCurrentVitalId(response.data.id)
            })
            .catch((error) => {
            });
    }
    return (
        <div>
            <Card >
                <CardBody>
                    <form >
                        <div className="row">

                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label className={classes.label} >Date Of Vital Signs</Label>
                                    <InputGroup>
                                        <Input
                                            type="date"
                                            name="encounterDate"
                                            id="encounterDate"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.encounterDate}
                                            className={classes.input}
                                        />

                                    </InputGroup>

                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label className={classes.label}>Pulse</Label>
                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            bmp
                                        </InputGroupText>
                                        <Input
                                            type="number"
                                            name="pulse"
                                            id="pulse"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.pulse}
                                            className={classes.input}
                                        />


                                    </InputGroup>
                                    {vital.pulse > 200 ? (
                                        <span className={classes.error}>{"Body Weight cannot be greater than 200."}</span>
                                    ) : ""
                                    }
                                </FormGroup>
                            </div>

                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label className={classes.label}>Respiratory Rate</Label>
                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            bpm
                                        </InputGroupText>
                                        <Input
                                            type="number"
                                            name="respiratoryRate"
                                            id="respiratoryRate"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.respiratoryRate}
                                            className={classes.input}
                                        />


                                    </InputGroup>
                                    {vital.respiratoryRate > 200 ? (
                                        <span className={classes.error}>{"Body Weight cannot be greater than 200."}</span>
                                    ) : ""
                                    }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label className={classes.label}>Temperature</Label>
                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            <sup>o</sup>C
                                        </InputGroupText>
                                        <Input
                                            type="number"
                                            name="temperature"
                                            id="temperature"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.temperature}
                                            className={classes.input}
                                        />


                                    </InputGroup>
                                    {vital.temperature > 200 ? (
                                        <span className={classes.error}>{"Body Weight cannot be greater than 200."}</span>
                                    ) : ""
                                    }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label className={classes.label}>Blood Presure</Label>
                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            systolic(mmHg)
                                        </InputGroupText >
                                        <Input
                                            type="number"
                                            name="systolic"
                                            id="systolic"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.systolic}
                                            className={classes.input}
                                        />

                                    </InputGroup>
                                    {vital.systolic > 200 ? (
                                        <span className={classes.error}>{"Blood Pressure cannot be greater than 200."}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label className={classes.label}>Blood Presure</Label>

                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            diastolic (mmHg)
                                        </InputGroupText>
                                        <Input
                                            type="text"
                                            name="diastolic"
                                            id="diastolic"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.diastolic}
                                            className={classes.input}
                                        />

                                    </InputGroup>
                                    {vital.diastolic > 200 ? (
                                        <span className={classes.error}>{"Blood Pressure cannot be greater than 200."}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label className={classes.label}>Body Weight</Label>
                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            kg
                                        </InputGroupText>
                                        <Input
                                            type="number"
                                            name="bodyWeight"
                                            id="bodyWeight"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.bodyWeight}
                                            className={classes.input}
                                            />


                                    </InputGroup>
                                    {vital.bodyWeight > 200 ? (
                                        <span className={classes.error}>{"Body Weight cannot be greater than 200."}</span>
                                    ) : ""
                                    }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label className={classes.label}>Height</Label>
                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            m
                                        </InputGroupText>
                                        <Input
                                            type="number"
                                            name="height"
                                            id="height"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.height}
                                            className={classes.input}
                                        />

                                    </InputGroup>
                                    {vital.height > 3 ? (
                                        <span className={classes.error}>{"Height cannot be greater than 3."}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>

                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                    <Label className={classes.label}>BMI</Label>
                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            BMI
                                        </InputGroupText>
                                        <Input
                                            type="number"
                                            name="bmi"
                                            id="bmi"
                                            disabled={true}
                                            onChange={handleInputChangeVitalSignDto}
                                            value={bmi}
                                            className={classes.input}
                                        />

                                    </InputGroup>
{/*                                    {vital.height > 3 ? (
                                        <span className={classes.error}>{"Height cannot be greater than 3."}</span>
                                    ) : "" }*/}
                                </FormGroup>
                            </div>



                        </div>




                        <div className="row">
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
                            //style={{backgroundColor:"#014d88", color:'#fff'}}
                            style={{backgroundColor:`${visitVitalStatus?'green':'#014d88'}`, color:'#fff'}}
                        >
                            {!saving ? (
                                <span style={{ textTransform: "capitalize" }}>{visitVitalStatus?'Update':'Save'}</span>
                            ) : (
                                <span style={{ textTransform: "capitalize" }}>{visitVitalStatus?'Updating...':'Saving...'}</span>
                            )}
                        </MatButton>
                        <Link to={"/"} >
                            <MatButton
                                variant="contained"
                                className={classes.button}
                                startIcon={<CancelIcon />}
                                style={{backgroundColor:"rgb(153, 46, 98)", color:'#fff'}}
                            >
                                <span style={{ textTransform: "capitalize" }}>Cancel</span>
                            </MatButton>
                        </Link>

{/*
                        {" "}<Button  floated='right'  style={{backgroundColor:"#014d88", color:'#fff'}} onClick={() => PostPatientService(patientObj)}>Post Patient</Button>
*/}


                    </form>
                </CardBody>
            </Card>
        </div>
    );
}

export default CurrentVitals;