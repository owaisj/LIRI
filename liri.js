//From Assignment Page
require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Command Argument
var command = process.argv[2];
var userInput = process.argv[3];
console.log('User Input:', userInput);
switch(command) {

    case 'spotify-this-song':
    spotifyThis(userInput);
    break;

    case 'concert-this':
    console.log('concert-this');
    break;

    case 'movie-this':
    console.log('movie-this');
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