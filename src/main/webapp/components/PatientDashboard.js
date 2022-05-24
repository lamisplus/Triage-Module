import React, { useCallback, useEffect, useState } from "react";
import {Link, useLocation} from "react-router-dom";
import {Box, Button, Card, CardContent, Grid, Paper} from "@mui/material";
import PersonCard from "./PersonCard";
import AddIcon from "@mui/icons-material/Add";
import {DataGrid} from "@mui/x-data-grid";
import axios from "axios";
import {token, url as baseUrl} from "../../../api";
import Swal from "sweetalert2";

const columns = [
    {
        field: 'encounterDate',
        headerName: 'Encounter Date',
        width: 200,
        editable: false,
    },
    {
        field: 'temperature',
        headerName: 'Temperature',
        width: 200,
        editable: false,
    },
    {
        field: 'height',
        headerName: 'Height',
        width: 200,
        editable: false,
    },
    {
        field: 'bodyWeight',
        headerName: 'Weight',
        width: 200,
        editable: false,
    }
];

const PatientDashboard = () => {
    let history = useLocation();
    const [vitalSigns, setVitalSigns] = useState([]);
    const patientObj = history && history.state ? history.state.patientObj : {};

    const loadPatientVitals = useCallback(async () => {
        try {
            const response = await axios.get(`${baseUrl}patient/vital-sign`, { headers: {"Authorization" : `Bearer ${token}`} });
            setVitalSigns(response.data);
        } catch (e) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred fetching patient vitals!',
            });
        }
    }, []);

    useEffect(() => {
        loadPatientVitals();
    }, [loadPatientVitals]);

    return (
        <Card>
            <CardContent>
                <Paper
                    style={{
                        display: "grid",
                        gridRowGap: "20px",
                        padding: "20px",
                        margin: "10px 10px",
                    }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>&nbsp;</Grid>
                        <Grid item xs={3}>&nbsp;</Grid>
                        <Grid item xs={3}>&nbsp;</Grid>
                        <Grid item xs={3}>
                            <Box
                                m={1}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Link style={{ textDecoration: 'none' }}
                                      to={ `/add-patient-vital` }
                                      state={{ patientObj: patientObj }}
                                >
                                    <Button
                                        variant="contained"
                                    >
                                        <AddIcon /> Add Vital Signs
                                    </Button>
                                </Link>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <PersonCard patientObj={patientObj} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Box height={"400px"}>
                                <DataGrid
                                    rows={vitalSigns}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    disableSelectionOnClick
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </CardContent>
        </Card>
    );
};

export default PatientDashboard;
