//From Assignment Page
require('dotenv').config();
var keys = require('./keys.js');
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require('fs');

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
    doWhat();
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
            }), 
        {});
        console.log('You want information about',band,'\n');
        Object.keys(tenShows).forEach(function(id){
            var currentShow = tenShows[id];
            var currentDateTime = currentShow.datetime.split('T');
            var currentDate = moment(currentDateTime[0],'YYYY-MM-DD').format('MM/DD/YYYY');
            var currentTime = moment(currentDateTime[1],'HH:mm:ss').format('hh:mma');
            console.log('Venue:',currentShow.venue.name);
            if (currentShow.venue.region !== '') {
                console.log('Location:',`${currentShow.venue.city}, ${currentShow.venue.region}`,currentShow.venue.country);
            } else {
                console.log('Location:', currentShow.venue.city, currentShow.venue.country);
            }
            
            console.log('Event Date:',currentDate,'at',currentTime,'\n');
        })

    }).catch(function(error){
        console.log(error);
    });
}

//Do-What-It-Says
function doWhat() {
    fs.readFile('random.txt','utf8', function(error, data){
        if (error) return console.log(error);
        var commandArray = data.split(',');
        var maxIndex = commandArray.length - 1;
        var index = Math.floor(Math.random()*maxIndex);
        var separate = commandArray[index].indexOf('"');
        var rCommand = commandArray[index].slice(0, separate-1);
        var rInput = commandArray[index].slice(separate, commandArray[index].length);
        console.log('Command',rCommand);
        console.log('Input',rInput);
        switch(rCommand) {

            case 'spotify-this-song':
            spotifyThis(rInput);
            break;
        
            case 'concert-this':
            isPlaying(rInput);
            break;
        
            case 'movie-this':
            movieThis(rInput);
            break;
        
            case 'do-what-it-says':
            doWhat();
            break;
        
            default: console.log('Please enter a command');
        }
    })
}

//Log
function log() {
    console.log('log');
}