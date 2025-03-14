/*let notifEnableButton = document.getElementById("notifs");
if((typeof Notification) !== "undefined"){
    notifEnableButton.onclick = async (e) => {
        if(notifEnableButton.checked){
            if(Notification.permission !== "denied"){
                if(Notification.permission === "default")
                  await Notification.requestPermission();
                if(Notification.permission !== "denied")
                  new Notification ("Notifications on", {silent:true, body:"Disable them with the same checkbox.", icon:"ico64.ico"});
            }
            else {document.getElementById("notifslabel").innerText = "Please enable notification permissions"; e.preventDefault(); return;}
	}
    };
}*/
/*if(localStorage && localStorage.getItem && localStorage.getItem("dflash")){
   //document.querySelector("#flash").checked = true;
}*/
/*document.querySelector("#flash").oninput = (e) => {
   if(e.currentTarget.checked){
      localStorage && localStorage.setItem && localStorage.setItem("dflash", "1");
   } else {
      localStorage && localStorage.removeItem && localStorage.removeItem("dflash");
   }
};*/
let lm = -1;
let ld = -1;
let ly = -1;
let constart = false;
let tvar = null;
let name = null;
let pass = null;
let intid = -1;
let title = "";
let notifs = 0;
let ats = 0;
let chatWs = null;
let intSet = false;
let minute = new Date().getMinutes();
let timestampmin = -1;
let charCount = 0;
let msgCount = 0;
let pastMsg = null;
let xhr = new XMLHttpRequest();
let lastColorChange = new Date().getSeconds();
let originalColor = document.querySelector(':root').style.getPropertyValue('--usr-clr');
let colorStarted = false;
/*xhr.open("GET", "https://" + window.location.hostname + "/chat/api/notice");
let noticePromise = new Promise((r, j) => {
    xhr.addEventListener('load', r);
    xhr.send();
});
document.onvisibilitychange = () => {
    if(document.visibilityState === "visible") { notifs = 0; ats = 0;}
};*/
/*
document.getElementById("chatsend").onclick = document.getElementById("chatinput").onkeypress = (e) => {
    if((e.key !== undefined && e.key !== "Enter")){return;}
    let inputbox = document.getElementById("chatinput");
    if( inputbox.value === "" || /^\s*$/.test(inputbox.value)){
       inputbox.value = "";
       dispMsg("SYSTEM", "Empty messages aren't allowed.", "#FFFF00");
       return;
    }
    if( /(https?:\/\/)?\w+\.\w+(:\d+)?(\/\w+)*\/?/.test(inputbox.value)){
       inputbox.value = "";
       dispMsg("SYSTEM", "Links aren't allowed.", "#FFFF00");
       return;
    }
    if( inputbox.value.length > 128 ){
       dispMsg("SYSTEM", "Messages this long aren't allowed.", "#FFFF00");
       return;
    }
    let currMin = new Date().getMinutes();
    if(currMin == minute){
       if(chatWs.rank && chatWs.rank === "UnverifiedUser" && (charCount + inputbox.value.length > 250 || msgCount >= 5)){
           dispMsg("SYSTEM", "Slow down.", "#FFFF00");
	   return;
       }
    }else{charCount = 0; msgCount = 0; minute = currMin}
    if(pastMsg === inputbox.value){
       dispMsg("SYSTEM", "No spamming.", "#FFFF00");
       return;
    }
    let msgObj = JSON.stringify({c:inputbox.value});
    msgCount += 1;
    charCount += inputbox.value.length;
   
    pastMsg = inputbox.value;
    chatWs.send(msgObj);
    inputbox.value = "";
    inputbox.focus();
};*/

let timeMap = new Map();
let stBoxes = window.localStorage.getItem("boxes");
if(stBoxes)stBoxes.split('-').forEach(x=>{let xelem = document.getElementById(x); if(xelem) xelem.checked = true});
/*
document.getElementById("nameinput").onkeypress = async (e) => {
    
    if(constart || (e.key !== undefined && e.key !== "Enter" )){return;}
    let nameinput = document.getElementById("nameinput");
    let nameinputsplit = nameinput.value.split("::");
    
    if(nameinputsplit[0].length > 12 && nameinputsplit[1] === undefined){
        nameinput.placeholder = "12 letters long or less.";
        nameinput.value = "";
        return;
    }
    if(/th[3e].*d[3e]v/i.test(nameinputsplit[0])){
        nameinput.placeholder = "Impersonation is not allowed.";
        nameinput.value = "";
        return;
    }
    constart = true;
    
    try{
    nameinput.placeholder = "Connecting...";
    nameinput.value = "";
    name = nameinputsplit[0];
    console.log(nameinputsplit[0]);
    pass = nameinputsplit[1];
    chatWs = await connect(nameinputsplit[0], nameinputsplit[1], e.shiftKey);
    if(Array.isArray(chatWs)){
      constart = false;
      nameinput.placeholder = "ERR: " + chatWs[1];
      return;
    }
    let cntPrm = new Promise((r) => {
        chatWs.addEventListener("error",(e) => {r("fail")});
        chatWs.addEventListener("open", (e) => {r("success")});
    });
    chatWs.onopen = async (e) => {
     
     if(!intSet){
     intSet = true;
     intid = setInterval(async ()=>{
         try{
             if(chatWs.readyState === WebSocket.CONNECTING) return;
             if(chatWs.readyState === 3)  throw 'Dead sock';
             chatWs.send(new Blob([new Uint8Array(0)]));
         }catch(sx){
             let errordiv = document.getElementById("msgs");
             let divAtBottom = atBottom(errordiv);
             let error = document.createElement("span");
             error.style.color = "red";
             error.style.fontFamily = "monospace";
             error.innerText = "Connection unexpectedly dropped, reconnecting...";
             errordiv.appendChild(error);
             errordiv.appendChild(document.createElement("br"));
             let oph = chatWs.onopen;
             let msh = chatWs.onmessage;
             let clh = chatWs.onclose;
             let usr = chatWs.username;
             let mnt = chatWs.mention;
             let bdg = chatWs.badge;
             let rank = chatWs.rank;
             let mnr = chatWs.mentionReg;
             chatWs.onclose = null;
             chatWs.onmessage = null;
             chatWs.onclose = null;
             chatWs.onerror = null;
             chatWs = await connect(name, pass);
             if(Array.isArray(chatWs)){
                 let fatal = document.createElement("span");
                 let mdiv = document.getElementById("msgs");
                 fatal.style.color = "#FF0000";
                 fatal.innerText = "Fatal error: " + (!!chatWs[1].length ? chatWs[1] : "Chat down");
                 fatal.style.fontFamily = "monospace";
                 clearInterval(intid);
                 mdiv.scrollTop = mdiv.scrollHeight;
                 mdiv.appendChild(fatal);
                 mdiv.appendChild(document.createElement("br"));
                 return;
             }
             chatWs.onerror = (e) => {
               clearInterval(intid);
               let fatal = document.createElement("span");
               let mdiv = document.getElementById("msgs");
               let btm = atBottom(mdiv);
               fatal.innerText = "Fatal error: Chat is inaccessible. Likely your device lost connection. Refresh your page to attempt reconnection.";
               fatal.style.color = "#FF0000";
               fatal.style.fontFamily = "monospace";
               errordiv.appendChild(fatal);
               errordiv.appendChild(document.createElement("br"));
               mdiv.scrollTop = mdiv.scrollHeight;
             };
             chatWs.onopen = oph;
             chatWs.onmessage = msh;
             chatWs.onclose = clh;
             chatWs.username = usr;
             chatWs.mention = mnt;
             chatWs.rank = rank;
             chatWs.badge = bdg;
             chatWs.mentionReg = mnr;
             if(divAtBottom)
             errordiv.scrollTop = errordiv.scrollHeight;
         }
     }, 2000);
     };
    let msgdiv = document.getElementById("msgs");
    console.log(msgdiv.childElementCount);
    if(msgdiv.childElementCount===0){
     if(xhr.readyState !== 4) await noticePromise;
     if(xhr.status === 200) {
         let noticeLabel = document.createElement("span");
         noticeLabel.style.color = "var(--usr-clr)";
         noticeLabel.style.fontFamily = "monospace";
         noticeLabel.innerText = "Notice from The Dev:";
         let notice = document.createElement("span");
         notice.style.color = "var(--msg-clr)";
         notice.style.fontFamily = "monospace";
         notice.innerText = xhr.response;
         msgdiv.appendChild(noticeLabel);
         msgdiv.appendChild(document.createElement("br"));
         msgdiv.appendChild(notice);
         msgdiv.appendChild(document.createElement("br"));
     }
    }
    let divAtBottom = atBottom(msgdiv);
    let connectedMsg = document.createElement("span");
    connectedMsg.style.fontFamily = "monospace";
    connectedMsg.style.color = "green";
    connectedMsg.innerText = "Connected to chat as " + chatWs.username;
    msgdiv.appendChild(connectedMsg);
    msgdiv.appendChild(document.createElement("br"));
    document.getElementById("chatdiv").hidden = false;
    document.getElementById("chatinput").focus();
    nameinput.hidden = true;
    if(divAtBottom) msgdiv.scrollTop = msgdiv.scrollHeight;
    };
    chatWs.onclose = (e) => {
      console.log(e.reason);
    };

    chatWs.onmessage = (e) => {
     let msgdiv = document.getElementById("msgs");
     let msgObj = JSON.parse(e.data);
     let content = msgObj.c;
     if(content === undefined) content = msgObj.content;
     let mnt = chatWs.mentionReg.test(content);
     dispMsg(msgObj.author, content, msgObj.style, mnt);
     if(notifEnableButton.checked && Notification.permission === "granted" && (document.visibilityState !== "visible" || !atBottom(msgdiv))){
        let n = new Notification("From " + msgObj.author + ":", {body:content, icon: "ico64.ico", silent: true});
        setTimeout(()=>{n.close();}, 1000);
     }
     if(document.visibilityState !== "visible"){
       notifs += 1;
       if(mnt) ats += 1;
     }
    };
    nameinput = document.getElementById("nameinput");
    
    let cntResult = await cntPrm;
    console.log(cntResult);
    if(cntResult === "fail"){
        let nameinput = document.getElementById("nameinput");
        nameinput.placeholder = "Chat service down.";
        nameinput.value = "";
	constart = false;
        console.log("failed");
        return;
    }
    if((typeof Notification) !== "undefined" && Notification.permission !== "denied"){
        notifEnableButton.hidden = false;
        document.getElementById("notifslabel").hidden = false;
    }
    }catch(ex){console.log(ex);}
};
*/
for(let box of document.querySelectorAll("input[type=checkbox]"))
    box.onchange = (e) => {update(); updateStorage();};
setInterval(()=>update(), 200);



function updateStorage(){
    window.localStorage.setItem("boxes", Array.from(
        document.getElementById("checkboxes")
        .children)
        .filter(x=>x.checked)
        .map(x=>x.id)
        .sort()
        .join('-'));
}
function update(){
    let now = new Date();
    now.setSeconds(now.getSeconds() + offsetSecs);
    if(now.getSeconds() < lastColorChange) { lastColorChange -= 60; }
    /*if(document.querySelector("#flash").checked || (now.getSeconds() - lastColorChange >= 2 && ((now.getMilliseconds() < 200) || (colorStarted)))){
      colorStarted = true;
      let cssRoot = document.querySelector(':root');
      let currentColor = cssRoot.style.getPropertyValue('--usr-clr');
      cssRoot.style.setProperty('--usr-clr', currentColor === originalColor ? (document.querySelector("#flash").checked ? originalColor: "#FF5055") : originalColor);
      lastColorChange = now.getSeconds();
    }*/
    let nxt = getNext();
    let diff = nxt.date - now;
    diff = Math.floor(diff / 1000);
    let secs = diff % 60;
    diff = Math.floor(diff / 60);
    let mins = diff % 60;
    diff = Math.floor(diff / 60);
    let hrs = diff;
    let timestr = `${(hrs === 0 ? "" : hrs.toString().padStart(2, '0') + ":")}${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2, '0')}`;
    document.getElementById("txt").innerText = `${timestr} left of ${nxt.name}`;
    if(chatWs)
        timestr = `${chatWs.readyState === WebSocket.CLOSED ? "[X] " : ((ats === 0 ? "" : "[@" + ats + "]")+(notifs === 0 ? "" : "[" + notifs + "] "))}` + timestr;
    if(title !== timestr) { document.title = timestr;
    title = timestr; }
}

let etSettings = document.querySelector("et-set");
console.log(etSettings);

let offsetSecs = parseInt(etSettings.querySelector("offset-secs").innerText);
if(offsetSecs === NaN){
  offsetSecs = 0;
}
console.log("Offset secs: " + offsetSecs);

let scheduleMods = etSettings.querySelector("schedule-options").innerText.split('-').filter(x=>x!=="");
console.log(scheduleMods);

let pepRally = false;

function getNext(d, p){
    let now = d === undefined?new Date():d;
    now.setSeconds(now.getSeconds()+offsetSecs);
    if(p) console.log(now);
    /*if((now.getDate() < 10 && now.getMonth() == 3) || (now.getDate() >= 31 && now.getMonth() == 2)){
       return {date: new Date(2023, 3, 10, 07, 25), name: "Spring Break"};
    }*/
    updateTimeMap(now);
    let arr;
    if(!pepRally){
        arr = timeMap.get(Array.from(new Set(
          Array.from(
            document.getElementById("checkboxes")
          .children)
        .filter(x=>x.checked)
        .map(x=>x.id).concat(scheduleMods)))
        .sort()
        .join('-'));
    }
    else {
        let year = now.getFullYear();
        let month = now.getMonth();
        let day = now.getDate();
        let bLunch = document.getElementById("bl").checked;
        arr =
           bLunch ?
           [
            {date: new Date(year, month, day, 07, 25), name: "Before School"},
            {date: new Date(year, month, day, 09, 38), name: "4th Period - ACT"},
            {date: new Date(year, month, day, 11, 57), name: "1st Period - ACT"},
            {date: new Date(year, month, day, 12, 32), name: "3rd Period"},
            {date: new Date(year, month, day, 13, 06), name: "Lunch"},
            {date: new Date(year, month, day, 14, 20), name: "2nd Period"}
           ]
        :
           [
            {date: new Date(year, month, day, 07, 25), name: "Before School"},
            {date: new Date(year, month, day, 09, 38), name: "4th Period - ACT"},
            {date: new Date(year, month, day, 11, 57), name: "1st Period - ACT"},
            {date: new Date(year, month, day, 12, 31), name: "Lunch"},
            {date: new Date(year, month, day, 13, 06), name: "3rd Period"},
            {date: new Date(year, month, day, 14, 20), name: "2nd Period"}
           ];
    }
    let next = arr.find(x=>x.date > now);
    if(next === undefined || now.getDay() === 6 || now.getDay() === 0){
        let ret = Object.assign({},arr[0]);
        ret.date = new Date(ret.date);

        ret.date.setDate(ret.date.getDate() + (ret.date.getDay() === 5 ? 3 : (ret.date.getDay() === 6 ? 2 : 1)));
  
        return ret;
    }
    return next;
}
function updateTimeMap(now){
    let year = now.getFullYear();
    let month = now.getMonth();
    let day = now.getDate();
    if(ly === year && lm === month && ld === day) return;
    ly = year;
    lm = month;
    ld = day;
    timeMap.set("",
        [
            {date: new Date(year, month, day, 07, 25), name: "Before School"},
            {date: new Date(year, month, day, 08, 52), name: "1st Period"},
            {date: new Date(year, month, day, 10, 35), name: "2nd Period"},
            {date: new Date(year, month, day, 11, 16), name: "Lunch"},
            {date: new Date(year, month, day, 12, 47), name: "3rd Period"},
            {date: new Date(year, month, day, 14, 20), name: "4th Period"}
        ]);//
    timeMap.set("hr",
        [
            {date: new Date(year, month, day, 07, 25), name: "Before School"},
            {date: new Date(year, month, day, 08, 50), name: "1st Period"},
            {date: new Date(year, month, day, 09, 08), name: "Homeroom"},
            {date: new Date(year, month, day, 10, 39), name: "2nd Period"},
            {date: new Date(year, month, day, 11, 20), name: "Lunch"},
            {date: new Date(year, month, day, 12, 49), name: "3rd Period"},
            {date: new Date(year, month, day, 14, 20), name: "4th Period"}
        ]);//
    timeMap.set("bl",
        [
            {date: new Date(year, month, day, 07, 25), name: "Before School"},
            {date: new Date(year, month, day, 08, 52), name: "1st Period"},
            {date: new Date(year, month, day, 10, 35), name: "2nd Period"},
            {date: new Date(year, month, day, 12, 08), name: "3rd Period"},
            {date: new Date(year, month, day, 12, 47), name: "Lunch"},
            {date: new Date(year, month, day, 14, 20), name: "4th Period"}
        ]);//
    timeMap.set("bl-hr",
        [
            {date: new Date(year, month, day, 07, 25), name: "Before School"},
            {date: new Date(year, month, day, 08, 50), name: "1st Period"},
            {date: new Date(year, month, day, 09, 08), name: "Homeroom"},
            {date: new Date(year, month, day, 10, 39), name: "2nd Period"},
            {date: new Date(year, month, day, 12, 10), name: "3rd Period"},
            {date: new Date(year, month, day, 12, 49), name: "Lunch"},
            {date: new Date(year, month, day, 14, 20), name: "4th Period"}
        ]);//
    timeMap.set("er",
        [
            {date: new Date(year, month, day, 07, 25), name: "Before School"},
            {date: new Date(year, month, day, 08, 30), name: "1st Period"},
            {date: new Date(year, month, day, 09, 41), name: "2nd Period"},
            {date: new Date(year, month, day, 10, 52), name: "3rd Period"},
            {date: new Date(year, month, day, 12, 03), name: "4th Period"},
            {date: new Date(year, month, day, 12, 20), name: "Lunch pickup time"}
        ]);//
    timeMap.set("bl-er",timeMap.get("er")
        );//
    timeMap.set("er-hr",
        [
            {date: new Date(year, month, day, 07, 25), name: "Before School"},
            {date: new Date(year, month, day, 08, 26), name: "1st Period"},
            {date: new Date(year, month, day, 08, 44), name: "Homeroom"},
            {date: new Date(year, month, day, 09, 51), name: "2nd Period"},
            {date: new Date(year, month, day, 10, 58), name: "3rd Period"},
            {date: new Date(year, month, day, 12, 05), name: "4th Period"},
            {date: new Date(year, month, day, 12, 20), name: "Lunch pickup time"}
        ]);//
    timeMap.set("bl-er-hr",
            timeMap.get("er-hr")
        );//
}
function fmtDt(d){
    let hrs = (d.getHours())% 12;
    if(hrs == 0) hrs = 12;
    return hrs.toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
}
function atBottom(x){
    return x.scrollTop - (x.scrollHeight - x.clientHeight) > -1;
}
function dispMsg(msgauthor, msgcontent, style, mnt){

     let rxAt = new Date();
     let rxMins = rxAt.getMinutes();
     let msgdiv = document.getElementById("msgs");
     let divAtBottom = atBottom(msgdiv);
     let msg = document.createElement("span");
     msg.classList.add("msg");
     let author = document.createElement("span");
     author.classList.add("msgauthor");
     let time = document.createElement("span");
     time.classList.add("msgtime");
     if(style){
         author.style.color = style;
     }
     let wholeMsg = document.createElement("div");
     author.innerText = msgauthor;
     msg.innerText = ": " + msgcontent;
     time.innerText = "| ";
     if(rxMins !== timestampmin){
         timestampmin = rxMins;
         let stamp = document.createElement("span");
         stamp.classList.add("msgtime");
         stamp.innerHTML = "[<span style=\"font-style: oblique\">" + fmtDt(rxAt) + "</span>]";
         msgdiv.appendChild(stamp);
         msgdiv.appendChild(document.createElement("br"));
     }
     if(mnt){
       wholeMsg.style.backgroundColor = "#222200";
     }
     wholeMsg.appendChild(time);
     wholeMsg.appendChild(author);
     wholeMsg.appendChild(msg);
     wholeMsg.style.padding = "0";
     wholeMsg.style.margin = "0";
     msgdiv.appendChild(wholeMsg);
     
     if(divAtBottom)
     msgdiv.scrollTop = msgdiv.scrollHeight;

}
async function connect(username, password, dbgKey){
    creds = {username: username};
    if(password !== undefined) creds.password = password;
    let ticket = new XMLHttpRequest();
    let xhrprm = new Promise((r, j) => {
        ticket.onload = () => r("ok");
        ticket.onerror = (e) => r(e);
    });
    ticket.open("POST", "https://" + window.location.hostname + "/chat/api/ticket");
    ticket.send(JSON.stringify(creds));
    let xhrres = await xhrprm;
    if(ticket.status === 502) ticket.responseTextProx = "Chat service down.";
    else {ticket.responseTextProx = ticket.responseText;}
    if(xhrres !== "ok" || Math.floor(ticket.status / 100) >= 4) return [ticket.status, ticket.responseTextProx];
    console.log(ticket.responseTextProx);
    let txt = ticket.responseText.split('\n')[0];
    if(dbgKey)  document.getElementById("banner").innerText= txt;
    let chatWs = new WebSocket("wss://" + window.location.hostname + "/chat/api/ws?ticket=" + txt);
    chatWs.ticket = txt;
    let dataLine = ticket.responseText.split('\n')[1].match(
      /^(?<rank>.*?) .*?\<(?<usr>(?<mention>.*?)( \[(?<badge>.+?)\])?)\>/ ///^(?<rank>.*?) .*?\<(?<usr>.*)\>/
    );
    chatWs.username = dataLine.groups.usr;
    chatWs.rank = dataLine.groups.rank;
    chatWs.badge = dataLine.groups.badge;
    chatWs.mention = dataLine.groups.mention;
    chatWs.mentionReg = new RegExp("@" + chatWs.mention.replace("\\", "\\\\").replace("[", "\\[").replace("]", "\\]").replace("*", "\\*").replace("+", "\\+").replace(".", "\\.").replace("(", "\\(").replace(")", "\\)").replace("{", "\\{").replace("}", "\\}"), "i");
    return chatWs;
}
