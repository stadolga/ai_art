# AI ART CRITIC #

## you can find the app here: https://aiartcritic.fly.dev/ ##

API used: https://replicate.com/pharmapsychotic/clip-interrogator
The analysis lasts about 2-30 seconds depending on how busy the replicate server is.

AI art critic is a project that queries Open-AI clip interrigator, and returns the analysis of the picture you have drawn to a HTML canvas.
You also have an option to generate stable diffusion images based on your drawn images.

You can locally run the project by going to the backend folder and running npm install and then npm start. In frontend there are no proxies setup so you need to change services baseUrl to access the backend server in development mode.

Frontend is done using React, and it uses Axios for requests. Backend is a node server using express and additional functionality for keeping track of API state has been done using socket.io library.