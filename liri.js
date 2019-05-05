//From Assignment Page
require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Command Argument
var command = process.argv[2];
switch(command) {

    case 'spotify-this-song':
    console.log('spotify-this-song');
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