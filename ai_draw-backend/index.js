require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const axios = require('axios');
const config = require('./config');

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname,'/build')));
app.use((err, req, res, next) => { console.log(err); res.status(500).send('Something went wrong'); });

app.get('/', function (req, res, next) {
    res.sendFile(path.resolve('build/index.html'));
});

app.post('/predict', async (req, res) => {
  try {
    const data = {
      version: 'a4a8bafd6089e1716b06057c42b19378250d008b80fe87caa5cd36d40c1eda90',
      input: {
        image: req.body.image,
        clip_model_name: 'ViT-L-14/openai',
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
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 3 seconds before trying again
        getResponse = await axios.get(response.data.urls.get, {
          headers: {
            Authorization: `Token ${config.API_KEY}`,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
    res.send(getResponse.data.output);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})