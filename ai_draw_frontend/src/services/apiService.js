import axios from 'axios';
const baseUrl = 'http://localhost:8080'

const predictWithServer = async (picture) => {
  try {
    const response = await axios.post(baseUrl+"/predict", {
      image: picture,
    });
    
    if(typeof(response.data) !== "string") throw new Error
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getStableDiffusionImage = async (prompt) => {
  try {
    const response = await axios.post(baseUrl+"/getImage", {
      prompt: prompt,
    });
    if(typeof(response.data[0]) !== "string") throw new Error
    return response.data[0];
  } catch (error) {
    console.error(error);
  }
};


export {predictWithServer, getStableDiffusionImage}
