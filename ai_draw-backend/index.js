require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const http = require('http');

const server = http.createServer(app);
const axios = require('axios');
const io = require('socket.io')(server, {
  cors: { origin: 'http://localhost:3000' },
});

const config = require('./config');

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

io.on('connection', (socket) => {
  socket.on('pong', () => {
    // keeps the connection from being idle, don't want to flood the logs by console.log()
  });
  console.log(`${socket.id} connected`);
  console.log(`number of clients: ${io.engine.clientsCount}`);
});

io.on('disconnection', (client) => {
  console.log(`${client.id} disconnected`);
  console.log(`number of clients: ${io.engine.clientsCount}`);
});

let ping; // interval

app.post('/predict/:socketId', async (req, res) => {
  try {
    ping = setInterval(() => { // keeping the connection alive by pinging, fly shuts connection after 60s of idle
      io.to(req.params.socketId).emit('ping');
    }, 10000);

    const data = {
      version: 'a4a8bafd6089e1716b06057c42b19378250d008b80fe87caa5cd36d40c1eda90',
      input: {
        image: req.body.image,
        mode: 'fast',
      },
    };
    const response = await axios.post('https://api.replicate.com/v1/predictions', data, {
      headers: {
        Authorization: `Token ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    let getResponse = await axios.get(response.data.urls.get, {
      headers: {
        Authorization: `Token ${config.API_KEY}`,
      },
    });

    while (getResponse.data.completed_at === null) { // fetching until getting the correct json
      io.to(req.params.socketId).emit('status', getResponse.data); // send data back to frontend
      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 3 seconds before trying again
      getResponse = await axios.get(getResponse.data.urls.get, {
        headers: {
          Authorization: `Token ${config.API_KEY}`,
        },
      });
    }

    if (getResponse.data.status === 'failed') {
      io.to(req.params.socketId).emit('error', getResponse.data);
    }
    res.send(getResponse.data.output);
  } catch (error) {
    console.error(error);
    throw (error);
  } finally {
    clearInterval(ping);
  }
});

app.post('/getImage/:socketId', async (req, res) => {
  try {
    ping = setInterval(() => { // keeping the connection alive
      io.to(req.params.socketId).emit('ping');
    }, 10000);

    const data = {
      version: 'f178fa7a1ae43a9a9af01b833b9d2ecf97b1bcb0acfd2dc5dd04895e042863f1',
      input: {
        prompt: req.body.prompt,
        width: 512,
        height: 512,
        num_inference_steps: 40,
      },
    };
    const response = await axios.post('https://api.replicate.com/v1/predictions', data, {
      headers: {
        Authorization: `Token ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    let getResponse = await axios.get(response.data.urls.get, {
      headers: {
        Authorization: `Token ${config.API_KEY}`,
      },
    });

    while (getResponse.data.completed_at === null) {
      io.to(req.params.socketId).emit('status', getResponse.data);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      getResponse = await axios.get(getResponse.data.urls.get, {
        headers: {
          Authorization: `Token ${config.API_KEY}`,
        },
      });
    }

    if (getResponse.data.status === 'failed') {
      console.log(getResponse.data);
      io.to(req.params.socketId).emit('error', getResponse.data);
    }
    res.send(getResponse.data.output);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    clearInterval(ping);
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
