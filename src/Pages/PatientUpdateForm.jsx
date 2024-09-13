import React, { useState } from 'react';
import patientService from '../patientService.ts';
import { useNavigate } from 'react-router-dom';

const PatientUpdateForm = ({ patient }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        request: {
          method: "PUT", // Add the HTTP verb here
          url: "Patient"  // Specify the resource type and optionally an ID if needed
        },
        resource: {
          resourceType: 'Patient',
          id: patient.id,
          name: [
            {
              given: [patient.name[0].given[0], patient.name[0].given[1]], // To accommodate first and middle names
              family: patient.name[0].family,
            },
          ],
          gender: patient.gender,
          telecom: [
            {
              system: 'phone',
              value: patient.telecom[0].value,
              use: 'mobile',
            },
            {
              system: 'email',
              value: patient.telecom[1].value,
              use: 'work',
            },
          ],
          birthDate: '',
        },
      },
    ]
  });
      

   // Handle change for input fields
   const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      const updatedData = { ...prevData }; // Copy the previous state
      const patientResource = updatedData.entry[0].resource; // Access the Patient resource

      switch (name) {
        case 'firstName':
          patientResource.name[0].given[0] = value; // Update first name
          break;
        case 'middleName':
          patientResource.name[0].given[1] = value; // Update middle name
          break;
        case 'lastName':
          patientResource.name[0].family = value; // Update last name
          break;
        case 'email':
          patientResource.telecom[1].value = value; // Update email
          break;
        case 'phoneNumber':
          // Format phone number to (111)-222-3333
          const formattedPhoneNumber = formatPhoneNumber(value);
          patientResource.telecom[0].value = formattedPhoneNumber; // Update phone number
          break;
        case 'gender':
          patientResource.gender = value; // Update gender
          break;
        case 'dob':
          patientResource.birthDate = value; // Update date of birth
          break;
        default:
          break;
      }

      return updatedData; // Return the updated state
    });
  };
  
  // Phone number formatting function
  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters
    const cleaned = ('' + value).replace(/\D/g, '');
  
    // Format the number into (111)-222-3333
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]})-${match[2]}-${match[3]}`;
    }
  
    // Return the cleaned input if it doesn't match the format
    return cleaned;
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      resourceType: "Bundle",
      type: "transaction",
      entry: [
        {
          resource: {
            resourceType: 'Patient',
            id: '',
            name: [
              {
                given: ['', ''], // To accommodate first and middle names
                family: '',
              },
            ],
            gender: '',
            telecom: [
              {
                system: 'phone',
                value: '',
                use: 'mobile',
              },
              {
                system: 'email',
                value: '',
                use: 'work',
              },
            ],
            birthDate: '',
          },
        },
      ]
    });
  };
  const handlePatientUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedPatient = await patientService.updatePatient(patient.id, formData.entry[0].resource);
      console.log(`${updatedPatient.name[0].given[0]} updated.`);
      resetForm();
      navigate('/', { replace: true });
      window.location.reload();
    } catch (error) {
      console.log(`Error updating patient: ${error}`);
      
    }
  };

 

  return (
    <div>
      <h1>Update Patient</h1>

      <form onSubmit={handlePatientUpdate}>
      <div className='mb-5'>
          <label className='form-label' htmlFor='firstname'>
            First name
          </label>
          <input
            className='form-input focus:shadow-outline'
            type='text'
            name='firstName'
            value={formData.entry[0].resource.name[0].given[0]}
            onChange={handleChange}
            placeholder=''
            id='firstname'
            required
          />
        </div>

        <div className='mb-5'>
          <label className='form-label' htmlFor='middleName'>
            Middle name
          </label>
          <input
            className='form-input focus:shadow-outline'
            type='text'
            name='middleName'
            value={formData.entry[0].resource.name[0].given[1]}
            onChange={handleChange}
            placeholder=''
            id='middleName'
            required
          />
        </div>

        <div className='mb-5'>
          <label className='form-label' htmlFor='lastName'>
            Last name
          </label>
          <input
            className='form-input focus:shadow-outline'
            type='text'
            name='lastName'
            value={formData.entry[0].resource.name[0].family}
            onChange={handleChange}
            placeholder=''
            id='lastName'
            required
          />
        </div>

        <div className='mb-5'>
          <label htmlFor='gender' className='text-base font-xs items-center justify-center'>
            Gender:
          </label>
          <select
            name='gender'
            value={formData.entry[0].resource.gender}
            onChange={handleChange}
            id='gender'
            required
            className='form-select'
          >
            <option value=''>Select Gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='other'>Other</option>
            <option value='unknown'>Unknown</option>
          </select>
        </div>

        <div className='mb-5'>
          <label className='form-label' htmlFor='email'>
            Email address
          </label>
          <input
            type='email'
            name='email'
            value={formData.entry[0].resource.telecom[1].value}
            onChange={handleChange}
            placeholder='abc@yahoo.com'
            autoComplete='username'
            required
            className='form-input focus:shadow-outline'
            id='email'
          />
        </div>

        <div className='mb-5'>
          <label className='form-label' htmlFor='phone-number'>
            Phone number
          </label>
          <input
            type='text'
            name='phoneNumber'
            value={formData.entry[0].resource.telecom[0].value}
            onChange={handleChange}
            placeholder=''
            className='form-input focus:shadow-outline'
            required
            id='phone-number'
          />
        </div>

        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type="submit">
          Apply Changes
        </button>
      </form>
    </div>
  );
};

export default PatientUpdateForm;
