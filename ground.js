// Visible creatures that can be met on foot on the surface.
const GROUND_SPECIES = [
  {id:'fire-bird',name:'Fire Bird',habitat:'ground',rate:.95,
    location:'Ember Highlands · walk into the bird on the ground'},
  {id:'garbage-hunk',name:'Garbage Hunk',habitat:'ground',rate:.97,
    location:'Meadows and Mushroom Marsh · walk into it'},
  {id:'seabird',name:'Seabird',habitat:'ground',rate:.97,
    location:'Sandy riverbanks · walk into the bird on land'},
].map(sp=>({...sp,draw:(...args)=>drawGroundCreature(sp.id,...args)}));
const groundWildlife=[];
let groundRandom, groundHabitats={};
const groundKey=(x,y)=>`${x},${y}`;
const surfaceLand=t=>[G,TG,SA,DK,MT,SN,HF].includes(t)||!!newBiomeByTile(t);
function groundReserved(x,y) {
  return [...TRAINERS,...MARKETS,...GYMS,CHAMPION_DOOR,FIRE_CAVE_SITE,tunnelEntrance,halloweenCavernEntrance]
    .some(site=>Math.abs(site.x-x)+Math.abs(site.y-y)<=1);
}
function groundHabitatMatches(id,x,y) {
  const t=map[y]?.[x];
  if(groundReserved(x,y))return false;
  if(id==='fire-bird')return t===newBiomeById('volcano').tile;
  if(id==='garbage-hunk')return (x<=15&&[G,TG].includes(t))||t===newBiomeById('marsh').tile;
  return t===SA;
}
function refreshGroundHabitats() {
  // Follow walking/boating rules so creatures never spawn on inaccessible banks.
  const queue=[{x:5,y:7,boat:false},...NEW_BIOMES.map(b=>({x:b.x,y:b.y,boat:false}))];
  const seen=new Set(queue.map(p=>`${p.x},${p.y},${p.boat}`)),land=new Set();
  for(let i=0;i<queue.length;i++) {
    const p=queue[i];if(!p.boat)land.add(groundKey(p.x,p.y));
    for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]) {
      const x=p.x+dx,y=p.y+dy,t=map[y]?.[x];
      if(x<1||y<1||x>=W-1||y>=H-1)continue;
      if([...TRAINERS,...MARKETS,...GYMS,CHAMPION_DOOR,FIRE_CAVE_SITE].some(s=>s.x===x&&s.y===y))continue;
      if(p.boat? ![WA,DK].includes(t): !surfaceLand(t)&&!(t===WA&&map[p.y][p.x]===DK))continue;
      const boat=t===WA,key=`${x},${y},${boat}`;
      if(!seen.has(key)){seen.add(key);queue.push({x,y,boat});}
    }
  }
  groundHabitats=Object.fromEntries(GROUND_SPECIES.map(sp=>[sp.id,
    [...land].map(key=>{const [x,y]=key.split(',').map(Number);return {x,y};})
      .filter(p=>groundHabitatMatches(sp.id,p.x,p.y))]));
}
function groundFree(mon,x,y) {
  return groundHabitatMatches(mon.id,x,y)&&
    groundHabitats[mon.id].some(p=>p.x===x&&p.y===y)&&
    !groundWildlife.some(other=>other!==mon&&other.active&&other.x===x&&other.y===y);
}
function respawnGroundCreature(mon) {
  const candidates=groundHabitats[mon.id].filter(p=>groundFree(mon,p.x,p.y)&&Math.hypot(p.x-P.x,p.y-P.y)>2);
  if(!candidates.length){mon.active=false;mon.respawnIn=2;return;}
  const point=candidates[Math.floor(groundRandom()*candidates.length)];
  Object.assign(mon,point,{fx:point.x,fy:point.y,progress:1,active:true,
    shiny:groundRandom()<1/8,moveIn:1+groundRandom()*2});
}
function initializeGroundWildlife() {
  groundRandom=rng(20261030);refreshGroundHabitats();groundWildlife.length=0;
  for(const sp of GROUND_SPECIES)for(let i=0;i<4;i++) {
    const mon={id:sp.id,active:false};groundWildlife.push(mon);respawnGroundCreature(mon);
  }
}
function updateGroundWildlife(dt) {
  if(underground||P.diving||modal)return;
  for(const mon of groundWildlife) {
    if(!mon.active){mon.respawnIn-=dt;if(mon.respawnIn<=0)respawnGroundCreature(mon);continue;}
    if(!groundHabitatMatches(mon.id,mon.x,mon.y)){respawnGroundCreature(mon);continue;}
    mon.progress=Math.min(1,mon.progress+dt/.55);mon.moveIn-=dt;
    if(mon.moveIn<=0&&mon.progress===1) {
      const [dx,dy]=[[1,0],[-1,0],[0,1],[0,-1]][Math.floor(groundRandom()*4)];
      const x=mon.x+dx,y=mon.y+dy;
      if(groundFree(mon,x,y))Object.assign(mon,{fx:mon.x,fy:mon.y,x,y,progress:0});
      mon.moveIn=1.5+groundRandom()*2;
    }
  }
  checkGroundEncounter();
}
function checkGroundEncounter() {
  if(underground||P.diving||P.boat||P.flying||modal||P.prog<1||encounterGrace>0||groundReserved(P.x,P.y))return false;
  const mon=groundWildlife.find(m=>m.active&&Math.hypot(
    m.fx+(m.x-m.fx)*m.progress-P.x,m.fy+(m.y-m.fy)*m.progress-P.y)<.65);
  if(!mon)return false;
  const sparkle=!!spotAt(mon.x,mon.y);
  startEncounter(byId(mon.id),mon.shiny||sparkle);
  if(!enc||enc.sp.id!==mon.id)return false;
  if(sparkle)removeSpot(mon.x,mon.y);
  mon.active=false;mon.respawnIn=20;
  return true;
}
function drawGroundWildlife(camX,camY) {
  if(underground||P.diving)return;
  for(const mon of groundWildlife) {
    if(!mon.active)continue;
    const x=(mon.fx+(mon.x-mon.fx)*mon.progress+.5)*T-camX;
    const y=(mon.fy+(mon.y-mon.fy)*mon.progress+.5)*T-camY;
    if(x< -50||y< -50||x>cv.width+50||y>cv.height+50)continue;
    ctx.save();ctx.fillStyle='#13253955';ctx.beginPath();ctx.ellipse(x,y+12,15,5,0,0,Math.PI*2);ctx.fill();
    const shiny=mon.shiny||!!spotAt(mon.x,mon.y);
    drawGroundCreature(mon.id,ctx,x,y-4,18,shiny,time);
    ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#20303d';ctx.fillStyle=shiny?'#fff0a2':'#fff';
    const name=(shiny?'✨ ':'')+byId(mon.id).name;ctx.strokeText(name,x,y-30);ctx.fillText(name,x,y-30);ctx.restore();
  }
}
function drawGroundCreature(id,c,x,y,size,shiny=false,t=0) {
  c.save();c.translate(x,y+Math.sin(t*3)*size*.025);c.scale(size,size);
  c.lineJoin='round';c.lineCap='round';c.strokeStyle='#263344';c.lineWidth=.055;
  const oval=(x,y,rx,ry,color,a=0)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,a,0,Math.PI*2);c.fill();c.stroke();};
  const shape=(p,color)=>{c.fillStyle=color;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke();};
  const line=(p,color,width=.07)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.strokeStyle='#263344';c.lineWidth=.055;};
  if(id==='garbage-hunk') {
    const body=shiny?'#aa77d9':'#5c917d',metal=shiny?'#f3c76c':'#a1b4bd',dark=shiny?'#68449c':'#3b635c';
    for(const side of[-1,1]) {
      line([[side*.5,0],[side*.88,.2],[side*.96,.55]],dark,.2);
      oval(side*.97,.55,.22,.2,body);oval(side*.38,.91,.29,.17,dark);
    }
    shape([[-.65,-.38],[.65,-.38],[.53,.82],[-.51,.82]],body);
    for(const offset of[-.32,0,.32])line([[offset,-.23],[offset,.61]],dark,.05);
    oval(0,-.48,.73,.17,metal,-.1);line([[-.18,-.64],[-.18,-.79],[.17,-.79],[.17,-.64]],metal,.1);
    shape([[-.57,-.56],[-.71,-1],[-.42,-.91],[-.28,-.6]],shiny?'#8ff2e2':'#f8db80');
    oval(-.25,-.05,.15,.18,'#fff');oval(.25,-.05,.15,.18,'#fff');
    oval(-.25,-.02,.06,.09,'#263344');oval(.25,-.02,.06,.09,'#263344');
    line([[-.2,.29],[0,.37],[.21,.27]],'#263344',.06);
    shape([[.25,.5],[.56,.4],[.64,.7],[.36,.76]],metal);
  } else {
    const fire=id==='fire-bird';
    const body=fire?(shiny?'#64b8f5':'#f0793f'):(shiny?'#c5a4ef':'#f0eee2');
    const wing=fire?(shiny?'#6c69cd':'#d6463c'):(shiny?'#7661b9':'#849eb1');
    const accent=fire?(shiny?'#cefcff':'#ffda63'):(shiny?'#86e9d0':'#f1b64f');
    for(const side of[-1,1]){line([[side*.24,.49],[side*.27,.88],[side*.45,.92]],accent,.1);line([[side*.27,.88],[side*.1,.95]],accent,.08);}
    shape([[.3,.25],[1,.43],[.82,.06],[.56,-.18]],wing);
    if(fire)for(let i=0;i<3;i++)shape([[.45,.3],[1.1+i*.03,.45-i*.23],[.68,-.08]],i===1?accent:body);
    oval(0,.14,.57,.55,body);oval(-.17,.31,.3,.31,fire?accent:'#fff8ee');
    oval(.24,.15,.3,.4,wing,.35);
    if(fire)shape([[.02,-.03],[.48,-.17],[.28,.33],[.06,.49]],accent);
    oval(-.21,-.44,.38,.37,body);
    shape([[-.5,-.43],[-.96,-.27],[-.48,-.14]],accent);
    oval(-.31,-.48,.1,.12,'#fff');oval(-.34,-.47,.045,.065,'#263344');
    if(fire)shape([[-.45,-.66],[-.35,-1.13],[-.13,-.83],[.09,-1.05],[.12,-.57]],accent);
    else line([[-.12,-.68],[.19,-.64]],wing,.07);
  }
  if(shiny)for(const [sx,sy]of[[1,-.83],[-.95,.22]])shape([[sx-.13,sy],[sx-.03,sy-.03],[sx,sy-.16],[sx+.04,sy-.03],[sx+.13,sy],[sx+.03,sy+.04],[sx,sy+.16],[sx-.03,sy+.03]],'#fff1a1');
  c.restore();
}
