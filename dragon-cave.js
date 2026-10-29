// The Fire Dragon's lair unlocks permanently after the first Elite Four clear.
const FIRE_CAVE_SITE = {id:'fire-cave',name:'Fire Dragon Cave',icon:'🐉',x:3,y:3};
const FIRE_CAVE_EXIT = {x:6,y:8};
const FIRE_DRAGON_NEST = {x:52,y:16};
const FIRE_DRAGON = {id:'fire-dragon',name:'Fire Dragon',habitat:'fire-cave',postgameOnly:true,
  special:true,rate:.15,draw:(...args)=>drawFireDragon(...args)};
const fireCaveUnlocked = () => journey.eliteCleared;
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
  persist();hud();
  toast(firstVisit?'🎁 You received 20 balls with a 100% catch chance! Find the Fire Dragon at the end of the cave.':'🔥 Welcome back to Fire Dragon Cave! Follow the signs to the lair.');
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
  $('dragon-quest').textContent=journey.fireDragonCaught
    ?'🐉 Fire Dragon caught! Return to the entrance ladder. Your remaining 100% balls work on any wild creature.'
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
  else {ctx.fillText('🐉 Fire Dragon befriended!',x,y);ctx.font='12px sans-serif';ctx.fillText('Return to the entrance ladder',x,y+25);}
  drawPlayer(ppx-camX,ppy-camY);
  ctx.fillStyle='#ffc078';
  for(let i=0;i<18;i++){ctx.globalAlpha=.15+.12*Math.sin(time+i);ctx.fillRect((i*137+time*9)%cv.width,(i*91-time*14%cv.height+cv.height)%cv.height,2,3);}
  ctx.globalAlpha=1;
}
