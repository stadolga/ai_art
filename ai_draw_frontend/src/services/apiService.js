import axios from 'axios';
const baseUrl = '/predict'

const predictWithServer = async (picture) => {
  try {
    const response = await axios.post(baseUrl, {
      image: picture,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default (predictWithServer);
