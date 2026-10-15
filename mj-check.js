(function(){
  "use strict";
  const $=s=>document.querySelector(s);
  const el=(t,c)=>{const e=document.createElement(t);if(c)e.className=c;return e;};
  const todayStr=d=>{d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");};
  const isWeekend=d=>{const g=(d||new Date()).getDay();return g===0||g===6;};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  // ---- icon set (inline svg) ----
  const ICONS={
    sunrise:'<path d="M3 20h18M6 20a6 6 0 0 1 12 0"/><path d="M12 3v3M5 9l1.6 1.6M19 9l-1.6 1.6M3 14h2M19 14h2M8.5 20 12 15.8 15.5 20"/>',
    candle:'<path d="M12 2.5c1.4 1.2 1.4 3 0 4.2-1.4-1.2-1.4-3 0-4.2Z"/><path d="M9.5 8.5h5v2h-5zM10 10.5h4v10h-4z"/>',
    phone:'<path d="M5.5 3.5h3l1.6 4-2 1.3a11 11 0 0 0 5 5l1.3-2 4 1.6v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 4 5.1 1.5 1.5 0 0 1 5.5 3.5Z"/>',
    building:'<rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M9 7.5h2M13 7.5h2M9 11h2M13 11h2M9 14.5h2M13 14.5h2M10 20.5v-3h4v3"/>',
    utensils:'<path d="M8 3v7a2 2 0 0 1-4 0V3M6 10v11M16 3c-1.5 0-2.5 1.5-2.5 4s1 4 2.5 4M16 3v18"/>',
    dumbbell:'<path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/>',
    droplet:'<path d="M12 3.5s6 6 6 10.2A6 6 0 0 1 6 13.7C6 9.5 12 3.5 12 3.5Z"/>',
    sunset:'<path d="M3 20h18M6 20a6 6 0 0 1 12 0"/><path d="M12 9V3M9 6l3 3 3-3M3 14h2M19 14h2"/>',
    moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    book:'<path d="M12 6.5C10.5 4.5 7.5 4 4.5 4.5v13C7.5 17 10.5 17.5 12 19.5M12 6.5C13.5 4.5 16.5 4 19.5 4.5v13C16.5 17 13.5 17.5 12 19.5M12 6.5v13"/>',
    gift:'<path d="M19 11.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8.5M3.5 7.5h17v4h-17zM12 21V7.5M12 7.5S10.7 3 8 3 5.5 6.8 8 7.5M12 7.5s1.3-4.5 4-4.5S18.5 6.8 16 7.5"/>',
    heart:'<path d="M12 20.5s-7-4.3-9.3-9A5 5 0 0 1 12 6.6a5 5 0 0 1 9.3 4.9c-2.3 4.7-9.3 9-9.3 9Z"/>',
    star:'<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.9 1-5.8-4.3-4.1 5.9-.9L12 3Z"/>',
    check:'<path d="M5 12.5 10 17l9-10"/>',
    close:'<path d="M6 6l12 12M18 6 6 18"/>',
    sun:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6 6.4 6.4M17.6 17.6l1.8 1.8M19.4 4.6 17.6 6.4M6.4 17.6 4.6 19.4"/>'
  };
  const BLOCK_ICON={acordar:"sunrise",orar:"candle",trabalho:"phone",escritorio:"building",refeicoes:"utensils",
    academia:"dumbbell",agua:"droplet",desacelerar:"sunset",dormir:"moon",estudo:"book"};
  function svg(name){const s='<svg class="i" viewBox="0 0 24 24">'+(ICONS[name]||ICONS.star)+'</svg>';return s;}
  function chip(name){const d=el("span","ic-chip");d.innerHTML=svg(name);return d;}

  const DEFAULT_BLOCKS=[
    {id:"acordar",label:"Acordar",emoji:"⏰",enabled:true,times:["06:30"],points:10,critical:true},
    {id:"orar",label:"Orar",emoji:"🙏",enabled:true,times:["07:00","12:00","21:00"],points:5,critical:true},
    {id:"trabalho",label:"Ligações (meta: 3)",emoji:"📞",enabled:true,times:["09:00"],points:20,critical:true},
    {id:"escritorio",label:"Ir ao escritório",emoji:"🏢",enabled:true,times:["08:30"],points:15,critical:false},
    {id:"refeicoes",label:"Refeições",emoji:"🍽️",enabled:true,times:["08:00","12:30","19:30"],points:3,critical:false},
    {id:"academia",label:"Academia",emoji:"🏋️",enabled:true,times:["18:00"],points:15,critical:false},
    {id:"agua",label:"Beber água",emoji:"💧",enabled:true,times:["10:00","14:00","16:00"],points:2,critical:false},
    {id:"desacelerar",label:"Desacelerar",emoji:"🌙",enabled:true,times:["21:30"],points:8,critical:false},
    {id:"dormir",label:"Dormir",emoji:"😴",enabled:true,times:["22:30"],points:10,critical:true},
    {id:"estudo",label:"Estudo",emoji:"📚",enabled:true,times:["20:00"],points:10,critical:false}
  ];
  const DEFAULT_REWARDS=[{id:"r1",name:"Um episódio de série",cost:50},{id:"r2",name:"Um lanche especial",cost:100},{id:"r3",name:"Rolê ou jogo sem culpa",cost:250}];
  const PHRASES=["Um passo de cada vez já é caminhar.","Você apareceu. Isso muda tudo.","O difícil de hoje é o orgulho de amanhã.","Progresso vale mais que perfeição.","Pequeno e feito vence grande e sonhado.","Você é mais forte do que a vontade de desistir.","Cada sim pra você constrói a sua vida.","Disciplina é amor-próprio em ação.","O seu futuro agradece por agora.","Levantar e tentar já é coragem.","Mais um tijolo da sua jornada.","Você não precisa estar 100% pra dar o próximo passo.","Constância cansa menos que recomeçar.","O sonho se constrói nos dias comuns.","Feito. Respira e sente o orgulho.","Você está voltando pra linha — e isso importa.","Hoje você escolheu você.","A vitória de agora acende a próxima.","Seu eu de amanhã começou aqui.","Devagar também é na direção certa.","Nenhum esforço seu se perde.","Você plantou algo bom agora.","Orgulho de ver você insistindo.","Uma tarefa de cada vez, um dia de cada vez.","A rotina te carrega quando a vontade falta.","Isso. Continua, no seu ritmo.","Força não é não cair; é levantar de novo.","Você está exatamente onde precisa começar.","Pequenas vitórias viram grandes viradas.","Respeita teu esforço: ele é real.","Deus caminha com quem dá o primeiro passo.","Fé e ação, de mãos dadas.","Hoje você honrou a sua palavra.","Teu futuro é feito de agoras como esse.","Menos culpa, mais próximo passo.","Você merece o que está construindo.","Seguir imperfeito é melhor que parar perfeito.","Tá difícil, e mesmo assim você fez.","Cada ligação é uma porta. Boa!","Teu esforço silencioso vai fazer barulho."];
  const VERSES=[["Posso todas as coisas naquele que me fortalece.","Filipenses 4:13"],["Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.","Salmos 37:5"],["Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.","Isaías 41:10"],["O Senhor é o meu pastor; nada me faltará.","Salmos 23:1"],["Tudo tem o seu tempo determinado debaixo do céu.","Eclesiastes 3:1"],["Aquietai-vos e sabei que eu sou Deus.","Salmos 46:10"],["O choro pode durar uma noite, mas a alegria vem pela manhã.","Salmos 30:5"],["Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.","1 Pedro 5:7"],["Os que esperam no Senhor renovarão as suas forças.","Isaías 40:31"],["Seja forte e corajoso; o Senhor, teu Deus, é contigo por onde quer que andares.","Josué 1:9"],["Bem-aventurado o homem que confia no Senhor.","Jeremias 17:7"],["O Senhor pelejará por vós, e vós vos calareis.","Êxodo 14:14"],["Em paz me deitarei e dormirei, porque só tu me fazes repousar seguro.","Salmos 4:8"],["Confia no Senhor de todo o teu coração.","Provérbios 3:5"],["A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.","2 Coríntios 12:9"],["Tudo é possível ao que crê.","Marcos 9:23"],["Alegrai-vos na esperança, sede pacientes na tribulação.","Romanos 12:12"],["Buscai primeiro o reino de Deus, e tudo vos será acrescentado.","Mateus 6:33"],["O justo cai sete vezes, e se levanta.","Provérbios 24:16"],["Não se turbe o vosso coração; credes em Deus, crede também em mim.","João 14:1"],["O Senhor é a minha luz e a minha salvação; a quem temerei?","Salmos 27:1"],["Vinde a mim, todos os que estais cansados, e eu vos aliviarei.","Mateus 11:28"],["Fiel é aquele que vos chama, o qual também o fará.","1 Tessalonicenses 5:24"],["Esforçai-vos, e ele fortalecerá o vosso coração.","Salmos 31:24"]];

  let db=null,uid=null,appRef=null,dayRef=null,unsubApp=null,unsubDay=null;
  let app=null,day=null,dateKey=todayStr(),weekendFlex=true,winddown=false,writing=false;
  const RC=2*Math.PI*40;
  const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}};
  const clone=o=>{try{return JSON.parse(JSON.stringify(o||{}));}catch(e){return o||{};}}; // dados do banco vêm congelados

  function greeting(){const h=new Date().getHours();if(h<5)return"Boa madrugada";if(h<12)return"Bom dia";if(h<18)return"Boa tarde";return"Boa noite";}
  function firstName(){const n=(app&&app.name||"").trim();return n?n.split(/\s+/)[0]:"";}
  function instances(){const wk=isWeekend();const list=[];(app.blocks||[]).forEach((b,bi)=>{if(!b.enabled)return;
    if(wk&&weekendFlex)list.push({iid:b.id+"#wk",b,time:null,order:bi});
    else (b.times||[]).forEach(t=>list.push({iid:b.id+"#"+t,b,time:t,order:bi}));});
    list.sort((a,c)=>{if(a.time&&c.time)return a.time<c.time?-1:a.time>c.time?1:a.order-c.order;if(a.time&&!c.time)return -1;if(!a.time&&c.time)return 1;return a.order-c.order;});return list;}
  const isDone=iid=>!!(day&&day.completed&&day.completed[iid]);
  const iconFor=id=>BLOCK_ICON[id]||"star";

  function render(){
    if(!app)return;
    $("#greet").textContent=greeting()+(firstName()?(", "+firstName()):"")+".";
    $("#subgreet").textContent=isWeekend()&&weekendFlex?"Fim de semana — no seu ritmo, sem pressa.":"Um passo de cada vez. Você consegue.";
    $("#statPts").textContent=app.totalPoints||0;
    $("#statStreak").textContent=app.streak||0;
    $("#balN").textContent=app.totalPoints||0;
    $("#nameInput").value=app.name||"";
    $("#wdBtn").classList.toggle("on",winddown);

    const inst=instances();
    const done=inst.filter(x=>isDone(x.iid)).length;
    const pct=inst.length?done/inst.length:0;
    $("#ringCount").textContent=done+"/"+inst.length;
    $("#ringPrg").style.strokeDasharray=RC;
    $("#ringPrg").style.strokeDashoffset=RC*(1-pct);
    $("#heroLine").textContent = !inst.length?"Ative seus blocos em Ajustes pra começar."
      : done===inst.length?"Dia completo. Que orgulho de você."
      : done===0?"Seu dia começa com um passo." : "Bom ritmo. Siga assim, com calma.";
    $("#cheer").hidden=done===0;

    const tl=$("#taskList");tl.innerHTML="";
    if(!inst.length)tl.appendChild(Object.assign(el("div","empty"),{textContent:"Nenhuma tarefa ativa. Ative seus blocos em Ajustes."}));
    inst.forEach(x=>tl.appendChild(taskRow(x)));

    const pl=$("#prayerList");pl.innerHTML="";
    const pr=inst.filter(x=>x.b.id==="orar");
    if(!pr.length)pl.appendChild(Object.assign(el("div","empty"),{textContent:"Ative o bloco Orar em Ajustes."}));
    pr.forEach(x=>pl.appendChild(taskRow(x)));

    const vi=dayIndex()%VERSES.length;
    $("#verseText").textContent=VERSES[vi][0];
    $("#verseRef").textContent=VERSES[vi][1];
    if($("#verseTextHoje")){$("#verseTextHoje").textContent=VERSES[vi][0];$("#verseRefHoje").textContent=VERSES[vi][1];}
    $("#gratInput").value=(day&&day.gratidao)||"";

    renderRewards();renderBlockEditor();renderMood();renderJornada();
    $("#weekendToggle").classList.toggle("on",weekendFlex);
  }
  function taskRow(x){
    const done=isDone(x.iid);
    const row=el("div","task"+(done?" done":""));
    row.appendChild(chip(iconFor(x.b.id)));
    const mid=el("div","mid");
    const nm=el("div","nm");nm.appendChild(Object.assign(el("span"),{textContent:x.b.label}));
    const p=el("span","pts");p.textContent="+"+x.b.points;nm.appendChild(p);mid.appendChild(nm);
    const tm=el("div","tm");
    if(x.time){tm.innerHTML='<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>';tm.appendChild(Object.assign(el("span"),{textContent:x.time}));}
    else tm.textContent="quando der, no seu tempo";
    mid.appendChild(tm);row.appendChild(mid);
    const chk=el("button","check");chk.innerHTML=svg("check");chk.setAttribute("aria-label","Concluir "+x.b.label);
    chk.onclick=()=>toggle(x);row.appendChild(chk);
    return row;
  }
  function renderRewards(){
    const rl=$("#rewardList");rl.innerHTML="";
    const rws=app.rewards||[];
    if(!rws.length)rl.appendChild(Object.assign(el("div","empty"),{textContent:"Crie sua primeira recompensa."}));
    rws.forEach(r=>{
      const row=el("div","reward");row.appendChild(chip("gift"));
      const mid=el("div","mid");mid.appendChild(Object.assign(el("div","nm"),{textContent:r.name}));
      mid.appendChild(Object.assign(el("div","cost"),{textContent:r.cost+" pontos"}));row.appendChild(mid);
      const b=el("button","btn sm");b.textContent="Resgatar";b.disabled=(app.totalPoints||0)<r.cost;b.onclick=()=>redeem(r);row.appendChild(b);
      const x=el("button","xbtn");x.title="Remover";x.innerHTML=svg("close");x.onclick=()=>removeReward(r.id);row.appendChild(x);
      rl.appendChild(row);
    });
  }
  function renderBlockEditor(){
    const be=$("#blockEditor");be.innerHTML="";
    (app.blocks||[]).forEach(b=>{
      const row=el("div","blk");row.appendChild(chip(iconFor(b.id)));
      const mid=el("div","mid");mid.appendChild(Object.assign(el("div","nm"),{textContent:b.label}));
      mid.appendChild(Object.assign(el("div","times"),{textContent:(b.times&&b.times.length)?("Horários "+b.times.join(", ")+"  ·  +"+b.points+" pts"):("+"+b.points+" pts · sem horário")}));
      const eb=el("button","btn sm ghost ed");eb.textContent="Editar horários";eb.onclick=()=>editBlock(b);mid.appendChild(eb);
      row.appendChild(mid);
      const tg=el("div","toggle"+(b.enabled?" on":""));tg.onclick=()=>{b.enabled=!b.enabled;saveApp({blocks:app.blocks});render();};
      row.appendChild(tg);be.appendChild(row);
    });
  }
  function dayIndex(){const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);}

  // ---- motor: humor, níveis, escudos, conquistas ----
  const MOODS=[{v:1,c:"#e06a6a",l:"Difícil"},{v:2,c:"#e0996a",l:"Baixo"},{v:3,c:"#c9b26a",l:"Neutro"},{v:4,c:"#8fc27f",l:"Bom"},{v:5,c:"#6fc79b",l:"Ótimo"}];
  function daysBetween(a,b){const pa=a.split("-"),pb=b.split("-");return Math.round((Date.UTC(+pb[0],+pb[1]-1,+pb[2])-Date.UTC(+pa[0],+pa[1]-1,+pa[2]))/864e5);}
  function titleFor(l){return l>=25?"Lenda":l>=18?"Imparável":l>=12?"Firme":l>=7?"Constante":l>=4?"Em movimento":l>=2?"Recomeçando":"Primeiro passo";}
  function levelInfo(){const xp=app.xp||0;const level=Math.floor(xp/100)+1;return{level,inLvl:xp%100,need:100,title:titleFor(level)};}
  const BADGES=[
    {id:"inicio",nm:"Primeiro passo",dc:"Concluiu sua primeira tarefa",on:()=>(app.xp||0)>0},
    {id:"s3",nm:"Três seguidos",dc:"Sequência de 3 dias",on:()=>(app.bestStreak||0)>=3},
    {id:"s7",nm:"Semana firme",dc:"Sequência de 7 dias",on:()=>(app.bestStreak||0)>=7},
    {id:"s30",nm:"Mês inteiro",dc:"Sequência de 30 dias",on:()=>(app.bestStreak||0)>=30},
    {id:"cheio",nm:"Dia completo",dc:"Concluiu tudo em um dia",on:()=>Object.values(app.history||{}).some(h=>h&&h.p>=100)},
    {id:"xp250",nm:"250 de XP",dc:"Acumulou 250 de experiência",on:()=>(app.xp||0)>=250},
    {id:"xp1000",nm:"Mil de XP",dc:"Acumulou 1000 de experiência",on:()=>(app.xp||0)>=1000},
    {id:"ativo7",nm:"Presente",dc:"Registrou 7 dias de progresso",on:()=>Object.keys(app.history||{}).length>=7}
  ];
  function checkBadges(){app.badges=app.badges||{};const nw=[];BADGES.forEach(b=>{if(b.on()&&!app.badges[b.id]){app.badges[b.id]=Date.now();nw.push(b);}});return nw;}
  function syncTodayHistory(){const inst=instances();const done=inst.filter(x=>isDone(x.iid)).length;
    const p=inst.length?Math.round(done/inst.length*100):0;app.history=app.history||{};
    app.history[dateKey]={p:p,m:(day&&day.mood)||0};
    const cut=todayStr(new Date(Date.now()-40*864e5));Object.keys(app.history).forEach(k=>{if(k<cut)delete app.history[k];});}
  function confetti(){if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
    const c=document.createElement("canvas");c.style.cssText="position:fixed;inset:0;z-index:70;pointer-events:none";
    c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);const ctx=c.getContext("2d");
    const cols=["#e3b36a","#78c7a1","#f0a15f","#caa15c","#ffffff"];const P=[];
    for(let i=0;i<120;i++)P.push({x:Math.random()*c.width,y:-20-Math.random()*c.height*.4,r:4+Math.random()*5,vy:2+Math.random()*4,vx:-2+Math.random()*4,a:Math.random()*6,col:cols[i%cols.length]});
    let t=0;(function f(){t++;ctx.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.y+=p.vy;p.x+=p.vx;p.a+=.1;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=p.col;ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*.6);ctx.restore();});if(t<95)requestAnimationFrame(f);else c.remove();})();}
  function celebrateDay(){openModal('<div class="burst">'+svg("star")+'</div><div class="mq">Dia completo. Que orgulho de você.</div><div class="msub">Você honrou a sua palavra hoje.</div><div class="actions"><button class="btn" data-close>Fechar</button></div>');}
  function renderMood(){const o=$("#moodOpts");if(!o)return;o.innerHTML="";const cur=(day&&day.mood)||0;
    MOODS.forEach(m=>{const b=el("button","mood-dot"+(cur===m.v?" sel":""));b.style.setProperty("--mc",m.c);b.title=m.l;b.setAttribute("aria-label",m.l);b.onclick=()=>setMood(m.v);o.appendChild(b);});
    const lab=$("#moodLabel");if(lab)lab.textContent=cur?MOODS[cur-1].l:"";}
  async function setMood(v){day=day||{completed:{},points:0,gratidao:"",mood:0};day.mood=(day.mood===v?0:v);
    syncTodayHistory();render();
    try{await dayRef.set({completed:day.completed||{},points:day.points||0,gratidao:day.gratidao||"",mood:day.mood||0});await appRef.update({history:app.history||{}});}catch(e){}}
  function renderJornada(){if(!$("#lvlN"))return;const li=levelInfo();const hist=app.history||{};
    $("#lvlN").textContent="Nível "+li.level;$("#lvlT").textContent=li.title;$("#lvlXP").textContent=(app.xp||0)+" XP";
    $("#lvlBar").style.width=li.inLvl+"%";$("#lvlNext").textContent=(li.need-li.inLvl)+" XP pro próximo nível";
    $("#jStreak").textContent=app.streak||0;$("#jBest").textContent=app.bestStreak||0;
    const sh=$("#jShields");sh.innerHTML="";for(let i=0;i<(app.shields||0);i++)sh.innerHTML+='<svg class="i" viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z"/></svg>';
    let sum=0,cnt=0;for(let i=0;i<7;i++){const d=todayStr(new Date(Date.now()-i*864e5));if(hist[d]){sum+=hist[d].p;cnt++;}}
    $("#jWeek").textContent=(cnt?Math.round(sum/cnt):0)+"%";
    const heat=$("#heat");heat.innerHTML="";for(let i=27;i>=0;i--){const d=todayStr(new Date(Date.now()-i*864e5));const h=hist[d];const p=h?h.p:null;
      const cell=el("div","hc");cell.style.background=p==null?"var(--card-soft)":"rgba(227,179,106,"+(0.14+0.86*(p/100)).toFixed(2)+")";cell.title=d+(p!=null?(" · "+p+"%"):"");heat.appendChild(cell);}
    const mt=$("#moodTrend");mt.innerHTML="";for(let i=13;i>=0;i--){const d=todayStr(new Date(Date.now()-i*864e5));const h=hist[d];const m=h&&h.m?h.m:0;
      const dot=el("div","mdot");dot.style.background=m?MOODS[m-1].c:"var(--card-soft)";dot.title=d+(m?(" · "+MOODS[m-1].l):"");mt.appendChild(dot);}
    const bc=$("#badges");bc.innerHTML="";app.badges=app.badges||{};
    BADGES.forEach(b=>{const earned=!!app.badges[b.id];const card=el("div","badge"+(earned?" on":""));
      card.innerHTML='<div class="bi">'+svg("star")+'</div><div class="bn"></div><div class="bd"></div>';
      card.querySelector(".bn").textContent=b.nm;card.querySelector(".bd").textContent=b.dc;bc.appendChild(card);});}

  async function toggle(x){
    if(writing)return;writing=true;
    try{
      day=day||{completed:{},points:0,gratidao:"",mood:0};day.completed=day.completed||{};
      const nowDone=!day.completed[x.iid];
      const prevAny=Object.values(day.completed).some(Boolean);
      if(nowDone)day.completed[x.iid]=true;else delete day.completed[x.iid];
      const delta=(nowDone?1:-1)*(x.b.points||0);
      day.points=Math.max(0,(day.points||0)+delta);
      app.totalPoints=Math.max(0,(app.totalPoints||0)+delta);
      app.xp=Math.max(0,(app.xp||0)+delta);
      const nowAny=Object.values(day.completed).some(Boolean);
      if(!prevAny&&nowAny){
        const last=app.lastActiveDate;
        if(!last){app.streak=1;}
        else{const gap=daysBetween(last,dateKey);
          if(gap<=0){}
          else if(gap===1){app.streak=(app.streak||0)+1;}
          else{const missed=gap-1;if((app.shields||0)>=missed){app.shields=(app.shields||0)-missed;app.streak=(app.streak||0)+1;}else{app.streak=1;}}
        }
        app.lastActiveDate=dateKey;
        app.bestStreak=Math.max(app.bestStreak||0,app.streak||0);
        if((app.streak||0)>0&&(app.streak||0)%7===0)app.shields=Math.min(3,(app.shields||0)+1);
      }
      if(x.b.id==="desacelerar"&&nowDone)setWinddown(true);
      syncTodayHistory();
      const novas=checkBadges();
      render();
      await dayRef.set({completed:day.completed,points:day.points,gratidao:day.gratidao||"",mood:day.mood||0});
      await appRef.update({totalPoints:app.totalPoints,xp:app.xp||0,streak:app.streak||0,bestStreak:app.bestStreak||0,shields:app.shields||0,lastActiveDate:app.lastActiveDate||dateKey,history:app.history||{},badges:app.badges||{}});
      if(nowDone){
        const inst2=instances();const d2=inst2.filter(y=>isDone(y.iid)).length;
        if(inst2.length&&d2===inst2.length){confetti();celebrateDay();}
        else motivate(x);
        if(novas.length)setTimeout(()=>toast("Nova conquista: "+novas[0].nm),900);
      }
    }catch(e){toast("Não consegui salvar. Tenta de novo.");}
    finally{writing=false;}
  }
  function motivate(x){
    const q=PHRASES[Math.floor(Math.random()*PHRASES.length)];
    openModal('<div class="burst">'+svg("star")+'</div><div class="mq">'+esc(q)+'</div><div class="msub">+'+x.b.points+' pontos · '+esc(x.b.label)+' feito</div><div class="actions"><button class="btn" data-close>Continuar</button></div>');
  }
  async function redeem(r){
    if((app.totalPoints||0)<r.cost)return;
    app.totalPoints-=r.cost;render();try{await appRef.update({totalPoints:app.totalPoints});}catch(e){}
    openModal('<div class="burst">'+svg("gift")+'</div><div class="mq">Aproveite: '+esc(r.name)+'</div><div class="msub">Você mereceu. Resgatado por '+r.cost+' pontos.</div><div class="actions"><button class="btn" data-close>Fechar</button></div>');
  }
  function addReward(){
    openModal('<div class="mq">Nova recompensa</div><div class="form-row"><label class="fld">O prêmio</label><input type="text" id="mRname" placeholder="Ex.: pedir meu lanche favorito"></div><div class="form-row"><label class="fld">Custa quantos pontos?</label><input type="number" id="mCost" value="100" min="1"></div><div class="actions"><button class="btn ghost" data-close>Cancelar</button><button class="btn" id="mSave">Criar</button></div>');
    $("#mSave").onclick=async()=>{const nm=($("#mRname").value||"").trim();const cost=parseInt($("#mCost").value||"0",10);
      if(!nm||!cost||cost<1){toast("Preencha o prêmio e o custo.");return;}
      app.rewards=app.rewards||[];app.rewards.push({id:"r"+Date.now(),name:nm,cost});closeModal();render();try{await appRef.update({rewards:app.rewards});}catch(e){}};
  }
  async function removeReward(id){app.rewards=(app.rewards||[]).filter(r=>r.id!==id);render();try{await appRef.update({rewards:app.rewards});}catch(e){}}
  function editBlock(b){
    openModal('<div class="mq">'+esc(b.label)+'</div><div class="form-row"><label class="fld">Horários (separe por vírgula)</label><input type="text" id="mTimes" value="'+esc((b.times||[]).join(", "))+'" placeholder="07:00, 12:00"></div><div class="form-row"><label class="fld">Pontos ao concluir</label><input type="number" id="mPts" value="'+b.points+'" min="0"></div><div class="actions"><button class="btn ghost" data-close>Cancelar</button><button class="btn" id="mSaveB">Salvar</button></div>');
    $("#mSaveB").onclick=async()=>{const raw=($("#mTimes").value||"").split(",").map(s=>s.trim()).filter(Boolean).map(s=>{const m=s.match(/^(\d{1,2}):?(\d{2})$/);if(!m)return null;return String(Math.min(23,+m[1])).padStart(2,"0")+":"+m[2];}).filter(Boolean);
      b.times=raw;b.points=Math.max(0,parseInt($("#mPts").value||"0",10));closeModal();render();await saveApp({blocks:app.blocks});};
  }
  async function saveName(){app.name=($("#nameInput").value||"").trim();await saveApp({name:app.name});render();toast("Salvo");}
  async function saveGrat(){day=day||{completed:{},points:0,gratidao:"",mood:0};day.gratidao=($("#gratInput").value||"").trim();
    try{await dayRef.set({completed:day.completed||{},points:day.points||0,gratidao:day.gratidao,mood:day.mood||0});toast("Gratidão guardada");}catch(e){toast("Não consegui salvar.");}}
  async function saveApp(p){try{await appRef.update(p);}catch(e){}}
  function setWinddown(on){winddown=on;document.body.classList.toggle("winddown",on);LS("mj_wd",on?"1":"0");const b=$("#wdBtn");if(b)b.classList.toggle("on",on);}

  function openModal(html){const r=$("#modalRoot");r.innerHTML='<div class="scrim"><div class="modal">'+html+'</div></div>';
    r.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeModal);const s=r.querySelector(".scrim");s.onclick=e=>{if(e.target===s)closeModal();};}
  function closeModal(){$("#modalRoot").innerHTML="";}
  let tT=null;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(tT);tT=setTimeout(()=>t.classList.remove("show"),2200);}

  document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
    document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");$("#v-"+t.dataset.tab).classList.add("active");window.scrollTo(0,0);});
  $("#wdBtn").onclick=()=>setWinddown(!winddown);
  $("#addRewardBtn").onclick=addReward;
  $("#gratSave").onclick=saveGrat;
  $("#nameSave").onclick=saveName;
  $("#weekendToggle").onclick=async()=>{weekendFlex=!weekendFlex;app.weekendFlex=weekendFlex;render();await saveApp({weekendFlex});};

  function showGate(m,h,retry){$("#gate").hidden=false;$("#app").hidden=true;$("#gateMsg").textContent=m;$("#gateHint").textContent=h||"";$("#gateRetry").hidden=!retry;}
  const withTimeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise(r=>setTimeout(()=>r("__to__"),ms))]);
  $("#gateRetry").onclick=()=>location.reload();
  function showApp(){$("#gate").hidden=true;$("#app").hidden=false;}
  function defaultApp(){return{name:"",onboarded:true,blocks:JSON.parse(JSON.stringify(DEFAULT_BLOCKS)),weekendFlex:true,rewards:JSON.parse(JSON.stringify(DEFAULT_REWARDS)),totalPoints:0,xp:0,streak:0,bestStreak:0,shields:0,badges:{},history:{},lastActiveDate:null,createdAt:Date.now()};}

  // ---- persistência local + sincronização dos horários pro push ----
  const SB_URL="https://emtuncwtxsrpdotepfyl.supabase.co";
  const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdHVuY3d0eHNycGRvdGVwZnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzk2MDgsImV4cCI6MjA5NDk1NTYwOH0.cZqkXGEOxlAdTxePeidiuC-rzvTLFAflF3GOsUetn7A";
  const VAPID_PUBLIC="BKAd4l94gqyLGgdspFk9uOjiz11D4Ej52yW37nV8IY5kk8eovnuB9EdeZgsaxcKiI4wPFdv0E5V4424P4FgsHrE";
  let sb=null,deviceId=null,STORE={app:null,days:{}};
  try{const raw=localStorage.getItem("mjState");if(raw)STORE=JSON.parse(raw);}catch(e){}
  if(!STORE.days)STORE.days={};
  function persist(){try{localStorage.setItem("mjState",JSON.stringify(STORE));}catch(e){}saveRemote();}
  function makeDayRef(d){return{set:async(o)=>{STORE.days[d]=o;if(d===dateKey)day=o;persist();},onSnapshot:cb=>{cb({exists:!!STORE.days[d],data:()=>STORE.days[d]});return ()=>{};}};}
  appRef={update:async p=>{Object.assign(app,p);STORE.app=app;persist();syncSchedule();},set:async o=>{app=o;STORE.app=app;persist();syncSchedule();},get:async()=>({exists:!!STORE.app,data:()=>STORE.app}),collection:()=>({doc:d=>makeDayRef(d)})};
  function buildSchedule(){const out=[];((app&&app.blocks)||[]).forEach(b=>{if(!b.enabled)return;(b.times||[]).forEach(t=>out.push({t:t,label:b.label}));});return out;}
  let syncT=null;
  function syncSchedule(){if(!sb)return;clearTimeout(syncT);syncT=setTimeout(async()=>{try{await sb.from("mj_devices").upsert({id:deviceId,schedule:buildSchedule(),tz:"America/Sao_Paulo",enabled:true,user_id:(currentUser?currentUser.id:null),last_seen:new Date().toISOString()});}catch(e){}},900);}
  function urlB64(s){const pad="=".repeat((4-s.length%4)%4);const b=(s+pad).replace(/-/g,"+").replace(/_/g,"/");const raw=atob(b);const arr=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)arr[i]=raw.charCodeAt(i);return arr;}
  function updatePushUI(){const b=$("#pushBtn");if(!b)return;const on=("Notification"in window)&&Notification.permission==="granted"&&LS("mj_push")==="1";b.textContent=on?"Notificações ativas ✓":"Ativar notificações";b.classList.toggle("ghost",on);}
  async function enablePush(){
    if(!("serviceWorker"in navigator)||!("PushManager"in window)){toast("Adicione à Tela de Início e abra pelo ícone primeiro.");return;}
    try{
      const perm=await Notification.requestPermission();
      if(perm!=="granted"){toast("Permissão de notificação negada.");return;}
      const reg=await navigator.serviceWorker.ready;
      let sub=await reg.pushManager.getSubscription();
      if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlB64(VAPID_PUBLIC)});
      if(sb)await sb.from("mj_devices").upsert({id:deviceId,push:sub.toJSON(),schedule:buildSchedule(),tz:"America/Sao_Paulo",enabled:true,user_id:(currentUser?currentUser.id:null),last_seen:new Date().toISOString()});
      LS("mj_push","1");updatePushUI();toast("Notificações ativadas!");
    }catch(e){toast("Não consegui ativar. Abra pelo ícone da Tela de Início e tente de novo.");}
  }
  document.addEventListener("visibilitychange",()=>{if(document.hidden)return;const t=todayStr();if(t!==dateKey){dateKey=t;dayRef=makeDayRef(dateKey);day=STORE.days[dateKey]||{completed:{},points:0,gratidao:"",mood:0};render();}});
  let currentUser=null,saveT=null,authMode="login";
  function saveRemote(){if(!sb||!currentUser)return;clearTimeout(saveT);saveT=setTimeout(async()=>{try{await sb.from("mj_state").upsert({user_id:currentUser.id,data:STORE,updated_at:new Date().toISOString()});}catch(e){}},1000);}
  function initApp(){
    app=STORE.app||defaultApp();app.blocks=app.blocks||[];app.rewards=app.rewards||[];
    if(typeof app.weekendFlex==="boolean")weekendFlex=app.weekendFlex;
    STORE.app=app;try{localStorage.setItem("mjState",JSON.stringify(STORE));}catch(e){}
    dayRef=makeDayRef(dateKey);day=STORE.days[dateKey]||{completed:{},points:0,gratidao:"",mood:0};
    try{setWinddown(LS("mj_wd")==="1");}catch(e){}
    showApp();render();
    const pb=$("#pushBtn");if(pb)pb.onclick=enablePush;updatePushUI();
    const lo=$("#logoutBtn");if(lo){lo.hidden=!(sb&&currentUser);lo.onclick=async()=>{try{await sb.auth.signOut();}catch(e){}};}
    syncSchedule();saveRemote();
  }
  function showLogin(msg){$("#gate").hidden=false;$("#app").hidden=true;$("#gateRetry").hidden=true;
    $("#gateMsg").textContent="Entre pra continuar";$("#gateHint").textContent="Seu progresso fica guardado e sincroniza entre seus aparelhos.";
    $("#authForm").hidden=false;$("#authMsg").textContent=msg||"";}
  function wireAuth(){
    const f=$("#authForm");if(!f)return;
    $("#authToggle").onclick=()=>{authMode=authMode==="login"?"signup":"login";
      $("#authSubmit").textContent=authMode==="login"?"Entrar":"Criar conta";
      $("#authToggle").textContent=authMode==="login"?"Criar conta nova":"Já tenho conta";
      $("#authPass").setAttribute("autocomplete",authMode==="login"?"current-password":"new-password");$("#authMsg").textContent="";};
    f.onsubmit=async(e)=>{e.preventDefault();if(!sb){$("#authMsg").textContent="Sem conexão com o servidor.";return;}
      const email=($("#authEmail").value||"").trim();const pass=$("#authPass").value||"";
      if(!email||pass.length<6){$("#authMsg").textContent="Informe e-mail e senha (mín. 6).";return;}
      $("#authSubmit").disabled=true;$("#authMsg").textContent="Um instante…";
      try{
        let res;
        if(authMode==="signup"){res=await sb.auth.signUp({email:email,password:pass});if(res.error)throw res.error;
          if(!res.data.session){res=await sb.auth.signInWithPassword({email:email,password:pass});if(res.error)throw res.error;}}
        else{res=await sb.auth.signInWithPassword({email:email,password:pass});if(res.error)throw res.error;}
        await afterLogin((res.data&&(res.data.user||(res.data.session&&res.data.session.user))));
      }catch(err){const m=((err&&err.message)||"").toLowerCase();
        $("#authMsg").textContent = m.indexOf("confirm")>=0?"Confirme seu e-mail (veja a caixa de entrada), ou me avise pra eu liberar."
          :m.indexOf("invalid")>=0?"E-mail ou senha incorretos."
          :(m.indexOf("already")>=0||m.indexOf("registered")>=0)?"Esse e-mail já tem conta — toque em Entrar."
          :((err&&err.message)||"Não consegui entrar. Tente de novo.");
      }finally{$("#authSubmit").disabled=false;}
    };
  }
  async function afterLogin(user){
    if(!user)return;currentUser=user;$("#authForm").hidden=true;
    try{const r=await sb.from("mj_state").select("data").eq("user_id",user.id).maybeSingle();
      const d=r&&r.data&&r.data.data;if(d&&(d.app||d.days))STORE={app:d.app||null,days:d.days||{}};}catch(e){}
    if(!STORE.days)STORE.days={};
    initApp();
  }
  async function boot(){
    try{deviceId=localStorage.getItem("mjDevice");if(!deviceId){deviceId=(window.crypto&&crypto.randomUUID?crypto.randomUUID():(Date.now()+"-"+Math.random().toString(36).slice(2)));localStorage.setItem("mjDevice",deviceId);}}catch(e){deviceId="dev-"+Date.now();}
    try{if(window.supabase&&window.supabase.createClient)sb=window.supabase.createClient(SB_URL,SB_KEY);}catch(e){}
    wireAuth();
    if(!sb){initApp();return;}
    try{const s=await sb.auth.getSession();if(s&&s.data&&s.data.session){await afterLogin(s.data.session.user);}else{showLogin();}}catch(e){showLogin();}
    try{sb.auth.onAuthStateChange((_e,s)=>{if(!s){currentUser=null;showLogin("Você saiu. Entre de novo quando quiser.");}});}catch(e){}
  }
  if("serviceWorker"in navigator){navigator.serviceWorker.register("sw.js").catch(()=>{});}
  boot();
})();
