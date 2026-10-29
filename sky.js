// Surface sky wildlife and riding a Fire Dragon from the player's collection.
const skyWildlife=[];
const dragonRideTargets=new WeakMap();
let skyRandom;
const ownedFireDragons = () => [...party,...box].filter(mon=>mon.id==='fire-dragon');
function markDragonRideTarget(element,mon) {
  if(mon.id!=='fire-dragon')return;
  element.dataset.rideDragon='true';dragonRideTargets.set(element,mon);
  element.title+=' · Hover and press 3 to ride on the surface';
}
function hoveredFireDragon() {
  return dragonRideTargets.get(document.querySelector('[data-ride-dragon]:hover'));
}
function restoreDragonFlight(saved) {
  P.flying=false;P.flightShiny=false;
  if(!saved.flying)return;
  const mount=ownedFireDragons().find(m=>!!m.shiny===!!saved.flightShiny)||ownedFireDragons()[0];
  if(underground||P.diving||P.boat)return;
  if(mount&&Number.isInteger(P.x)&&Number.isInteger(P.y)&&P.x>0&&P.y>0&&P.x<W-1&&P.y<H-1){P.flying=true;P.flightShiny=!!mount.shiny;}
  else Object.assign(P,{x:5,y:7,fx:5,fy:7});
}
function mountFireDragon(mon) {
  if(modal&&modal!=='party')return;
  if(P.flying)return;
  if(!mon||!ownedFireDragons().includes(mon)){toast('🐉 Hover over your Fire Dragon in Party, Box, or the party bar, then press 3.');return;}
  if(underground||P.diving||P.boat||P.prog<1){toast('🐉 Return to surface land and stop moving to take flight.');return;}
  if(modal==='party')closeParty();
  P.flying=true;P.flightShiny=!!mon.shiny;fishing=null;keys.clear();encounterGrace=4;
  persist();hud();toast('☁️ You are riding your Fire Dragon! Fly into shiny dragons to encounter them. Press 3 over clear ground to land.');
}
function canLandDragon() {
  const ground=map[P.y]?.[P.x];
  return ([G,TG,SA,DK,MT,SN,HF].includes(ground)||!!newBiomeByTile(ground))&&
    ![...TRAINERS,...surfaceSites()].some(site=>site.x===P.x&&site.y===P.y);
}
function landFireDragon() {
  if(!P.flying||(modal&&modal!=='party')||P.prog<1)return;
  if(!canLandDragon()){toast('Find clear ground to land—fly past water, trees, peaks, and buildings.');return;}
  if(modal==='party')closeParty();
  P.flying=false;keys.clear();encounterGrace=4;persist();hud();toast('🐉 Landed safely! Hover over your Fire Dragon and press 3 to fly again.');
}
function flightHud() {
  const owns=ownedFireDragons().length>0;
  $('btn-flight').hidden=!owns||underground||P.diving||P.boat;
  $('btn-flight').textContent=P.flying?'↓ Land dragon (3)':'🐉 Ride dragon';
  $('flight-help').hidden=!owns;
  $('flight-help').textContent=P.flying?'You are riding a Fire Dragon. Press 3 over clear ground to land.':'Hover over a Fire Dragon below and press 3 to ride it on surface land. Touch players: close Party and tap Ride dragon.';
  if(P.flying){$('hud-mode').textContent='🐉 Flying';$('hud-biome').textContent='☁️ Sky';document.querySelector('.hint').textContent='Arrows/WASD: fly · Touch sky dragons: shiny Lv 70 encounters · 3 / Land dragon: land over clear ground';}
}
function resetSkyDragon(mon) {
  const free=[];
  for(let y=mon.y1;y<=mon.y2;y++)for(let x=mon.x1;x<=mon.x2;x++)
    if(Math.hypot(x-P.x,y-P.y)>2&&!skyWildlife.some(m=>m!==mon&&m.x===x&&m.y===y))free.push({x,y});
  if(!free.length)return;
  const point=free[Math.floor(skyRandom()*free.length)];
  Object.assign(mon,point,{fx:point.x,fy:point.y,progress:1,moveIn:1+skyRandom()*2,life:60+skyRandom()*40,shiny:true});
}
function initializeSky() {
  skyRandom=rng(7070);skyWildlife.length=0;
  // Keep a dragon in each region, across the whole surface, even over rivers and peaks.
  for(let row=0;row<3;row++)for(let col=0;col<6;col++){
    const mon={id:'fire-dragon',x:-100,y:-100,x1:col*10+1,x2:Math.min(W-2,col*10+9),y1:row*14+1,y2:Math.min(H-2,row*14+14)};
    skyWildlife.push(mon);resetSkyDragon(mon);
  }
}
function updateSkyWildlife(dt) {
  for(const mon of skyWildlife){
    mon.progress=Math.min(1,mon.progress+dt/.65);mon.moveIn-=dt;mon.life-=dt;
    if(mon.life<=0)resetSkyDragon(mon);
    if(mon.moveIn<=0){
      const [dx,dy]=[[1,0],[-1,0],[0,1],[0,-1]][Math.floor(skyRandom()*4)];
      const x=mon.x+dx,y=mon.y+dy;
      if(x>=mon.x1&&x<=mon.x2&&y>=mon.y1&&y<=mon.y2&&!skyWildlife.some(m=>m!==mon&&m.x===x&&m.y===y)){
        mon.fx=mon.x;mon.fy=mon.y;mon.x=x;mon.y=y;mon.progress=0;
      }
      mon.moveIn=1+skyRandom()*2;
    }
  }
  checkSkyEncounter();
}
function checkSkyEncounter() {
  if(!P.flying||underground||P.diving||modal||P.prog<1||encounterGrace>0)return;
  const mon=skyWildlife.find(m=>Math.hypot(m.fx+(m.x-m.fx)*m.progress-P.x,m.fy+(m.y-m.fy)*m.progress-P.y)<.65);
  if(!mon)return;
  mon.x=mon.y=mon.fx=mon.fy=-100;mon.life=0;
  startEncounter(byId('fire-dragon'),true,false,false,false,'sky');
}
function drawSkyWildlife(camX,camY) {
  if(P.diving||underground)return;
  ctx.save();
  if(P.flying){ctx.fillStyle='#9edaff44';ctx.fillRect(0,0,cv.width,cv.height);}
  for(const mon of skyWildlife){
    const x=(mon.fx+(mon.x-mon.fx)*mon.progress+.5)*T-camX,y=(mon.fy+(mon.y-mon.fy)*mon.progress+.5)*T-camY;
    if(x< -80||y< -80||x>cv.width+80||y>cv.height+80)continue;
    ctx.globalAlpha=P.flying?.8:.4;ctx.fillStyle='#f0f8ff';
    for(const[dx,dy,rx]of[[-23,6,24],[0,1,34],[25,8,22]]){ctx.beginPath();ctx.ellipse(x+dx,y+dy,rx,13,0,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=P.flying?1:.75;drawFireDragon(ctx,x,y-7,P.flying?24:17,true,time);
    ctx.fillStyle=P.flying?'#fff5b3':'#ffffcf';ctx.strokeStyle='#324a6e';ctx.lineWidth=3;ctx.font='bold 11px sans-serif';ctx.textAlign='center';
    ctx.strokeText('✨ Lv 70',x,y-46);ctx.fillText('✨ Lv 70',x,y-46);
  }
  ctx.restore();
}
function drawDragonRider(px,py) {
  const x=px+T/2,y=py+T/2,bob=Math.sin(time*2)*2;
  ctx.save();drawFireDragon(ctx,x,y+5,24,P.flightShiny,time);
  ctx.fillStyle='#365cd6';ctx.fillRect(x-6,y-15+bob,12,13);
  ctx.fillStyle='#ffdbad';ctx.beginPath();ctx.arc(x,y-20+bob,6,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ec5660';ctx.beginPath();ctx.arc(x,y-23+bob,7,Math.PI,0);ctx.fill();ctx.fillRect(x-6,y-23+bob,14,3);
  ctx.restore();
}
