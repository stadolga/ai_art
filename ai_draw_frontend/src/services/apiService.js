import axios from 'axios';
const baseUrl = 'http://localhost:8080/predict'

const predictWithServer = async (picture) => {
  try {
    const response = await axios.post(baseUrl, {
      image: picture,
    });
    
    if(typeof(response.data) !== "string") throw new Error
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default (predictWithServer);
