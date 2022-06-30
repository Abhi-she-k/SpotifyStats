async function getStat(endpoint){
    try{
        const response = await fetch('https://spotfystats1.herokuapp.com/'+endpoint)
        data = await response;
        return await data.json()
    }
    catch(e){
        console.log(e)
    }

    
}

async function userInfo(){
    var user = await getStat('user')

    let info = document.getElementsByClassName("UserInfo")[0];

    let img = document.createElement("img");
    let name = document.createElement("h3");
    let followers = document.createElement("h6");

    img.id = 'proPic';
    name.id = 'userName';

    img.src = user.pic;
    name.innerText = user.name;
    followers.innerText = "Followers | " + user.followers;
    followers.style.fontSize='20px';

    info.append(img);
    info.append(name);
    info.append(followers);


}


async function topArt(time, div){
    var stats = await getStat(time)
    var count = 0;
    let list = document.getElementsByClassName("time")[div];

    stats.forEach((item)=>{
 
    count++
    let div = document.createElement("div")
    div.className="Child1"
    let text = document.createElement("h5");
    let pic = document.createElement("img");
    text.innerText = count  + ". " + item.name;
    pic.src = item.pic
    text.id = "text"
    pic.id = "Pic"
    text.style.width="300px"
    if(count<=3){
        text.style.color="#FFD700"
    }
    
    div.append(pic);
    div.append(text);
    list.appendChild(div)
    })
}

async function topSong(time, div){
    var stats = await getStat(time)
    var count = 0;
    let list = document.getElementsByClassName("time")[div];

    stats.forEach((item)=>{
 
    count++
    let div = document.createElement("div")
    div.className="Child2"
    let text = document.createElement("h5");
    let pic = document.createElement("img");
    text.innerText = count  + ". " + item.name;
    pic.src = item.pic
    text.id = "text"
    pic.id = "Pic"
    text.style.width="300px"
    if(count<=3){
        text.style.color="#FFD700"
    }
    
    div.append(pic);
    div.append(text);
    list.appendChild(div)
    })
}

async function userHistory(){
    var stats = await getStat('his')
    var count = 0;
    let list = document.getElementsByClassName("History")[0];

    stats.forEach((item)=>{
    count++
    let div = document.createElement("div")
    div.className="Child2"
    let text = document.createElement("h5");
    let pic = document.createElement("img");
    text.innerText = count + ". "+item.name;
    pic.src = item.pic
    text.id = "songhis"
    pic.id = "Pic"
    text.style.color="#FFD700"
    div.append(pic);
    div.append(text);
    list.appendChild(div)
    })
}

userInfo()
topArt('TopArtShort',0)
topArt('TopArtMed',1)
topArt('TopArtLong',2)
topSong('TopSongShort',3)
topSong('TopSongMed',4)
topSong('TopSongLong',5)
topSong('TopSongShort',6)
topSong('TopSongMed',7)
topSong('TopSongLong',8)
userHistory()
