import axios from 'axios';

const instance = axios.create({
  timeout: 120000, // it is expected that calls don't take more than 120 seconds
  // do something once timeout
});

const predictWithServer = async (picture, setStatus) => {
  try {
    let response = await instance.post("/predict", {
      image: picture,
    });

    while (response.data.completed_at === null) { // fetching until getting the correct json
      //dispatch
      setStatus(response.data.status)
      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 3 seconds before trying again
      response = await instance.post("/getAPIoutcome", {
        content: response.data.urls.get,
      })
    }
    return response.data.output;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStableDiffusionImage = async (prompt, setStatus) => {
  try {

    let response = await instance.post(`/getImage/`, {
      prompt,
    });

    while (response.data.completed_at === null) { // fetching until getting the correct json
      //dispatch
      setStatus(response.data.status)
      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 3 seconds before trying again
      response = await instance.post("/getAPIoutcome", {
        content: response.data.urls.get,
      })
    }
    if(response.data.error !== null){
      throw new Error()
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { predictWithServer, getStableDiffusionImage};
