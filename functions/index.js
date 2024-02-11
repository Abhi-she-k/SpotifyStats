const { query } = require('express')
const express = require('express')
const app = express()
const port =3002
const querystring = require('querystring')
const fetch = require('node-fetch')

app.use(express.static('public'))

global.access_token;
const client_id = 'df40d135664a4a2cbae1c4db4de04977';
const local_host = 'http://localhost:3002'
const redirect_uri = local_host+'/callback';
const client_secret = '5419800129b84a63920a4d20d12fbb6e'
const scope = 'user-read-private user-read-email ugc-image-upload user-top-read user-library-read user-library-modify user-read-recently-played playlist-modify-private playlist-read-collaborative user-read-playback-state playlist-read-private' 

app.listen(process.env.PORT ||3002,() => {
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

function getListItems(data){

    let items = ""
    let count = 0;

    for(const a in data){
      if(count == 2){
        return items
      }
      items+=data[a]+ "\n"
      count+=1
    }
    return items
}

async function getInfoArt(data){
  dataList = []
  for(const a in data.items){
    dataList.push({name: data.items[a].name, pic: data.items[a].images[1].url, url: data.items[a].uri, popularity: data.items[a].popularity, genres: getListItems(data.items[a].genres)})
  }
  return dataList
}

async function getInfoSong(data){
  dataList = []
  for(const a in data.items){
    let dur = data.items[a].duration_ms
    const date =  new Date(1000*Math.round(dur/1000));
    function pad(i) { return ('0'+i).slice(-2); }
    var minutes = pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds());
    dataList.push({name: data.items[a].name, pic: data.items[a].album.images[1].url, url: data.items[a].uri, date: data.items[a].album.release_date, duration: minutes})
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
    
    const data = await getData('/me');

    
    try{
      res.json({name: data.display_name, pic: data.images[1].url, followers: data.followers.total})
      
    }
    catch{
      res.json({name: data.display_name, followers: data.followers.total})
    }
})

app.get('/TopArt/:length',async function(req,res){
  const length = req.params.length;
  const TopArtShort = await getData(`/me/top/artists?time_range=${length}_term&limit=5&offset=0`);
  res.json(await getInfoArt(TopArtShort))

})


app.get('/TopSong/:length',async function(req,res){
  const length = req.params.length;
  const TopSongShort = await getData(`/me/top/tracks?time_range=${length}_term&limit=5&offset=0`);
  res.json(await getInfoSong(TopSongShort))

})


app.get('/his',async function(req,res){
  
  const his = await getData('/me/player/recently-played/?limit=25');
  
  dataList=[]
  for(const a in his.items){
    let dur = his.items[a].track.duration_ms
    const date2 =  new Date(1000*Math.round(dur/1000));
    function pad(i) { return ('0'+i).slice(-2); }
    var minutes = pad(date2.getUTCMinutes()) + ':' + pad(date2.getUTCSeconds());
    await dataList.push({name: his.items[a].track.name, pic: his.items[a].track.album.images[0].url, url: his.items[a].track.uri, date: his.items[a].track.album.release_date, duration: minutes})
  }
  res.json(await dataList)

})

// app.get('/his',async function(req,res){
  
//   const his = await getData('/me/player/recently-played/?limit=25');
  
//   dataList=[]
//   for(const a in his.items){
//     await dataList.push({name: his.items[a].track.name, pic: his.items[a].track.album.images[0].url, url: his.items[a].track.uri})
//   }
//   res.json(await dataList)

// })


