import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import patientService from '../patientService.ts';
import Filter from '../components/Filter';
import debounce from 'lodash.debounce';

const Patients = ({ patients, formatSurname, getPatient, currentPage, setCurrentPage, loading, nameSearch, setNameSearch }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(nameSearch);

  // Debounced function to handle search input
  const debouncedSearch = useMemo(
    () => debounce((value) => {
      setNameSearch(value);
      setCurrentPage(0);
    }, 300), [setNameSearch, setCurrentPage]
  );

  const handleNameSearch = (e) => {
    setInputValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Cleanup debounce on component unmount
    };
  }, [debouncedSearch]);

  const getSelectedPatient = async (id) => {
    const selectedPatient = patients.find((patient) => patient.id === id);
    if (!selectedPatient) {
      console.log(`Patient with ID ${id} not found`);
      return;
    }

    getPatient(selectedPatient); // Assuming this sets state or triggers a side effect

    try {
      const patientToGet = await patientService.getPatient(selectedPatient.id);
      console.log(patientToGet);
      navigate(`/patient/${selectedPatient.id}`);
    } catch (error) {
      console.error(`Error getting patient with ID ${selectedPatient.id}:`, error); // Enhanced error log
    }
  };

  // Search filter logic for patient names
  const searchFilter = patients.filter((patient) => {
    const givenNames = patient.name?.[0]?.given || [];
    const familyName = patient.name?.[0]?.family || '';
    const phoneNumber = patient.telecom?.[0]?.value ;
    const fullName = [...givenNames, familyName].join(' ').toLowerCase();
    const searchArray = [fullName, phoneNumber]
    return searchArray
    // return fullName.includes(nameSearch.toLowerCase()) ;
  });

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className='max-w-md mx-auto'>
      <div className="font-bold text-red-600 text-2xl">Patients on the server</div>

      <div>
        <a href='/new-patient' className='px-2 py-2 bg-gray-500 text-white rounded-md'>Create a new patient</a>
      </div>

      <Filter nameSearch={inputValue} handleNameSearch={handleNameSearch} />

      {loading && <div>Loading...</div>}

      {!loading && searchFilter.length > 0 ? (
        <ul>
          {searchFilter.map((patient, index) => (
            <p className='hover:bg-gray-200 cursor-pointer' key={index} onClick={() => getSelectedPatient(patient.id)}>
              <button className="flex gap-2">
                <li className="font-bold">{formatSurname(patient)}</li>
                <li>{patient.name?.[0]?.given?.join(' ') || 'No Name'}</li>
              </button>
            </p>
          ))}
        </ul>
      ) : (
        <div>No patients found.</div>
      )}

      <div className='mx-2 my-4 flex flex-row gap-4'>
        <button
          className={`${currentPage === 0 ? 'bg-gray-400' : 'bg-black'} px-2 py-2 text-white rounded-md`}
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <button
          className='px-2 py-2 bg-black text-white rounded-md'
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Patients;
