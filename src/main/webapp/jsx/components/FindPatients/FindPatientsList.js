import React, { useState, useEffect, useRef, forwardRef } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import { url as baseUrl, token } from "./../../../../../api";
import { MdPerson } from "react-icons/md";
import { Card, CardBody } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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
import SplitActionButton from "../../layouts/SplitActionButton";

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
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": { margin: theme.spacing(1) },
    "& a": { textDecoration: "none !important" },
  },
}));

const calculateAge = (dob) => {
  if (dob === 0 || dob === undefined || dob === null || dob === "") return 0;
  const today = new Date();
  const birthDate = new Date(dob);
  let ageYears = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    ageYears--;
  }
  if (ageYears === 0) {
    return monthDifference === 0 ? "Less than a month" : `${monthDifference} month(s)`;
  }
  return ageYears === 1 ? "1 year" : `${ageYears} years`;
};

const getHospitalNumber = (identifier) => {
  const list = identifier?.identifier || (Array.isArray(identifier) ? identifier : []);
  const hospitalNumber = list.find((obj) => obj.type === "HospitalNumber");
  return hospitalNumber ? hospitalNumber.value : "";
};

const getPhone = (contactPoint) => {
  const list = contactPoint?.contactPoint || (Array.isArray(contactPoint) ? contactPoint : []);
  return list.find((c) => c.type === "phone")?.value || "";
};

const getAddress = (address) => {
  const a = address?.address?.[0] || (Array.isArray(address) ? address[0] : null);
  if (!a) return "";
  const line = Array.isArray(a.line) ? a.line.filter(Boolean).join(" ") : a.line || "";
  return [line, a.city].filter(Boolean).join(" ").trim();
};

const toPatientObj = (row) => ({
  ...row,
  fullname: [row.firstName, row.otherName, row.surname].filter(Boolean).join(" "),
  hospitalNumber: getHospitalNumber(row.identifier),
  phone: getPhone(row.contactPoint),
  address: getAddress(row.address),
});

const FindPatientsList = () => {
  const classes = useStyles();
  const tableRef = useRef(null);
  const [permissions, setPermissions] = useState([]);
  const [enablePII, setEnablePII] = useState(true);

  useEffect(() => {
    axios
      .get(`${baseUrl}account`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setPermissions(response.data.permissions || []))
      .catch(() => {});
  }, []);

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
              state: { patientObj: toPatientObj(row), permissions },
            },
          },
        ],
      },
    ];
  }

  const handleRemoteData = (query) =>
    new Promise((resolve) => {
      axios
        .get(
          `${baseUrl}patient?pageSize=${query.pageSize}&pageNo=${query.page}&searchParam=${query.search}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((result) => {
          if (!result.data || result.data === "") {
            resolve({ data: [], page: 0, totalCount: 0 });
          } else {
            resolve({
              data: result.data.records.map((row) => ({
                name: [row.firstName, row.otherName, row.surname]
                  .filter(Boolean)
                  .join(", "),
                hospitalNumber: getHospitalNumber(row.identifier),
                sex: row.sex
                  ? row.sex.charAt(0).toUpperCase() + row.sex.slice(1).toLowerCase()
                  : "",
                dateOfBirth: row.dateOfBirth,
                age: calculateAge(row.dateOfBirth),
                actions: <div><SplitActionButton actions={actionItems(row)} /></div>,
              })),
              page: query.page,
              totalCount: result.data.totalRecords,
            });
          }
        })
        .catch(() => resolve({ data: [], page: 0, totalCount: 0 }));
    });

  const PIISelect = () => (
    <FormGroup className="float-right mr-1">
      <FormControlLabel
        control={
          <Checkbox
            onChange={() => setEnablePII(!enablePII)}
            checked={!enablePII}
            style={{ color: "#014d88", fontWeight: "bold" }}
          />
        }
        label="Show PII"
        style={{ color: "#014d88", fontWeight: "bolder" }}
      />
    </FormGroup>
  );

  return (
    <div className={classes.root}>
      <Card>
        <CardBody>
          <MaterialTable
            tableRef={tableRef}
            icons={tableIcons}
            title={<PIISelect />}
            columns={[
              { title: "Name", field: "name", filtering: false, hidden: enablePII },
              { title: "Hosp. Number", field: "hospitalNumber", filtering: false },
              { title: "Sex", field: "sex", filtering: false },
              { title: "Date Of Birth", field: "dateOfBirth", filtering: false },
              { title: "Age", field: "age", filtering: false },
              { title: "Actions", field: "actions", filtering: false },
            ]}
            data={handleRemoteData}
            options={{
              headerStyle: {
                backgroundColor: "#014d88",
                color: "#fff",
                fontSize: "16px",
                padding: "10px",
                fontWeight: "bolder",
              },
              searchFieldStyle: { width: "100%", minWidth: "320px" },
              filtering: false,
              exportButton: false,
              searchFieldAlignment: "left",
              pageSizeOptions: [10, 20, 100],
              pageSize: 10,
              debounceInterval: 400,
              sorting: false,
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default FindPatientsList;
