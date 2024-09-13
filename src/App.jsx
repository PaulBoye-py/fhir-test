import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import patientService from './patientService.ts';
import Patients from './Pages/Patients';
import PatientForm from './Pages/PatientForm';
import Patient from './Pages/Patient';
import PatientUpdateForm from './Pages/PatientUpdateForm';

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null); // State for selected patient
  const [currentPage, setCurrentPage] = useState(0); // State for current page of patients
  const [loading, setLoading] = useState(true);
  const [nameSearch, setNameSearch] = useState('');

  const getPatients = async () => {
    setLoading(true);
    try {
      const response = await patientService.getAll(currentPage, nameSearch);
      
      // Iterate over the 'entry' array to get all resources
      const patientResources = response?.entry.map((entry) => entry.resource);
      
      setPatients(patientResources);
      console.log('patients',patientResources); // Optional: for debugging purposes
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error; // Optional: depending on how you want to handle errors
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    getPatients();
    
  }, [currentPage, nameSearch]); // Add currentPage as a dependency to refetch patients when it changes

  const formatSurname = (patient) => {
    const surname = patient.name?.[0]?.family || 'No Name';
    return surname.toUpperCase();
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient); // Set the selected patient when clicked
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Patients
              patients={patients}
              formatSurname={formatSurname}
              getPatient={handlePatientClick}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              loading={loading}
              setLoading={setLoading}
              nameSearch={nameSearch}
              setNameSearch={setNameSearch}

            />
          }
        />
        <Route path="/new-patient" element={<PatientForm />} />
        <Route
          path="/patient/:id"
          element={<Patient patient={selectedPatient} />} // Pass the selected patient as a prop
        />
        <Route path="/patient/:id/update" element={<PatientUpdateForm patient={selectedPatient} />} />
      </Routes>
    </Router>
  );
}

export default App;
