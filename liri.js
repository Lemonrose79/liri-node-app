//required libraries/packages 
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const Spotify = require("node-spotify-api");

// liri uses keys from keys.js
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);

//define variables using process.argv 
let command = process.argv[2]
let searchTerm = process.argv.slice(3).join(" ")

//log.txt bonus - append to file, no re-write
//taken from bank.js activity
fs.appendFile('log.txt', command + ",", function (err) {
    //catch/throw from w3schools
    if (err) throw err;
});

//spotify-this-song
function spotifyThis(song) {
    spotify
        //search and then return the data
        .search({ type: "track", query: song })
        .then(function (response) {
            //error for no song provided - function to follow below
            if (response.tracks.total === 0) {
                spotifyError();
            } else {
                //if a viable song is chosen, the below data appears in command line
                console.log(`
                Artist: ${response.tracks.items[0].artists[0].name}
                Track: ${response.tracks.items[0].name}
                Preview URL: ${response.tracks.items[0].preview_url}
                Album: ${response.tracks.items[0].album.name}
                `);
            }
            //catch for any errors
            //w3schools
        }).catch(function (error) {
            console.log(error);
            console.log("No Results found. Showing results for 'Stupid Girl' by Garbage");
        });
}

//function to be executed for song selected by me in the case of an error
function spotifyError() {
    spotify
        // error song defined below
        .search({ type: 'track', query: '' })
        .then(function (notfoundresponse) {
            for (var i = 0; i < notfoundresponse.tracks.items.length; i++) {
                console.log(`
                    Artist: ${notfoundresponse.tracks.items[i].artists[0].name}
                    Track: ${notfoundresponse.tracks.items[0].name}
                    Preview URL: ${notfoundresponse.tracks.items[i].preview_url}
                    Album: ${notfoundresponse.tracks.items[i].album.name}
                    `);
                i = notfoundresponse.tracks.items.length;
            }
            //error
            //w3schools
        }).catch(function (error) {
            console.log(error);
            console.log("No Results found. ");
        });
}

//movie-this
function movieThis(movie) {
    //axios call to OMDB
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey="+keys.omdb.key).then(
        function (response) {
            //if the movie title is defined, the below data is returned to the user
            if (response.data.Title != undefined) {
                console.log(`
                Title: ${response.data.Title}
                Year: ${response.data.Year}
                IMDB Rating: ${response.data.imdbRating}
                Rotten Tomatoes: ${response.data.tomatoRating}
                Country: ${response.data.Country}
                Language: ${response.data.Language}
                Plot: ${response.data.Plot}
                Actors: ${response.data.Actors}
                `);
            }
            else {
                movieThis("Mr. Nobody"); //from homework README
            }
        }
        //error
        //w3schools
    ).catch(function (error) {
        console.log(error);
        console.log("No Results found.");
    });
}

//do-what-it-says
//will take text in random.text and use it to call appropriate Liri command
//update text in random.txt to test
function doRandom() {
    //reading random.txt
    fs.readFile("random.txt", "utf8", function (error, data) {
        //separate out data
        var dataArr = data.split(",");
        command=dataArr[0];
        searchTerm=dataArr[1];
        RunApp()
        //error
        if (error) {
            return console.log(error);
        }
    });
}

//switch function to account for three code blocks
//code taken from bank.js activity
function RunApp() {
    switch (command) {
        case "spotify-this-song":
            if (!searchTerm){
                spotifyThis("Linger");
                break;
            }else{
                spotifyThis(searchTerm);
                break;
            }
        case "movie-this":
            if (!searchTerm){
                movieThis("Only Lovers Left Alive");
                break;
            }else{
                movieThis(searchTerm);
                break;
            }
        case "do-what-it-says":
            doRandom();
            break;
        default:
            console.log("Command not found")    
    }
}
//run app
RunApp();

