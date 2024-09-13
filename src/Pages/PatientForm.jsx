import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import patientService from '../patientService.ts';

const PatientForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        request: {
          method: "POST", // Add the HTTP verb here
          url: "Patient"  // Specify the resource type and optionally an ID if needed
        },
        resource: {
          resourceType: 'Patient',
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

  // Handle change for input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedResource = { ...prevData.entry[0].resource };

      switch (name) {
        case 'firstName':
          updatedResource.name[0].given[0] = value;
          break;
        case 'middleName':
          updatedResource.name[0].given[1] = value;
          break;
        case 'lastName':
          updatedResource.name[0].family = value;
          break;
        case 'email':
          updatedResource.telecom[1].value = value;
          break;
        case 'phoneNumber':
          updatedResource.telecom[0].value = formatPhoneNumber(value);
          break;
        case 'gender':
          updatedResource.gender = value;
          break;
        case 'dob':
          updatedResource.birthDate = value;
          break;
        default:
          break;
      }

      return {
        ...prevData,
        entry: [{ ...prevData.entry[0], resource: updatedResource }]
      };
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
          request: {
            method: "POST", // Ensure the HTTP verb is set on reset too
            url: "Patient"
          },
          resource: {
            resourceType: 'Patient',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the entire formData object to maintain the correct structure
      const newPatient = await patientService.createNew(formData.entry[0].resource);

      if (newPatient) {
        console.log(`New patient successfully created`);
        resetForm();
        navigate('/', { replace: true });
        window.location.reload();
      }
    } catch (error) {
      console.log(`Error creating patient`, error);
    }
  };

  const dateToday = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h1>Add a new patient</h1>

      <form onSubmit={handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        {/* First Name */}
        <div className='mb-5'>
          <label className='form-label' htmlFor='firstname'>First name</label>
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

        {/* Middle Name */}
        <div className='mb-5'>
          <label className='form-label' htmlFor='middleName'>Middle name</label>
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

        {/* Last Name */}
        <div className='mb-5'>
          <label className='form-label' htmlFor='lastName'>Last name</label>
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

        {/* Gender */}
        <div className='mb-5'>
          <label htmlFor='gender' className='text-base font-xs items-center justify-center'>Gender:</label>
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

        {/* Email */}
        <div className='mb-5'>
          <label className='form-label' htmlFor='email'>Email address</label>
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

        {/* Phone Number */}
        <div className='mb-5'>
          <label className='form-label' htmlFor='phone-number'>Phone number</label>
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

        {/* Date of Birth */}
        <div className='mb-5'>
          <label className='form-label' htmlFor='dob'>Date of Birth</label>
          <input
            type='date'
            max={dateToday}
            name='dob'
            value={formData.entry[0].resource.birthDate}
            onChange={handleChange}
            placeholder=''
            className='form-input focus:shadow-outline'
            required
            id='dob'
          />
        </div>

        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default PatientForm;
