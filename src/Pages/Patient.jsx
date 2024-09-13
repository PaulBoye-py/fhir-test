import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Patient = ({ patient }) => {
  const { id } = useParams(); // Extract id from URL parameters
  const navigate = useNavigate();

  // Check if the patient data is available
  if (!patient || Object.keys(patient).length === 0) {
    return <div>No patient details available.</div>; // Show a message if no patient data is passed
  }

  const goToUpdate = () => {
    navigate(`/patient/${id}/update`);
  };

  return (
    <div className="patient-details">
      <h2 className="text-2xl font-bold">Patient Details</h2>
      <div className="patient-info">
        <p><strong>ID:</strong> {patient.id}</p>
        <p><strong>Name:</strong> {patient.name?.[0]?.given?.join(' ') || 'No Name'} {patient.name?.[0]?.family || ''}</p>
        <p><strong>Gender:</strong> {patient.gender || 'Unknown'}</p>
        <p><strong>Birth Date:</strong> {patient.birthDate || 'Not available'}</p>
        {/* Add more patient fields as needed */}
      </div>

      <button onClick={goToUpdate} className='border border-gray-600 px-2 py-2 rounded-md'>
        Update Details
      </button>
    </div>
  );
};

export default Patient;
