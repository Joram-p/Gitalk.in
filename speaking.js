(()=> {
 const $=id=>document.getElementById(id), lang=$('practiceLanguage'), prompt=$('practicePrompt');
 let transcript='', lastScore=0, recognition=null;
 lang.addEventListener('change',()=>location.href='speaking.php?language='+encodeURIComponent(lang.value));
 prompt.addEventListener('change',()=>{$('promptDisplay').textContent=prompt.value;transcript='';$('transcript').textContent='';$('feedback').hidden=true;$('savePractice').disabled=true;});
 $('hearPrompt').addEventListener('click',()=>{if(!('speechSynthesis'in window)){ $('speechStatus').textContent='Speech synthesis is unavailable.';return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(prompt.value);u.lang=lang.value;speechSynthesis.speak(u);});
 $('startSpeaking').addEventListener('click',()=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){$('speechStatus').textContent=LF_STRINGS.unsupported;return;}
  recognition=new SR();recognition.lang=lang.value;recognition.interimResults=true;recognition.continuous=false;
  $('speechStatus').textContent=LF_STRINGS.listening;$('transcript').textContent='';
  recognition.onresult=e=>{let final='', interim='';for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal)final+=e.results[i][0].transcript;else interim+=e.results[i][0].transcript;}transcript=(final||interim).trim();$('transcript').textContent=transcript||'…';};
  recognition.onerror=e=>{$('speechStatus').textContent='Speech error: '+e.error;};
  recognition.onend=()=>{if(!transcript){$('speechStatus').textContent=LF_STRINGS.empty;return;}const a=prompt.value.toLocaleLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).filter(x=>x.length>2);const b=transcript.toLocaleLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).filter(x=>x.length>2);const unique=new Set(a);const matched=b.filter(x=>unique.has(x)).length;lastScore=Math.min(100,Math.round(100*matched/Math.max(1,unique.size)));const msg=lastScore>=65?LF_STRINGS.good:LF_STRINGS.retry;$('feedback').hidden=false;$('feedback').innerHTML='<b>'+msg+'</b><p>Practice similarity indicator: '+lastScore+'% — compare the transcript and repeat.</p>';$('speechStatus').textContent=LF_STRINGS.done;$('savePractice').disabled=false;};
  try{recognition.start();}catch(e){$('speechStatus').textContent=e.message;}
 });
 $('savePractice').addEventListener('click',async()=>{
  const btn=$('savePractice');btn.disabled=true;
  try{const r=await fetch('api/speaking-save.php',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':LF_CSRF},body:JSON.stringify({prompt:prompt.value,transcript,language:lang.value,score:lastScore,feedback:$('feedback').innerText})});const data=await r.json();$('speechStatus').textContent=data.ok?LF_STRINGS.saved:(data.message||'Could not save.');}
  catch(e){$('speechStatus').textContent='Network error. Please retry.';}finally{btn.disabled=false;}
 });
})();