import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Grid, Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import Swal from "sweetalert2";
import { url as baseUrl } from "../../../api";
import { token } from "../../../api";

const columns = [
    {
        field: 'name',
        headerName: 'Patient Name',
        width: 200,
        editable: false,
        valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.otherName || ''} ${params.row.surname || ''}`
    },
    {
        field: 'id',
        headerName: 'Patient ID',
        width: 200,
        editable: false,
    },
    {
        field: 'gender',
        headerName: 'Gender',
        width: 200,
        editable: false,
        valueGetter: (params) =>
            `${params.row.gender.display || ''}`
    },
    {
        field: 'dob',
        headerName: 'Date Of Birth',
        width: 200,
        editable: false,
        valueGetter: (params) =>
            `${params.row.dateOfBirth || ''}`
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 200,
        editable: false,
        renderCell: (params) => (
            <Link
                to={ `/patient-dashboard` }
                state={{ patientObj: params.row }}
            >Patient Dashboard</Link>
        )
    }
];

const PatientList = () => {
    const [patients, setPatients] = useState([]);

    const loadPatients = useCallback(async () => {
        try {
            const response = await axios.get(`${baseUrl}patient/checked-in-by-service/triage-code`, { headers: {"Authorization" : `Bearer ${token}`} });
            setPatients(response.data);
        } catch (e) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred fetching patients!',
            });
        }
    }, []);

    useEffect(() => {
        loadPatients();
    }, [loadPatients]);

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box height={"400px"}>
                            <DataGrid
                                rows={patients}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                disableSelectionOnClick
                            />
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default PatientList;
