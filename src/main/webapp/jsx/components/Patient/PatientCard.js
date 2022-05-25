import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import { Button } from 'semantic-ui-react';
import {Label,} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import { Col, Row } from "reactstrap";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import PostPatient from './PostPatient'

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '20.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

function PatientCard(props) {
  const { classes } = props;
  const patientObjs = props.patientObj ? props.patientObj : {}
  const [patientObj, setpatientObj] = useState(patientObjs)
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);


    const calculate_age = dob => {
      var today = new Date();
      var dateParts = dob.split("-");
      var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      var birthDate = new Date(dateObject); // create a date object directlyfrom`dob1`argument
      var age_now = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                  age_now--;
              }
          if (age_now === 0) {
                  return m + " month(s)";
              }
              return age_now + " year(s)";
    };

  
  const CurrentStatus = ()=>{

        return (  <Label color="blue" size="mini">Active</Label>);
}
const getHospitalNumber = (identifier) => {     
  const identifiers = identifier;
  const hospitalNumber = identifiers.identifier.find(obj => obj.type == 'HospitalNumber');       
  return hospitalNumber ? hospitalNumber.value : '';
};
const getPhoneNumber = (identifier) => {     
  const identifiers = identifier;
  const phoneNumber = identifiers.contactPoint.find(obj => obj.type == 'phone');       
  return phoneNumber ? phoneNumber.value : '';
};
const getAddress = (identifier) => {     
  const identifiers = identifier;
  const address = identifiers.address.find(obj => obj.city);      
  return address ? address.city : '';
};

const PostPatientService =(row)=> {
  setpatientObj({...patientObj, ...row});
  setModal(!modal)
}

  
  return (
    <div className={classes.root}>
       <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                
                <Row>
                    
                    <Col md={11}>
                    <Row className={"mt-1"}>
                    <Col md={12} className={classes.root2}>
                        <b style={{fontSize: "25px"}}>
                        {patientObj.firstName + " " + patientObj.surname }
                        </b>
                        
                    </Col>
                    <Col md={4} className={classes.root2}>
                    <span>
                        {" "}
                        Patient ID : <b>{getHospitalNumber(patientObj.identifier) }</b>
                    </span>
                    </Col>

                    <Col md={4} className={classes.root2}>
                    <span>
                        Date Of Birth : <b>{patientObj.dateOfBirth }</b>
                    </span>
                    </Col>
                    <Col md={4} className={classes.root2}>
                    <span>
                        {" "}
                        Age : <b>{calculate_age(moment(patientObj.dateOfBirth).format("DD-MM-YYYY"))}</b>
                    </span>
                    </Col>
                    <Col md={4}>
                    <span>
                        {" "}
                        Gender :{" "}
                        <b>{patientObj.gender.display }</b>
                    </span>
                    </Col>
                    <Col md={4} className={classes.root2}>
                    <span>
                        {" "}
                        Phone Number : <b>{getPhoneNumber(patientObj.contactPoint)}</b>
                    </span>
                    </Col>
                    <Col md={4} className={classes.root2}>
                    <span>
                        {" "}
                        Address : <b>{getAddress(patientObj.address)} </b>
                    </span>
                    </Col>

                    <Col md={12}>
                    {/* {HIVStatus(patientObj)} */}
                    <span>
                        {" "}
                        <b>Status : </b> {CurrentStatus()}
                      </span>
                      
                    </Col>
                    </Row>
                    </Col>
                    <div className="float-end">
                      {" "}<Button secondary floated='right'  onClick={() => PostPatientService(patientObj)}>Post Patient</Button>
                    </div>
                </Row>
            
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                
                    <Button
                      color='red'
                      content='BloodType'
                      //icon='heart'
                      label={{ basic: true, color: 'red', pointing: 'left', content: 'AB+' }}
                    />
                                  
                    <Button
                        basic
                        color='blue'
                        content='Height'
                        icon='fork'
                        label={{
                            as: 'a',
                            basic: true,
                            color: 'blue',
                            pointing: 'left',
                            content: '74.5 in',
                        }}
                      />              
                      <Button
                        basic
                        color='blue'
                        content='Weight'
                        icon='fork'
                        label={{
                            as: 'a',
                            basic: true,
                            color: 'blue',
                            pointing: 'left',
                            content: '74.5 in',
                        }}
                        />
                               
                 
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions expandIcon={<ExpandMoreIcon />}>
                
                </ExpansionPanelActions>
            </ExpansionPanel>
            <PostPatient toggle={toggle} showModal={modal} patientObj={patientObj} />
    </div>
  );
}

PatientCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PatientCard);
