const { query } = require('express')
const express = require('express')
const app = express()
const hostname = '0.0.0.0'
const port =3002
const querystring = require('querystring')
const fetch = require('node-fetch')

app.use(express.static('public'))

global.access_token;
const client_id = 'df40d135664a4a2cbae1c4db4de04977';
const redirect_uri = 'http://localhost:3002/callback';
const client_secret = '5419800129b84a63920a4d20d12fbb6e'
const scope = 'user-read-private user-read-email ugc-image-upload user-top-read user-library-read user-library-modify user-read-recently-played playlist-modify-private playlist-read-collaborative user-read-playback-state playlist-read-private' 

app.listen(process.env.PORT||port, hostname, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/', function(req, res) {
  res.sendFile(__dirname,'/views/index.html')
});

app.get('/login',  async function(req, res) {

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: 'a'
    }));
});

app.get('/callback', async function(req, res) {
    
  var code = await req.query.code || null;
  
  var body = new URLSearchParams({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  });

  const data = await response.json();
  global.access_token = data.access_token
  res.redirect('/check')
  // res.redirect('/user')

});


async function getData(endpoint) {
  const response = await fetch("https://api.spotify.com/v1" + endpoint, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer "+ global.access_token,
      "Content-Type": "application/json"
    } 
  });

  const data = await response;
  return data.json();
}

async function getInfoArt(data){
  dataList = []
  for(const a in data.items){
    dataList.push({name: data.items[a].name, pic: data.items[a].images[0].url})
  }
  return dataList
}

async function getInfoSong(data){
  dataList = []
  for(const a in data.items){
    dataList.push({name: data.items[a].name, pic: data.items[a].album.images[0].url})
  }
  return dataList
}

app.get('/check',async function(req,res){  
  try{
    const data = await getData('/me');
    res.redirect('/stats.html')
  }
  catch(error){
    res.redirect('/error.html')
  }
  
})


app.get('/user',async function(req,res){  
    try{
      const data = await getData('/me');
      res.json({name: data.display_name, pic: data.images[0].url, followers: data.followers.total})
    }
    catch{
      res.send()
    }

})

app.get('/TopArtShort',async function(req,res){
  
  const TopArtShort = await getData('/me/top/artists?time_range=short_term&limit=5&offset=0');
  res.json(await getInfoArt(TopArtShort))

})

app.get('/TopArtMed',async function(req,res){
  
  const TopArtMed = await getData('/me/top/artists?time_range=medium_term&limit=5&offset=0');
  res.json(await getInfoArt(TopArtMed))

})


app.get('/TopArtLong',async function(req,res){
  
  const TopArtLong = await getData('/me/top/artists?time_range=long_term&limit=5&offset=0');
  res.json(await getInfoArt(TopArtLong))

})


app.get('/TopSongShort',async function(req,res){
  
  const TopSongShort = await getData('/me/top/tracks?time_range=short_term&limit=5&offset=0');
  res.json(await getInfoSong(TopSongShort))

})



app.get('/TopSongMed',async function(req,res){
  
  const TopSongMed = await getData('/me/top/tracks?time_range=medium_term&limit=5&offset=0');
  res.json(await getInfoSong(TopSongMed))

})

app.get('/TopSongLong',async function(req,res){
  
  const TopSongLong = await getData('/me/top/tracks?time_range=long_term&limit=5&offset=0');
  res.json(await getInfoSong(TopSongLong))

})

app.get('/his',async function(req,res){
  
  const his = await getData('/me/player/recently-played/?limit=15');
  
  dataList=[]
  for(const a in his.items){
    await dataList.push({name: his.items[a].track.name, pic: his.items[a].track.album.images[0].url})
  }

  res.json(await dataList)

})


// app.get('/id', function(req,res){
//   res.json('fdsfs')
// })



