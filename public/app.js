(async()=>{
const{initializeApp}=await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
const{getAuth,initializeAuth,indexedDBLocalPersistence,browserLocalPersistence,browserSessionPersistence,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail,signOut}=await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js');
const{initializeFirestore,getFirestore,persistentLocalCache,persistentMultipleTabManager,collection,doc,addDoc,setDoc,updateDoc,deleteDoc,getDocs,writeBatch,query,where}=await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');
const{firebaseConfig}=await import('./firebase-config.js');
window.__appStarted=true;const fapp=initializeApp(firebaseConfig);
const fa=(()=>{try{return initializeAuth(fapp,{persistence:[indexedDBLocalPersistence,browserLocalPersistence,browserSessionPersistence]})}catch(e){return getAuth(fapp)}})();
let db;try{db=initializeFirestore(fapp,{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})})}catch(e){db=getFirestore(fapp)}
const STD=[['Cash','Asset'],['Account Receivable','Asset'],['Office Supplies','Asset'],['Prepaid Insurance','Asset'],['Prepaid Rent','Asset'],['Equipment','Asset'],['Accumulated Depreciation - Equipment','Asset'],['Furniture','Asset'],['Vehicles','Asset'],['Accounts Payable','Liability'],['Unearned Revenue','Liability'],['Notes Payable','Liability'],['Salaries Payable','Liability'],["Owner's Capital",'Capital'],["Owner's Drawing",'Drawing'],['Service Revenue','Revenue'],['Advertising Expense','Expense'],['Utilities Expense','Expense'],['Salaries Expense','Expense'],['Maintenance Expense','Expense'],['Professional Fee Expense','Expense'],['Repairs Expense','Expense'],['Rent Expense','Expense'],['Interest Expense','Expense'],['Insurance Expense','Expense'],['Supplies Expense','Expense'],['Depreciation Expense','Expense']];
const SAMPLE=[['2026-10-01','Owner invested cash','Cash',"Owner's Capital",100000,0],['2026-10-02','Bought equipment','Equipment','Cash',15000,0],['2026-10-03','Bought furniture on account','Furniture','Accounts Payable',18000,0],['2026-10-04','Paid 3 months rent in advance','Prepaid Rent','Cash',3000,0],['2026-10-05','Paid 1 year insurance','Prepaid Insurance','Cash',2400,0],['2026-10-06','Bought office supplies','Office Supplies','Cash',2600,0],['2026-10-08','Borrowed from the bank','Cash','Notes Payable',20000,0],['2026-10-10','Service income in cash','Cash','Service Revenue',37800,0],['2026-10-12','Services on account','Account Receivable','Service Revenue',5400,0],['2026-10-13','Advance from client','Cash','Unearned Revenue',6000,0],['2026-10-15','Paid salaries','Salaries Expense','Cash',18800,0],['2026-10-16','Paid advertising','Advertising Expense','Cash',2300,0],['2026-10-17','Paid utilities','Utilities Expense','Cash',1250,0],['2026-10-18','Paid part of payable','Accounts Payable','Cash',8000,0],['2026-10-20','Paid repairs','Repairs Expense','Cash',500,0],['2026-10-25','Owner withdrew cash',"Owner's Drawing",'Cash',3500,0],['2026-10-31','Insurance expired','Insurance Expense','Prepaid Insurance',200,1],['2026-10-31','Supplies used','Supplies Expense','Office Supplies',1500,1],['2026-10-31','Rent expired','Rent Expense','Prepaid Rent',1000,1],['2026-10-31','Depreciation','Depreciation Expense','Accumulated Depreciation - Equipment',1600,1],['2026-10-31','Accrued salaries','Salaries Expense','Salaries Payable',400,1],['2026-10-31','Unearned revenue earned','Unearned Revenue','Service Revenue',1000,1]];
const ERR={'auth/invalid-credential':'Wrong username or password. New here? Press Create account.','auth/user-not-found':'No account with that name yet. Press Create account.','auth/wrong-password':'That password is not correct.','auth/email-already-in-use':'That username is taken. Try another one.','auth/weak-password':'Password needs at least 6 characters.','auth/invalid-email':'Please use a valid username or email.','auth/network-request-failed':'No internet connection.','auth/operation-not-allowed':'Turn on Email/Password in Firebase Authentication (see README).','permission-denied':'Permission denied. Deploy the Firestore rules (see README).'};
const nm=u=>u.email.endsWith('@accountingsystem.app')?u.email.split('@')[0]:u.email;
const toEmail=u=>u.includes('@')?u:u.toLowerCase()+'@accountingsystem.app';
const col=n=>collection(db,'users',fa.currentUser.uid,n),dref=(n,id)=>doc(db,'users',fa.currentUser.uid,n,id);
const need=()=>{if(!fa.currentUser)throw Error('Please log in first.')};
const ZERO={m0:0,m1:0,m2:0,m3:0};
async function wipe(){need();const[a,t]=await Promise.all([getDocs(col('accounts')),getDocs(col('transactions'))]);const bt=writeBatch(db);t.docs.forEach(d=>bt.delete(d.ref));a.docs.forEach(d=>bt.update(d.ref,ZERO));await bt.commit();return a.docs}
const A={
 async me(){await Promise.race([fa.authStateReady(),new Promise(r=>setTimeout(r,6000))]);return{user:fa.currentUser?nm(fa.currentUser):null}},
 async logout(){await signOut(fa);return{}},
 async register(b){const u=(b.username||'').trim();
  if(!u.includes('@')&&!/^[A-Za-z0-9_]{3,20}$/.test(u))throw Error('Username: 3-20 letters, numbers or _ (no spaces).');
  if((b.password||'').length<6)throw Error('Password needs at least 6 characters.');
  const c=await createUserWithEmailAndPassword(fa,toEmail(u),b.password);
  const bt=writeBatch(db);STD.forEach(([n,t],i)=>bt.set(doc(col('accounts')),{name:n,type:t,...ZERO,ord:i}));await bt.commit();return{user:nm(c.user)}},
 async reset(b){await sendPasswordResetEmail(fa,b.email);return{}},
 async login(b){const c=await signInWithEmailAndPassword(fa,toEmail((b.username||'').trim()),b.password||'');return{user:nm(c.user)}},
 async data(){need();const[a,t]=await Promise.all([getDocs(col('accounts')),getDocs(col('transactions'))]);
  return{accounts:a.docs.map(d=>({id:d.id,...d.data()})).sort((x,y)=>(x.ord||0)-(y.ord||0)),
   txns:t.docs.map(d=>({id:d.id,...d.data()})).sort((x,y)=>x.tdate<y.tdate?-1:x.tdate>y.tdate?1:(x.ts||0)-(y.ts||0))}},
 async'account.save'(b){need();const n=(b.name||'').trim().slice(0,80),t=b.type||'Asset';
  if(!n)throw Error('Account name cannot be empty.');
  if(!['Asset','Liability','Capital','Drawing','Revenue','Expense'].includes(t))throw Error('Unknown account type.');
  const all=await getDocs(col('accounts'));
  if(all.docs.some(d=>d.id!==b.id&&d.data().name===n))throw Error('You already have an account with that name.');
  let id=b.id;if(id)await updateDoc(dref('accounts',id),{name:n,type:t});else id=(await addDoc(col('accounts'),{name:n,type:t,...ZERO,ord:Date.now()})).id;return{id}},
 async'account.delete'(b){need();const[x,y]=await Promise.all([getDocs(query(col('transactions'),where('debit_id','==',b.id))),getDocs(query(col('transactions'),where('credit_id','==',b.id)))]);
  if(x.size||y.size)throw Error('This account has transactions. Delete or change those first.');
  await deleteDoc(dref('accounts',b.id));return{}},
 async'account.manual'(b){need();const k=+b.k;if(!(k>=0&&k<=3))throw Error('Bad column.');await updateDoc(dref('accounts',b.id),{['m'+k]:Math.round((+b.value||0)*100)/100});return{}},
 async'txn.save'(b){need();const d=b.tdate||'',am=Math.round((+b.amount||0)*100)/100;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(d))throw Error('The date must look like 2026-10-23.');
  if(!b.debit_id||!b.credit_id||b.debit_id===b.credit_id)throw Error('The debit and credit accounts must be different.');
  if(!(am>0))throw Error('The amount must be more than zero.');
  const data={tdate:d,description:((b.description||'').trim()||'Transaction').slice(0,200),debit_id:b.debit_id,credit_id:b.credit_id,amount:am,adjusting:b.adjusting?1:0};
  if(b.id)await updateDoc(dref('transactions',b.id),data);else await addDoc(col('transactions'),{...data,ts:Date.now()});return{}},
 async'txn.delete'(b){need();await deleteDoc(dref('transactions',b.id));return{}},
 async clear(){await wipe();return{}},
 async sample(){const a=await wipe(),ids={};a.forEach(d=>ids[d.data().name]=d.id);const bt=writeBatch(db);
  SAMPLE.forEach(([d,s,dr,cr,am,aj],i)=>{if(ids[dr]&&ids[cr])bt.set(doc(col('transactions')),{tdate:d,description:s,debit_id:ids[dr],credit_id:ids[cr],amount:am,adjusting:aj,ts:Date.now()+i})});
  await bt.commit();return{}}
};
async function api(a,b){try{if(!A[a])throw Error('Unknown action');return await A[a](b||{})}catch(e){const m=ERR[e.code]||e.message||'Something went wrong';toast(m,1);throw Error(m)}}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const num=v=>parseFloat(String(v).replace(/,/g,''))||0,eq=(a,b)=>Math.abs(a-b)<.005;
const fmt=n=>Math.abs(n)<.005?'':n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const f2=n=>Math.abs(n)<.005?'0.00':n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const m2=n=>n<-.004?'('+f2(-n)+')':f2(n);
const cmp=v=>v>=1e6?+(v/1e6).toFixed(1)+'M':v>=1e3?+(v/1e3).toFixed(1)+'k':String(Math.round(v));
const ymd=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const longD=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})};
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const SV='xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"';
const IC={trash:`<svg ${SV}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>`};
const LB=['Unadjusted Debit','Unadjusted Credit','Adjustments Debit','Adjustments Credit','Adjusted Debit','Adjusted Credit','Income Stmt Debit','Income Stmt Credit','Balance Sheet Debit','Balance Sheet Credit'];
const TY=['Asset','Liability','Capital','Drawing','Revenue','Expense'],G=['Unadjusted trial balance','Adjustments','Adjusted trial balance','Income statement','Balance sheet'];
const TN={d:'Dashboard',j:'Journal',l:'General-Ledger',w:'Worksheet',s:'Financial-Statements',c:'Chart-of-Accounts'};
const QS=[["Owner invests cash","Cash","Owner's Capital","Owner invested cash",0],["Earned income - paid in cash","Cash","Service Revenue","Service income received",0],
["Earned income - customer pays later","Account Receivable","Service Revenue","Service on account",0],["Customer paid what they owed","Cash","Account Receivable","Collected from customer",0],
["Bought equipment with cash","Equipment","Cash","Bought equipment",0],["Paid salaries","Salaries Expense","Cash","Paid salaries",0],["Paid rent","Rent Expense","Cash","Paid rent",0],
["Owner took money out","Owner's Drawing","Cash","Owner withdrew cash",0],["ADJUSTING: supplies used up","Supplies Expense","Office Supplies","Supplies used",1],
["ADJUSTING: equipment lost value","Depreciation Expense","Accumulated Depreciation - Equipment","Depreciation",1]];
let S={accounts:[],txns:[],raw:{a:{},t:{}},by:{}},USER='';
const tag=t=>`<span class="tg tg-${t}">${t}</span>`,jtag=adj=>`<span class="tg tg-${adj?'Adj':'Reg'}">${adj?'Adjusting':'Regular'}</span>`;

/* ---------- toast + undo ---------- */
function toast(m,bad,undoable){const t=$('#toast');t.textContent=m;t.className=bad?'bad show':'show';
 if(undoable){const b=document.createElement('button');b.type='button';b.className='tundo';b.textContent='Undo';b.onclick=()=>{t.className='';undo()};t.appendChild(b)}
 clearTimeout(t.h);t.h=setTimeout(()=>t.className='',undoable?7000:3500)}
const U=[];
const snap=()=>JSON.parse(JSON.stringify(S.raw));
const same=(a,b)=>{if(!a||!b)return false;const k=new Set([...Object.keys(a),...Object.keys(b)]);for(const x of k)if(a[x]!==b[x])return false;return true};
async function restore(s){need();const cur=S.raw,ops=[];
 for(const[k,n]of[['t','transactions'],['a','accounts']]){
  for(const id in cur[k])if(!s[k][id])ops.push(b=>b.delete(dref(n,id)));
  for(const id in s[k])if(!same(cur[k][id],s[k][id]))ops.push(b=>b.set(dref(n,id),s[k][id]))}
 for(let i=0;i<ops.length;i+=400){const b=writeBatch(db);ops.slice(i,i+400).forEach(f=>f(b));await b.commit()}}
function updUndo(){const b=$('#bundo');b.disabled=!U.length;b.title=U.length?'Undo: '+U[U.length-1].label+' (Ctrl+Z)':'Nothing to undo'}
async function undo(){const u=U.pop();updUndo();if(!u)return toast('Nothing to undo yet.');
 try{await restore(u.s);await load();toast('Undone: '+u.label)}catch(e){toast('Could not undo: '+(e.message||e),1)}}
/* run a change; remember the books as they were so Undo can bring them back */
async function mut(label,fn,msg){const s=snap();let r;try{r=await fn()}catch(e){await load().catch(()=>{});return false}
 if(r!==false){U.push({label,s});if(U.length>30)U.shift()}await load();updUndo();if(msg)toast(msg,0,r!==false);return true}

/* ---------- data ---------- */
async function load(){const d=await api('data');
 S.accounts=d.accounts.map(a=>({id:a.id,name:a.name,type:a.type,m:[+a.m0,+a.m1,+a.m2,+a.m3]}));
 S.txns=d.txns.map(t=>({id:t.id,date:t.tdate,desc:t.description,dr:t.debit_id,cr:t.credit_id,amt:+t.amount,adj:+t.adjusting}));
 S.raw={a:{},t:{}};d.accounts.forEach(a=>{const{id,...r}=a;S.raw.a[id]=r});d.txns.forEach(t=>{const{id,...r}=t;S.raw.t[id]=r});render()}
function calc(){const by={};S.accounts.forEach(a=>{a.jr=[0,0,0,0];by[a.id]=a;a.n=0});S.by=by;
 S.txns.forEach(t=>{const d=by[t.dr],c=by[t.cr];if(d){d.jr[t.adj?2:0]+=t.amt;d.n++}if(c){c.jr[t.adj?3:1]+=t.amt;c.n++}});
 const tot=Array(10).fill(0);
 S.accounts.forEach(a=>{a.in=a.m.map((m,k)=>m+a.jr[k]);const n=a.in[0]-a.in[1]+a.in[2]-a.in[3],dr=Math.max(n,0),cr=Math.max(-n,0),pl=a.type=='Revenue'||a.type=='Expense';a.net=n;
  a.out=[dr,cr,pl?dr:0,pl?cr:0,pl?0:dr,pl?0:cr];[...a.in,...a.out].forEach((v,i)=>tot[i]+=v)});
 const ni=tot[7]-tot[6];return{tot,ni,fin:[tot[6]+(ni>0?ni:0),tot[7]+(ni<0?-ni:0),tot[8]+(ni<0?-ni:0),tot[9]+(ni>0?ni:0)]}}
const opts=sel=>S.accounts.map(a=>`<option value="${a.id}"${a.id==sel?' selected="selected"':''}>${esc(a.name)}</option>`).join('');
function count(el,to){const from=+el.dataset.v||0;el.dataset.v=to;const t0=performance.now(),f=t=>{const p=matchMedia('(prefers-reduced-motion:reduce)').matches?1:Math.min(1,(t-t0)/600);
 el.textContent=(from+(to-from)*(1-Math.pow(1-p,3))).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function render(){const R=calc();dash(R);journal();ledger();sheet(R);stmt(R);accts()}
let INIT=0,LID='';const nmOf=id=>(S.accounts.find(a=>a.id==id)||{}).name||'?',tyOf=id=>(S.by[id]||{}).type||'Asset';
const guess=n=>/expense/i.test(n)?'Expense':/revenue|income|sales|fee/i.test(n)?'Revenue':/payable|unearned|loan|mortgage/i.test(n)?'Liability':/capital/i.test(n)?'Capital':/drawing|withdraw/i.test(n)?'Drawing':'Asset';
async function accId(name){name=(name||'').trim();if(!name)return'';const f=()=>S.accounts.find(a=>a.name.toLowerCase()==name.toLowerCase());const a=f();if(a)return a.id;const r=await api('account.save',{name,type:guess(name)});await load();toast('New account created: '+name+' ('+guess(name)+'). You can change its type in Chart of Accounts.');return r.id}
const balState=R=>{const{tot,fin}=R,ok=[eq(tot[0],tot[1]),eq(tot[2],tot[3]),eq(tot[4],tot[5]),eq(fin[0],fin[1]),eq(fin[2],fin[3])];return{bad:ok.indexOf(false),empty:!(tot[0]||tot[1]||tot[2]||tot[3])}};

/* ---------- Dashboard ---------- */
function monthly(){const m={};
 S.txns.forEach(t=>{const k=t.date.slice(0,7),o=m[k]||(m[k]={i:0,e:0}),d=tyOf(t.dr),c=tyOf(t.cr);
  if(c=='Revenue')o.i+=t.amt;if(d=='Revenue')o.i-=t.amt;if(d=='Expense')o.e+=t.amt;if(c=='Expense')o.e-=t.amt});
 return Object.keys(m).sort().slice(-6).map(k=>({k,i:Math.max(0,m[k].i),e:Math.max(0,m[k].e)}))}
const nice=v=>{const p=Math.pow(10,Math.floor(Math.log10(v))),n=v/p;return(n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p};
const rb=(x,y,w,h)=>{if(h<=0)return'';const r=Math.min(4,w/2,h);return`M${x},${y+h}V${y+r}Q${x},${y} ${x+r},${y}H${x+w-r}Q${x+w},${y} ${x+w},${y+r}V${y+h}Z`};
function bars(){const d=monthly(),el=$('#cbar'),hd=`<div class="chh"><div><h3>Income vs expenses by month</h3><p class="hint">Revenue earned and expenses incurred, from your journal</p></div><div class="lg"><span><i class="bi"/>Income</span><span><i class="be"/>Expenses</span></div></div>`;
 if(!d.length){el.innerHTML=hd+'<p class="empty">No transactions yet.<br/>Post one in the Journal and the chart appears here.</p>';return}
 const W=560,H=250,L=48,B=30,T=14,Rg=8,pw=W-L-Rg,ph=H-T-B,mx=nice(Math.max(1,...d.flatMap(x=>[x.i,x.e]))),y=v=>T+ph-v/mx*ph,gw=pw/d.length,bw=Math.min(30,gw/3);
 let s=`<svg xmlns="http://www.w3.org/2000/svg" class="bars" viewBox="0 0 ${W} ${H}" role="img" aria-label="Income and expenses by month">`;
 for(let k=0;k<=4;k++){const v=mx*k/4;s+=`<line x1="${L}" x2="${W-Rg}" y1="${y(v)}" y2="${y(v)}" class="gl"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end">${cmp(v)}</text>`}
 d.forEach((x,i)=>{const cx=L+gw*(i+.5),mi=+x.k.slice(5)-1,lab=MN[mi]+' '+x.k.slice(0,4),tip=`${lab}: income ${f2(x.i)}, expenses ${f2(x.e)}`;
  s+=`<g><title>${tip}</title><rect x="${cx-gw/2}" y="${T}" width="${gw}" height="${ph}" fill="transparent"/><path class="bi" d="${rb(cx-bw-1,y(x.i),bw,ph+T-y(x.i)+0)}"/><path class="be" d="${rb(cx+1,y(x.e),bw,ph+T-y(x.e))}"/><text x="${cx}" y="${H-8}" text-anchor="middle">${lab}</text></g>`});
 el.innerHTML=hd+s+'</svg>'}
const DC=['#6c63ff','#2ba8d8','#2dbe8c','#f59e0b','#ff6b9d','#9a98b8'];
function donut(){const el=$('#cdon'),hd='<div class="chh"><div><h3>Where the money goes</h3><p class="hint">Expenses by account</p></div></div>';
 let ex=S.accounts.filter(a=>a.type=='Expense').map(a=>({n:a.name,v:a.out[2]-a.out[3]})).filter(x=>x.v>.005).sort((a,b)=>b.v-a.v);
 if(!ex.length){el.innerHTML=hd+'<p class="empty">No expenses yet.</p>';return}
 const top=ex.slice(0,5),rest=ex.slice(5).reduce((s,x)=>s+x.v,0);if(rest>.005)top.push({n:'Other',v:rest});
 const tot=top.reduce((s,x)=>s+x.v,0),r=64,C=2*Math.PI*r;let off=0,s=`<svg xmlns="http://www.w3.org/2000/svg" class="donut" viewBox="0 0 180 180" role="img" aria-label="Expenses by account">`;
 top.forEach((x,i)=>{const len=Math.max(.5,x.v/tot*C-(top.length>1?3:0));s+=`<circle cx="90" cy="90" r="${r}" fill="none" stroke="${DC[i]}" stroke-width="24" stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-off}" transform="rotate(-90 90 90)"><title>${esc(x.n)}: ${f2(x.v)} (${Math.round(x.v/tot*100)}%)</title></circle>`;off+=x.v/tot*C});
 s+=`<text x="90" y="88" text-anchor="middle" class="dv">${cmp(tot)}</text><text x="90" y="106" text-anchor="middle" class="dl">total expenses</text></svg>`;
 el.innerHTML=hd+`<div class="don">${s}<ul class="dlg">${top.map((x,i)=>`<li><i style="background:${DC[i]}"/><span>${esc(x.n)}</span><b>${f2(x.v)}</b><small>${Math.round(x.v/tot*100)}%</small></li>`).join('')}</ul></div>`}
function dash(R){const{tot,ni}=R,{bad,empty}=balState(R);
 count($('#si'),tot[7]);count($('#se'),tot[6]);count($('#sn'),ni);$('#sl').textContent=ni>=0?'Net income':'Net loss';
 $('#sb').className='card stat a3 '+(empty?'empty':bad<0?'ok':'bad');$('#sbt').textContent=empty?'No data yet':bad<0?'Balanced':'Not balanced';
 $('#sc').textContent=empty?'Add a transaction to begin':bad<0?'Debits equal credits':'Check: '+G[bad];
 bars();donut();
 const rc=S.txns.slice(-5).reverse();
 $('#rb').innerHTML=rc.map(t=>`<tr><td data-l="Date">${t.date}</td><td data-l="Description">${esc(t.desc)}</td><td data-l="Debit">${esc(nmOf(t.dr))}</td><td data-l="Credit">${esc(nmOf(t.cr))}</td><td class="r" data-l="Amount">${fmt(t.amt)}</td><td data-l="Type">${jtag(t.adj)}</td></tr>`).join('')
 ||'<tr><td colspan="6" class="empty"><b>No transactions yet</b><br/>Press + New transaction in the Journal to start.</td></tr>';
 const ba=$('#wst');ba.className='pill '+(empty?'':bad<0?'':'bad');ba.textContent=empty?'Add a transaction to begin':bad<0?'Books balanced':'Check: '+G[bad]}

/* ---------- Journal ---------- */
function fil(){const q=$('#jq').value.trim().toLowerCase(),f=$('#jf1').value,t=$('#jf2').value,k=$('#jty').value;
 return S.txns.filter(x=>(!f||x.date>=f)&&(!t||x.date<=t)&&(k===''||String(x.adj)===k)&&(!q||[x.date,x.desc,nmOf(x.dr),nmOf(x.cr),fmt(x.amt),String(x.amt)].join(' ').toLowerCase().includes(q)))}
function journal(){$('#accs').innerHTML=S.accounts.map(a=>`<option value="${esc(a.name)}"/>`).join('');if(!INIT&&S.accounts.length){INIT=1;$('#fr').value=(S.accounts.find(a=>a.name=='Cash')||S.accounts[0]).name}
 const nm=id=>esc(nmOf(id)),E=(f,h,tip)=>`<span class="e" data-f="${f}" title="${tip||'Double-click (or tap) to edit'}">${h}</span>`,L=fil(),act=!!($('#jq').value||$('#jf1').value||$('#jf2').value||$('#jty').value);
 $('#jclr').hidden=!act;
 $('#jb').innerHTML=L.map(t=>`<tr data-id="${t.id}"><td class="ctr dte">${E('d',t.date)}</td><td class="par"><div class="ln dr">${E('dr',nm(t.dr))} ${tag(tyOf(t.dr))}</div><div class="ln cr">${E('cr',nm(t.cr))} ${tag(tyOf(t.cr))}</div><div class="ln ds">${E('s','('+esc(t.desc)+')')}</div></td><td class="dbt"><div class="ln am">${E('a',fmt(t.amt))}</div></td><td class="crd"><div class="ln"></div><div class="ln am">${E('a',fmt(t.amt))}</div></td><td class="ctr typ">${E('j',jtag(t.adj))}</td><td class="ctr noprint"><button class="ib x" title="Delete this transaction" aria-label="Delete this transaction">${IC.trash}</button></td></tr>`).join('')
 ||(act?'<tr><td colspan="6" class="empty"><b>No transactions match your filters</b><br/>Try a different word or clear the filters.</td></tr>':'<tr><td colspan="6" class="empty"><b>No transactions yet</b><br/>Press + New transaction above, then fill in the form.</td></tr>');
 const dt=L.reduce((a,t)=>a+t.amt,0);$('#jn').textContent=act?`Showing ${L.length} of ${S.txns.length}`:'Transactions: '+S.txns.length;$('#jd').textContent='Total Debit: '+(fmt(dt)||'0.00');$('#jc').textContent='Total Credit: '+(fmt(dt)||'0.00')}

/* ---------- Ledger ---------- */
const lines=id=>{let bal=0,dt=0,ct=0;const ls=S.txns.filter(t=>t.dr==id||t.cr==id).map(t=>{const d=t.dr==id;bal+=d?t.amt:-t.amt;d?dt+=t.amt:ct+=t.amt;return{...t,d,bal}});return{ls,bal}};
const tcard=(a,ls,bal)=>{const side=d=>ls.filter(l=>l.d==d).map(l=>`<p><span>${l.date.slice(5)}</span><span>${fmt(l.amt)}</span></p>`).join('');
 return`<h3 style="margin:0 0 4px;text-align:center">${esc(a.name)}</h3><p class="hint" style="text-align:center;margin-bottom:10px">${tag(a.type)} account</p><div class="t"><div><b>Debit</b>${side(true)}</div><div><b>Credit</b>${side(false)}</div></div><p class="bal ${bal>=0?'pos':'neg'}">Ending balance ${fmt(Math.abs(bal))||'0.00'} ${bal>=0?'Dr':'Cr'}</p>`};
function ledger(){const inp=$('#la'),a=S.accounts.find(x=>x.id==LID)||S.accounts[0];
 $('#lall').innerHTML=S.accounts.map(x=>{const l=lines(x.id);return l.ls.length?`<div class="card tc">${tcard(x,l.ls,l.bal)}</div>`:''}).join('');
 if(!a){$('#lb').innerHTML='';$('#tacc').innerHTML='';return}LID=a.id;const id=a.id;if(document.activeElement!==inp)inp.value=a.name;
 const{ls,bal}=lines(id);
 $('#lb').innerHTML=ls.map(l=>`<tr data-id="${l.id}"><td data-l="Date"><input type="date" class="d" value="${l.date}"/></td><td data-l="Description"><input class="s" value="${esc(l.desc)}"/></td><td data-l="Debit"><input class="ld r" value="${l.d?fmt(l.amt):''}"/></td><td data-l="Credit"><input class="lc r" value="${l.d?'':fmt(l.amt)}"/></td><td class="r" data-l="Balance">${fmt(Math.abs(l.bal))||'0.00'} ${l.bal>=0?'Dr':'Cr'}</td></tr>`).join('')
 ||'<tr><td colspan="5" class="empty"><b>No entries for this account yet</b><br/>Post a transaction in the Journal and it will show up here.</td></tr>';
 $('#tacc').innerHTML=tcard(a,ls,bal)}

/* ---------- Worksheet ---------- */
function sheet(R){const{tot,ni,fin}=R,f=(v,o=0)=>v.map((x,i)=>`<td class="r${(i+o)%2?' gb':''}" data-l="${LB[i+o]}">${fmt(x)}</td>`).join('');
 $('#wh').innerHTML=`<tr><th rowspan="2">Account</th><th rowspan="2" class="gb">Type</th>${G.map((g,i)=>`<th colspan="2" class="g${i} gb">${g}</th>`).join('')}<th rowspan="2" class="noprint"></th></tr><tr>${G.map((g,i)=>`<th class="g${i}">Debit</th><th class="g${i} gb">Credit</th>`).join('')}</tr>`;
 $('#wbd').innerHTML=S.accounts.map(a=>`<tr data-id="${a.id}"><td data-l="Account"><input class="wn" value="${esc(a.name)}"/></td><td data-l="Type" class="gb"><select class="wt">${TY.map(t=>`<option${t==a.type?' selected="selected"':''}>${t}</option>`).join('')}</select></td>${a.in.map((v,k)=>`<td data-l="${LB[k]}"${k%2?' class="gb"':''}><input class="wc r" data-k="${k}" value="${fmt(v)}"/></td>`).join('')}${a.out.map((v,i)=>`<td class="r c${2+(i>>1)}${i%2?' gb':''}" data-l="${LB[4+i]}">${fmt(v)}</td>`).join('')}<td class="noprint"><button class="x" title="Delete account">&#10005;</button></td></tr>`).join('');
 $('#wf').innerHTML=`<tr><th colspan="2" class="gb">Totals</th>${f(tot)}<td class="noprint"></td></tr><tr><th colspan="2" class="gb ${ni>=0?'pos':'neg'}">${ni>=0?'Net income':'Net loss'}</th><td colspan="6" class="gb"></td>${f([ni>0?ni:0,ni<0?-ni:0,ni<0?-ni:0,ni>0?ni:0],6)}<td class="noprint"></td></tr><tr><th colspan="2" class="gb">Totals</th><td colspan="6" class="gb"></td>${f(fin,6)}<td class="noprint"></td></tr>`}

/* ---------- Financial statements ---------- */
function stData(){const A_=S.accounts,pick=(ty,fn)=>A_.filter(a=>a.type==ty).map(a=>[a.name,fn(a)]).filter(x=>!eq(x[1],0)),sum=l=>l.reduce((s,x)=>s+x[1],0);
 const rev=pick('Revenue',a=>a.out[3]-a.out[2]),exp=pick('Expense',a=>a.out[2]-a.out[3]),tr=sum(rev),te=sum(exp),ni=tr-te;
 const as=pick('Asset',a=>a.out[4]-a.out[5]),li=pick('Liability',a=>a.out[5]-a.out[4]),cap=pick('Capital',a=>a.out[5]-a.out[4]),dw=pick('Drawing',a=>a.out[4]-a.out[5]);
 const tA=sum(as),tL=sum(li),tE=sum(cap)+ni-sum(dw),ds=S.txns.map(t=>t.date).sort(),i=l=>l.map(x=>({k:'i',l:x[0],v:x[1]}));
 const inc=[{k:'h',l:'Revenue'},...i(rev),{k:'t',l:'Total revenue',v:tr},{k:'h',l:'Expenses'},...i(exp),{k:'t',l:'Total expenses',v:te},{k:'g',l:ni>=0?'Net income':'Net loss',v:ni}];
 const bs=[{k:'h',l:'Assets'},...i(as),{k:'t',l:'Total assets',v:tA},{k:'h',l:'Liabilities'},...i(li),{k:'t',l:'Total liabilities',v:tL},{k:'h',l:"Owner's equity"},...i(cap),{k:'i',l:ni>=0?'Add: Net income':'Less: Net loss',v:ni},...dw.map(x=>({k:'i',l:'Less: '+x[0],v:-x[1]})),{k:'t',l:"Total owner's equity",v:tE},{k:'g',l:"Total liabilities and owner's equity",v:tL+tE}];
 return{inc,bs,tA,tLE:tL+tE,from:ds[0],to:ds[ds.length-1],empty:!rev.length&&!exp.length&&!as.length&&!li.length&&!cap.length}}
function stmt(){const d=stData(),rows=r=>r.map(x=>x.k=='h'?`<div class="sr h"><span>${esc(x.l)}</span></div>`:`<div class="sr ${x.k=='t'?'tt':x.k=='g'?'gt':'i'}"><span>${esc(x.l)}</span><span>${m2(x.v)}</span></div>`).join('');
 if(d.empty){$('#inc').innerHTML=$('#bsh').innerHTML='<p class="empty"><b>Nothing to show yet</b><br/>Post some transactions and the statements are built for you.</p>';return}
 const okb=eq(d.tA,d.tLE);
 $('#inc').innerHTML=`<h3>Income Statement</h3><p class="sub">For the period ${d.from===d.to?'of '+longD(d.to):longD(d.from)+' to '+longD(d.to)}</p>${rows(d.inc)}`;
 $('#bsh').innerHTML=`<h3>Balance Sheet</h3><p class="sub">As of ${longD(d.to)}</p>${rows(d.bs)}<p class="pill ${okb?'':'bad'}" style="margin-top:14px">${okb?'Assets equal liabilities + equity':'Out of balance by '+f2(Math.abs(d.tA-d.tLE))}</p>`}

/* ---------- Chart of accounts ---------- */
function accts(){const q=($('#cq').value||'').trim().toLowerCase(),L=S.accounts.filter(a=>!q||a.name.toLowerCase().includes(q)||a.type.toLowerCase().includes(q));
 $('#cn_count').textContent=S.accounts.length+' accounts'+(q?' ('+L.length+' shown)':'');
 $('#cb').innerHTML=L.map(a=>`<tr data-id="${a.id}"><td data-l="Account"><input class="cn" value="${esc(a.name)}"/></td><td data-l="Type"><span class="tsel">${tag(a.type)}<select class="ctp">${TY.map(t=>`<option${t==a.type?' selected="selected"':''}>${t}</option>`).join('')}</select></span></td><td class="r" data-l="Entries">${a.n}</td><td class="r" data-l="Balance">${a.n||a.net?f2(Math.abs(a.net))+' '+(a.net>=0?'Dr':'Cr'):'0.00'}</td><td class="noprint"><button class="ib x" title="${a.n?'Has '+a.n+' entries - delete or change those first':'Delete this account'}" aria-label="Delete account"${a.n?' disabled="disabled"':''}>${IC.trash}</button></td></tr>`).join('')
 ||'<tr><td colspan="5" class="empty">No accounts match.</td></tr>'}

/* ---------- editing ---------- */
const row=(tr,c)=>tr.querySelector('.'+c);
const editCell=e=>{const sp=e.target.closest('.e');if(!sp||sp.querySelector('input,select'))return;const tr=sp.closest('tr'),t=S.txns.find(x=>x.id==tr.dataset.id),f=sp.dataset.f;
 const h={d:`<input type="date" value="${t.date}"/>`,s:`<input value="${esc(t.desc)}"/>`,a:`<input class="r" value="${t.amt}"/>`,dr:`<input list="accs" value="${esc(nmOf(t.dr))}"/>`,cr:`<input list="accs" value="${esc(nmOf(t.cr))}"/>`,j:`<select><option value="0">Regular</option><option value="1"${t.adj?' selected="selected"':''}>Adjusting</option></select>`}[f];
 if(!h)return;sp.innerHTML=h;const i=sp.firstChild;i.focus();let done=0;
 const fin=async ok=>{if(done)return;done=1;if(!ok)return render();const v=i.value;
  await mut('Edit transaction',async()=>{const b={id:t.id,tdate:t.date,description:t.desc,debit_id:t.dr,credit_id:t.cr,amount:t.amt,adjusting:t.adj};
   if(f=='d')b.tdate=v;else if(f=='s')b.description=v;else if(f=='a')b.amount=num(v);else if(f=='j')b.adjusting=+v;
   else{const id=await accId(v);if(!id)return false;if(f=='dr')b.debit_id=id;else b.credit_id=id}
   if(b.tdate==t.date&&b.description==t.desc&&b.debit_id==t.dr&&b.credit_id==t.cr&&b.amount==t.amt&&b.adjusting==t.adj)return false;
   await api('txn.save',b)})};
 i.onchange=()=>fin(1);i.onblur=()=>fin(1);i.onkeydown=ev=>{if(ev.key=='Enter')fin(1);if(ev.key=='Escape')fin(0)}};
$('#jb').ondblclick=editCell;
$('#jb').onclick=async e=>{if(matchMedia('(pointer:coarse)').matches&&e.target.closest('.e'))return editCell(e);const x=e.target.closest('.x');if(!x)return;
 await mut('Delete transaction',()=>api('txn.delete',{id:x.closest('tr').dataset.id}),'Transaction deleted.')};
$('#lb').onchange=e=>{const tr=e.target.closest('tr'),t=S.txns.find(x=>x.id==tr.dataset.id),id=LID,c=e.target.className.split(' ')[0];
 const b={id:t.id,tdate:t.date,description:t.desc,debit_id:t.dr,credit_id:t.cr,amount:t.amt,adjusting:t.adj};
 if(c=='d')b.tdate=e.target.value;else if(c=='s')b.description=e.target.value;else{const v=num(e.target.value);if(v<=0)return load();b.amount=v;if((t.dr==id)!=(c=='ld'))[b.debit_id,b.credit_id]=[t.cr,t.dr]}
 mut('Edit entry',()=>api('txn.save',b))};
const pickAcc=()=>{const a=S.accounts.find(x=>x.name.toLowerCase()==$('#la').value.trim().toLowerCase());if(a&&a.id!=LID){LID=a.id;ledger()}};
$('#la').oninput=pickAcc;$('#la').onchange=()=>{pickAcc();const c=S.accounts.find(x=>x.id==LID);if(c)$('#la').value=c.name};
['#la','#fr','#fc'].forEach(q=>{const el=$(q);el.onfocus=()=>{el.dataset.old=el.value;el.value=''};el.addEventListener('blur',()=>{if(!el.value.trim())el.value=el.dataset.old||''})});
$('#wbd').onchange=async e=>{const tr=e.target.closest('tr'),a=S.accounts.find(x=>x.id==tr.dataset.id),c=e.target.className.split(' ')[0];
 await mut('Edit worksheet',async()=>{if(c=='wc'){const k=+e.target.dataset.k;await api('account.manual',{id:a.id,k,value:Math.round((num(e.target.value)-a.jr[k])*100)/100})}
 else await api('account.save',{id:a.id,name:row(tr,'wn').value,type:row(tr,'wt').value})})};
const delAcc=async e=>{const x=e.target.closest('.x');if(!x||x.disabled)return;const id=x.closest('tr').dataset.id,n=nmOf(id);await mut('Delete account',()=>api('account.delete',{id}),'Account deleted: '+n)};
$('#wbd').onclick=delAcc;$('#cb').onclick=delAcc;
$('#wadd').onclick=()=>mut('Add account',()=>api('account.save',{name:'New account '+(S.accounts.length+1),type:'Asset'}));
$('#wsam').onclick=()=>{if(confirm('Replace your transactions with the sample books? (You can press Undo afterwards.)'))mut('Load sample',()=>api('sample',{}),'Sample books loaded.')};
$('#wclr').onclick=()=>{if(confirm('Delete ALL transactions and typed numbers? Account names stay. (You can press Undo afterwards.)'))mut('Clear all numbers',()=>api('clear',{}),'All numbers cleared.')};
$('#cb').onchange=e=>{const tr=e.target.closest('tr');mut('Edit account',()=>api('account.save',{id:tr.dataset.id,name:row(tr,'cn').value,type:row(tr,'ctp').value}))};
$('#cq').addEventListener('input',accts);
const addAcc=async()=>{const n=$('#cn').value.trim();if(!n)return toast('Type a name for the new account first.',1);
 if(await mut('Add account',()=>api('account.save',{name:n,type:$('#ct').value}),'Account added: '+n))$('#cn').value=''};
$('#cadd').onclick=addAcc;$('#cn').onkeydown=e=>{if(e.key=='Enter')addAcc()};

/* ---------- filters + new-transaction dialog ---------- */
['#jq','#jf1','#jf2','#jty'].forEach(q=>$(q).addEventListener('input',journal));
$('#jclr').onclick=()=>{['#jq','#jf1','#jf2','#jty'].forEach(q=>$(q).value='');journal()};
$('#qlist').innerHTML=QS.map(q=>`<option value="${esc(q[0])}"/>`).join('');
$('#quick').onchange=e=>{const q=QS.find(x=>x[0].toLowerCase()==e.target.value.trim().toLowerCase());if(!q)return;
 $('#fr').value=q[1];$('#fc').value=q[2];$('#fs').value=q[3];$('#fj').checked=!!q[4];e.target.value='';$('#fa').focus()};
$('#jnew').onclick=()=>{$('#fd').value=ymd();$('#nt').showModal();$('#fs').focus()};
$('#ncancel').onclick=()=>$('#nt').close();
async function post(more){let ok;
 try{const d=await accId($('#fr').value),c=await accId($('#fc').value);if(!d||!c)return toast('Type or choose both a debit account and a credit account.',1);
  ok=await mut('Post transaction',()=>api('txn.save',{tdate:$('#fd').value,description:$('#fs').value,debit_id:d,credit_id:c,amount:num($('#fa').value),adjusting:$('#fj').checked?1:0}),'Posted! See it in the ledger and worksheet.')}catch(e){return}
 if(!ok)return;$('#fs').value='';$('#fa').value='';if(more)$('#fs').focus();else $('#nt').close()}
$('#post').onclick=()=>post(0);$('#post2').onclick=()=>post(1);
$('#fa').onkeydown=e=>{if(e.key=='Enter')post(0)};

/* ---------- navigation, theme, colors ---------- */
const go=t=>{const b=document.querySelector('nav button[data-t="'+t+'"]');if(b)b.click()};
$$('nav button').forEach(b=>b.onclick=()=>{$$('nav button,main>section').forEach(x=>x.classList.remove('on'));b.classList.add('on');$('#'+b.dataset.t).classList.add('on');store.set('tab',b.dataset.t);scrollTo(0,0)});
$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
$('#bguide').onclick=()=>$('#guide').showModal();
const setDark=d=>{document.body.classList.toggle('dark',d);$$('.themesw').forEach(b=>b.setAttribute('aria-checked',d?'true':'false'));store.set('dark',d?1:0)};
$$('.themesw').forEach(b=>b.onclick=()=>setDark(!document.body.classList.contains('dark')));
const setAcc=a=>{if(!['purple','blue','green'].includes(a))a='purple';document.body.dataset.acc=a;$$('.sat').forEach(s=>s.setAttribute('aria-pressed',s.dataset.a==a?'true':'false'));store.set('acc',a)};
$$('.sat').forEach(s=>s.onclick=()=>{setAcc(s.dataset.a);$('#accpop').hidden=true});
$('#bacc').onclick=e=>{e.stopPropagation();$('#accpop').hidden=!$('#accpop').hidden};
document.addEventListener('click',e=>{if(!e.target.closest('#accpop'))$('#accpop').hidden=true});
$('#bundo').onclick=undo;
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&e.key.toLowerCase()=='z'&&!/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName||'').toUpperCase())&&!$('#nt').open){e.preventDefault();undo()}});
$('#bout').onclick=async()=>{await api('logout',{});location.reload()};

/* ---------- export (CSV / Excel) + print ---------- */
const nz=v=>eq(v,0)?'':v;
function sheetsFor(tab){const R=calc();
 if(tab=='j'){const L=fil();return L.length?[{name:'Journal',head:1,rows:[['Date','Debit account','Credit account','Description','Amount','Type'],...L.map(t=>[t.date,nmOf(t.dr),nmOf(t.cr),t.desc,t.amt,t.adj?'Adjusting':'Regular'])]}]:[]}
 if(tab=='l'){const rows=[['Account','Date','Description','Debit','Credit','Balance','Dr/Cr']];S.accounts.forEach(a=>{lines(a.id).ls.forEach(l=>rows.push([a.name,l.date,l.desc,l.d?l.amt:'',l.d?'':l.amt,Math.abs(l.bal),l.bal>=0?'Dr':'Cr']))});return rows.length>1?[{name:'General Ledger',head:1,rows}]:[]}
 if(tab=='w'){if(!S.accounts.length)return[];const{tot,ni,fin}=R,rows=[['Account','Type',...LB]];
  S.accounts.forEach(a=>rows.push([a.name,a.type,...[...a.in,...a.out].map(nz)]));
  rows.push(['Totals','',...tot.map(nz)]);rows.push([ni>=0?'Net income':'Net loss','','','','','','','',...[ni>0?ni:0,ni<0?-ni:0,ni<0?-ni:0,ni>0?ni:0].map(nz)]);rows.push(['Totals','','','','','','','',...fin.map(nz)]);
  return[{name:'Worksheet',head:1,bold:[rows.length-3,rows.length-2,rows.length-1],rows}]}
 if(tab=='s'){const d=stData();if(d.empty)return[];const mk=(title,sub,r)=>{const rows=[[title],[sub],[]],bold=[0];r.forEach(x=>{if(x.k!='i')bold.push(rows.length);rows.push(x.k=='h'?[x.l]:[x.l,x.v])});return{name:title,rows,bold,w:[44,16]}};
  return[mk('Income Statement',d.from===d.to?longD(d.to):longD(d.from)+' to '+longD(d.to),d.inc),mk('Balance Sheet','As of '+longD(d.to),d.bs)]}
 if(tab=='c'){return S.accounts.length?[{name:'Chart of Accounts',head:1,rows:[['Account','Type','Entries','Balance','Dr/Cr'],...S.accounts.map(a=>[a.name,a.type,a.n,Math.abs(a.net),a.net>=0?'Dr':'Cr'])]}]:[]}
 return[]}
const csvCell=c=>{c=c==null?'':typeof c=='number'?c.toFixed(2):String(c);return/[",\r\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c};
const toCsv=sh=>sh.map(s=>(sh.length>1?csvCell(s.name)+'\r\n':'')+s.rows.map(r=>r.map(csvCell).join(',')).join('\r\n')).join('\r\n\r\n');
const CT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc32=b=>{let c=-1;for(let i=0;i<b.length;i++)c=CT[(c^b[i])&255]^(c>>>8);return(c^-1)>>>0};
function zip(files){const en=new TextEncoder(),ch=[],cd=[];let off=0;
 files.forEach(f=>{const n=en.encode(f.name),d=en.encode(f.data),crc=crc32(d),h=new DataView(new ArrayBuffer(30));
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(12,0x21,true);h.setUint32(14,crc,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,n.length,true);
  ch.push(new Uint8Array(h.buffer),n,d);
  const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(14,0x21,true);c.setUint32(16,crc,true);c.setUint32(20,d.length,true);c.setUint32(24,d.length,true);c.setUint16(28,n.length,true);c.setUint32(42,off,true);
  cd.push(new Uint8Array(c.buffer),n);off+=30+n.length+d.length});
 const sz=cd.reduce((s,x)=>s+x.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,sz,true);e.setUint32(16,off,true);
 return new Blob([...ch,...cd,new Uint8Array(e.buffer)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
const colL=i=>{let s='';i++;while(i>0){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26)}return s};
const xe=s=>String(s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function sheetXml(s){const bd=ri=>(ri==0&&s.head)||(s.bold||[]).includes(ri),n=Math.max(...s.rows.map(r=>r.length)),w=s.w||Array.from({length:n},(_,c)=>Math.min(48,Math.max(10,...s.rows.map(r=>String(r[c]==null?'':typeof r[c]=='number'?f2(r[c]):r[c]).length+2))));
 return'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0">'+(s.head?'<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>':'')+'</sheetView></sheetViews><cols>'+w.map((x,i)=>`<col min="${i+1}" max="${i+1}" width="${x}" customWidth="1"/>`).join('')+'</cols><sheetData>'
 +s.rows.map((r,ri)=>`<row r="${ri+1}">`+r.map((v,ci)=>{if(v===''||v==null)return'';const ref=colL(ci)+(ri+1);
  return typeof v=='number'?`<c r="${ref}" s="${bd(ri)?3:2}"><v>${v}</v></c>`:`<c r="${ref}" t="inlineStr"${bd(ri)?' s="1"':''}><is><t xml:space="preserve">${xe(v)}</t></is></c>`}).join('')+'</row>').join('')+'</sheetData></worksheet>'}
function xlsx(sh){const names=sh.map(s=>s.name.replace(/[\\\/?*\[\]:]/g,'').slice(0,31)),H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
 return zip([
  {name:'[Content_Types].xml',data:H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+sh.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')+'</Types>'},
  {name:'_rels/.rels',data:H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
  {name:'xl/workbook.xml',data:H+'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+names.map((n,i)=>`<sheet name="${xe(n)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets></workbook>'},
  {name:'xl/_rels/workbook.xml.rels',data:H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sh.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')+`<Relationship Id="rId${sh.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`},
  {name:'xl/styles.xml',data:H+'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="4" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="4" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'},
  ...sh.map((s,i)=>({name:`xl/worksheets/sheet${i+1}.xml`,data:sheetXml(s)}))])}
function dl(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000)}
let oldTitle=document.title;
function printTab(tab,all){const T={d:'Dashboard',j:'Journal',l:'General Ledger',w:'Worksheet',s:'Financial Statements',c:'Chart of Accounts'};
 $('#phead').innerHTML='<div><b>Accounting System</b> - '+esc(T[tab])+'</div><span>'+esc(USER)+' | '+new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})+'</span>';
 $('#pgs').textContent='@page{size:'+(tab=='w'?'landscape':'portrait')+';margin:12mm}';
 document.body.classList.toggle('pall',!!all);oldTitle=document.title;document.title='Accounting - '+TN[tab]+' - '+ymd();setTimeout(()=>window.print(),60)}
addEventListener('afterprint',()=>{document.body.classList.remove('pall');document.title=oldTitle});
document.addEventListener('click',e=>{const b=e.target.closest('[data-x]');if(!b)return;const tab=b.closest('section').id,k=b.dataset.x;
 if(k=='print'||k=='printall')return printTab(tab,k=='printall');
 const sh=sheetsFor(tab);if(!sh.length)return toast('Nothing to export yet.',1);const base='Accounting-'+TN[tab]+'-'+ymd();
 if(k=='csv')dl(new Blob(['﻿'+toCsv(sh)],{type:'text/csv;charset=utf-8'}),base+'.csv');else dl(xlsx(sh),base+'.xlsx');toast('Downloaded '+base+'.'+k)});

/* ---------- start-up ---------- */
async function enter(u){USER=u;$('#boot').hidden=true;$('#login').style.display='none';$('#app').hidden=false;const h=new Date().getHours();$('#hello').textContent=(h<12?'Good morning':h<18?'Good afternoon':'Good evening')+', '+u;$('#fd').value=ymd();await load();updUndo();const tb=document.querySelector('nav button[data-t="'+store.get('tab')+'"]');if(tb)tb.click()}
const lmsg=(t,ok)=>{$('#lerr').className=ok?'err ok':'err';$('#lerr').textContent=t};
$('#bforgot').onclick=async()=>{const u=$('#lu').value.trim();
 if(!u)return lmsg('Type your email in the box above first, then press Forgot password again.');
 if(!u.includes('@'))return lmsg('This account uses only a username, so no reset email can be sent. Ask the person who manages the app to reset it in Firebase, or create a new account using your email.');
 try{await api('reset',{email:u});lmsg('If an account exists for that email, a reset link was sent. Check your inbox and spam folder.',1)}catch(e){lmsg(e.message)}};
async function auth(a){lmsg('');try{const d=await api(a,{username:$('#lu').value.trim(),password:$('#lp').value});await enter(d.user);if(a=='register')$('#guide').showModal()}catch(e){$('#lerr').textContent=e.message}}
$('#bin').onclick=()=>auth('login');$('#bup').onclick=()=>auth('register');$('#lp').onkeydown=e=>{if(e.key=='Enter')auth('login')};
setDark(store.get('dark')!=='0');setAcc(store.get('acc')||'purple');updUndo();
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
const showLogin=()=>{$('#boot').hidden=true;$('#login').style.display='grid'};
api('me').then(async d=>{if(d.user){try{await enter(d.user)}catch(e){}}else showLogin()}).catch(showLogin);
})();
