import axios from 'axios';
import io from 'socket.io-client';

const instance = axios.create({
  timeout: 120000, // it is expected that calls don't take more than 120 seconds
  // do something once timeout
});

const local = "http://localhost:8080"

const socket = io(local); // every user has unique socket and it's id is passed to backend to identify user
window.onbeforeunload = function () { // when the user leaves, disconnect socket
  socket.disconnect();
};
socket.on('ping', () => { //keeps connection alive so fly.io doesn't shut it off
  socket.emit('pong');
});

const predictWithServer = async (picture) => {
  try {
    const response = await instance.post(local+`/predict/${socket.id}`, {
      image: picture,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStableDiffusionImage = async (prompt) => {
  try {
    const response = await instance.post(local+`/getImage/${socket.id}`, {
      prompt,
    });

    return response.data[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { predictWithServer, getStableDiffusionImage, socket };
