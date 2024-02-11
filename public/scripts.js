async function getStat(endpoint){
    try{
        const response = await fetch('http://localhost:3002/'+endpoint)
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


async function topUserData(endpoint, div){
    var stats = await getStat(endpoint)
    var count = 0;
    let list = document.getElementsByClassName("Songs")[div];

    stats.forEach((item)=>{
 
    count++
    let div = document.createElement("div")
    let link = document.createElement("a")
    div.className="Child2"
    let text = document.createElement("h5");
    text.className="Child2Text"
    let text2 = document.createElement("h5");
    text2.className="Child2Text2"
    let pic = document.createElement("img");
    text.innerText = count + ". "+item.name;
    if(endpoint.includes("TopArt")){
        text2.innerText = "Popularity\n" + item.popularity + "\n\nGenres\n" + item.genres;
    }
    else{
        text2.innerText = "Release Date\n" + item.date + "\n\nDuration\n" + item.duration;
    }
    pic.src = item.pic
    text.id = "songhis"
    text2.id = "songhis"
    pic.id = "Pic"
    link.href = item.url
    if(count<=3){
        text.style.color="#FFD700"
    }
    text2.style.color="#E6E6FA"
    text2.style.Width="1000px"
    text2.style.fontSize="20px"

    
    link.appendChild(div)
    div.append(pic);
    div.appendChild(text);
    div.appendChild(text2);
    list.appendChild(link)
    })
}

async function otherStats(){
    var stats = await getStat('his')
    var count = 0;
    let list = document.getElementsByClassName("History")[0];
    stats.forEach((item)=>{
    count++
    let div = document.createElement("div")
    let link = document.createElement("a")
    div.className="Child2"
    let text = document.createElement("h5");
    text.className="Child2Text"
    let text2 = document.createElement("h5");
    text2.className="Child2Text2"
    let pic = document.createElement("img");
    text.innerText = count + ". "+item.name;
    text2.innerText = "Release Date\n" + item.date + "\n\nDuration\n" + item.duration;
    pic.src = item.pic
    text.id = "songhis"
    text2.id = "songhis"
    pic.id = "Pic"
    link.href = item.url
    text.style.color="#FFD700"
    text2.style.color="#E6E6FA"
    text2.style.Width="1000px"
    text2.style.fontSize="20px"

    link.appendChild(div)
    div.append(pic);
    div.appendChild(text);
    div.appendChild(text2);
    list.appendChild(link)

    })
}


userInfo()
topUserData('TopArt/short',0)
topUserData('TopArt/medium',1)
topUserData('TopArt/long',2)
topUserData('TopSong/short',3)
topUserData('TopSong/medium',4)
topUserData('TopSong/long',5)
otherStats()
