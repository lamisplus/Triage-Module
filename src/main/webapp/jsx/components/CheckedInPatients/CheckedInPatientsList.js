import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import { url as baseUrl, token } from "./../../../../../api";
import { FaEye, FaUserPlus } from "react-icons/fa";
import {
  MdDashboard,
  MdDeleteForever,
  MdModeEdit,
  MdPerson,
} from "react-icons/md";
import { forwardRef } from "react";
import "semantic-ui-css/semantic.min.css";
import { Link } from "react-router-dom";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { Card, CardBody } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { calculate_age } from "../../Utils";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { Label } from "semantic-ui-react";
import moment from "moment";
import SplitActionButton from "../../layouts/SplitActionButton";
import _ from "lodash";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

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

const Patients = (props) => {
  const [patientList, setPatientList] = useState([]);
  const [patientObj, setpatientObj] = useState([]);
  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    userPermission();
  }, []);
  //Get list of Finger index
  const userPermission = () => {
    axios
      .get(`${baseUrl}account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPermissions(response.data.permissions);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    patients();
  }, []);
  ///GET LIST OF Patients
  async function patients() {
    axios
      .get(`${baseUrl}patient/checked-in-by-service/triage-code`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //console.log(response);
        setPatientList(_.uniqBy(response.data, "id"));
      })
      .catch((error) => {});
  }
  // const calculate_age = (dob) => {
  //   var today = new Date();
  //   var dateParts = dob.split("-");
  //   var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  //   var birthDate = new Date(dateObject); // create a date object directlyfrom`dob1`argument
  //   var age_now = today.getFullYear() - birthDate.getFullYear();
  //   var m = today.getMonth() - birthDate.getMonth();
  //   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //     age_now--;
  //   }
  //   if (age_now === 0) {
  //     return m > 1 ? m + " months" : age_now + " month";
  //   }
  //   return age_now > 1 ? age_now + " years" : age_now + " year";
  // };

  const getHospitalNumber = (identifier) => {
    const identifiers = identifier;
    const hospitalNumber = identifiers.identifier.find(
      (obj) => obj.type == "HospitalNumber"
    );
    return hospitalNumber ? hospitalNumber.value : "";
  };

  function actionItems(row) {
    return [
      {
        type: "single",
        actions: [
          {
            name: "Vitals",
            type: "link",
            icon: <MdPerson size="22" />,
            to: {
              pathname: "/patient-dashboard",
              state: { patientObj: row, permissions: permissions },
            },
          },
          /*                {...(permissions.includes('view_patient') || permissions.includes("all_permission")&&
                        {
                            name:'Patient Dashboard',
                            type:'link',
                            icon:<MdPerson size="20" color='rgb(1, 77, 136)' />,
                            to:{
                                pathname: "/patient-dashboard",
                                state: { patientObj: row , permissions:permissions  }
                            }
                        }
                    )},*/
        ],
      },
    ];
  }

  return (
    <div>
      <Card>
        <CardBody>
          <MaterialTable
            icons={tableIcons}
            title="Checked-In Patients"
            columns={[
              // { title: " ID", field: "Id" },
              {
                title: "Patient Name",
                field: "name",
              },
              {
                title: "Hospital Number",
                field: "hospital_number",
                filtering: false,
              },
              { title: "Sex", field: "sex", filtering: false },
              { title: "Age", field: "age", filtering: false },
              {
                title: "Encounter Date",
                field: "encounterDate",
                filtering: false,
              },
              { title: "Actions", field: "actions", filtering: false },
            ]}
            data={patientList
              .sort((a, b) => b.id - a.id)
              .map((row) => ({
                name: row.firstName + " " + row.surname,
                hospital_number: getHospitalNumber(row.identifier),
                encounterDate: moment(row.encounterDate).format(
                  "DD-MM-YYYY hh:mm A"
                ),
                sex: row.sex,
                age:
                  row.dateOfBirth === 0 ||
                  row.dateOfBirth === undefined ||
                  row.dateOfBirth === null ||
                  row.dateOfBirth === ""
                    ? 0
                    : calculate_age(
                        moment(row.dateOfBirth).format("DD-MM-YYYY")
                      ),
                actions: (
                  <div>
                    {permissions.includes("view_patient") ||
                    permissions.includes("all_permission") ? (
                      <SplitActionButton actions={actionItems(row)} />
                    ) : (
                      ""
                    )}
                  </div>
                ),
              }))}
            options={{
              headerStyle: {
                backgroundColor: "#014d88",
                color: "#fff",
                fontSize: "16px",
                padding: "10px",
              },
              searchFieldStyle: {
                width: "200%",
                margingLeft: "250px",
              },
              filtering: false,
              exportButton: false,
              searchFieldAlignment: "left",
              pageSizeOptions: [10, 20, 100],
              pageSize: 10,
              debounceInterval: 400,
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Patients;
