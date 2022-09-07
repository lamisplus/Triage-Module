import React, {useState, Fragment } from "react";

import { Row, Col, Card,  Tab, Tabs, } from "react-bootstrap";
import CheckedInPatientList from './CheckedInPatients/CheckedInPatientsList'

const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const Home = () => {
    const [key, setKey] = useState('home');


  return (
    <Fragment>
     
      <Row>
       
        <Col xl={12}>
          <Card style={divStyle}>
            
            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                    >
                   
                    <Tab eventKey="home" title="Checked-In">
                      <CheckedInPatientList />
                    </Tab>
{/*                    <Tab eventKey="find-patient" title="Find Patient">
                        <CheckedInPatientList />
                    </Tab>*/}
                    
                    </Tabs>


              </div>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </Fragment>
  );
};

export default Home;
