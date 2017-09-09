var fs = require('fs');
var action = process.argv[2];
var value = process.argv[3];

switch (action) {
  case 'my-tweets':
    tweets();
    break;
  case 'spotify-this-song':
    spotify();
    break;
  case 'movie-this':
    movie();
    break;
  case 'do-what-it-says':
    says();
    break;
  default:
    console.log("Sorry but I don't know that")
}

function tweets() {
  var Twitter = require('twitter');
  var keys = require('./keys.js');
  var client = new Twitter(keys.twitterKeys);
  var params = {
    screen_name: 'liri_twit',
    count: 10
  };
  client.get('statuses/user_timeline', params, (err, tweets, response) => {
    if (!err && response.statusCode === 200) {
      console.log('Last 10 Tweets:')
      for (i = 0; i < tweets.length; i++) {
        console.log('=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=');
        console.log('liri_twit: ' + tweets[i].text);
        console.log('Tweeted On: ' + tweets[i].created_at);
        console.log('=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=');
        fs.appendFile(
          'log.txt',
          ('\nliri_twit: ' + tweets[i].text +
            ' | ' + tweets[i].created_at +
            ' \n'), (err) => {
            if (err) {
              return console.log(err);
            }
          })
      }
    };
  })
};

function spotify() {
  var Spotify = require('node-spotify-api');
  var spotify = new Spotify({
    id: 'ea48b89926cb46dea4abc0f5712eb362',
    secret: '9cc83f9b1417415fba0a33868a7819a0'
  });
  if (value == null) {
    value = 'Barbara Streisand';
  }
  spotify.search({ type: 'track', query: value, limit: 5 }, (err, data) => {
    if (err) throw err;
    console.log('=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=');
    console.log('Artist: ' + data.tracks.items[0].artists[0].name);
    console.log('Song Name: ' + data.tracks.items[0].name);
    console.log('Album: ' + data.tracks.items[0].album.name);
    console.log('Spotify Preview Link: ' + data.tracks.items[0].external_urls.spotify);
    console.log('=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=');
    fs.appendFile(
      'log.txt',
      ('\nArtist: ' + data.tracks.items[0].artists[0].name +
        '\nSong: ' + data.tracks.items[0].name +
        '\nPreview Link: ' + data.tracks.items[0].preview_url +
        '\nAlbum: ' + data.tracks.items[0].album.name +
        '\n'), (err) => {
        if (err) {
          return console.log(err);
        }
      })
  })
};
function movie() {
  var request = require('request');
  var movieName = '';
  var queryUrl = 'http://www.omdbapi.com/?t=' + value + '&y=&plot=short&apikey=40e9cece';

  for (var i = 2; i < value.length; i++) {
    if (i > 2 && i < value.length) {
      movieName = movieName + '+' + value[i];
    } else {
      movieName += value[i];
    }
  }
  request(queryUrl, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      console.log('=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=');
      console.log('Title: ' + JSON.parse(body).Title);
      console.log('Year: ' + JSON.parse(body).Year);
      console.log('IMDb Rating: ' + JSON.parse(body).imdbRating);
      console.log('Country: ' + JSON.parse(body).Country);
      console.log('Language: ' + JSON.parse(body).Language);
      console.log('Plot: ' + JSON.parse(body).Plot);
      console.log('Actors: ' + JSON.parse(body).Actors);
      console.log('=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=');
      fs.appendFile(
        'log.txt',
        ('\nTitle: ' + JSON.parse(body).Title +
          '\nYear: ' + JSON.parse(body).Year +
          '\nIMDb Rating: ' + JSON.parse(body).imdbRating +
          '\nCountry: ' + JSON.parse(body).Country +
          '\nLanguage: ' + JSON.parse(body).Language +
          '\nPlot: ' + JSON.parse(body).Plot +
          '\nActors: ' + JSON.parse(body).Actors +
          '\n'), (err) => {
          if (err) {
            return console.log(err);
          }
        })
    }
  })
};

function says() {
  fs.readFile('random.txt', 'utf8', (err, data) => {
    if (err) throw err;
    var dataArr = data.split(',');
    action = dataArr[0];
    value = dataArr[1];
    switch (action) {
      case 'my-tweets':
        tweets();
        break;
      case 'spotify-this-song':
        spotify();
        break;
      case 'movie-this':
        movie();
        break;
      case 'do-what-it-says':
    }
  })
};
