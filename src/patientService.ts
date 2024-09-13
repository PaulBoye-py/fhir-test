import axios from 'axios';

// Define base URLs for different environments
// const prodUrl = 'https://hapi.fhir.org/baseR4/Patient';
// const devUrl = 'http://localhost:3001/Patient';

// Use the appropriate URL based on the environment (you can customize this logic)
// const baseUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl;

// const baseUrl = 'https://hapi.fhir.org/baseR4/Patient';

const baseUrl = 'http://localhost:8080/fhir/Patient'

const fhirApi = axios.create({ baseURL: baseUrl, headers: {
    'Cache-Control' : 'no-cache',
} });

var searchTerm = ''

const isPhoneNumber = (searchTerm: string) => {
  if (parseInt(searchTerm)) {
    return true
  }
  return false
}

const getAll = async (page : number, searchTerm : string | undefined) => {
  let searchParams: {
    phone? : string | undefined,
    name? : string | undefined,
  } = {};

  if (searchTerm) {
    if (isPhoneNumber(searchTerm)) {
      searchParams.phone = searchTerm;
    } else {
      searchParams.name = searchTerm;
    }
  }

  try {
    const response = await fhirApi.get('', { // Correct endpoint structure
      params: {
        _sort: '-_lastUpdated',
        _count: 15,
        _offset: page * 15, // Pagination logic - can also use skip
        // name: searchTerm ? searchTerm : undefined,
        ...searchParams,
      }
    });

    // Check if response is in JSON format
    if (response.headers['content-type'] && response.headers['content-type'].includes('application/fhir+json')) {
      console.log(response.data);
      return response.data;
    } else {
      console.error('Unexpected response format:', response.data);
    }
  } catch (error) {
    console.error('Error fetching patients:', error.message);
  }
};

const getPatient = async (id : any) => {
  try {
    const response = await fhirApi.get(`/${id}`);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error(`Error fetching patient: ${error.message}`); // Log the error with a message
  }
};

const updatePatient = async (id: any, updatedPatient: object) => {
  try {
    const response = await fhirApi.put(`/${id}`, updatedPatient);
    return response.data; // Return the updated patient data
  } catch (error) {
    console.error(`Error updating patient: ${error.message}`);
  }
};

const createNew = async (patientData: object) => {
  try {
    const response = await fhirApi.post('', patientData); // Correct endpoint structure for POST
    return response.data; // Return the created patient data
  } catch (error) {
    console.error('Error creating patient:', error.message);
  }
};

// Correct export statement
const patientService = {
    getAll,
    getPatient,
    updatePatient,
    createNew,
  };
  
  export default patientService;
