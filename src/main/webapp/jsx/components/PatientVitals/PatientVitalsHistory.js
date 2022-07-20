import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table';
import axios from "axios";
import { url as baseUrl, token } from "../../../../../api";

import { forwardRef } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from 'react-router-dom'
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import {  Card,CardBody,} from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles'

import { MdDashboard } from "react-icons/md";
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { Label } from 'semantic-ui-react'
import Moment from "moment";
import moment from "moment";
import ButtonMui from "@material-ui/core/Button";
import AddVitals from './AddVitals'


const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

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


const Patients = (props) => {
    
    const [patientList, setPatientList] = useState([])
    const [patientObj, setpatientObj] = useState(props.patientObj)
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    useEffect(() => {
        patientsVitalsSigns()
      }, []);
        ///GET LIST OF Patients
        async function patientsVitalsSigns() {
            axios
                .get(`${baseUrl}patient/vital-sign/person/${patientObj.id}`,
                { headers: {"Authorization" : `Bearer ${token}`} }
                )
                .then((response) => {
                    setPatientList(response.data);
                })
                .catch((error) => {
                });        
        }
        const AddVitalsSigns =(row)=> {
            setpatientObj({...patientObj, ...row});
            setModal(!modal)
        }


  return (
    <div>

            <MaterialTable
            icons={tableIcons}
              title=""
              columns={[
              // { title: " ID", field: "Id" },
                {
                  title: "Ecounter Date",
                  field: "date",
                    headerStyle: {
                        backgroundColor: "#039be5",
                        border:'2px solid #fff',
                        paddingRight:'30px'
                    }
                },
                { title: "Pulse", field: "pulse", filtering: false },
                { title: "Respiratory Rate", field: "respiratoryRate", filtering: false },
                { title: "Blood Presure", field: "bloodPresure", filtering: false },
                { title: "Temperature", field: "temperature", filtering: false },
                { title: "Height", field: "Height", filtering: false },
                { title: "Weight", field: "Weight", filtering: false },
                { title: "BMI", field: "BMI", filtering: false },

              
              ]}
              data={ patientList.map((row) => ({
                  //Id: manager.id,
                  date:row.encounterDate,
                  pulse:row.pulse,
                  respiratoryRate:row.respiratoryRate, 
                  temperature:row.temperature,
                  bloodPresure:row.systolic + " /"+ row.diastolic,
                  Height:row.height,
                  Weight:row.bodyWeight,
                  BMI: Math.round(row.bodyWeight/Math.pow(row.height,2))
                  }))}
            
                        options={{
                          headerStyle: {
                              backgroundColor: "#014d88",
                              color: "#fff",
                              fontSize:'14px',
                          },
                          searchFieldStyle: {
                              width : '200%',
                              margingLeft: '250px',
                          },
                          filtering: false,
                          exportButton: false,
                          searchFieldAlignment: 'left',
                          pageSizeOptions:[10,20,100],
                          pageSize:10,
                          debounceInterval: 400
                      }}
            />
        <AddVitals toggle={toggle} showModal={modal} patientObj={patientObj} patientsVitalsSigns={patientsVitalsSigns}/>
    </div>
  );
}

export default Patients;


