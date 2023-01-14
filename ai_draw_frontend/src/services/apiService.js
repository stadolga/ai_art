import axios from 'axios';
var instance = axios.create({
  timeout: 200000, //it is expected that calls don't take more than 200 seconds
});

const baseUrl = "http://localhost:8080"

const predictWithServer = async (picture) => {
  try {
    const response = await instance.post(baseUrl+"/predict", {
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
    const response = await instance.post(baseUrl+"/getImage", {
      prompt: prompt,
    });
    if(typeof(response.data[0]) !== "string") throw new Error //if doesn't return a link
    return response.data[0];
  } catch (error) {
    console.error(error);
  }
};


export {predictWithServer, getStableDiffusionImage}
