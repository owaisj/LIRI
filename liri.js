//From Assignment Page
require('dotenv').config();
var keys = require('./keys.js');
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var userInput = process.argv[3];
switch(command) {

    case 'spotify-this-song':
    spotifyThis(userInput);
    break;

    case 'concert-this':
    isPlaying(userInput);
    break;

    case 'movie-this':
    movieThis(userInput);
    break;

    case 'do-what-it-says':
    console.log('do-what-it-says');
    break;

    default: console.log('Please enter a command');
}

//Spotify-This-Song
function spotifyThis(song) {
    if (song === undefined) song = 'The Sign Ace of Base';
    spotify.search({
        type: 'track',
        query: song,
        limit: 1
    }).then(function(response){
        var information = response.tracks.items[0];
        //console.log('Response', information);
        console.log('\nTitle:',information.name);
        console.log('Artist:',information.artists[0].name);
        console.log('Album:',information.album.name)
        console.log('Link:', information.external_urls.spotify);
    })
    .catch(function(error){
        console.log(error)
    });
}

//Movie-This-Film
function movieThis(film) {
    if (film === undefined) film = 'Looper';
    var queryUrl = `http://www.omdbapi.com/?t=${film}&y=&plot=short&apikey=trilogy`;
    axios.get(queryUrl).then(function(response) {
        var movieInfo = response.data;
        console.log('Title:',movieInfo.Title);
        console.log('Released:',movieInfo.Year);
        console.log('IMDB Rating:', movieInfo.imdbRating);
        console.log('Rotten Tomatoes:',movieInfo.Ratings[1].Value)
        console.log('Country:',movieInfo.Country);
        console.log('Language(s):', movieInfo.Language);
        console.log('Plot:', movieInfo.Plot);
        console.log('Actors:', movieInfo.Actors);
        console.log('Written by:', movieInfo.Writer);
        console.log('Directed by:', movieInfo.Director);
    }).catch(function(error){
        console.log(error);
    });
}

//Concert-This-Band
function isPlaying(band) {
    if(band === undefined) band = 'PUP';
    var queryUrl = `https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`;
    axios.get(queryUrl).then(function(response){
        //Take first 10 entries: https://stackoverflow.com/questions/39336556/how-can-i-slice-an-object-in-javascript
        var tenShows = Object.keys(response.data).slice(0, 10).reduce((function(result, key){
                result[key] = response.data[key];
                return result;
            }), {});

        Object.keys(tenShows).forEach(function(id){
            var currentShow = tenShows[id];
            console.log('Venue:',currentShow.venue.name)
        })

    }).catch(function(error){
        console.log(error);
    });
}