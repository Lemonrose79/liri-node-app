//required libraries/packages 
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const Spotify = require("node-spotify-api");

// require liri to use keys from keys file
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
