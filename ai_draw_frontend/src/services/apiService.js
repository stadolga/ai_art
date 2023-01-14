import axios from 'axios';
import io from 'socket.io-client'


var instance = axios.create({
  timeout: 200000, //it is expected that calls don't take more than 200 seconds
});

export const socket = io("")


const predictWithServer = async (picture) => {
  try {

    const response = await instance.post("/predict", {
      image: picture,
    });
    
    if(typeof(response.data) !== "string") throw new Error //if doesn't return the text, this is a lazy way to handle backend problems in frontend
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getStableDiffusionImage = async (prompt) => {
  try {
    const response = await instance.post("/getImage", {
      prompt: prompt,
    });
    socket.on('getImage', (data) => {
      console.log(data);
      // update the state or display the data
    });

    if(typeof(response.data[0]) !== "string") throw new Error //if doesn't return a link
    return response.data[0];
  } catch (error) {
    console.error(error);
  }
};


export {predictWithServer, getStableDiffusionImage}
