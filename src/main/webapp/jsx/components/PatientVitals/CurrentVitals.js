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
import moment from "moment";

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
        },
        '& .input-group-text':{
            fontSize:'0.75rem'
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
        fontSize:'1.1rem',
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
    const [visitStartDate, setVisitStartDate] = useState(new Date().toISOString().substr(0, 10).replace('T', ' '));
    const [currentVitalId, setCurrentVitalId]=useState(null);
    const [today, setToday] = useState(moment().format('YYYY-MM-DDTHH:mm'));




    const [vital, setVitalSignDto]= useState({
        bodyWeight: "",
        diastolic: "",
        captureDate: moment().format('YYYY-MM-DDTHH:mm'),
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
            setBMI(Math.round(weight/Math.pow((height/100),2)))
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
            vital.captureDate =  moment(vital.captureDate, "YYYY-MM-DDTHH:mm").format('yyyy-MM-DD HH:mm');
            axios.put(`${baseUrl}patient/vital-sign/${currentVitalId}`, vital,
                { headers: {"Authorization" : `Bearer ${token}`}},

            ).then(response => {
                    setSaving(false);
                    props.patientObj.commenced=true
                    toast.success("Vital signs update successful");
                    //props.toggle()
                    //props.patientsVitalsSigns()

                })
                .catch(error => {
                    setSaving(false);
                    toast.error("Something went wrong");


                });
        }else{
            setSaving(true);
            vital.captureDate =  moment(vital.captureDate, "YYYY-MM-DDTHH:mm").format('yyyy-MM-DD HH:mm');
            axios.post(`${baseUrl}patient/vital-sign/`, vital,
                { headers: {"Authorization" : `Bearer ${token}`}},

            )
                .then(response => {
                    setSaving(false);
                    props.patientObj.commenced=true
                    toast.success("Vital signs save successful");
                    //props.toggle()
                   // props.patientsVitalsSigns()
                    props.setVisitVitalExists(true);
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
        axios.get(`${baseUrl}patient/visit/${props.patientObj.visitId}`,{headers:{"Authorization":`Bearer ${token}`}})
            .then(response =>{
                setVisitStartDate(new Date(response.data.checkInDate).toISOString().substr(0, 10).replace('T', ' '))
            })
        axios
            .get(`${baseUrl}patient/vital-sign/visit/${props.patientObj.visitId}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
            )
            .then((response) => {
                setVitalSignDto(response.data);
                setBMI(Math.round(response.data.bodyWeight/Math.pow((response.data.height/100),2)));
                setVisitVitalStatus(true);
                setCurrentVitalId(response.data.id)
                vital.captureDate = moment(response.data.captureDate).format('YYYY-MM-DDTHH:mm')

                props.setVisitVitalExists(true);
            })
            .catch((error) => {
            });
/*        axios.get(`${baseUrl}patient/visit/visit-by-patient/${props.patientObj.visitId}`,
            { headers: {"Authorization" : `Bearer ${token}`} }
            ).then((response)=>{
                console.log("response.data")
                console.log(response.data)
                console.log("response.data")
        })*/
    }
    const numberOnly=(e, inputName)=>{
        const result = e.target.value.replace(/[^0-9]/gi, '');
    }
    return (
        <div className={classes.root}>
            <Card >
                <CardBody>
                    <form >
                        <div className="row">

                            <div className="form-group mb-3 col-md-3">
                                <FormGroup>
                                    <Label className={classes.label} >Date Of Vital Sign *</Label>
                                    <InputGroup>
                                        <Input
                                            type="datetime-local"
                                            name="captureDate"
                                            id="captureDate"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.captureDate}
                                            className={classes.input}
                                            max={today}
                                            min={moment(visitStartDate).format('YYYY-MM-DDTHH:mm')}
                                            required
                                        />

                                    </InputGroup>

                                </FormGroup>
                            </div>

                            <div className="form-group mb-3 col-md-3">
                                <FormGroup>
                                    <Label className={classes.label}>Pulse *</Label>
                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            bmp
                                        </InputGroupText>
                                        <Input
                                            type="text"
                                            name="pulse"
                                            id="pulse"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.pulse}
                                            className={classes.input}
                                            required = {true}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/\D/g,'')
                                            }}
                                        />


                                    </InputGroup>
                                    {vital.pulse > 150 ||vital.pulse < 40  ? (
                                        <span className={classes.error}>{"Pulse must not be greater than 150 and less than 40"}</span>
                                    ) : ""
                                    }
                                </FormGroup>
                            </div>

                            <div className="form-group mb-3 col-md-3">
                                <FormGroup>
                                    <Label className={classes.label}>Respiratory Rate *</Label>
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
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/\D/g,'')
                                            }}
                                        />


                                    </InputGroup>
                                    {vital.respiratoryRate > 40 ||  vital.respiratoryRate < 10 ? (
                                        <span className={classes.error}>{"Respiratory Rate must not be greater than 40 and less than 10"}</span>
                                    ) : ""
                                    }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-3">
                                <FormGroup>
                                    <Label className={classes.label}>Temperature *</Label>
                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            <sup>o</sup>C
                                        </InputGroupText>
                                        <Input
                                            type="text"
                                            name="temperature"
                                            id="temperature"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.temperature}
                                            className={classes.input}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/\D/g,'');
                                            }}
                                        />


                                    </InputGroup>
                                    {vital.temperature > 47 || vital.temperature < 35 ? (
                                        <span className={classes.error}>{"Temperature must not be greater than 47 and less than 35"}</span>
                                    ) : ""
                                    }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>

                                    <InputGroup>
                                        <div style={{width:'30%', display:'flex',alignContent:'flex-start',alignItems:'center', paddingRight:'10px'}}><Label className={classes.label}>Blood Pressure *</Label></div>
                                        <div style={{width:'35%'}}>
                                            <InputGroupText className={classes.inputGroupText}>
                                                systolic(mmHg)
                                            </InputGroupText >
                                            <Input
                                                type="text"
                                                name="systolic"
                                                id="systolic"
                                                onChange={handleInputChangeVitalSignDto}
                                                value={vital.systolic}
                                                className={classes.input}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/\D/g,'')
                                                }}
                                            />
                                            {vital.systolic > 200 ? (
                                                <span className={classes.error}>{"systolic cannot be greater than 200"}</span>
                                            ) : "" }
                                            {vital.systolic < 60 ? (
                                                <span className={classes.error}>{"systolic cannot be less than 60"}</span>
                                            ) : "" }
                                        </div>
                                        <div style={{width:'35%'}}>
                                            <InputGroupText className={classes.inputGroupText} style={{backgroundColor:'#992E62'}}>
                                                diastolic (mmHg)
                                            </InputGroupText>
                                            <Input
                                                type="text"
                                                name="diastolic"
                                                id="diastolic"
                                                onChange={handleInputChangeVitalSignDto}
                                                value={vital.diastolic}
                                                className={classes.input}
                                                style={{border:'2px solid #992E62'}}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/\D/g,'')
                                                }}
                                            />
                                            {vital.diastolic > 200 ? (
                                                <span className={classes.error}>{"diastolic cannot be greater than 200"}</span>
                                            ) : "" }
                                            { vital.diastolic < 60  ? (
                                                <span className={classes.error}>{"diastolic cannot be less than 60"}</span>
                                            ) : "" }
                                        </div>

                                    </InputGroup>

                                </FormGroup>
                            </div>
{/*                            <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                    <Label className={classes.label}>Blood Pressure *</Label>

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
                            </div>*/}
                            <div className="form-group mb-3 col-md-3">
                                <FormGroup>
                                    <Label className={classes.label}>Body Weight *</Label>
                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            kg
                                        </InputGroupText>
                                        <Input
                                            type="text"
                                            name="bodyWeight"
                                            id="bodyWeight"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.bodyWeight}
                                            className={classes.input}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/\D/g,'')
                                            }}
                                            />


                                    </InputGroup>
                                    {vital.bodyWeight > 200 ? (
                                        <span className={classes.error}>{"Body Weight cannot be greater than 200."}</span>
                                    ) : ""
                                    }
                                </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-3">
                                <FormGroup>
                                    <Label className={classes.label}>Height *</Label>
                                    <InputGroup>
                                        <InputGroupText className={classes.inputGroupText}>
                                            cm
                                        </InputGroupText>
                                        <Input
                                            type="text"
                                            name="height"
                                            id="height"
                                            onChange={handleInputChangeVitalSignDto}
                                            value={vital.height}
                                            className={classes.input}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/\D/g,'')
                                            }}

                                        />
                                        <InputGroupText className={classes.inputGroupText} style={{backgroundColor:'#992E62',color:'#fff'}}>
                                            {vital.height/100} M
                                        </InputGroupText>
                                    </InputGroup>

                                    {vital.height > 300 ? (
                                        <span className={classes.error}>{"Height cannot be greater than 300."}</span>
                                    ) : "" }
                                </FormGroup>
                            </div>

                            <div className="form-group mb-3 col-md-2">
                                <div style={{marginTop:'5px',display:'flex',alignContent:'flex-start',alignItems:'center', height:'100%', backgroundColor:'#fff',color:'#014d88 ',fontSize:'16px',padding:'15px',fontWeight:'bold'}}>
                                    <h3 style={{color:'#014d88',fontSize:'1.2rem'}}>BMI : <span style={{color:'#992E62'}}>{bmi}</span> </h3>
                                </div>
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