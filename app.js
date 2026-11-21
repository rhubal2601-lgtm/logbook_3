const MU=['Brust','Rücken','Schultern','Bizeps','Trizeps','Quadrizeps','Beinbeuger','Gesäß','Waden','Bauch','Unterarme','Nacken','Sonstige'];
const BR=['Prime Fitness','Cybex','Hammer Strength','Nautilus','Technogym','Panatta','gym80','Matrix','Life Fitness','Atlantis','Arsenal Strength','Hoist','Precor','Freemotion','Body-Solid','Eleiko','Watson Gym Equipment','Gymleco','Star Trac','TuffStuff','Hammer','Sonstige'];
const EX0=`Brustpresse sitzend|Brust|Hammer Strength|Plate Loaded Chest Press|
Schrägbrustpresse|Brust|Hammer Strength|Incline Press|
Decline Press|Brust|Hammer Strength|Decline Press|
Butterfly|Brust|Cybex|Pec Fly|
Kabelzug Fly|Brust|Technogym|Kabelturm|u
Schrägbankdrücken Kurzhantel|Brust|Sonstige|Hantelbank|
Rudern Iso-Lateral|Rücken|Hammer Strength|Iso-Lateral Row|u
High Row|Rücken|Hammer Strength|High Row|u
Latzug|Rücken|Prime Fitness|Lat Pulldown|
Rudern sitzend Kabel|Rücken|Cybex|Seated Row|
T-Bar Rudern|Rücken|Atlantis|T-Bar Row|
Schulterpresse|Schultern|Technogym|Shoulder Press|
Seitheben Maschine|Schultern|Prime Fitness|Lateral Raise|
Seitheben Kabel einarmig|Schultern|Sonstige|Kabelturm|u
Reverse Fly Maschine|Schultern|Hammer Strength|Rear Delt|
Bizepscurl Maschine|Bizeps|Cybex|Biceps Curl|
Scott Curl|Bizeps|gym80|Preacher Curl|
Hammer Curl Kurzhantel|Bizeps|Sonstige|Kurzhanteln|u
Trizepsdrücken Kabel|Trizeps|Sonstige|Kabelturm|
Dip Maschine|Trizeps|Matrix|Dip|
Overhead Trizeps Kabel|Trizeps|Sonstige|Kabelturm|
Beinpresse|Quadrizeps|Hammer Strength|Leg Press|
Hackenschmidt|Quadrizeps|Panatta|Hack Squat|
Beinstrecker|Quadrizeps|Prime Fitness|Leg Extension|
Beinstrecker einbeinig|Quadrizeps|Cybex|Leg Extension|u
Kniebeuge Maschine|Quadrizeps|Hammer Strength|Squat|
Beinbeuger sitzend|Beinbeuger|Hammer Strength|Seated Leg Curl|
Beinbeuger liegend|Beinbeuger|Nautilus|Lying Leg Curl|
Rumänisches Kreuzheben|Beinbeuger|Sonstige|Langhantel|
Hip Thrust Maschine|Gesäß|Prime Fitness|Hip Thrust|
Abduktoren|Gesäß|Life Fitness|Hip Abduction|
Wadenheben stehend|Waden|Hammer Strength|Standing Calf|
Wadenpresse|Waden|gym80|Calf Press|
Crunch Maschine|Bauch|Technogym|Abdominal Crunch|
Beinheben hängend|Bauch|Sonstige|Klimmzugstange|
Handgelenkcurl|Unterarme|Sonstige|Kurzhanteln|u
Nackenmaschine|Nacken|Hammer Strength|Neck|`.split('\n').map((l,i)=>{const[a,b,c,d,u]=l.split('|');return{id:'e'+i,name:a,mu:b,br:c,model:d,uni:!!u}});
EX0.push(...(window.GEAR||[]));
const SYS={'Push / Pull / Legs':['Push','Pull','Legs'],'Torso / Limbs':['Torso A','Torso B','Limbs A','Limbs B']};
const DEF={Push:[0,1,3,11,12,18,19],Pull:[6,7,8,9,15,16,14],Legs:[21,23,24,27,28,30,32],'Torso A':[0,6,11,8,15,18],'Torso B':[1,7,9,12,16,19],'Limbs A':[21,25,27,17,20,32],'Limbs B':[22,24,28,15,19,33]};
const FIELDS=['Sitzhöhe','Rückenlehne','Griffposition','Griffbreite','Polsterhöhe','Kabelhöhe','Bewegungsradius','Startposition','Fußposition','Notiz'];
const SETT=['Aufwärm','Arbeit','Dropset','Rest-Pause'];
const $=s=>document.querySelector(s),uid=()=>Math.random().toString(36).slice(2,10);
let S,view='home',tgt='a',sel={},open={};
const db=new Promise(r=>{const q=indexedDB.open('logbook',1);q.onupgradeneeded=()=>q.result.createObjectStore('k');q.onsuccess=()=>r(q.result)});
const idb=async(m,k,v)=>{const d=await db;return new Promise(r=>{const o=d.transaction('k',m=='get'?'readonly':'readwrite').objectStore('k');const q=m=='get'?o.get(k):o.put(v,k);q.onsuccess=()=>r(q.result)})};
const save=()=>{idb('put','state',S);try{localStorage.setItem('logbook_mirror',JSON.stringify(S))}catch(e){}};
const mkP=n=>{const p={id:uid(),name:n,system:'Push / Pull / Legs',last:'Push',plans:{},workouts:[],settings:{},customEx:[],active:null};for(const k in DEF)p.plans[k]=DEF[k].map(i=>({id:'e'+i,sets:3,rep:'8-12',rir:2,rest:120,note:''}));return p};
const P=()=>S.profiles.find(p=>p.id==S.cur),ALL=()=>EX0.concat(P().customEx),EX=id=>ALL().find(e=>e.id==id)||{name:'?',mu:'',br:'',model:'',uni:false};
const SS=p=>SYS[p.system].concat((p.custom||{})[p.system]||[]);
const eq=e=>e.br+' '+e.model;
const W=()=>tgt=='a'?P().active:P().workouts.find(w=>w.id==tgt);
const vol=s=>s.t=='Aufwärm'?0:(s.uni?(+s.l.kg||0)*(+s.l.reps||0)+(+s.r.kg||0)*(+s.r.reps||0):(+s.kg||0)*(+s.reps||0))+(s.parts||[]).reduce((a,x)=>a+(+x.kg||0)*(+x.reps||0),0);
const e1=(k,r)=>k&&r?Math.round(k*(1+r/30)*10)/10:0;
const tops=s=>s.uni?[s.l,s.r].map(x=>({kg:+x.kg||0,reps:+x.reps||0})):[{kg:+s.kg||0,reps:+s.reps||0}].concat((s.parts||[]).map(x=>({kg:+x.kg||0,reps:+x.reps||0})));
const wvol=w=>w.ex.reduce((a,x)=>a+x.sets.reduce((b,s)=>b+vol(s),0),0);
const lastOf=id=>{const ws=P().workouts.filter(w=>w.end&&w.ex.some(x=>x.id==id)).sort((a,b)=>b.start-a.start);if(!ws[0])return null;return{w:ws[0],x:ws[0].ex.find(x=>x.id==id)}};
const D=t=>new Date(t).toLocaleDateString('de-AT');
const fmt=s=>s.uni?`L ${s.l.kg}×${s.l.reps} / R ${s.r.kg}×${s.r.reps}`:[s].concat(s.parts||[]).map(x=>`${x.kg||0}×${x.reps||0}`).join(' → ')+(s.rir!==''&&s.rir!=null?` · RIR ${s.rir}`:'');
const mkSet=(x,ref)=>{const u=EX(x).uni,r=ref||{};return{t:'Arbeit',kg:r.kg||'',reps:r.reps||'',rir:r.rir??'',rpe:'',rest:r.rest||'',c:'',l:{kg:r.l?.kg||'',reps:r.l?.reps||''},r:{kg:r.r?.kg||'',reps:r.r?.reps||''},parts:[],uni:u}};
function startW(sess){const p=P();p.last=sess;p.active={id:uid(),sess,sys:p.system,start:Date.now(),note:'',ex:p.plans[sess].map(it=>{const l=lastOf(it.id);const sets=[];for(let i=0;i<it.sets;i++){const ref=l&&l.x.sets.filter(s=>s.t!='Aufwärm')[i];sets.push(mkSet(it.id,ref?{...ref,rest:it.rest}:{rir:it.rir,rest:it.rest}))}return{id:it.id,ss:false,note:'',plan:it,sets}})};tgt='a';save();go('train')}
function prs(w){const out=[];const old=P().workouts.filter(x=>x.end&&x.id!=w.id&&x.start<w.start);w.ex.forEach(x=>{let kg=0,e=0;x.sets.forEach(s=>{if(s.t=='Aufwärm')return;tops(s).forEach(t=>{kg=Math.max(kg,t.kg);e=Math.max(e,e1(t.kg,t.reps))})});let ok=0,oe=0;old.forEach(o=>o.ex.filter(y=>y.id==x.id).forEach(y=>y.sets.forEach(s=>{if(s.t=='Aufwärm')return;tops(s).forEach(t=>{ok=Math.max(ok,t.kg);oe=Math.max(oe,e1(t.kg,t.reps))})})));if(old.length&&(kg>ok||e>oe)&&kg>0)out.push({id:x.id,kg,e1:e,newKg:kg>ok})});return out}
const A={
 go,sys(v){P().system=v;P().last=SYS[v][0];save();render()},ses(v){P().last=v;save();render()},start(){startW(P().last)},
 sw(id){S.cur=id;save();render()},
 np(){const n=prompt('Name des Profils');if(n){const p=mkP(n);S.profiles.push(p);S.cur=p.id;save();render()}},
 dp(){if(S.profiles.length>1&&confirm('Profil "'+P().name+'" mit allen Daten löschen?')){S.profiles=S.profiles.filter(p=>p.id!=S.cur);S.cur=S.profiles[0].id;save();render()}},
 rn(){const n=prompt('Neuer Name',P().name);if(n){P().name=n;save();render()}},
 pic(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=96;c.getContext('2d').drawImage(im,0,0,96,96);P().pic=c.toDataURL('image/jpeg',.7);save();render()};im.src=r.result};r.readAsDataURL(f)},
 goal(v){P().goal=v;save()},
 f(ei,k,v){W().ex[ei][k]=v;save()},
 s(ei,si,k,v){W().ex[ei].sets[si][k]=v;save()},
 s2(ei,si,sd,k,v){W().ex[ei].sets[si][sd][k]=v;save()},
 sp(ei,si,pi,k,v){W().ex[ei].sets[si].parts[pi][k]=v;save()},
 add(ei){const x=W().ex[ei],l=x.sets[x.sets.length-1];const n=mkSet(x.id,l);if(l)n.uni=l.uni;x.sets.push(n);save();render()},
 del(ei,si){W().ex[ei].sets.splice(si,1);save();render()},
 part(ei,si){const s=W().ex[ei].sets[si];s.parts.push({kg:s.t=='Rest-Pause'?s.kg:'',reps:''});save();render()},
 dpart(ei,si,pi){W().ex[ei].sets[si].parts.splice(pi,1);save();render()},
 type(ei,si,v){const s=W().ex[ei].sets[si];s.t=v;if(v=='Dropset'||v=='Rest-Pause'){}else s.parts=[];save();render()},
 uni(ei){const x=W().ex[ei];const e=P().customEx.find(c=>c.id==x.id);x.sets.forEach(s=>s.uni=!s.uni);save();render()},
 ss(ei){W().ex[ei].ss=!W().ex[ei].ss;save();render()},
 tog(k){open[k]=!open[k];render()},
 set(key,f,v){const p=P();(p.settings[key]=p.settings[key]||{})[f]=v;save()},
 addF(key){const f=prompt('Name des neuen Einstellungsfelds');if(f){A.set(key,f,'');render()}},
 finish(){const w=P().active;if(!confirm('Training beenden und speichern?'))return;w.end=Date.now();w.prs=prs(w);P().workouts.push(w);P().active=null;save();tgt=w.id;go('detail')},
 cancel(){if(confirm('Laufendes Training verwerfen?')){P().active=null;save();go('home')}},
 open(id){tgt=id;go('detail')},
 delw(id){if(confirm('Training löschen?')){P().workouts=P().workouts.filter(w=>w.id!=id);save();go('hist')}},
 addEx(id){const w=W();w.ex.push({id,ss:false,note:'',plan:null,sets:[mkSet(id)]});save();view=tgt=='a'?'train':'detail';render()},
 pick(){view='pick';render()},
 q(k,v){sel[k]=v;render()},
 newEx(){const n=prompt('Name der Übung');if(!n)return;const mu=prompt('Muskelgruppe ('+MU.join(', ')+')','Sonstige');const br=prompt('Hersteller','Sonstige');const md=prompt('Gerät/Modell','');const u=confirm('Einseitige Übung? (OK = ja)');P().customEx.push({id:'c'+uid(),name:n,mu:MU.includes(mu)?mu:'Sonstige',br,model:md,uni:u,custom:1});save();render()},
 newBr(){const b=prompt('Hersteller');const m=prompt('Modell/Gerät');if(b&&m){const mu=prompt('Muskelgruppe','Sonstige');P().customEx.push({id:'c'+uid(),name:m,mu:MU.includes(mu)?mu:'Sonstige',br:b,model:m,uni:false,custom:1});save();render()}},
 pl(s){sel.plan=s;render()},
 pm(i,d){const a=P().plans[sel.plan||P().last],j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];save();render()},
 pd(i){P().plans[sel.plan||P().last].splice(i,1);save();render()},
 pc(i){const a=P().plans[sel.plan||P().last];a.splice(i+1,0,{...a[i]});save();render()},
 pf(i,k,v){P().plans[sel.plan||P().last][i][k]=k=='sets'?+v:v;save()},
 px(i){sel.rep=i;view='pick';render()},
 pa(id){const a=P().plans[sel.plan||P().last];if(sel.rep!=null){a[sel.rep].id=id;sel.rep=null}else a.push({id,sets:3,rep:'8-12',rir:2,rest:120,note:''});save();view='edit';render()},
 lab(k,v){S.ui.labels[k]=v;save();render()},nv(k){S.ui.navHide[k]=!S.ui.navHide[k];save();render()},ord(i,d){const o=S.ui.order,j=i+d;if(j<0||j>=o.length)return;[o[i],o[j]]=[o[j],o[i]];save();render()},num(k,v){S.ui[k]=+v;save();theme()},
 preset(i){Object.assign(S.ui,PRE[i]);save();theme();render()},
 addS(){const n=prompt('Name der neuen Einheit');if(!n)return;const p=P();if(p.plans[n])return alert('Existiert schon');p.plans[n]=[];(p.custom=p.custom||{})[p.system]=(p.custom[p.system]||[]).concat(n);sel.plan=n;save();render()},
 delS(n){const p=P();if(!confirm('Einheit "'+n+'" löschen?'))return;for(const k in p.custom||{})p.custom[k]=p.custom[k].filter(x=>x!=n);delete p.plans[n];sel.plan=null;if(p.last==n)p.last=SYS[p.system][0];save();render()},
 css(k,v){S.ui[k]=v;save();theme()},vis(k){S.ui.hide[k]=!S.ui.hide[k];save();render()},
 reset(){if(confirm('Design zurücksetzen?')){S.ui=defUI();save();theme();render()}},
 exp(){const b=new Blob([JSON.stringify({app:'logbook',v:1,date:Date.now(),data:S})],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='logbook-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click()},
 imp(i,mode){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=async()=>{try{const j=JSON.parse(r.result);if(j.app!='logbook'||!j.data||!Array.isArray(j.data.profiles))throw 0;const m=confirm('OK = Backup ERSETZT alle Daten.\nAbbrechen = andere Option.')?'r':(confirm('OK = Backup mit bestehenden Daten ZUSAMMENFÜHREN.\nAbbrechen = Import abbrechen.')?'m':null);if(!m)return;await idb('put','snapshot',JSON.parse(JSON.stringify(S)));if(m=='r')S=j.data;else{j.data.profiles.forEach(p=>{const o=S.profiles.find(x=>x.id==p.id);if(!o)S.profiles.push(p);else{const ids=new Set(o.workouts.map(w=>w.id));p.workouts.forEach(w=>ids.has(w.id)||o.workouts.push(w));p.customEx.forEach(c=>o.customEx.some(x=>x.id==c.id)||o.customEx.push(c));o.settings={...p.settings,...o.settings}}})}S.cur=S.profiles[0].id;save();theme();alert('Import erfolgreich. (Sicherungspunkt wurde angelegt.)');go('home')}catch(e){alert('Ungültige Backup-Datei.')}};r.readAsText(f)},
 restore(){idb('get','snapshot').then(s=>{if(!s)return alert('Kein Sicherungspunkt vorhanden.');if(confirm('Auf Sicherungspunkt vor letztem Import zurücksetzen?')){S=s;save();theme();go('home')}})},
 wipe(){if(confirm('ALLE Daten unwiderruflich löschen?')&&confirm('Wirklich sicher?')){S=init();save();go('home')}}
};
function go(v){view=v;if(v=='train')tgt='a';render();scrollTo(0,0)}
const PRE=[{a:'#ffd400',bg:'#0a0a0a',c:'#17171a',t:'#ffffff',b:'#26262b'},{a:'#ff3b30',bg:'#0b0b0b',c:'#1a1414',t:'#ffffff',b:'#2a2020'},{a:'#00e0a4',bg:'#06100d',c:'#10201b',t:'#ffffff',b:'#1c332b'},{a:'#111111',bg:'#f2f2f2',c:'#ffffff',t:'#111111',m:'#666666',b:'#e2e2e2'}];
const N=[['home','Home'],['train','Training'],['ex','Übungen'],['gear','Geräte'],['hist','Historie'],['prog','Fortschritt'],['prof','Profile'],['edit','Editor'],['set','Backup']];
const F=(l,v,cb,t='number')=>`<label class="f"><span>${l}</span><input type="${t}" inputmode="${t=='number'?'decimal':'text'}" step="any" value="${v??''}" onchange="${cb}"></label>`;
const ICON={home:'🏠',train:'🏋️',ex:'📋',gear:'⚙️',hist:'🕘',prog:'📈',prof:'👤',edit:'🎨',set:'💾'};
const o=(a,v)=>a.map(x=>`<option ${x==v?'selected':''}>${x}</option>`).join('');
const inp=(v,cb,ph,c='n',t='number')=>`<input class="${c}" type="${t}" inputmode="decimal" step="any" placeholder="${ph}" value="${v??''}" onchange="${cb}">`;
function exCard(ei,x,ed){const e=EX(x.id),p=P(),key=eq(e),l=lastOf(x.id),u=x.sets[0]?.uni;const st=p.settings[key]||{};const fs=[...new Set([...FIELDS.slice(0,4),...Object.keys(st)])];
 return`<div class="card ${x.ss?'ss':''}"><h3>${e.name}</h3>${ed?`<div class="row" style="margin:8px 0 6px">`:''}${ed?`<button class="s" onclick="A.ss(${ei})">${x.ss?'🔗 Supersatz':'Supersatz'}</button><button class="s" onclick="A.uni(${ei})">${u?'Einseitig ✓':'Einseitig'}</button><button class="s d" onclick="W().ex.splice(${ei},1);save();render()">✕</button>`:''}</div>
 <small>${e.mu} · ${key}</small>${x.plan?`<br><small>Plan: ${x.plan.sets}×${x.plan.rep} · RIR ${x.plan.rir} ${x.plan.note}</small>`:''}
 <div class="m" style="margin:8px 0;font-size:14px">${l?`Letztes (${D(l.w.start)}): ${l.x.sets.filter(s=>s.t!='Aufwärm').map(fmt).join(' | ')}`:'Noch keine Vorwerte'}</div>
 <button class="s" onclick="A.tog('g${x.id}')">⚙ Geräteeinstellungen</button>${open['g'+x.id]?`<div style="margin:8px 0">${fs.map(f=>`<div class="row"><small style="width:110px">${f}</small>${inp(st[f],`A.set('${key}','${f}',this.value)`,'','grow','text')}</div>`).join('')}<button class="s" onclick="A.addF('${key}')">+ Feld</button></div>`:''}
 ${x.sets.map((s,si)=>`<div class="set ${s.t}"><div class="sh"><b class="sn">${si+1}</b><select onchange="A.type(${ei},${si},this.value)">${o(SETT,s.t)}</select><button class="s d" onclick="A.del(${ei},${si})">✕</button></div>
 ${s.uni?`<div class="gs"><i>L</i>${F('kg',s.l.kg,`A.s2(${ei},${si},'l','kg',this.value)`)}${F('Wdh',s.l.reps,`A.s2(${ei},${si},'l','reps',this.value)`)}</div><div class="gs"><i>R</i>${F('kg',s.r.kg,`A.s2(${ei},${si},'r','kg',this.value)`)}${F('Wdh',s.r.reps,`A.s2(${ei},${si},'r','reps',this.value)`)}</div>`:`<div class="g2">${F('kg',s.kg,`A.s(${ei},${si},'kg',this.value)`)}${F('Wdh',s.reps,`A.s(${ei},${si},'reps',this.value)`)}</div>`}
 ${(s.parts||[]).map((q,pi)=>`<div class="pt"><small>${s.t=='Dropset'?'Drop':'Block'} ${pi+2}</small><button class="s d" onclick="A.dpart(${ei},${si},${pi})">✕</button></div><div class="g2" style="margin-top:4px">${F('kg',q.kg,`A.sp(${ei},${si},${pi},'kg',this.value)`)}${F('Wdh',q.reps,`A.sp(${ei},${si},${pi},'reps',this.value)`)}</div>`).join('')}
 ${s.t=='Dropset'||s.t=='Rest-Pause'?`<button class="s" style="margin-top:8px" onclick="A.part(${ei},${si})">+ ${s.t=='Dropset'?'Drop':'Pause-Block'}</button>`:''}
 <div class="g3">${F('RIR',s.rir,`A.s(${ei},${si},'rir',this.value)`)}${F('RPE',s.rpe,`A.s(${ei},${si},'rpe',this.value)`)}${F('Pause s',s.rest,`A.s(${ei},${si},'rest',this.value)`)}</div>
 <input class="c" placeholder="Satzkommentar" value="${s.c}" onchange="A.s(${ei},${si},'c',this.value)"></div>`).join('')}
 <button onclick="A.add(${ei})">+ Satz</button><input style="margin-top:8px" placeholder="Notiz zur Übung" value="${x.note}" onchange="A.f(${ei},'note',this.value)"></div>`}
function pickV(){const q=sel;let l=ALL().filter(e=>(!q.mu||e.mu==q.mu)&&(!q.br||e.br==q.br)&&(!q.s||e.name.toLowerCase().includes(q.s.toLowerCase()))&&(!q.own||e.custom));const tgtFn=sel.rep!=null||view=='pick'&&sel.plan!==undefined&&sel.forPlan;return`<h2>Übung wählen</h2><div class="row"><select onchange="A.q('mu',this.value)"><option value="">Muskel</option>${o(MU,q.mu)}</select><select onchange="A.q('br',this.value)"><option value="">Hersteller</option>${o(BR,q.br)}</select><button class="${q.own?'p':''}" onclick="A.q('own',!sel.own)">Eigene</button></div><input placeholder="Suche" value="${q.s||''}" onchange="A.q('s',this.value)" style="margin:8px 0">${l.map(e=>`<div class="card pick" onclick="${S.pickMode}('${e.id}')"><b>${e.name}</b><small>${e.mu} · ${eq(e)}${e.uni?' · einseitig':''}</small></div>`).join('')}<button onclick="A.newEx()">+ Eigene Übung</button> <button onclick="go(S.back)">Zurück</button>`}
const V={
home(){const p=P(),u=S.ui,ws=p.workouts.filter(w=>w.end),l=ws[ws.length-1],wk=ws.filter(w=>Date.now()-w.start<7*864e5),vl=wk.reduce((a,w)=>a+wvol(w),0),pr=ws.flatMap(w=>(w.prs||[]).map(r=>({...r,d:w.start}))).slice(-4).reverse(),L=(k,d)=>u.labels['h_'+k]||d;
 const sec={next:`<div class="card"><h2>${L('next','Dein nächstes Training')}</h2><div class="row chips">${Object.keys(SYS).map(k=>`<button class="${p.system==k?'on':''}" onclick="A.sys('${k}')">${k}</button>`).join('')}</div><div class="row chips" style="margin:10px 0">${SS(p).map(k=>`<button class="${p.last==k?'on':''}" onclick="A.ses('${k}')">${k}</button>`).join('')}</div>${p.active?`<button class="p" style="width:100%" onclick="go('train')">▶ Laufendes Training fortsetzen</button>`:`<button class="p" style="width:100%;font-size:18px" onclick="A.start()">Training starten: ${p.last}</button>`}</div>`,
 last:`<div class="card"><h3>${L('last','Letztes Training')}</h3>${l?`${l.sess} · ${D(l.start)} · ${Math.round((l.end-l.start)/6e4)} min · ${Math.round(wvol(l))} kg <button class="s" onclick="A.open('${l.id}')">Öffnen</button>`:'<span class="m">Noch keins</span>'}</div>`,
 freq:`<div class="card"><h3>${L('freq','Diese Woche')}</h3>${wk.length} Trainings · ${Math.round(vl)} kg Volumen · ${ws.length} gesamt</div>`,
 pr:`<div class="card"><h3>${L('pr','Persönliche Rekorde')}</h3>${pr.map(r=>`<div><span class="pr">PR</span> ${EX(r.id).name}: ${r.kg} kg (e1RM ≈ ${r.e1}) <small>${D(r.d)}</small></div>`).join('')||'<span class="m">Noch keine</span>'}</div>`,
 links:`<div class="row"><button class="grow" onclick="go('hist')">Historie</button><button class="grow" onclick="go('prog')">Fortschritt</button></div>`};
 return u.order.filter(k=>!u.hide[k]&&sec[k]).map(k=>sec[k]).join('')},
train(){const w=P().active;if(!w)return`<div class="card"><h2>Kein laufendes Training</h2><button class="p" onclick="A.start()">${P().last} starten</button></div>`;tgt='a';S.pickMode='A.addEx';S.back='train';return`<h2>${w.sess} <small>seit ${new Date(w.start).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'})}</small></h2>${w.ex.map((x,i)=>exCard(i,x,1)).join('')}<button onclick="A.pick()">+ Übung</button><textarea style="width:100%;margin:8px 0" placeholder="Trainingsnotizen" onchange="P().active.note=this.value;save()">${w.note}</textarea><button class="p" style="width:100%" onclick="A.finish()">Training beenden</button> <button class="d" onclick="A.cancel()">Verwerfen</button>`},
detail(){const w=W();if(!w)return go('hist');S.pickMode='A.addEx';S.back='detail';return`<h2>${w.sess} · ${D(w.start)}</h2><div class="card">${Math.round((w.end-w.start)/6e4)} min · ${Math.round(wvol(w))} kg Volumen ${(w.prs||[]).map(r=>`<br><span class="pr">PR</span> ${EX(r.id).name} ${r.kg} kg`).join('')}</div>${w.ex.map((x,i)=>exCard(i,x,1)).join('')}<button onclick="A.pick()">+ Übung</button><textarea style="width:100%;margin:8px 0" onchange="W().note=this.value;save()">${w.note}</textarea><button class="d" onclick="A.delw('${w.id}')">Löschen</button> <button onclick="go('hist')">Zurück</button>`},
ex(){S.pickMode='(()=>0)';S.back='home';const q=sel;return pickV().replace(/onclick="\(\(\)=>0\)\('([^']+)'\)"/g,'');},
gear(){const p=P();const sb=sel.gb||'';const l=ALL().filter(e=>!sb||e.br==sb);return`<h2>Geräte</h2><select style="width:100%" onchange="A.q('gb',this.value)"><option value="">Alle Hersteller</option>${o(BR,sb)}</select>${l.map(e=>{const k=eq(e),st=p.settings[k]||{};const fs=[...new Set([...FIELDS.slice(0,4),...Object.keys(st)])];return`<div class="card"><b>${e.br} – ${e.model}</b><br><small>${e.name}</small> <button class="s" onclick="A.tog('G${e.id}')">⚙</button>${open['G'+e.id]?`<div style="margin-top:8px">${fs.map(f=>`<div class="row"><small style="width:110px">${f}</small>${inp(st[f],`A.set('${k}','${f}',this.value)`,'','grow','text')}</div>`).join('')}<button class="s" onclick="A.addF('${k}')">+ Feld</button></div>`:''}</div>`}).join('')}<button onclick="A.newBr()">+ Eigenes Gerät</button>`},
hist(){const ws=P().workouts.filter(w=>w.end).sort((a,b)=>b.start-a.start);return`<h2>Historie</h2>${ws.map(w=>`<div class="card" onclick="A.open('${w.id}')"><b>${w.sess}</b> · ${D(w.start)}<br><small>${Math.round((w.end-w.start)/6e4)} min · ${w.ex.length} Übungen · ${w.ex.reduce((a,x)=>a+x.sets.length,0)} Sätze · ${Math.round(wvol(w))} kg ${(w.prs||[]).length?'<span class="pr">PR</span>':''}</small></div>`).join('')||'<div class="card m">Noch keine Trainings.</div>'}`},
prog(){const p=P(),ws=p.workouts.filter(w=>w.end).sort((a,b)=>a.start-b.start),ids=[...new Set(ws.flatMap(w=>w.ex.map(x=>x.id)))];const id=sel.pe&&ids.includes(sel.pe)?sel.pe:ids[0],m=sel.pm||'Gewicht';const mv={};ws.forEach(w=>w.ex.forEach(x=>x.sets.forEach(s=>{if(s.t=='Aufwärm')return;tops(s).forEach(t=>mv[EX(x.id).mu]=(mv[EX(x.id).mu]||0)+t.kg*t.reps)})));
 let pts=[];if(id)ws.forEach(w=>{const x=w.ex.find(y=>y.id==id);if(!x)return;let k=0,r=0,e=0,v=0;x.sets.forEach(s=>{if(s.t=='Aufwärm')return;v+=vol(s);tops(s).forEach(t=>{k=Math.max(k,t.kg);r=Math.max(r,t.reps);e=Math.max(e,e1(t.kg,t.reps))})});pts.push({d:w.start,y:{Gewicht:k,Wiederholungen:r,Volumen:v,'Geschätztes 1RM':e}[m]})});
 const mx=Math.max(1,...pts.map(q=>q.y)),sv=pts.length>1?`<svg viewBox="0 0 300 120" style="width:100%"><polyline fill="none" stroke="var(--a)" stroke-width="3" points="${pts.map((q,i)=>`${10+i*280/(pts.length-1)},${110-q.y/mx*100}`).join(' ')}"/></svg>`:'<span class="m">Mind. 2 Trainings nötig.</span>';
 return`<h2>Fortschritt</h2><div class="card"><div class="row"><select class="grow" onchange="A.q('pe',this.value)">${ids.map(i=>`<option value="${i}" ${i==id?'selected':''}>${EX(i).name}</option>`).join('')}</select><select onchange="A.q('pm',this.value)">${o(['Gewicht','Wiederholungen','Volumen','Geschätztes 1RM'],m)}</select></div>${sv}${m=='Geschätztes 1RM'?'<small>Schätzwert (Epley)</small>':''}</div><div class="card"><h3>Statistik</h3>${ws.length} Trainings · ${ws.reduce((a,w)=>a+w.ex.reduce((b,x)=>b+x.sets.length,0),0)} Sätze · Ø ${ws.length?Math.round(ws.reduce((a,w)=>a+(w.end-w.start)/6e4,0)/ws.length):0} min<br>Letzte 30 Tage: ${ws.filter(w=>Date.now()-w.start<30*864e5).length} Trainings</div><div class="card"><h3>Volumen pro Muskelgruppe (kg)</h3>${Object.entries(mv).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="row"><small style="width:90px">${k}</small><div style="height:10px;background:var(--a);border-radius:5px;width:${v/Math.max(...Object.values(mv))*55}%"></div><small>${Math.round(v)}</small></div>`).join('')||'<span class="m">Keine Daten</span>'}</div>`},
prof(){return`<h2>Profile</h2>${S.profiles.map(p=>`<div class="card row" onclick="A.sw('${p.id}')">${p.pic?`<img src="${p.pic}" width="48" height="48" style="border-radius:50%">`:'👤'}<div class="grow"><b>${p.name}</b>${p.id==S.cur?' <span class="pr">aktiv</span>':''}<br><small>${p.workouts.filter(w=>w.end).length} Trainings · ${p.system}</small></div></div>`).join('')}<button class="p" onclick="A.np()">+ Neues Profil</button><div class="card"><h3>Aktives Profil: ${P().name}</h3><textarea style="width:100%" placeholder="Trainingsziele" onchange="A.goal(this.value)">${P().goal||''}</textarea><div class="row" style="margin-top:8px"><button onclick="A.rn()">Umbenennen</button><label class="s" style="background:#26262b;padding:12px;border-radius:12px">Bild<input type="file" accept="image/*" hidden onchange="A.pic(this)"></label><button class="d" onclick="A.dp()">Löschen</button></div></div>`},
edit(){const p=P(),sn=sel.plan||p.last,pl=p.plans[sn],u=S.ui,h=S.ui.hide;S.pickMode='A.pa';S.back='edit';return`<h2>Editor</h2><div class="card"><h3>Trainingsplan</h3><div class="row chips">${Object.keys(p.plans).map(k=>`<button class="${k==sn?'on':''}" onclick="A.pl('${k}')">${k}</button>`).join('')}</div>${pl.map((it,i)=>`<div class="card" style="background:#26262b"><b>${EX(it.id).name}</b><div class="row" style="margin:6px 0"><button class="s" onclick="A.pm(${i},-1)">↑</button><button class="s" onclick="A.pm(${i},1)">↓</button><button class="s" onclick="A.px(${i})">Tauschen</button><button class="s" onclick="A.pc(${i})">Duplizieren</button><button class="s d" onclick="A.pd(${i})">✕</button></div><div class="g4">${F('Sätze',it.sets,`A.pf(${i},'sets',this.value)`)}${F('Wdh',it.rep,`A.pf(${i},'rep',this.value)`,'text')}${F('RIR',it.rir,`A.pf(${i},'rir',this.value)`)}${F('Pause',it.rest,`A.pf(${i},'rest',this.value)`)}</div><input style="margin-top:6px" placeholder="Notiz" value="${it.note}" onchange="A.pf(${i},'note',this.value)"></div>`).join('')}<button onclick="sel.rep=null;A.pick()">+ Übung hinzufügen</button></div>
 <div class="card"><h3>Einheiten</h3><div class="row"><button onclick="A.addS()">+ Neue Einheit</button>${(p.custom||{})[p.system]?.includes(sn)?`<button class="d" onclick="A.delS('${sn}')">„${sn}" löschen</button>`:''}</div></div>
 <div class="card"><h3>Design (gilt für alle Profile)</h3><div class="row chips">${['Gelb','Rot','Grün','Hell'].map((n,i)=>`<button onclick="A.preset(${i})">${n}</button>`).join('')}</div><div class="row" style="margin-top:10px">${[['a','Akzent'],['bg','Hintergrund'],['c','Karten'],['t','Text'],['m','Grau'],['b','Buttons']].map(([k,n])=>`<small>${n}</small><input type="color" value="${u[k]}" onchange="A.css('${k}',this.value)">`).join('')}</div><div class="row" style="margin-top:10px"><small>Rundung</small><input class="grow" type="range" min="0" max="28" value="${u.r}" oninput="A.num('r',this.value)"><small>Schrift</small><input class="grow" type="range" min="13" max="21" value="${u.fs}" oninput="A.num('fs',this.value)"></div><select style="margin-top:10px;width:100%" onchange="A.css('ff',this.value)">${[['system-ui,sans-serif','System'],['Georgia,serif','Serif'],['ui-monospace,monospace','Mono'],['ui-rounded,system-ui,sans-serif','Rund'],['Impact,Haettenschweiler,sans-serif','Kraftvoll']].map(([v,n])=>`<option value="${v}" ${u.ff==v?'selected':''}>${n}</option>`).join('')}</select></div>
 <div class="card"><h3>Dashboard: Reihenfolge & Sichtbarkeit</h3>${u.order.map((k,i)=>`<div class="row"><span class="grow">${{next:'Nächstes Training',last:'Letztes Training',freq:'Woche',pr:'Rekorde',links:'Schnellzugriffe'}[k]}</span><button class="s" onclick="A.ord(${i},-1)">↑</button><button class="s" onclick="A.ord(${i},1)">↓</button><button class="s ${h[k]?'':'p'}" onclick="A.vis('${k}')">${h[k]?'aus':'an'}</button></div>`).join('')}<h3 style="margin-top:12px">Überschriften</h3>${[['next','Nächstes Training'],['last','Letztes Training'],['freq','Woche'],['pr','Rekorde']].map(([k,n])=>`<input style="margin-bottom:8px" placeholder="${n}" value="${u.labels['h_'+k]||''}" onchange="A.lab('h_${k}',this.value)">`).join('')}</div>
 <div class="card"><h3>Navigation</h3>${N.map(([k,n])=>`<div class="row"><input class="grow" placeholder="${n}" value="${u.labels[k]||''}" onchange="A.lab('${k}',this.value)">${k=='edit'||k=='set'?'':`<button class="s ${u.navHide[k]?'':'p'}" onclick="A.nv('${k}')">${u.navHide[k]?'aus':'an'}</button>`}</div>`).join('')}<button style="margin-top:10px" onclick="A.reset()">Standarddesign</button></div>`},
set(){return`<h2>Backup & Einstellungen</h2><div class="card"><button class="p" onclick="A.exp()">Backup exportieren (JSON)</button><p><small>Import: vorher wird automatisch ein Sicherungspunkt angelegt.</small></p><label style="display:block;background:#26262b;padding:12px;border-radius:12px;text-align:center">Backup importieren<input type="file" accept=".json,application/json" hidden onchange="A.imp(this)"></label><button style="margin-top:8px" onclick="A.restore()">Sicherungspunkt wiederherstellen</button></div><div class="card"><button class="d" onclick="A.wipe()">Alle Daten löschen</button></div><small>logbook v1 · alle Daten nur lokal auf diesem Gerät.</small>`},
pick:pickV};
function theme(){const r=document.documentElement.style,u=S.ui;[['--a',u.a],['--bg',u.bg],['--c',u.c],['--t',u.t],['--m',u.m],['--b',u.b],['--r',u.r+'px']].forEach(([k,v])=>r.setProperty(k,v));r.fontSize=u.fs+'px';document.body.style.fontFamily=u.ff}
const defUI=()=>({a:'#ffd400',bg:'#0a0a0a',c:'#17171a',t:'#ffffff',m:'#8d8d94',b:'#26262b',r:16,fs:16,ff:'system-ui,sans-serif',hide:{},order:['next','last','freq','pr','links'],labels:{},navHide:{}});
function render(){const p=P();$('#who').innerHTML=(p.pic?`<img src="${p.pic}" width="20" height="20" style="border-radius:50%;vertical-align:middle"> `:'')+p.name;$('#nav').innerHTML=N.filter(([k])=>!S.ui.navHide[k]).map(([k,n])=>`<button class="${view==k||(view=='detail'&&k=='hist')?'on':''}" onclick="go('${k}')"><i>${ICON[k]}</i>${S.ui.labels[k]||n}${k=='train'&&p.active?' ●':''}</button>`).join('');
 if(view=='ex'||view=='pick'){S.pickMode=view=='ex'?'(()=>0)':S.pickMode}
 $('#app').innerHTML=view=='ex'?V.ex():V[view]();}
const init=()=>{const p=mkP('Athlet');return{v:1,profiles:[p],cur:p.id,ui:defUI()}};
(async()=>{S=await idb('get','state');if(!S){try{S=JSON.parse(localStorage.getItem('logbook_mirror'))}catch(e){}}if(!S||!S.profiles){S=init();save()}S.ui=Object.assign(defUI(),S.ui);theme();view=P().active?'train':'home';render();if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js')})();
addEventListener('beforeunload',save);
