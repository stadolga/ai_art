import axios from 'axios';

const predictWithServer = async (picture) => {
  try {
    const response = await axios.post("/predict", {
      image: picture,
    });
    
    if(typeof(response.data) !== "string") throw new Error //if doesn't return the text
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getStableDiffusionImage = async (prompt) => {
  try {
    const response = await axios.post("/getImage", {
      prompt: prompt,
    });
    if(typeof(response.data[0]) !== "string") throw new Error //if doesn't return a link
    return response.data[0];
  } catch (error) {
    console.error(error);
  }
};


export {predictWithServer, getStableDiffusionImage}
