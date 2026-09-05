document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.getElementById('menu'),links=document.getElementById('links');
menu.onclick=()=>links.classList.toggle('open');
document.querySelectorAll('#links a').forEach(a=>a.onclick=()=>links.classList.remove('open'));

const input=document.getElementById('media'),preview=document.getElementById('preview');
input.onchange=()=>{preview.innerHTML='';[...input.files].forEach(file=>{const f=document.createElement('figure'),c=document.createElement('figcaption');c.textContent=file.name;if(file.type.startsWith('image/')){const x=document.createElement('img');x.src=URL.createObjectURL(file);f.append(x,c)}else if(file.type.startsWith('video/')){const x=document.createElement('video');x.src=URL.createObjectURL(file);x.controls=true;f.append(x,c)}preview.append(f)})};

document.getElementById('pay').onclick=()=>{const amount=document.getElementById('amount').value;if(!amount||Number(amount)<=0){alert('Please enter a valid amount.');return}const p=new URLSearchParams({pa:'8940270189@nye',pn:'Gitalk.in',am:Number(amount).toFixed(2),cu:'INR'});location.href='upi://pay?'+p.toString()};
