function toggleMenu(){document.getElementById("navLinks").classList.toggle("open")}
function percent(){let a=+p1.value,b=+p2.value;pres.textContent=(isFinite(a)&&isFinite(b))?`Result: ${a*b/100}`:"Enter valid numbers"}
function discount(){let a=+d1.value,b=+d2.value;if(a>=0&&b>=0)dres.textContent=`Pay: ₹${(a-a*b/100).toFixed(2)} | Save: ₹${(a*b/100).toFixed(2)}`}
function age(){let x=new Date(dob.value);if(isNaN(x))return ares.textContent="Select your date of birth";let t=new Date(), y=t.getFullYear()-x.getFullYear(), m=t.getMonth()-x.getMonth();if(m<0||(m===0&&t.getDate()<x.getDate()))y--;ares.textContent=`Age: ${y} years`}
function emi(){let P=+loan.value,r=+rate.value/1200,n=+months.value;if(P>0&&n>0){let e=r?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n;eres.textContent=`Monthly EMI: ₹${e.toFixed(2)}`}}
function gst(){let a=+gstPrice.value,r=+gstRate.value;if(a>=0&&r>=0)gres.textContent=`GST: ₹${(a*r/100).toFixed(2)} | Total: ₹${(a*(1+r/100)).toFixed(2)}`}
function countText(){let s=counter.value.trim();cres.textContent=`Words: ${s?s.split(/\s+/).length:0} • Characters: ${counter.value.length}`}
function makePass(){let n=Math.min(50,Math.max(4,+passLen.value||12)),c="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";let out="";for(let i=0;i<n;i++)out+=c[Math.floor(Math.random()*c.length)];passres.textContent=out}
function makeQR(){let t=qrText.value.trim();if(!t)return;qrcode.innerHTML=`<img alt="QR code" src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(t)}">`}
function yearAge(){let y=+birthYear.value;if(y>1900&&y<=new Date().getFullYear())yres.textContent=`Approx. age: ${new Date().getFullYear()-y} years`}
function convertKm(){let k=+km.value;if(k>=0)kmres.textContent=`Miles: ${(k*0.621371).toFixed(3)}`}
async function shareSite(){if(navigator.share){try{await navigator.share({title:"Gitalk.in",text:"Free tools and useful guides",url:location.href})}catch(e){}}else{await navigator.clipboard?.writeText(location.href);alert("Website link copied!")}}
year.textContent=new Date().getFullYear();