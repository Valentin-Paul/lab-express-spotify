require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res, next)=> {
    res.render('home')
})

app.get("/artist-search", (req, res, next)=>{
    let artist = req.query.artist
    spotifyApi.searchArtists(artist)
  .then(function(data) {
      res.render("artist-search-results", {artists: data.body.artists.items})
    console.log('Search artists by "Love"', data.body.artists.items);
  }, function(err) {
    console.error(err);
  });

})

app.get('/albums/:artistId', (req, res, next) => {
    let album = req.params.artistId;
    spotifyApi.getArtistAlbums(album).then(
        function(data) {
            res.render('Artist albums', {albums: data.body.items})
          console.log('Artist albums', data.body.items);
        },
        function(err) {
          console.error(err);
        }
      );
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
