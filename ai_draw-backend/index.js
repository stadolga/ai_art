require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const http = require('http');

const server = http.createServer(app);
const axios = require('axios');

const config = require('./config');

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.post('/getAPIoutcome', async(req, res) => { //gets the request
  const url = req.body.content;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Token ${config.API_KEY}`,
    },
  });
  res.send(response.data);
});

app.post('/predict/', async (req, res) => { //sends the requests and gets the url that the response is at once loaded
  try {
    const data = {
      version: 'a4a8bafd6089e1716b06057c42b19378250d008b80fe87caa5cd36d40c1eda90',
      input: {
        image: req.body.image,
        mode: 'fast',
      },
    };
    const getResponse = await axios.post('https://api.replicate.com/v1/predictions', data, {
      headers: {
        Authorization: `Token ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    res.send(getResponse.data);
  } catch (error) {
    console.error(error);
    throw (error);
  }
});

app.post('/getImage/', async (req, res) => {
  try {
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

    const getResponse = await axios.get(response.data.urls.get, {
      headers: {
        Authorization: `Token ${config.API_KEY}`,
      },
    });

    res.send(getResponse.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
