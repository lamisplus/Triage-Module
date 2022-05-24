import * as React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import PatientList from "./main/webapp/components/PatientList";
import PatientDashboard from "./main/webapp/components/PatientDashboard";
import AddPatientVitals from "./main/webapp/components/Add-Patient-Vitals";

function App() {
  return (
      <React.Fragment>
          <CssBaseline />
          <Container maxWidth="false">
              <Router>
                  <Routes>
                      <Route path="/" element={<PatientList />} />
                      <Route path="/patient-dashboard" element={<PatientDashboard />} />
                      <Route path="/add-patient-vital" element={<AddPatientVitals />} />
                  </Routes>
              </Router>
          </Container>
      </React.Fragment>
  );
}

export default App;
