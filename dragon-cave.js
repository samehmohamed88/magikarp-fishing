// The Fire Dragon's lair unlocks permanently after the first Elite Four clear.
const FIRE_CAVE_SITE = {id:'fire-cave',name:'Fire Dragon Cave',icon:'🐉',x:3,y:3};
const FIRE_CAVE_EXIT = {x:6,y:8};
const FIRE_DRAGON_NEST = {x:52,y:16};
const FIRE_DRAGON = {id:'fire-dragon',name:'Fire Dragon',habitat:'fire-cave',postgameOnly:true,
  special:true,rate:.15,draw:(...args)=>drawFireDragon(...args)};
const DRAGON_CHAMPIONS = [['squirt-turtle','Squirt Turtle'],['bulb-toad','Bulb Toad'],['fire-lizard','Fire Lizard']]
  .map(([id,name])=>({id,name,habitat:'fire-cave',postgameOnly:true,championWild:true,special:true,
    rate:.94,draw:(...args)=>drawDragonChampion(id,...args)}));
const fireCaveUnlocked = () => journey.eliteCleared;
const dragonChampionsUnlocked = () => fireCaveUnlocked()&&journey.fireDragonDefeated;
function syncDragonChampions() {
  if(!dragonChampionsUnlocked()){fireCaveWildlife.length=0;return;}
  const firstSpawns={
    'squirt-turtle':[{x:47,y:17},{x:10,y:9}],
    'bulb-toad':[{x:49,y:21},{x:28,y:12}],
    'fire-lizard':[{x:55,y:18},{x:35,y:34}],
  };
  for(const sp of DRAGON_CHAMPIONS)for(let i=fireCaveWildlife.filter(m=>m.id===sp.id).length;i<2;i++){
    const free=fireCaveTiles.filter(p=>Math.hypot(p.x-P.x,p.y-P.y)>2&&
      !fireCaveWildlife.some(m=>m.x===p.x&&m.y===p.y));
    if(!free.length)continue;
    const preferred=firstSpawns[sp.id][i];
    const p=free.find(p=>p.x===preferred.x&&p.y===preferred.y)||free[Math.floor(fireCaveRandom()*free.length)];
    fireCaveWildlife.push({id:sp.id,...p,fx:p.x,fy:p.y,progress:1,shiny:fireCaveRandom()<1/8,
      moveIn:2+fireCaveRandom()*2,life:60+fireCaveRandom()*40});
  }
}
function unlockDragonChampions() {
  if(!fireCaveUnlocked()||journey.fireDragonDefeated)return false;
  journey.fireDragonDefeated=true;syncDragonChampions();return true;
}
const dragonChampionMessage = 'Level-100 Squirt Turtles, Bulb Toads, and Fire Lizards now roam this cave!';
function buildFireCaveMap(width,height,wall,floor) {
  const layer=Array.from({length:height},()=>Array(width).fill(wall));
  // Four chambers joined by a single winding route. The nest is at the far end.
  for(const [x1,y1,x2,y2] of [[3,4,15,13],[13,9,25,11],[23,7,35,19],
    [28,17,30,32],[26,29,46,39],[44,21,46,35],[41,11,56,24]])
    for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)layer[y][x]=floor;
  return layer;
}
function enterFireCave() {
  if(modal||!fireCaveUnlocked()||nearLeagueSite()!==FIRE_CAVE_SITE||P.prog<1)return;
  dragonCave=underground=true;halloweenCavern=deepDiving=abyssDiving=false;
  activeMap=fireCaveMap;
  Object.assign(P,{...FIRE_CAVE_EXIT,fx:FIRE_CAVE_EXIT.x,fy:FIRE_CAVE_EXIT.y,prog:1,boat:false,diving:false});
  fishing=null;keys.clear();ignoredTrainer=null;caveGrace=encounterGrace=4;
  const firstVisit=!journey.fireCaveGift;
  if(firstVisit){journey.fireCaveGift=true;journey.perfectBalls+=20;}
  syncDragonChampions();
  persist();hud();
  toast(firstVisit?'🎁 You received 20 balls with a 100% catch chance! Find the Fire Dragon at the end of the cave.':dragonChampionsUnlocked()?dragonChampionMessage:'🔥 Welcome back to Fire Dragon Cave! Follow the signs to the lair.');
}
function leaveFireCave() {
  if(modal||!dragonCave||P.prog<1||!nearTunnel())return;
  dragonCave=underground=false;activeMap=map;
  Object.assign(P,{x:FIRE_CAVE_SITE.x,y:FIRE_CAVE_SITE.y+1,fx:FIRE_CAVE_SITE.x,fy:FIRE_CAVE_SITE.y+1,prog:1,boat:false,diving:false});
  keys.clear();encounterGrace=4;hud();persist();toast('☀️ Back in the meadow. Your remaining 100% balls are in your bag.');
}
function nearFireDragon() {
  return dragonCave&&!journey.fireDragonCaught&&Math.abs(P.x-FIRE_DRAGON_NEST.x)+Math.abs(P.y-FIRE_DRAGON_NEST.y)<=1;
}
function meetFireDragon() {
  if(modal||P.prog<1||!nearFireDragon()||!fireCaveUnlocked())return;
  startEncounter(byId('fire-dragon'),false);
}
function fireCaveHud() {
  $('dragon-quest').hidden=!dragonCave;
  $('dragon-quest').textContent=dragonChampionsUnlocked()
    ?`🐢 Level-100 Squirt Turtle, Bulb Toad & Fire Lizard are roaming! Touch them to encounter · 💎 ${journey.perfectBalls} guaranteed-catch balls left`
    :`🎁 First-visit gift: 20 guaranteed-catch balls · 💎 ${journey.perfectBalls} left · Follow the signs to the level-70 Fire Dragon!`;
  $('btn-dragon').hidden=!nearFireDragon();
}
function drawFireDragon(c,x,y,s,shiny=false,t=0) {
  c.save();c.translate(x,y+Math.sin(t*2)*s*.03);c.scale(s,s);
  c.lineJoin='round';c.lineCap='round';c.lineWidth=.045;c.strokeStyle='#351e35';
  const skin=shiny?'#567ee8':'#dd5637',light=shiny?'#a6d9ff':'#ffbd73',wing=shiny?'#a188e2':'#8c3449';
  const shape=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([a,b],i)=>i?c.lineTo(a,b):c.moveTo(a,b));c.closePath();c.fill();c.stroke();};
  const oval=(a,b,rx,ry,color,angle=0)=>{c.fillStyle=color;c.beginPath();c.ellipse(a,b,rx,ry,angle,0,Math.PI*2);c.fill();c.stroke();};
  const flap=Math.sin(t*2.8)*.1;
  // Batlike wings, each with three long fingers and a scalloped membrane.
  for(const side of [-1,1]) {
    c.save();c.scale(side,1);
    shape([[.25,-.2],[.78,-1.2-flap],[1.58,-1.04-flap],[1.38,-.1],[.94,-.35],[.65,.12]],wing);
    c.strokeStyle=skin;c.lineWidth=.07;c.beginPath();c.moveTo(.3,-.18);c.lineTo(.78,-1.2-flap);c.lineTo(1.58,-1.04-flap);
    c.moveTo(.78,-1.2-flap);c.lineTo(1.38,-.1);c.moveTo(.78,-1.2-flap);c.lineTo(.94,-.35);c.stroke();
    c.strokeStyle='#351e35';c.lineWidth=.045;c.restore();
  }
  // Curved tail tipped with an animated flame.
  c.strokeStyle='#351e35';c.lineWidth=.3;c.beginPath();c.moveTo(.3,.5);c.bezierCurveTo(1.05,1.1,1.5,.9,1.26,.38);c.stroke();
  c.strokeStyle=skin;c.lineWidth=.21;c.stroke();c.strokeStyle='#351e35';c.lineWidth=.045;
  const flicker=Math.sin(t*7)*.08;
  shape([[1.15,.46],[1.03,.18],[1.23,.23],[1.32,-.22-flicker],[1.5,.18],[1.41,.47]],shiny?'#68eaff':'#ffad3f');
  shape([[1.22,.43],[1.3,.06],[1.4,.4]],'#fff1a7');
  oval(0,.26,.56,.72,skin);oval(-.06,.39,.33,.5,light);
  for(const side of [-1,1]) {
    oval(side*.43,.81,.3,.18,skin);
    for(let i=0;i<3;i++)shape([[side*.43-.17+i*.11,.85],[side*.43-.12+i*.11,1.03],[side*.43-.07+i*.11,.85]],'#fff2cc');
    oval(side*.54,.17,.15,.36,skin,side*-.65);
  }
  oval(-.13,-.65,.46,.43,skin);
  shape([[-.5,-.85],[-.57,-1.28],[-.23,-.99]],'#ffe3a5');shape([[.12,-1],[.4,-1.25],[.31,-.76]],'#ffe3a5');
  oval(-.27,-.4,.42,.22,light);
  oval(-.32,-.73,.13,.16,'#fff5cf');oval(.05,-.71,.11,.15,'#fff5cf');
  oval(-.29,-.72,.05,.1,'#273145');oval(.06,-.7,.04,.09,'#273145');
  c.strokeStyle='#592c3c';c.lineWidth=.04;c.beginPath();c.moveTo(-.48,-.34);c.quadraticCurveTo(-.18,-.2,.02,-.33);c.stroke();
  shape([[-.36,-.31],[-.31,-.19],[-.26,-.28]],'#fff8df');
  c.restore();
}
function drawDragonChampion(id,c,x,y,s,shiny=false,t=0) {
  c.save();c.translate(x,y+Math.sin(t*3)*s*.025);c.scale(s,s);
  c.lineJoin='round';c.lineCap='round';c.strokeStyle='#243347';c.lineWidth=.045;
  const oval=(a,b,rx,ry,color,angle=0)=>{c.fillStyle=color;c.beginPath();c.ellipse(a,b,rx,ry,angle,0,Math.PI*2);c.fill();c.stroke();};
  const shape=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([a,b],i)=>i?c.lineTo(a,b):c.moveTo(a,b));c.closePath();c.fill();c.stroke();};
  const line=(points,color,width=.05)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([a,b],i)=>i?c.lineTo(a,b):c.moveTo(a,b));c.stroke();c.strokeStyle='#243347';c.lineWidth=.045;};
  const eye=(a,b)=>{oval(a,b,.12,.16,'#fff5da');oval(a-.025,b+.01,.05,.09,'#263248');oval(a-.045,b-.03,.025,.035,'#fff');};
  if(id==='squirt-turtle') {
    const skin=shiny?'#ad91eb':'#67badb',shell=shiny?'#62bda3':'#9b704c',belly=shiny?'#d7f8df':'#f6d8a0';
    // A curled swimming tail, four flippers, and a patterned dome shell.
    c.strokeStyle='#243347';c.lineWidth=.22;c.beginPath();c.arc(.83,.38,.28,-1.4,Math.PI*1.45);c.stroke();
    c.strokeStyle=skin;c.lineWidth=.14;c.stroke();c.strokeStyle='#243347';c.lineWidth=.045;
    for(const side of [-1,1]){oval(side*.39,.85,.3,.16,skin,side*-.25);oval(side*.64,.13,.2,.34,skin,side*.55);}
    oval(.02,.2,.62,.68,shell);oval(-.12,.35,.42,.49,belly);
    line([[.25,-.38],[.43,-.12],[.57,.1]],'#debc8a');line([[.43,-.12],[.29,.14],[.37,.48]],'#debc8a');
    for(const b of [.1,.32,.54])line([[-.43,b],[-.12,b+.08],[.23,b]],shiny?'#87bdaa':'#ba9e78',.035);
    oval(-.14,-.61,.51,.44,skin);eye(-.36,-.66);eye(.06,-.64);
    line([[-.3,-.37],[-.11,-.31],[.12,-.4]],'#35546d',.04);
    for(const[a,b]of[[.63,-.75],[.84,-1.04],[1.01,-.58]]){
      shape([[a,b-.12],[a-.07,b+.04],[a,b+.1],[a+.07,b+.04]],shiny?'#c7a8ff':'#9aeaff');
    }
  } else if(id==='bulb-toad') {
    const skin=shiny?'#63d6c7':'#87c96b',bulb=shiny?'#d98fcc':'#559d60',leaf=shiny?'#f2b1e0':'#92d778';
    // Four wide toes and a leafy bulb growing from a squat toad's back.
    for(const side of [-1,1]){
      oval(side*.63,.56,.35,.3,skin);
      for(let i=0;i<3;i++)oval(side*(.48+i*.16),.8,.12,.08,skin);
    }
    oval(.12,.2,.72,.58,skin);
    shape([[-.3,-.12],[-.71,-.63],[-.17,-.45],[.1,-.92],[.33,-.42],[.89,-.5],[.48,-.05]],leaf);
    oval(.16,-.49,.46,.57,bulb);line([[.16,-1.04],[-.02,-.56],[.07,-.05]],leaf,.05);
    line([[.16,-1.04],[.38,-.5],[.24,-.03]],leaf,.05);
    oval(-.24,.2,.55,.4,skin);oval(-.54,-.08,.2,.2,skin);oval(.05,-.08,.2,.2,skin);
    eye(-.53,-.09);eye(.05,-.08);
    line([[-.58,.32],[-.29,.4],[.09,.3]],'#386656',.04);
    for(const[a,b]of[[-.6,.22],[-.03,.48],[.55,.3]])oval(a,b,.08,.05,shiny?'#3e969e':'#518853');
  } else {
    const skin=shiny?'#50667e':'#ed8b45',belly=shiny?'#a9e0e3':'#ffe0a5';
    // Long flame-tipped tail and a wingless, upright lizard silhouette.
    c.strokeStyle='#243347';c.lineWidth=.26;c.beginPath();c.moveTo(.3,.5);c.bezierCurveTo(1.1,1.04,1.27,.55,1.15,.05);c.stroke();
    c.strokeStyle=skin;c.lineWidth=.18;c.stroke();c.strokeStyle='#243347';c.lineWidth=.045;
    shape([[1.02,.15],[.92,-.12],[1.08,-.08],[1.19,-.52-Math.sin(t*6)*.06],[1.4,-.08],[1.29,.18]],shiny?'#77ccff':'#ffb344');
    shape([[1.1,.1],[1.18,-.26],[1.29,.1]],'#fff3b1');
    for(const side of [-1,1])oval(side*.33,.83,.28,.16,skin);
    oval(0,.2,.44,.66,skin);oval(-.06,.35,.28,.45,belly);
    for(const side of [-1,1])oval(side*.49,.09,.13,.3,skin,side*.6);
    oval(-.13,-.67,.45,.41,skin);oval(-.32,-.43,.27,.16,belly);
    eye(-.32,-.72);eye(.06,-.67);
    line([[-.42,-.4],[-.14,-.33],[.13,-.42]],'#54413e',.04);
    shape([[-.14,-.36],[-.08,-.23],[-.03,-.37]],'#fff6dd');
    for(const[a,b]of[[.2,-.9],[.29,-.16],[.3,.22]])oval(a,b,.055,.045,shiny?'#8daeb9':'#c96c45');
  }
  c.restore();
}
function drawFireCaveTile(t,x,y,px,py) {
  const h=hash(x,y);
  ctx.fillStyle=t===CW?'#251e2c':h&1?'#6a4144':'#633b40';ctx.fillRect(px,py,T,T);
  if(t===CW) {
    ctx.fillStyle='#422c3c';ctx.beginPath();ctx.moveTo(px+3,py+32);ctx.lineTo(px+8,py+8);ctx.lineTo(px+28,py+3);ctx.lineTo(px+38,py+28);ctx.closePath();ctx.fill();
    if((h&3)===0){ctx.strokeStyle='#e98449';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px+12,py+5);ctx.lineTo(px+19,py+20);ctx.lineTo(px+10,py+30);ctx.stroke();}
  } else {
    ctx.fillStyle='#a46a58';ctx.fillRect(px+((h>>2)%28)+3,py+((h>>6)%28)+3,5,3);
  }
}
function drawFireCaveScene(camX,camY,ppx,ppy) {
  drawTunnelMarker(FIRE_CAVE_EXIT.x*T-camX,FIRE_CAVE_EXIT.y*T-camY,true);
  for(const [tx,ty,label] of [[10,6,'FIRE DRAGON LAIR →'],[29,12,'FOLLOW THE EMBERS ↓'],[34,34,'DRAGON LAIR →'],[45,26,'↑ LEVEL 70 DRAGON'],[43,17,'← EXIT VIA SOUTH PATH']]) {
    const x=(tx+.5)*T-camX,y=(ty+.5)*T-camY;
    ctx.font='bold 12px sans-serif';ctx.textAlign='center';const w=ctx.measureText(label).width+20;
    ctx.fillStyle='#291f31';ctx.fillRect(x-w/2,y-13,w,26);ctx.fillStyle='#ffdc98';ctx.fillText(label,x,y+4);
  }
  for(const [tx,ty] of [[4,5],[14,12],[24,8],[34,18],[27,30],[45,38],[42,12],[55,23]]) {
    const x=(tx+.5)*T-camX,y=(ty+.5)*T-camY;
    const glow=ctx.createRadialGradient(x,y,3,x,y,70);glow.addColorStop(0,'#ff963b55');glow.addColorStop(1,'#ff963b00');ctx.fillStyle=glow;ctx.fillRect(x-70,y-70,140,140);
    ctx.fillStyle='#342431';ctx.fillRect(x-4,y,8,15);ctx.fillStyle='#ffb04d';ctx.beginPath();ctx.ellipse(x,y-4,7,11+Math.sin(time*6+tx)*2,0,0,Math.PI*2);ctx.fill();
  }
  const x=(FIRE_DRAGON_NEST.x+.5)*T-camX,y=(FIRE_DRAGON_NEST.y+.5)*T-camY;
  ctx.strokeStyle='#edab6d';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y+12,70,32,0,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#fff1c6';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
  if(!journey.fireDragonCaught){drawFireDragon(ctx,x,y-12,46,false,time);ctx.fillText('FIRE DRAGON · Lv 70',x,y-88);ctx.font='12px sans-serif';ctx.fillText('Approach to encounter',x,y+62);}
  else {ctx.fillText('🐉 Fire Dragon befriended!',x,y);ctx.font='12px sans-serif';ctx.fillText('Level-100 creatures now roam the cave!',x,y+25);}
  if(dragonChampionsUnlocked())for(const mon of fireCaveWildlife){
    const mx=(mon.fx+(mon.x-mon.fx)*mon.progress+.5)*T-camX,my=(mon.fy+(mon.y-mon.fy)*mon.progress+.5)*T-camY;
    if(mx< -T||my< -T||mx>cv.width+T||my>cv.height+T)continue;
    byId(mon.id).draw(ctx,mx,my,21,mon.shiny,time);
    ctx.fillStyle=mon.shiny?'#ffef93':'#fff3db';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText(mon.shiny?'✨ Lv 100':'Lv 100',mx,my+32);
  }
  drawPlayer(ppx-camX,ppy-camY);
  ctx.fillStyle='#ffc078';
  for(let i=0;i<18;i++){ctx.globalAlpha=.15+.12*Math.sin(time+i);ctx.fillRect((i*137+time*9)%cv.width,(i*91-time*14%cv.height+cv.height)%cv.height,2,3);}
  ctx.globalAlpha=1;
}
