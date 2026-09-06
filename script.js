const $=id=>document.getElementById(id);
$("year").textContent=new Date().getFullYear();

function toggleNav(){ $("nav").classList.toggle("open"); }

function tick(){
  const now=new Date();
  $("clock").textContent=now.toLocaleString([], {day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",second:"2-digit"});
  $("bigClock").textContent=now.toLocaleTimeString();
}
setInterval(tick,1000);tick();

function siteSearch(){
  const q=$("searchBox").value.toLowerCase().trim();
  const items=[...document.querySelectorAll(".searchable")];
  let n=0;
  items.forEach(x=>{let ok=!q||x.innerText.toLowerCase().includes(q);x.classList.toggle("hidden",!ok);if(ok&&q)n++});
  $("searchCount").textContent=q?`${n} match${n===1?"":"es"}`:"";
}

function aiHelp(){
 const q=$("aiInput").value.toLowerCase();
 let a="I can help you explore JORAM. Try asking about travel, flowers, news, booking, videos or contact.";
 if(/travel|trip|tour|destination/.test(q)) a="✈️ Travel: open Travel & Explore, then use Booking to send your enquiry.";
 else if(/flower|nature|plant/.test(q)) a="🌺 Flowers: your uploaded flower photography is in the Gallery section.";
 else if(/news|headline/.test(q)) a="📰 News: open Live News and press Refresh News for the latest available headlines.";
 else if(/video|youtube/.test(q)) a="🎥 Video: open Watch & Share to connect your YouTube channel or add local videos.";
 else if(/book|booking|reserve/.test(q)) a="📅 Booking: fill out the Booking & Enquiry form and send it to navyaaitech@gmail.com.";
 else if(/contact|email/.test(q)) a="📧 Contact JORAM at navyaaitech@gmail.com — Jodhpur, Rajasthan, India.";
 $("aiAnswer").textContent=a;
}

document.querySelectorAll(".gallery figure").forEach(f=>f.addEventListener("click",()=>{ $("lightboxImg").src=f.querySelector("img").src; $("lightboxImg").alt=f.querySelector("img").alt; $("lightbox").classList.add("show"); }));
function closeLightbox(){ $("lightbox").classList.remove("show"); }

async function loadNews(){
 const grid=$("newsGrid"); grid.innerHTML='<div class="loading">Loading Google News headlines…</div>';
 const feeds=[
  ["Jodhpur", "Jodhpur Rajasthan"],
  ["Rajasthan", "Rajasthan India"],
  ["India", "India latest news"],
  ["Technology", "India technology AI gadgets"]
 ];
 try{
   const all=[];
   for(const [label,q] of feeds){
     const rss=`https://news.google.com/rss/search?q=${encodeURIComponent(q+" when:2d")}&hl=en-IN&gl=IN&ceid=IN:en`;
     const res=await fetch("https://api.allorigins.win/raw?url="+encodeURIComponent(rss));
     const text=await res.text();
     const xml=new DOMParser().parseFromString(text,"text/xml");
     [...xml.querySelectorAll("item")].slice(0,3).forEach(i=>all.push({
       category:label,
       title:i.querySelector("title")?.textContent||"Latest headline",
       link:i.querySelector("link")?.textContent||"https://news.google.com/",
       pub:i.querySelector("pubDate")?.textContent||"",
       source:i.querySelector("source")?.textContent||"Google News"
     }));
   }
   if(!all.length) throw new Error("No headlines");
   grid.innerHTML=all.slice(0,8).map(x=>`<article class="news-card"><small>🔴 LIVE • ${escapeHtml(x.category)} • ${escapeHtml(x.source)}</small><h3>${escapeHtml(x.title)}</h3><p>${x.pub?new Date(x.pub).toLocaleString():"Latest available"}</p><a target="_blank" rel="noopener" href="${x.link}">Read story ↗</a></article>`).join("");
   $("tickerText").textContent=all[0].title;
   $("newsStatus").textContent=`Updated ${new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`;
 }catch(e){
   const fallback=[
    ["Jodhpur", "Latest Jodhpur stories on Google News", "https://news.google.com/search?q=Jodhpur%20Rajasthan"],
    ["Rajasthan", "Latest Rajasthan stories on Google News", "https://news.google.com/search?q=Rajasthan"],
    ["India", "Latest India stories on Google News", "https://news.google.com/"],
    ["Technology", "Latest India technology and AI stories", "https://news.google.com/search?q=India%20technology%20AI%20gadgets"]
   ];
   grid.innerHTML=fallback.map(x=>`<article class="news-card"><small>GOOGLE NEWS</small><h3>${x[0]}</h3><p>${x[1]}</p><a target="_blank" rel="noopener" href="${x[2]}">Open latest ↗</a></article>`).join("");
   $("tickerText").textContent="Google News live links are ready — open a category for the newest headlines.";
   if($("newsStatus")) $("newsStatus").textContent="Live links ready";
 }
}

function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
loadNews();

async function getWeather(manual=false){
  const box=$("weather"); box.textContent="Loading Jodhpur weather…";
  try{
    let lat=26.2389,lon=73.0243;
    if(manual && navigator.geolocation){
      await new Promise(resolve=>navigator.geolocation.getCurrentPosition(p=>{lat=p.coords.latitude;lon=p.coords.longitude;resolve()},resolve,{timeout:4000}));
    }
    const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`);
    const d=await r.json(), c=d.current;
    box.innerHTML=`<b>${Math.round(c.temperature_2m)}°C</b><br>Humidity ${c.relative_humidity_2m}%<br>Wind ${Math.round(c.wind_speed_10m)} km/h`;
  }catch(e){box.textContent="Weather service unavailable right now."}
}
getWeather();

function convertMoney(){
 const v=parseFloat($("inr").value)||0, r=parseFloat($("rate").value), unit=$("rate").selectedOptions[0].text;
 $("conversion").textContent=`≈ ${(v*r).toFixed(2)} ${unit} (demo rate)`;
}
convertMoney();

function calculate(){
 const expr=$("calc").value.trim();
 if(!/^[0-9+\-*/().%\s]+$/.test(expr)){ $("calcResult").textContent="Use numbers and + - * / ( ) % only."; return; }
 try{ $("calcResult").textContent="= "+Function("return ("+expr+")")(); }catch(e){ $("calcResult").textContent="Invalid calculation."; }
}
let countdownTimer;
function startCountdown(){
 clearInterval(countdownTimer); const input=$("countdownDate").value; if(!input){$("countdownResult").textContent="Choose a date.";return;}
 const target=new Date(input).getTime();
 function update(){ const diff=target-Date.now(); if(diff<=0){$("countdownResult").textContent="🎉 Time reached!";clearInterval(countdownTimer);return;} const d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000); $("countdownResult").textContent=`${d}d ${h}h ${m}m ${s}s`; }
 update(); countdownTimer=setInterval(update,1000);
}
async function shareJORAM(){
 const data={title:"JORAM",text:"Explore JORAM — Jodhpur, Rajasthan",url:location.href};
 try{ if(navigator.share){await navigator.share(data); $("shareResult").textContent="Shared.";} else {await navigator.clipboard.writeText(location.href); $("shareResult").textContent="Website link copied.";} }catch(e){$("shareResult").textContent="Share cancelled.";}
}

function sendBooking(e){
 e.preventDefault();
 const body=`Name: ${$("name").value}\nEmail: ${$("email").value}\nService: ${$("service").value}\nDate: ${$("date").value}\nMessage: ${$("message").value}`;
 location.href=`mailto:navyaaitech@gmail.com?subject=${encodeURIComponent("JORAM Booking / Enquiry")}&body=${encodeURIComponent(body)}`;
}
