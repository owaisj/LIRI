require('dotenv').config();
var keys = require('./keys.js');
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require('fs');

var userCommand = process.argv[2];
var userInput = process.argv[3];

function switchCase(command, input) {
    switch(command) {

        case 'spotify-this-song':
        spotifyThis(input);
        break;
    
        case 'concert-this':
        isPlaying(input);
        break;
    
        case 'movie-this':
        movieThis(input);
        break;
    
        case 'do-what-it-says':
        doWhat();
        break;
    
        default: console.log('Please enter a command');
    }
}

function spotifyThis(song) {
    if (song === undefined || song === '') song = 'The Sign Ace of Base';
    spotify.search({
        type: 'track',
        query: song,
        limit: 1
    }).then(function(response){
        var information = response.tracks.items[0];
        var output ='Spotify This Song\n';
        output += '==============================================\n';
        output += `Title: ${information.name}\nArtist: ${information.artists[0].name}\nAlbum: ${information.album.name}\nLink: ${information.external_urls.spotify}\n`;
        output += '==============================================';
        console.log(output);
        log(output);
    })
    .catch(function(error){
        console.log(error)
    });
}

function movieThis(film) {
    if (film === undefined || film === '') film = 'Catch Me If You Can';
    var queryUrl = `http://www.omdbapi.com/?t=${film}&y=&plot=short&apikey=trilogy`;
    axios.get(queryUrl).then(function(response) {
        var movieInfo = response.data;
        var output = 'Movie This Film\n';
        output += '==============================================\n';
        output += `Title: ${movieInfo.Title}\nReleased: ${movieInfo.Year}\nIMDB Rating: ${movieInfo.imdbRating}\n`;
        output += `Rotten Tomatoes: ${movieInfo.Ratings[1].Value}\nCountry: ${movieInfo.Country}\nLanguage(s): ${movieInfo.Language}\n`;
        output += `Plot: ${movieInfo.Plot}\nActors: ${movieInfo.Actors}\nWritten By: ${movieInfo.Writer}\nDirected By: ${movieInfo.Director}\n`;
        output += '==============================================';
        console.log(output);
        log(output);
    }).catch(function(error){
        console.log(error);
    });
}

function isPlaying(band) {
    if(band === undefined || band === '') band = 'PUP';
    var queryUrl = `https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`;
    axios.get(queryUrl).then(function(response){
        var output = 'Concert This Artist\n';
        output += '==============================================\n';
        
        var numShows = Object.keys(response.data).length;

        var end = 1; //Where to stop slicing of Object.keys
        if (numShows === 0) { //Radiohead (Not on tour)
            output += `${band} is not on tour.\n`;
            output += '==============================================';
            log(output);
            return console.log(output);
        } else if (numShows > 9) {
            end = 10; //More than 10 shows (PUP, The Menzingers)
        } else {
            end = numShows + 1; //Less than 10 shows (Tycho)
        }

        output += `Concert information about ${band}\n`;
        var showSnippet = Object.keys(response.data).slice(0, end).reduce((function(result, key){
                result[key] = response.data[key];
                return result;
            }), 
        {});
        Object.keys(showSnippet).forEach(function(id){
            var currentShow = showSnippet[id];
            var currentDateTime = currentShow.datetime.split('T');
            var currentDate = moment(currentDateTime[0],'YYYY-MM-DD').format('MM/DD/YYYY');
            var currentTime = moment(currentDateTime[1],'HH:mm:ss').format('hh:mma');

            output += `=== Show ${Number(id) + 1} ====================\n`;
            output += `Venue: ${currentShow.venue.name}\n`;
            if (currentShow.venue.region !== '') {
                output += `Location: ${currentShow.venue.city}, ${currentShow.venue.region}, ${currentShow.venue.country}\n`;
            } else {
                output += `Location: ${currentShow.venue.city}, ${currentShow.venue.country}\n`;
            }
            output += `Event Date: ${currentDate} at ${currentTime}\n`;
        })
        output += '==============================================';
        console.log(output);
        log(output);

    }).catch(function(error){
        console.log(error);
    });
}

function doWhat() {
    fs.readFile('random.txt','utf8', function(error, data){
        if (error) return console.log(error);
        var commandArray = data.split('\n');
        var index = Math.floor(Math.random()*commandArray.length);
        var separate = commandArray[index].indexOf('"');
        var rCommand = commandArray[index].slice(0, separate-1);
        var rInput = commandArray[index].slice(separate, commandArray[index].length);

        var output = `Liri will perform ${rCommand} on ${rInput}\n`;
        output += '------------------------------------------------';
        console.log(output);
        log(output);
        switchCase(rCommand, rInput);

    })
}

function log(data) {
    fs.appendFile('log.txt',`${data}\n`, function(error){
        if (error) return console.log(error);
        console.log('[Output added to log.txt]');
    })
}

switchCase(userCommand, userInput);