import axios from 'axios';

const predictWithServer = async (picture) => {
  try {
    const response = await axios.post('http://localhost:4000/predict', {
      image: picture,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default (predictWithServer);
