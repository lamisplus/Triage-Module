import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import { url as baseUrl, token } from "./../../../../../api";
import { MdPerson } from "react-icons/md";
import { forwardRef } from "react";
import "semantic-ui-css/semantic.min.css";
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

import { makeStyles } from "@material-ui/core/styles";
import "@reach/menu-button/styles.css";
import moment from "moment";
import SplitActionButton from "../../layouts/SplitActionButton";
import _ from "lodash";
import Spinner from "react-bootstrap/Spinner";

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
    fontSize: "11px",
  },
}));
const Patients = (props) => {
  const [patientList, setPatientList] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const getServiceCode = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}opd-setting`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        let data = response.data;
        let triageCode = data.find(
          (item) => item.moduleServiceName.toUpperCase() === "TRIAGE"
        )?.moduleServiceCode;
        if (triageCode !== null || triageCode !== null) {
          patients(triageCode);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getServiceCode();
    // patients();
  }, []);
  ///GET LIST OF Patients
  async function patients(triageCode) {
    axios
      .get(`${baseUrl}patient/checked-in-by-service/${triageCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPatientList(_.uniqBy(response.data, "id"));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

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
        ],
      },
    ];
  }

  return (
    <div>
      <Card>
        <CardBody>
          {loading && <Spinner animation="border" />}
          <MaterialTable
            icons={tableIcons}
            title="Checked-In Patients"
            columns={[
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

              { title: "Actions", field: "actions", filtering: false },
            ]}
            data={patientList.reverse().map((row) => ({
              name: row.fullname,
              hospital_number: row.hospitalNumber,
              sex: row.sex,
              age: row.age,
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
