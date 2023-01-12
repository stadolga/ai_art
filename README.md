# AI ART CRITIC #

you can find the app here: https://aiartcritic.fly.dev/

AI art critic is a project that queries Open-AI clip interrigator, and returns the analysis of the picture.

API used: https://replicate.com/pharmapsychotic/clip-interrogator
The analysis lasts about 2-30 seconds depending on how busy the replicate server is.

You can locally run the project by going to the backend folder and running npm install and then npm start.
Frontend uses Axios for requests, and backend is a node server using express.