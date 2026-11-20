const courses = [
 {id:"en",name:"English",native:"English",flag:"🇬🇧",level:"Beginner",category:"Popular",lessons:24,desc:"Everyday English, grammar and confident speaking.",hello:"Hello",meaning:"नमस्ते / नमस्कार",sample:"How are you?",translation:"आप कैसे हैं?"},
 {id:"hi",name:"Hindi",native:"हिन्दी",flag:"🇮🇳",level:"Beginner",category:"India",lessons:18,desc:"Learn Hindi letters, useful phrases and conversation.",hello:"नमस्ते",meaning:"Hello",sample:"आपका नाम क्या है?",translation:"What is your name?"},
 {id:"es",name:"Spanish",native:"Español",flag:"🇪🇸",level:"Beginner",category:"Popular",lessons:20,desc:"Useful phrases for travel, people and daily life.",hello:"Hola",meaning:"Hello",sample:"¿Cómo estás?",translation:"How are you?"},
 {id:"fr",name:"French",native:"Français",flag:"🇫🇷",level:"Beginner",category:"Europe",lessons:20,desc:"Start speaking French with simple everyday lessons.",hello:"Bonjour",meaning:"Good morning / Hello",sample:"Comment allez-vous?",translation:"How are you?"},
 {id:"de",name:"German",native:"Deutsch",flag:"🇩🇪",level:"Beginner",category:"Europe",lessons:22,desc:"Build a foundation in German vocabulary and grammar.",hello:"Hallo",meaning:"Hello",sample:"Wie geht es dir?",translation:"How are you?"},
 {id:"ja",name:"Japanese",native:"日本語",flag:"🇯🇵",level:"Beginner",category:"Asia",lessons:26,desc:"Learn greetings, hiragana basics and daily expressions.",hello:"こんにちは",meaning:"Hello",sample:"お元気ですか？",translation:"How are you?"},
 {id:"ko",name:"Korean",native:"한국어",flag:"🇰🇷",level:"Beginner",category:"Asia",lessons:20,desc:"Explore Hangul, greetings and practical conversation.",hello:"안녕하세요",meaning:"Hello",sample:"잘 지내세요?",translation:"How are you?"},
 {id:"zh",name:"Chinese",native:"中文",flag:"🇨🇳",level:"Beginner",category:"Asia",lessons:22,desc:"Begin Mandarin with tones, pinyin and useful words.",hello:"你好",meaning:"Hello",sample:"你好吗？",translation:"How are you?"},
 {id:"ar",name:"Arabic",native:"العربية",flag:"🇸🇦",level:"Beginner",category:"Popular",lessons:20,desc:"Learn the Arabic script and common expressions.",hello:"مرحبا",meaning:"Hello",sample:"كيف حالك؟",translation:"How are you?"},
 {id:"it",name:"Italian",native:"Italiano",flag:"🇮🇹",level:"Intermediate",category:"Europe",lessons:18,desc:"Practice useful Italian phrases and pronunciation.",hello:"Ciao",meaning:"Hello / Bye",sample:"Come stai?",translation:"How are you?"},
 {id:"pt",name:"Portuguese",native:"Português",flag:"🇧🇷",level:"Intermediate",category:"Popular",lessons:18,desc:"Learn Portuguese for travel and everyday situations.",hello:"Olá",meaning:"Hello",sample:"Tudo bem?",translation:"All good?"},
 {id:"ru",name:"Russian",native:"Русский",flag:"🇷🇺",level:"Advanced",category:"Popular",lessons:24,desc:"Explore Cyrillic, grammar and useful conversation.",hello:"Здравствуйте",meaning:"Hello",sample:"Как дела?",translation:"How are you?"}
];
const grid=document.getElementById("courseGrid"), search=document.getElementById("searchInput"), level=document.getElementById("levelFilter"), category=document.getElementById("categoryFilter");
let showAll=false, currentCourse=null;
const progress=JSON.parse(localStorage.getItem("lf_progress")||"{}");
function renderCourses(){
 let list=courses.filter(c=>(c.name+" "+c.native+" "+c.desc).toLowerCase().includes(search.value.toLowerCase())&&(level.value==="All"||c.level===level.value)&&(category.value==="All"||c.category===category.value));
 if(!showAll)list=list.slice(0,6);
 grid.innerHTML=list.length?list.map(c=>`<article class="course-card"><div class="course-top"><span class="flag">${c.flag}</span><span class="free-tag">100% FREE</span></div><h3>${c.name}</h3><p>${c.native} · ${c.desc}</p><div class="course-meta"><span>◷ ${c.lessons} lessons</span><span>▣ ${c.level}</span><span>✓ ${progress[c.id]||0}% done</span></div><button data-course="${c.id}">Start learning →</button></article>`).join(""):"<p>No courses found. Try another search.</p>";
 grid.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>openCourse(b.dataset.course)));
}
function toast(msg){let t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function openCourse(id){
 currentCourse=courses.find(c=>c.id===id);let c=currentCourse, done=progress[id]||0;
 document.getElementById("lessonContent").innerHTML=`<div class="eyebrow">${c.flag} ${c.name.toUpperCase()} · BEGINNER PATH</div><h2>Welcome to ${c.name}</h2><p>${c.desc}</p><div class="progress"><span style="width:${done}%"></span></div><small>${done}% course progress</small><div class="lesson-block"><small>LESSON 01 · GREETINGS</small><h3>Say hello</h3><strong>${c.hello}</strong><p>${c.meaning}</p><hr style="border:0;border-top:1px solid #dce6d3;margin:15px 0"><b>${c.sample}</b><p>${c.translation}</p></div><h3>Quick check</h3><p>What does “${c.hello}” mean?</p><button class="quiz-option" data-answer="yes">${c.meaning}</button><button class="quiz-option" data-answer="no">Goodbye</button><button class="quiz-option" data-answer="no">Thank you</button><div id="quizFeedback"></div><button class="btn btn-green full" id="completeLesson">Mark lesson complete →</button><p class="muted" style="margin-top:14px">This sample lesson is a starter template. Add full audio, video and lesson content through a connected course backend.</p>`;
 document.getElementById("lessonModal").classList.add("show");
 document.querySelectorAll(".quiz-option").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".quiz-option").forEach(x=>x.classList.remove("correct","wrong"));b.classList.add(b.dataset.answer==="yes"?"correct":"wrong");document.getElementById("quizFeedback").textContent=b.dataset.answer==="yes"?"Correct! Well done.":"Try again — read the meaning above."; }));
 document.getElementById("completeLesson").addEventListener("click",()=>{progress[id]=Math.min(100,(progress[id]||0)+10);localStorage.setItem("lf_progress",JSON.stringify(progress));document.getElementById("lessonModal").classList.remove("show");renderCourses();toast("Lesson completed. Your progress was saved on this device.");});
}
[search,level,category].forEach(el=>el.addEventListener("input",renderCourses));
document.getElementById("showMore").addEventListener("click",()=>{showAll=!showAll;document.getElementById("showMore").textContent=showAll?"Show fewer ↑":"Explore all courses →";renderCourses()});
document.getElementById("closeLesson").addEventListener("click",()=>document.getElementById("lessonModal").classList.remove("show"));
const auth=document.getElementById("authModal");
function showAuth(title){document.getElementById("modalTitle").textContent=title;auth.classList.add("show")}
document.getElementById("loginBtn").onclick=()=>showAuth("Welcome back");
document.getElementById("signupBtn").onclick=()=>showAuth("Create your free account");
document.getElementById("closeModal").onclick=()=>auth.classList.remove("show");
document.getElementById("authForm").addEventListener("submit",e=>{e.preventDefault();let name=document.getElementById("userName").value,email=document.getElementById("userEmail").value;localStorage.setItem("lf_user",JSON.stringify({name,email}));auth.classList.remove("show");toast("Welcome, "+name+"! Demo profile saved.");});
document.getElementById("menuBtn").onclick=()=>{let nav=document.querySelector(".topbar nav");nav.style.display=nav.style.display==="flex"?"none":"flex";nav.style.position="absolute";nav.style.top="70px";nav.style.left="0";nav.style.right="0";nav.style.padding="20px";nav.style.background="white";nav.style.flexDirection="column";};
[auth,document.getElementById("lessonModal")].forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show")}));
renderCourses();