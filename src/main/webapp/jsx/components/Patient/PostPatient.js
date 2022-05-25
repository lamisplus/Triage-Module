import React, {useState, useEffect} from 'react';
import { Form,Row, Card,CardBody} from 'reactstrap';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import axios from "axios";
import { toast} from "react-toastify";
import { url as baseUrl } from "../../../api";
import { token as token } from "../../../api";
import { useHistory } from "react-router-dom";
import {  Modal, Button } from "react-bootstrap";

import 'react-summernote/dist/react-summernote.css'; // import styles
import { Spinner } from "reactstrap";
// import Autocomplete from '@mui/material/Autocomplete';
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';

// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
        display: 'none'
    }, 
    error: {
        color: "#f85032",
        fontSize: "11px",
    },
    success: {
        color: "#4BB543 ",
        fontSize: "11px",
    },
}))

const AddVitals = (props) => {
    const patientObj = props.patientObj;
    let history = useHistory();
    const classes = useStyles()
    const [services, setServices]= useState([]);
    //const [values, setValues] = useState([]);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        ServicesPost()
      }, []);
        ///GET LIST OF Post Services
        async function ServicesPost() {
            axios
                .get(`${baseUrl}patient/post-service`,
                { headers: {"Authorization" : `Bearer ${token}`} }
                )
                .then((response) => {
                    console.log(response.data)
                    setServices(response.data);
                })
                .catch((error) => {    
                });        
        }

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

  return (      
      <div >
         
              <Modal show={props.showModal} toggle={props.toggle} className="fade" size="lg">
             <Modal.Header toggle={props.toggle} style={{backgroundColor:"#eeeeee"}}>
                Post Patient
                 <Button
                    variant=""
                    className="btn-close"
                    onClick={props.toggle}
                ></Button>
            </Modal.Header>
                <Modal.Body>                   
                        <Card >
                            <CardBody>
                            <form >
                                <div className="row">
                                
                                {/* <Autocomplete
                                    multiple
                                    id="checkboxes-tags-demo"
                                    options={services}
                                    //disableCloseOnSelect
                                    getOptionLabel={(option) => option.moduleServiceName}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.moduleServiceName}
                                        </li>
                                    )}
                                    style={{ width: 400 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Services" />
                                    )}
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
                            >
                                {!saving ? (
                                <span style={{ textTransform: "capitalize" }}>Save</span>
                                ) : (
                                <span style={{ textTransform: "capitalize" }}>Saving...</span>
                                )}
                            </MatButton>
                          
                            <MatButton
                                variant="contained"
                                className={classes.button}
                                startIcon={<CancelIcon />}
                                
                            >
                                <span style={{ textTransform: "capitalize" }}>Cancel</span>
                            </MatButton>
                          
                                </form>
                            </CardBody>
                        </Card> 
                    </Modal.Body>
        
      </Modal>
    </div>
  );
}

export default AddVitals;
