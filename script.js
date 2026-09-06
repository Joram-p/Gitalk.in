const products=[
["Travel","Travel Backpack","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80","$59"],
["Travel","Camera Backpack","https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=800&q=80","$79"],
["Travel","Travel Bottle","https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80","$24"],
["Travel","Luggage Set","https://images.unsplash.com/photo-1565026057447-bc90a4d4c2b1?auto=format&fit=crop&w=800&q=80","$129"],
["Travel","Travel Organizer","https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=800&q=80","$32"],
["Home","Ceramic Vase","https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80","$34"],
["Home","Table Lamp","https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80","$48"],
["Home","Coffee Set","https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80","$42"],
["Home","Cushion Set","https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80","$39"],
["Home","Desk Organizer","https://images.unsplash.com/photo-1516383607781-913a19294fd1?auto=format&fit=crop&w=800&q=80","$28"],
["Garden","Garden Tools","https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80","$45"],
["Garden","Flower Pot","https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80","$25"],
["Garden","Watering Can","https://images.unsplash.com/photo-1599685315640-4c6c3d1e1b55?auto=format&fit=crop&w=800&q=80","$29"],
["Garden","Plant Mister","https://images.unsplash.com/photo-1614594575928-a1e5d6c8f6a5?auto=format&fit=crop&w=800&q=80","$19"],
["Garden","Pruning Shears","https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80","$22"],
["Lifestyle","Sunglasses","https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80","$35"],
["Lifestyle","Watch","https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80","$89"],
["Lifestyle","Leather Journal","https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80","$27"],
["Lifestyle","Headphones","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80","$75"],
["Lifestyle","Smart Speaker","https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80","$69"],
["Fashion","Cotton Shirt","https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80","$44"],
["Fashion","Sling Bag","https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80","$51"],
["Fashion","Sneakers","https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80","$65"],
["Fashion","Sunglasses Premium","https://images.unsplash.com/photo-1518544889280-3c9b0a7c4f5b?auto=format&fit=crop&w=800&q=80","$59"],
["Fashion","Travel Hat","https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80","$31"],
["Tech","Smartphone","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80","$499"],
["Tech","Tablet","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80","$299"],
["Tech","Smartwatch","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80","$129"],
["Tech","Power Bank","https://images.unsplash.com/photo-1609592424687-1c8f2f4d6f11?auto=format&fit=crop&w=800&q=80","$29"],
["Tech","Wireless Earbuds","https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80","$49"]
];
const categories=["All",...new Set(products.map(x=>x[0]))];
let active="All";
const productEl=document.querySelector("#products"), chips=document.querySelector("#categoryChips");
function renderProducts(){const q=document.querySelector("#productSearch").value.toLowerCase(); productEl.innerHTML=products.filter(p=>(active==="All"||p[0]===active)&&p[1].toLowerCase().includes(q)).map((p,i)=>`<article class="product"><img src="${p[2]}" alt="${p[1]}" loading="lazy"><div class="product-body"><small>${p[0]}</small><h3>${p[1]}</h3><p>Curated by JORAM for your lifestyle and adventures.</p><span class="price">${p[3]}</span><a class="btn primary" href="https://www.amazon.in/" target="_blank" rel="noopener sponsored">View Deal</a></div></article>`).join("")||"<p>No products found.</p>"}
chips.innerHTML=categories.map(c=>`<button class="chip ${c==="All"?"active":""}">${c}</button>`).join(""); chips.onclick=e=>{if(!e.target.classList.contains("chip"))return;active=e.target.textContent;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===e.target));renderProducts()};document.querySelector("#productSearch").oninput=renderProducts;renderProducts();

const flowerImgs=["https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1495231916356-a86217efff12?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?auto=format&fit=crop&w=900&q=80"];
document.querySelector("#gallery").innerHTML=flowerImgs.map((x,i)=>`<img src="${x}" alt="JORAM flower photograph ${i+1}" loading="lazy">`).join("");
document.querySelector("#gallery").onclick=e=>{if(e.target.tagName==="IMG"){document.querySelector("#lightboxImg").src=e.target.src;document.querySelector("#lightbox").classList.add("show")}};

const news=[["Rajasthan Tourism","Explore Rajasthan travel destinations and experiences.","https://www.tourism.rajasthan.gov.in/"],["Jodhpur District","Official district information, services and updates.","https://jodhpur.rajasthan.gov.in/"],["Google News","Search the latest Jodhpur and Rajasthan headlines.","https://news.google.com/search?q=Jodhpur%20Rajasthan"]];
document.querySelector("#newsGrid").innerHTML=news.map(n=>`<article class="news-card"><small>RAJASTHAN</small><h3>${n[0]}</h3><p>${n[1]}</p><a href="${n[2]}" target="_blank" rel="noopener">Read / open →</a></article>`).join("");
document.querySelector("#openNews").onclick=()=>window.open("https://news.google.com/search?q=Jodhpur%20Rajasthan","_blank");
document.querySelector("#refreshNews").onclick=()=>{document.querySelector("#tickerText").textContent="🔴 LIVE • News feed refreshed — Jodhpur • Rajasthan • Travel • Culture";setTimeout(()=>document.querySelector("#tickerText").textContent="🔴 LIVE • JORAM News & Media — Welcome to the premium Rajasthan experience",3500)};

function clock(){document.querySelector("#clock").textContent=new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true}).format(new Date())}setInterval(clock,1000);clock();document.querySelector("#year").textContent=new Date().getFullYear();
const rates={USD:83,EUR:90,GBP:105,INR:1};function convert(){let a=+amount.value||0;let f=from.value,t=to.value;document.querySelector("#conversion").textContent=`${a} ${f} ≈ ${(a*rates[f]/rates[t]).toFixed(2)} ${t}*`}["amount","from","to"].forEach(id=>document.querySelector("#"+id).oninput=convert);

document.querySelector("#menuBtn").onclick=()=>document.querySelector("#navLinks").classList.toggle("open");
function modal(id){document.querySelector(id).classList.add("show")}function closeModals(){document.querySelectorAll(".modal").forEach(x=>x.classList.remove("show"))}
document.querySelector("#searchBtn").onclick=()=>modal("#searchModal");document.querySelector("#aiOpen").onclick=()=>modal("#aiModal");document.querySelectorAll(".close").forEach(x=>x.onclick=closeModals);document.querySelectorAll(".modal").forEach(x=>x.onclick=e=>{if(e.target===x)x.classList.remove("show")});
const allSearch=[...products.map(p=>({name:p[1],type:p[0],href:"#shop"})),...news.map(n=>({name:n[0],type:"News",href:n[2]}))];
document.querySelector("#globalSearch").oninput=e=>{let q=e.target.value.toLowerCase();document.querySelector("#searchResults").innerHTML=allSearch.filter(x=>(x.name+x.type).toLowerCase().includes(q)).slice(0,12).map(x=>`<div class="search-result"><b>${x.name}</b><small> · ${x.type}</small></div>`).join("")};
document.querySelector("#chatForm").onsubmit=e=>{e.preventDefault();let input=document.querySelector("#chatInput"),q=input.value.trim();if(!q)return;document.querySelector("#chat").insertAdjacentHTML("beforeend",`<div class="bubble user">${q}</div>`);let a=q.toLowerCase().includes("travel")?"Try the Travel and Explore sections for Jodhpur ideas.":q.toLowerCase().includes("product")||q.toLowerCase().includes("shop")?"Open Shop and use categories or search to find products.":q.toLowerCase().includes("flower")?"Visit Flowers to browse the gallery and replace placeholders with your own photographs.":"I can guide you around JORAM. Try asking about travel, products, flowers, news or contact.";setTimeout(()=>document.querySelector("#chat").insertAdjacentHTML("beforeend",`<div class="bubble">${a}</div>`),250);input.value=""};
document.querySelector("#enquiry").onsubmit=e=>{e.preventDefault();alert("Thank you! Your enquiry form is ready. Connect this form to your email/Formspree/Netlify Forms backend to receive submissions.");};
