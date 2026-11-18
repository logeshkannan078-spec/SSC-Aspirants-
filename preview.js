
const $=id=>document.getElementById(id);
const subjects=['Maths','English','Reasoning','GK / GS'];
const KEY='ssc_daily_track_v1';
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=d=>{let x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
const add=(date,n)=>{const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+n);return iso(d)};
const today=iso(new Date());
const num=n=>Number.isFinite(Number(n))?Number(n):0;
const pct=(n,d)=>d?Math.round(100*n/d):0;
const avg=a=>a.reduce((s,v)=>s+v,0)/a.length;
const bar=(n)=>`<div class="bar"><div class="fill" style="width:${Math.max(0,Math.min(100,n))}%"></div></div>`;
const item=(t,sub)=>`<div class="item"><strong>${safe(t)}</strong><div class="muted small">${safe(sub)}</div></div>`;
function notify(s){$('feedback').textContent=s}
function normalize(v){let d=v?.data??v;if(!d||typeof d!=='object'||Array.isArray(d))throw Error('Invalid backup or cloud document.');return {days:d.days||{},topics:Array.isArray(d.topics)?d.topics:[],syllabus:d.syllabus||{},revisions:d.revisions||{},mocks:Array.isArray(d.mocks)?d.mocks:[],sundays:d.sundays||{},mistakes:Array.isArray(d.mistakes)?d.mistakes:[]}}
function pending(d){return d.topics.flatMap(t=>[1,4,7].map(n=>({t,n,due:add(t.date,n),key:t.id+'_'+n}))).filter(x=>x.due<=today&&!d.revisions[x.key]).sort((a,b)=>a.due.localeCompare(b.due))}
function render(d,source){
const days=d.days, rev=pending(d), mocks=d.mocks.filter(m=>num(m.max)>0&&Number.isFinite(Number(m.score))).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
const last=mocks.at(-1), day=days[today], hrs=subjects.reduce((s,k)=>s+num(day?.hours?.[k]),0);
$('hours').textContent=hrs.toFixed(1)+'h';$('due').textContent=rev.length;$('mock').textContent=last?`${num(last.score)}/${num(last.max)}`:'—';
const subjectStats=subjects.map(s=>{const keys=Object.keys(d.syllabus).filter(k=>k.startsWith(s+'|'));const completed=keys.filter(k=>d.syllabus[k]==='Completed').length;const mistakes=d.mistakes.filter(m=>m.subject===s);const pendingCount=rev.filter(r=>r.t.subject===s).length;const logs=d.topics.filter(t=>t.subject===s);return {s,keys,completed,mistakes,pendingCount,logs,coverage:keys.length?pct(completed,keys.length):null}});
$('subjects').innerHTML=subjectStats.map(x=>item(x.s,`${x.completed} completed of ${x.keys.length} tracked chapters · ${x.mistakes.length} mistakes · ${x.pendingCount} revisions due`)+(x.coverage!==null?bar(x.coverage):'')).join('')+'<p class="muted small">Subject-wise mock accuracy cannot be calculated from existing total-score-only mock records.</p>';
const rec=subjectStats.map(x=>({ ...x,priority:Math.min(100,x.pendingCount*14)+Math.min(30,x.mistakes.length*8)+(x.coverage===null?10:(100-x.coverage)*.2)})).sort((a,b)=>b.priority-a.priority);
$('recommend').innerHTML=rec.slice(0,4).map((x,i)=>item(`${i+1}. ${x.s}`,`${x.pendingCount} due revisions · ${x.mistakes.length} logged mistakes · ${x.coverage===null?'syllabus coverage unknown':x.coverage+'% tracked chapters complete'}`)).join('')+'<p class="muted small">Recommendations are rule-based; existing records do not contain chapter-level mock accuracy.</p>';
$('revisions').innerHTML=rev.length?rev.slice(0,12).map(x=>item(x.t.name,`${x.t.subject} · Day ${x.n} · Due ${x.due}`)).join('')+(rev.length>12?`<p class="muted">${rev.length-12} more due</p>`:''):'<p>No revisions due today.</p>';
const full=mocks.filter(m=>num(m.max)===200);if(full.length>=5){const recent=full.slice(-10).map(m=>num(m.score));const weights=recent.map((_,i)=>i+1),weighted=recent.reduce((s,x,i)=>s+x*weights[i],0)/weights.reduce((a,b)=>a+b,0);const sd=Math.sqrt(avg(recent.map(x=>(x-weighted)**2)));const range=Math.max(8,1.3*sd);$('predict').innerHTML=`<div class="value">${Math.max(0,weighted-range).toFixed(0)}–${Math.min(200,weighted+range).toFixed(0)} / 200</div><p class="muted">Indicative range from ${recent.length} recent 200-mark mocks. Not a guaranteed examination result.</p>`}else{$('predict').innerHTML=`<p>${full.length}/5 comparable 200-mark mocks available.</p><p class="muted">Add more full-length tests before generating a prediction.</p>`}
const sunday=new Date(today+'T12:00:00');sunday.setDate(sunday.getDate()+(7-sunday.getDay())%7);const sun=iso(sunday);const from=add(sun,-6);const topics=d.topics.filter(t=>t.date>=from&&t.date<sun);const distinct=[...new Map(topics.map(t=>[t.subject+'|'+t.name,t])).values()];$('sunday').innerHTML=`<p class="sub"><strong>Next Sunday: ${safe(sun)}</strong></p>`+(distinct.length?distinct.slice(0,12).map(t=>item(t.name,t.subject)).join(''):'<p>No recorded topics for this week yet.</p>')+'<p class="muted small">Blueprint only; no MCQ questions are automatically generated.</p>';
const completed=Object.values(d.syllabus).filter(v=>v==='Completed').length;const total=Object.keys(d.syllabus).length;const revTotal=d.topics.length*3;const revDone=Object.keys(d.revisions).length;const last7=Array.from({length:7},(_,i)=>add(today,-i));const consistency=last7.filter(date=>Object.prototype.hasOwnProperty.call(days,date)).length/7*100;const mockScore=full.length>=5?Math.min(100,avg(full.slice(-5).map(m=>num(m.score)))/200*100):null;const syllabusScore=total?completed/total*100:null;const revisionScore=revTotal?Math.min(100,revDone/revTotal*100):null;const balance=subjectStats.every(x=>x.coverage!==null)?Math.max(0,100-(Math.max(...subjectStats.map(x=>x.coverage))-Math.min(...subjectStats.map(x=>x.coverage)))):null;
const components=[['Mock performance',mockScore,40],['Syllabus completion',syllabusScore,20],['Revision completion',revisionScore,15],['Subject balance',balance,15],['Study consistency',consistency,10]];
const enough=components.every(x=>x[1]!==null);
const readiness=enough?Math.round(components.reduce((s,x)=>s+x[1]*x[2]/100,0)):null;
$('ready').textContent=readiness===null?'N/A':readiness+'/100';
$('readiness').innerHTML=components.map(([name,value,weight])=>item(name,`${value===null?'Insufficient data':value.toFixed(0)+'%'} · weight ${weight}%`)+(value===null?'':bar(value))).join('')+(enough?'<p class="muted small">Planning index, not an official percentile.</p>':'<p class="muted small">Index withheld until all required metrics are available.</p>');
$('state').textContent='Read-only · '+source;notify(`Loaded ${Object.keys(days).length} study days, ${d.topics.length} topics and ${d.mocks.length} mocks from ${source}. No changes saved.`);
}
$('local').onclick=()=>{try{const raw=localStorage.getItem(KEY);if(!raw)throw Error('No local v1 records found in this browser. Use the JSON backup or cloud option.');render(normalize(JSON.parse(raw)),'local storage')}catch(e){notify(e.message)}};
$('backup').onclick=()=>$('file').click();
$('file').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;render(normalize(JSON.parse(await f.text())),'JSON backup')}catch(e){notify('Could not load backup: '+e.message)}finally{e.target.value=''}};
$('cloud').onclick=async()=>{try{
const configText=localStorage.getItem('ssc_firebase_config');if(!configText)throw Error('Firebase configuration not found in this browser. Open the original app in the same browser first, or load a JSON backup.');
const config=JSON.parse(configText);
const [{initializeApp,getApps},{getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged},{getFirestore,doc,getDoc}]=await Promise.all([
import('https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js'),
import('https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'),
import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js')]);
const app=getApps().find(a=>a.name==='ssc-v2-readonly')||initializeApp(config,'ssc-v2-readonly');
const auth=getAuth(app);let user=auth.currentUser;
if(!user){const result=await signInWithPopup(auth,new GoogleAuthProvider());user=result.user}
const snapshot=await getDoc(doc(getFirestore(app),'users',user.uid,'app','main'));
if(!snapshot.exists())throw Error('No cloud document found for this Google account.');
render(normalize(snapshot.data()),'Firebase (read-only)');
}catch(e){notify('Cloud read failed: '+e.message)}};
