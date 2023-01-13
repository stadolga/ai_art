require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const axios = require('axios');
const config = require('./config');

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')));
app.use((err, req, res, next) => { console.log(err); res.status(500).send('Something went wrong'); });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/predict', async (req, res) => {
  try {
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
      console.log(getResponse.data)
        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 3 seconds before trying again
        getResponse = await axios.get(response.data.urls.get, {
          headers: {
            Authorization: `Token ${config.API_KEY}`,
          },
        });
    }
    console.log(getResponse)
    res.send(getResponse.data.output);
  } catch (error) {
    console.error(error);
    res.send(error)
  }
});

app.post('/getImage', async (req, res) => {
  try {
    const data = {
      version: 'f178fa7a1ae43a9a9af01b833b9d2ecf97b1bcb0acfd2dc5dd04895e042863f1',
      input: {
        prompt: req.body.prompt ,
        negative_prompt: "an airplane flying through the night sky with the moon in the background",
        width: 512,
        height: 512,
        num_inference_steps: 20,
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
        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 3 seconds before trying again
        getResponse = await axios.get(response.data.urls.get, {
          headers: {
            Authorization: `Token ${config.API_KEY}`,
          },
        });
    }

    res.send(getResponse.data.output);
  } catch (error) {
    console.error(error);
    res.send(error)
  }
});


const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})