import React from "react";
import {Accordion, AccordionSummary, Grid} from "@mui/material";

const PersonCard = (props) => {
    const patientObj = props.patientObj ? props.patientObj : {};

    return (
        <Accordion defaultExpanded>
            <AccordionSummary>
                <Grid container spacing={2}>
                    <Grid item xs={1}>
                        <img alt={""} />
                    </Grid>
                    <Grid item xs={11}>
                        <Grid item xs={12}>
                            <b style={{fontSize: "25px"}}>
                                { patientObj.firstName } { patientObj.otherName } { patientObj.surname }
                            </b>
                        </Grid>
                        <Grid container>
                            <Grid item xs={4}>
                                Patient ID: { patientObj.identifier.identifier.find(obj => obj.type == "HospitalNumber").value } (Hospital Number)
                            </Grid>

                            <Grid item xs={4}>
                                Date Of Birth : <b>{ patientObj.dateOfBirth }</b>
                            </Grid>

                            <Grid item xs={4}>
                                Age : <b>30 yrs</b>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={4}>
                                Gender: { patientObj.gender.display }
                            </Grid>

                            <Grid item xs={4}>
                                Phone Number : <b>0725756682</b>
                            </Grid>

                            <Grid item xs={4}>
                                Address : <b>Langata</b>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionSummary>
        </Accordion>
    );
};

export default PersonCard;
