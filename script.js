document.getElementById("year").textContent = new Date().getFullYear();

function toggleMenu(){document.getElementById("nav").classList.toggle("open")}

function searchSite(){
  const q=document.getElementById("siteSearch").value.toLowerCase().trim();
  const cards=[...document.querySelectorAll(".searchable")];
  let count=0;
  cards.forEach(c=>{const match=!q||c.innerText.toLowerCase().includes(q);c.style.display=match?"block":"none";if(match&&q)count++});
  document.getElementById("searchResult").textContent=q?`${count} matching service(s) found.`:"";
}

function aiHelp(){
  const q=document.getElementById("aiInput").value.toLowerCase();
  let answer="Try the Services or Booking sections for more help.";
  if(q.includes("travel")||q.includes("trip")||q.includes("tour")) answer="✈️ For travel, open Travel & Explore and then use Booking to send your trip enquiry.";
  else if(q.includes("flower")) answer="🌺 For flowers, open the Flowers service and Gallery to showcase your collection.";
  else if(q.includes("book")||q.includes("reservation")) answer="📅 Use the Booking section to send your request.";
  else if(q.includes("contact")||q.includes("whatsapp")) answer="📱 Use the Contact section. Replace the sample WhatsApp number with your real number.";
  document.getElementById("aiAnswer").textContent=answer;
}

function sendBooking(e){
  e.preventDefault();
  const name=document.getElementById("name").value;
  const email=document.getElementById("email").value;
  const service=document.getElementById("service").value;
  const date=document.getElementById("date").value;
  const message=document.getElementById("message").value;
  const subject=encodeURIComponent("JORAM Booking / Enquiry - "+service);
  const body=encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\nDate: ${date}\nMessage: ${message}`);
  window.location.href=`mailto:YOUR_EMAIL@example.com?subject=${subject}&body=${body}`;
}

function demoLink(e){
  e.preventDefault();
  alert("Replace this demo link with your real product or affiliate URL.");
}