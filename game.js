// ===== Magikarp River Quest =====
const T = 40, W = 60, H = 45;
const G = 0, TG = 1, WA = 2, DK = 3, TR = 4, SA = 5, MT = 6, MP = 7, SN = 8, CF = 9, CW = 10, CP = 11, HF = 12, HT = 13;
const $ = id => document.getElementById(id);
const cv = $('world'), ctx = cv.getContext('2d');

// ---------- Creatures ----------
const SPECIES = [
  { id: 'magikarp', name: 'Magikarp', water: true, fishingWeight: 5, rate: 0.98 },
  { id: 'bunny', name: 'Bunny', weight: 40, rate: 0.97, draw: (...a) => drawAnimal('bunny', ...a) },
  { id: 'duck', name: 'Duck', weight: 25, rate: 0.96, draw: (...a) => drawAnimal('duck', ...a) },
  { id: 'frog', name: 'Frog', draw: (...a) => drawFrog(...a), emoji: '🐸', weight: 45, fishingWeight: 5, rate: 0.955 },
  { id: 'squirrel', name: 'Squirrel', weight: 12, rate: 0.95, draw: (...a) => drawAnimal('squirrel', ...a) },
  { id: 'fox', name: 'Fox', weight: 6, rate: 0.935, draw: (...a) => drawAnimal('fox', ...a) },
  { id: 'hedgehog', name: 'Hedgehog', weight: 2, rate: 0.925, draw: (...a) => drawAnimal('hedgehog', ...a) },
  { id: 'bouldersaur', name: 'Bouldersaur', weight: 4, rate: 0.92, draw: (...a) => drawBoulder(...a) },
  { id: 'snowy', name: 'Snowy', habitat: 'winter', rate: 0.955, draw: (...a) => drawSnowy(...a) },
  { id: 'shark', name: 'Shark', water: true, fishingShinyRate: 0.5, fishingWeight: 14, rate: 0.935, draw: (...a) => drawWaterAnimal('shark', ...a) },
  { id: 'catfish', name: 'Catfish', water: true, fishingShinyRate: 0.5, fishingWeight: 20, rate: 0.965, draw: (...a) => drawWaterAnimal('catfish', ...a) },
  { id: 'grunt', name: 'Grunt', water: true, fishingShinyRate: 0.5, fishingWeight: 14, rate: 0.97, draw: (...a) => drawWaterAnimal('grunt', ...a) },
  { id: 'spiny-dogfish', name: 'Spiny Dogfish', water: true, fishingShinyRate: 0.5, fishingWeight: 14, rate: 0.945, draw: (...a) => drawWaterAnimal('spiny-dogfish', ...a) },
  { id: 'crocodile', name: 'Crocodile', water: true, fishingShinyRate: 0.5, fishingWeight: 14, rate: 0.93, draw: (...a) => drawWaterAnimal('crocodile', ...a) },
  { id: 'alligator', name: 'Alligator', water: true, fishingShinyRate: 0.75, fishingWeight: 14, rate: 0.93, draw: (...a) => drawWaterAnimal('alligator', ...a) },
  { id: 'deer', name: 'Deer', weight: 20, rate: 0.96, draw: (...a) => drawLandAnimal('deer', ...a) },
  { id: 'bear', name: 'Bear', weight: 20, rate: 0.94, draw: (...a) => drawLandAnimal('bear', ...a) },
  { id: 'raccoon', name: 'Raccoon', weight: 20, rate: 0.96, draw: (...a) => drawLandAnimal('raccoon', ...a) },
  { id: 'badger', name: 'Badger', weight: 20, rate: 0.95, draw: (...a) => drawLandAnimal('badger', ...a) },
  { id: 'skunk', name: 'Skunk', weight: 20, rate: 0.96, draw: (...a) => drawLandAnimal('skunk', ...a) },
  { id: 'turtle', name: 'Turtle', weight: 20, rate: 0.97, draw: (...a) => drawLandAnimal('turtle', ...a) },
  { id: 'owl', name: 'Owl', weight: 20, rate: 0.95, draw: (...a) => drawLandAnimal('owl', ...a) },
  { id: 'mouse', name: 'Mouse', weight: 20, rate: 0.98, draw: (...a) => drawLandAnimal('mouse', ...a) },
  { id: 'porcupine', name: 'Porcupine', weight: 20, rate: 0.95, draw: (...a) => drawLandAnimal('porcupine', ...a) },
  { id: 'red-panda', name: 'Red Panda', weight: 20, rate: 0.95, draw: (...a) => drawLandAnimal('red-panda', ...a) },
  ...['narwhal', 'crab', 'lobster', 'starfish', 'mussel', 'octopus', 'squid'].map(id => ({
    id, name: id[0].toUpperCase() + id.slice(1), water: true, diveOnly: true,
    rate: 0.96, draw: (...a) => drawSeaCreature(id, ...a),
  })),
  ...[['mole','Mole'],['ant','Ant'],['spider','Spider'],['cricket','Cricket'],
    ['praying-mantis','Praying Mantis'],['cave-crawfish','Cave Crawfish']].map(([id,name]) => ({
    id, name, habitat: 'cave', rate: .96, draw: (...a) => drawCaveCreature(id, ...a),
  })),
  ...[['tyrannosaurus-rex','Tyrannosaurus rex'],['spinosaurus','Spinosaurus'],['giganotosaurus','Giganotosaurus']].map(([id,name]) => ({
    id, name, habitat: 'generator', rate: 1, draw: (...a) => drawDinosaur(id, ...a),
  })),
  ...['skeleton','crow','zombie','ghost'].map(id=>({
    id,name:id[0].toUpperCase()+id.slice(1),habitat:'halloween',rate:.96,
    draw:(...a)=>drawHalloweenCreature(id,...a),
  })),
  ...[['giant-squid','Giant Squid'],['colossal-squid','Colossal Squid'],
    ['great-white-shark','Great White Shark'],['tiger-shark','Tiger Shark'],['orca','Orca']].map(([id,name])=>({
    id,name,water:true,deepOnly:true,rate:.95,draw:(...a)=>drawDeepCreature(id,...a),
  })),
  ...[['mosasaurus','Mosasaurus'],['megalodon','Megalodon'],['elasmosaurus','Elasmosaurus']].map(([id,name])=>({
    id,name,water:true,habitat:'deep-generator',rate:1,draw:(...a)=>drawDeepCreature(id,...a),
  })),
  ...[['anglerfish','Anglerfish'],['gulper-eel','Gulper Eel'],['dumbo-octopus','Dumbo Octopus'],
    ['goblin-shark','Goblin Shark'],['frilled-shark','Frilled Shark'],['viperfish','Viperfish'],
    ['dragonfish','Dragonfish'],['barreleye','Barreleye'],['vampire-squid','Vampire Squid'],
    ['giant-isopod','Giant Isopod'],['nautilus','Nautilus'],['sea-pig','Sea Pig']].map(([id,name])=>({
    id,name,water:true,abyssOnly:true,rate:.95,draw:(...a)=>drawAbyssCreature(id,...a),
  })),
];
SPECIES.push(...BIOME_SPECIES);
const byId = id => SPECIES.find(s => s.id === id);

// Seasonal events follow the player's device calendar and recur each year.
function halloweenCalendar(date = new Date()) {
  return { open:date.getMonth()===9, ghosts:date.getMonth()===9&&date.getDate()===31,
    key:`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` };
}
function pickHalloweenAnimal(date = new Date()) {
  const season=halloweenCalendar(date);
  if(!season.open)return null;
  if(season.ghosts&&Math.random()<.05)return byId('ghost');
  return byId(['skeleton','crow','zombie'][Math.floor(Math.random()*3)]);
}
function drawHalloweenCreature(id,c,x,y,s,shiny=false,t=0) {
  c.save();c.translate(x,y+Math.sin(t*3)*s*.03);c.scale(s,s);c.lineJoin='round';c.lineCap='round';c.strokeStyle='#263046';c.lineWidth=.05;
  const oval=(x,y,rx,ry,color,angle=0)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,Math.PI*2);c.fill();c.stroke();};
  const line=(points,color,width=.08)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.strokeStyle='#263046';c.lineWidth=.05;};
  const shape=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke();};
  if(id==='crow') {
    const body=shiny?'#9971d0':'#38445f',light=shiny?'#dec0fa':'#697c99';
    for(const side of[-1,1]){line([[side*.22,.45],[side*.25,.83]],'#e9b66b');line([[side*.25,.83],[side*.47,.9]],'#e9b66b');}
    shape([[.18,.32],[1,.64],[.8,.1]],body);oval(0,.15,.6,.54,body);oval(.2,.16,.3,.43,light,-.5);
    oval(-.24,-.45,.4,.4,body);shape([[-.55,-.42],[-1,-.26],[-.5,-.15]],'#e9b66b');
    oval(-.35,-.51,.1,.12,'#fff');oval(-.38,-.5,.045,.07,'#22273b');
  } else if(id==='ghost') {
    const body=shiny?'#f4b5de':'#e9f3ff';
    c.fillStyle=body;c.beginPath();c.moveTo(-.7,.9);c.lineTo(-.7,-.15);c.bezierCurveTo(-.7,-1.2,.7,-1.2,.7,-.15);c.lineTo(.7,.9);
    for(let i=0;i<5;i++)c.lineTo(.7-i*.35,.9+(i%2?-.25:0));c.closePath();c.fill();c.stroke();
    oval(-.22,-.2,.12,.2,'#43516d');oval(.22,-.2,.12,.2,'#43516d');oval(0,.24,.12,.16,shiny?'#b35e9e':'#a0b9dd');
    for(const side of[-1,1])oval(side*.75,.1,.2,.13,body,side*.6);
  } else if(id==='skeleton') {
    const bone=shiny?'#a7e8ed':'#f1e3c7';
    for(const side of[-1,1]){
      line([[side*.18,.35],[side*.28,.7],[side*.27,1]],bone,.13);line([[side*.27,1],[side*.49,1]],bone,.13);
      line([[side*.27,-.21],[side*.63,.03],[side*.79,-.2]],bone,.12);
    }
    line([[0,-.22],[0,.5]],bone,.11);oval(0,.38,.31,.13,bone);
    for(let i=0;i<3;i++){c.strokeStyle=bone;c.lineWidth=.08;c.beginPath();c.ellipse(0,-.14+i*.16,.3-i*.04,.1,0,0,Math.PI*2);c.stroke();}
    c.strokeStyle='#263046';c.lineWidth=.05;oval(0,-.67,.43,.37,bone);
    oval(-.18,-.72,.105,.13,'#39445b');oval(.18,-.72,.105,.13,'#39445b');
    line([[-.2,-.43],[.2,-.43]],'#776b80',.04);
    for(let i=0;i<4;i++)line([[-.15+i*.1,-.49],[-.15+i*.1,-.37]],'#776b80',.025);
  } else {
    const skin=shiny?'#9bc8f0':'#9cc58d',shirt=shiny?'#866abb':'#8b6c87';
    for(const side of[-1,1]){line([[side*.23,.32],[side*.26,.9]],'#4c556e',.22);oval(side*.3,.93,.24,.12,'#364153');
      line([[side*.3,-.18],[side*.64,-.05],[side*.85,-.35]],shirt,.2);oval(side*.84,-.35,.14,.15,skin);}
    shape([[-.38,-.35],[.38,-.35],[.35,.54],[.1,.45],[-.1,.55],[-.35,.45]],shirt);
    oval(0,-.64,.42,.4,skin);shape([[-.38,-.9],[-.18,-1.07],[.03,-.94],[.3,-1],[.39,-.78]],'#46534a');
    for(const side of[-1,1]){oval(side*.18,-.69,.11,.12,'#fff0c8');oval(side*.18,-.67,.045,.06,'#263046');}
    line([[-.2,-.43],[.2,-.47]],'#4e675a',.04);
  }
  c.restore();
}

function drawDinosaur(id, c, x, y, s, shiny = false, t = 0) {
  const palettes = {
    'tyrannosaurus-rex': ['#79974f','#e1dfa1','#e9a24b','#fff0b9'],
    spinosaurus: ['#c87955','#f5d7aa','#668fd5','#c5e7ff'],
    giganotosaurus: ['#547f8b','#b9e1db','#ae6cbf','#f1cbff'],
  };
  const p=palettes[id],body=p[shiny?2:0],light=p[shiny?3:1],spino=id==='spinosaurus',giga=id==='giganotosaurus';
  c.save();c.translate(x,y+Math.sin(t*2)*s*.025);c.scale(s,s);c.strokeStyle='#26323d';c.lineWidth=.045;c.lineJoin='round';
  const oval=(x,y,rx,ry,color,angle=0)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,Math.PI*2);c.fill();c.stroke();};
  const shape=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke();};
  shape([[.35,-.12],[1.68,.1+Math.sin(t*3)*.1],[1.04,.48],[.38,.45]],body);
  if(spino){
    shape([[-.42,-.2],[-.38,-.82],[-.1,-1.23],[.26,-1.28],[.58,-1.03],[.8,-.63],[.85,-.03]],light);
    for(let i=0;i<5;i++){c.beginPath();c.moveTo(-.26+i*.22,-.12);c.lineTo(-.3+i*.23,-.7-Math.sin(i/4*Math.PI)*.48);c.stroke();}
  }
  oval(.15,.08,.85,.56,body);oval(-.05,.29,.56,.26,light);
  for(const side of [-1,1]){
    const px=side*.33+.12;
    oval(px,.55,.22,.42,body,-side*.2);shape([[px-.12,.77],[px-.46,.99],[px+.24,.99],[px+.14,.74]],body);
    for(let i=0;i<3;i++)shape([[px-.37+i*.16,.97],[px-.4+i*.16,1.06],[px-.28+i*.16,.97]],'#fff3ce');
  }
  oval(-.59,-.28,.32,.53,body,-.25);
  oval(-.88,-.64,spino?.35:.49,spino?.25:.34,body);
  oval(spino?-1.3:-1.07,-.51,spino?.52:.4,spino?.14:.2,body);
  shape([[-1.55,-.44],[-.69,-.4],[-.83,-.24],[-1.48,-.3]],'#9c505a');
  for(let i=0;i<5;i++)shape([[-1.48+i*.15,-.42],[-1.43+i*.15,-.31],[-1.38+i*.15,-.42]],'#fff4d8');
  oval(-.87,-.72,.1,.1,'#fff');oval(-.9,-.72,.045,.065,'#202835');
  if(giga){for(let i=0;i<6;i++)shape([[-.45+i*.2,-.43],[-.37+i*.2,-.65],[-.29+i*.2,-.38]],light);shape([[-1.08,-.83],[-.8,-.92],[-.65,-.78]],light);}
  c.lineWidth=.12;c.lineCap='round';c.strokeStyle=body;c.beginPath();c.moveTo(-.45,.06);c.lineTo(-.65,.35);c.lineTo(spino?-.99:-.77,.28);c.stroke();
  c.strokeStyle='#fff3ce';c.lineWidth=.035;for(let i=0;i<2;i++){c.beginPath();c.moveTo((spino?-.99:-.77)+i*.05,.28);c.lineTo((spino?-1.06:-.84)+i*.05,.36);c.stroke();}
  c.restore();
}

function drawCaveCreature(id, c, x, y, s, shiny = false, t = 0) {
  if (id === 'cave-crawfish') {
    drawSeaCreature('lobster', c, x, y, s * .85, shiny, t, ['#d6bdb1','#fff1df','#83d8ba','#d7fff3']); return;
  }
  const palettes = {
    mole: ['#92715e','#d6b59a','#a58be3','#e8d8ff'],
    ant: ['#9d5348','#df9480','#65bac5','#b8f1ee'],
    spider: ['#76618e','#c1a2dc','#ecaf5d','#ffe2a3'],
    cricket: ['#a88e4d','#dec788','#78bfdc','#d0f4ff'],
    'praying-mantis': ['#80b35a','#d1ed99','#eb97c3','#ffe1f0'],
  };
  const p = palettes[id], body = p[shiny ? 2 : 0], light = p[shiny ? 3 : 1];
  c.save(); c.translate(x, y); c.scale(s, s); c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = '#2c2937'; c.lineWidth = .05;
  const oval = (x,y,rx,ry,color,angle=0) => {c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,Math.PI*2);c.fill();c.stroke();};
  const line = (points,color=body,width=.08) => {c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.strokeStyle='#2c2937';c.lineWidth=.05;};
  const sway = Math.sin(t*4)*.07;
  if (id === 'mole') {
    oval(0,.17,.7,.64,body);oval(0,-.25,.58,.47,body);
    for(const side of [-1,1]) {
      oval(side*.65,.28,.34,.25,light,side*.4);
      for(let i=0;i<3;i++)line([[side*(.55+i*.12),.35],[side*(.61+i*.13),.62]],'#fff0d9',.07);
      oval(side*.25,-.3,.055,.06,'#171c2a');oval(side*.3,.7,.25,.14,body);
    }
    oval(0,-.1,.23,.14,'#ef9ea9');
    for(const side of [-1,1])line([[side*.15,-.02],[side*.48,-.04]],light,.035);
  } else {
    const mantis=id==='praying-mantis', spider=id==='spider', cricket=id==='cricket';
    for(const side of [-1,1])for(let i=0;i<(spider?4:3);i++) {
      const y=-.25+i*.27;
      line([[side*.25,y],[side*(.8+(cricket&&i===2?.35:0)),y-.2+sway],[side*(1.02+(cricket&&i===2?.2:0)),y+.36]],body,cricket&&i===2?.13:.075);
    }
    if (mantis) {
      oval(0,.42,.27,.5,body);oval(0,-.08,.16,.42,body);
      for(const side of [-1,1]) {
        line([[side*.1,-.2],[side*.66,-.7],[side*.32,-.95],[side*.4,-.55]],light,.1);
        for(let i=0;i<3;i++)line([[side*(.35+i*.08),-.77+i*.06],[side*(.3+i*.08),-.65+i*.06]],body,.03);
      }
      c.fillStyle=body;c.beginPath();c.moveTo(-.48,-.65);c.lineTo(.48,-.65);c.lineTo(0,-.24);c.closePath();c.fill();c.stroke();
    } else {
      oval(0,.38,spider?.55:.35,spider?.52:.4,body);
      if(id==='ant')oval(0,-.1,.26,.27,body);
      if(cricket){oval(-.13,.23,.21,.48,light,-.2);oval(.13,.23,.21,.48,body,.2);}
      oval(0,-.48,spider?.33:.36,.32,body);
    }
    for(const side of [-1,1]) {
      if(!spider)line([[side*.15,-.65],[side*.3,-1.05],[side*.58,-1.22+sway]],light,.035);
      oval(side*(mantis?.3:.15),mantis?-.57:-.5,.1,.11,light);
      oval(side*(mantis?.3:.15),mantis?-.57:-.5,.045,.065,'#192033');
    }
    if(spider)for(const side of [-1,1])oval(side*.07,-.68,.035,.04,light);
  }
  c.restore();
}

function drawAbyssCreature(id,c,x,y,s,shiny=false,t=0) {
  const palettes={anglerfish:['#596394','#a7d6e8','#c081c4','#fbe2a1'],
    'gulper-eel':['#435e73','#9dc5ca','#9762be','#e5bfff'],
    'dumbo-octopus':['#e8aa87','#ffe0b9','#81b4e0','#d8f7ff'],
    'goblin-shark':['#d395a5','#f9d4d5','#76bac9','#d4f9ef'],
    'frilled-shark':['#8d8c70','#d6cfb0','#ad79cb','#ecd3ff'],
    viperfish:['#7698af','#d9f4fb','#ddad53','#fff0bd'],
    dragonfish:['#3b4e68','#75e4db','#a65b90','#ffcc78'],
    barreleye:['#587b98','#a1ebcb','#ac82c5','#ffda85'],
    'vampire-squid':['#9e435e','#ed8b83','#597ad3','#b2e4ff'],
    'giant-isopod':['#9f9baf','#d3d2e2','#d59c6a','#ffe0b4'],
    nautilus:['#f1d1a5','#b87955','#9bdfcd','#438ca5'],
    'sea-pig':['#eda6be','#ffd9e3','#8fc9ac','#d8ffe1']};
  const p=palettes[id],body=p[shiny?2:0],light=p[shiny?3:1],sway=Math.sin(t*3)*.12;
  c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#1b2440';c.lineWidth=.045;c.lineJoin='round';c.lineCap='round';
  const oval=(x,y,rx,ry,color,angle=0)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,Math.PI*2);c.fill();c.stroke();};
  const shape=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke();};
  const line=(points,color,width=.045)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.strokeStyle='#1b2440';c.lineWidth=.045;};
  const eye=(x,y)=>{oval(x,y,.13,.15,'#fff');oval(x-.02,y,.055,.08,'#17263b');};
  if(id==='anglerfish') {
    shape([[.48,-.2],[1.16,-.5+sway],[1,.05],[1.16,.5+sway],[.48,.25]],body);
    oval(-.05,.08,.82,.68,body);oval(-.12,.35,.55,.22,light);
    shape([[.1,.15],[.62,.65],[.6,.14]],light);
    c.strokeStyle=light;c.lineWidth=.07;c.beginPath();c.moveTo(-.14,-.5);c.bezierCurveTo(-.08,-1.3,-1.05,-1.3,-1.05,-.65);c.stroke();
    c.strokeStyle='#1b2440';c.lineWidth=.045;
    const glow=c.createRadialGradient(-1.05,-.65,.02,-1.05,-.65,.33);glow.addColorStop(0,'#ffffb8cc');glow.addColorStop(1,'#ffffb800');c.fillStyle=glow;c.fillRect(-1.4,-1,.7,.7);
    oval(-1.05,-.65,.13,.14,'#fff6a0');eye(-.45,-.12);
    oval(-.56,.31,.38,.19,'#263047');
    for(let i=0;i<4;i++)shape([[-.87+i*.17,.22],[-.81+i*.17,.38],[-.75+i*.17,.22]],'#fff4cf');
  } else if(id==='gulper-eel') {
    c.strokeStyle='#1b2440';c.lineWidth=.26;c.beginPath();c.moveTo(-.1,.03);c.bezierCurveTo(.6,-.1,.5,.65,1,.6+sway);c.quadraticCurveTo(1.45,.5,1.14,-.25+sway);c.stroke();
    c.strokeStyle=body;c.lineWidth=.18;c.stroke();c.strokeStyle='#1b2440';c.lineWidth=.045;
    oval(-.52,.1,.67,.4,body);shape([[-1.16,.02],[-.65,.22],[-.17,.13],[-.48,.63]],light);
    c.beginPath();c.moveTo(-1.15,.04);c.lineTo(-.55,.24);c.lineTo(-.18,.13);c.stroke();
    eye(-.76,-.08);oval(1.14,-.25+sway,.065,.065,'#f7e8a4');
  } else if(id==='dumbo-octopus') {
    for(let i=0;i<8;i++) {
      const x=-.55+i*.16;c.strokeStyle='#1b2440';c.lineWidth=.17;c.beginPath();c.moveTo(x,.25);
      c.quadraticCurveTo(x*1.6,.9+sway,x*1.75,.72+Math.sin(t*3+i)*.08);c.stroke();c.strokeStyle=body;c.lineWidth=.11;c.stroke();
    }
    c.strokeStyle='#1b2440';c.lineWidth=.045;
    oval(-.68,-.42,.4,.27,body,-.4-sway);oval(.68,-.42,.4,.27,body,.4+sway);
    oval(0,-.08,.6,.69,body);oval(.17,-.35,.15,.23,light,-.4);
    eye(-.23,.1);eye(.23,.1);oval(0,.35,.1,.065,light);
  } else if(id==='goblin-shark') {
    shape([[.55,-.13],[1.35,-.7+sway],[1.08,.03],[1.3,.34+sway],[.55,.2]],body);
    shape([[.1,-.2],[.35,-.67],[.6,-.17]],body);
    oval(.05,.03,.84,.34,body);oval(.03,.19,.59,.14,light);
    shape([[-.48,-.23],[-1.45,-.35],[-1.27,-.12],[-.5,.04]],body);
    shape([[-.55,.01],[-1.18,.12],[-.86,.4],[-.43,.26]],light);
    line([[-1.13,.14],[-.78,.24],[-.5,.12]],'#1b2440');
    for(let i=0;i<3;i++)shape([[-1.08+i*.15,.16],[-1+i*.15,.29],[-.94+i*.15,.19]],'#fff9dc');
    shape([[.03,.15],[.47,.68+sway],[.51,.2]],body);eye(-.48,-.08);
    for(let i=0;i<3;i++)line([[-.19+i*.12,-.07],[-.25+i*.12,.12]],'#75586d',.03);
  } else if(id==='frilled-shark') {
    c.strokeStyle='#1b2440';c.lineWidth=.37;c.beginPath();c.moveTo(-.6,-.03);c.bezierCurveTo(.15,-.4,.17,.5,.73,.38);c.quadraticCurveTo(1.35,.3,1.16,-.39+sway);c.stroke();
    c.strokeStyle=body;c.lineWidth=.28;c.stroke();c.strokeStyle='#1b2440';c.lineWidth=.045;
    shape([[.7,.33],[.82,.03],[1.2,.14]],light);
    shape([[-.13,.13],[.11,.59],[.29,.21]],body);
    oval(-.77,-.06,.47,.24,body);eye(-.87,-.13);
    line([[-1.18,.04],[-.79,.12]],'#1b2440');
    for(let i=0;i<6;i++)line([[-.5+i*.09,-.19],[-.55+i*.09,-.01],[-.48+i*.09,.17]],light,.045);
    for(let i=0;i<3;i++)shape([[-1.17+i*.11,.05],[-1.11+i*.11,.16],[-1.06+i*.11,.08]],'#fff5d9');
  } else if(id==='viperfish'||id==='dragonfish') {
    const dragon=id==='dragonfish';
    shape([[.61,-.12],[1.36,-.39+sway],[1.15,.02],[1.36,.34+sway],[.61,.17]],body);
    shape([[-.05,-.16],[.29,dragon?-.47:-.64],[.66,-.1]],light);
    oval(-.07,0,.98,dragon?.22:.32,body);
    shape([[-1.08,.01],[-.62,.03],[-.39,.32],[-.99,.24]],'#1d293e');
    for(let i=0;i<3;i++)shape([[-1.02+i*.17,.04],[-.95+i*.17,dragon?.28:.43],[-.88+i*.17,.06]],'#f4f7dd');
    eye(-.73,-.13);
    for(let i=0;i<7;i++)oval(-.36+i*.18,.12,.033,.033,dragon?light:'#a4ffef');
    shape([[.08,.14],[.42,.48],[.49,.15]],body);
    if(dragon){line([[-.88,.25],[-.96,.61],[-.64,.74+sway]],light,.03);oval(-.64,.74+sway,.09,.09,light);}
    else {line([[.2,-.32],[.36,-.94],[.01,-1.02]],light,.025);oval(.01,-1.02,.055,.055,'#a4ffef');}
  } else if(id==='barreleye') {
    shape([[.55,-.19],[1.18,-.51+sway],[1.05,0],[1.18,.51+sway],[.55,.2]],light);
    oval(.06,.1,.85,.38,body);
    oval(-.49,-.2,.58,.53,shiny?'#dcb5ed88':'#c2fff488');
    for(const x of[-.69,-.36]){oval(x,-.23,.13,.28,light,-.15);oval(x-.02,-.42,.09,.07,shiny?'#fff2ac':'#deffb4');}
    c.strokeStyle='#d8ffff';c.lineWidth=.025;c.beginPath();c.ellipse(-.49,-.2,.58,.53,0,Math.PI,Math.PI*1.6);c.stroke();c.strokeStyle='#1b2440';c.lineWidth=.045;
    oval(-.88,.12,.04,.04,'#25304a');line([[-.98,.25],[-.73,.29]],'#1b2440',.03);
    shape([[.01,.19],[.35,.65],[.6,.23]],light);
  } else if(id==='vampire-squid') {
    const hem=.85+sway;
    shape([[0,-.2],[-1.04,hem],[-.73,hem-.13],[-.48,hem+.12],[-.23,hem-.04],[0,hem+.18],[.23,hem-.04],[.48,hem+.12],[.73,hem-.13],[1.04,hem]],body);
    for(const end of[-.95,-.48,0,.48,.95]){
      line([[end*.18,.13],[end,hem]],light,.04);
      oval(end,hem,.045,.045,light);
    }
    oval(-.53,-.44,.33,.17,light,-.5-sway);oval(.53,-.44,.33,.17,light,.5+sway);
    oval(0,-.2,.49,.64,body);oval(.15,-.5,.1,.17,light,-.3);
    eye(-.23,.04);eye(.23,.04);
  } else if(id==='giant-isopod') {
    for(let i=0;i<7;i++)for(const side of[-1,1]){
      const x=-.5+i*.19;line([[x,side*.2],[x+.13,side*(.55+sway*.3)],[x-.05,side*.72]],light,.085);
    }
    shape([[.69,-.2],[1.13,-.32],[1.27,0],[1.13,.32],[.69,.2]],light);
    oval(.08,0,.87,.5,body);
    for(let i=0;i<6;i++){
      const x=-.44+i*.21;c.strokeStyle=light;c.lineWidth=.055;c.beginPath();c.moveTo(x,-.42);c.quadraticCurveTo(x+.24,0,x,.42);c.stroke();
    }
    c.strokeStyle='#1b2440';c.lineWidth=.045;oval(-.68,0,.34,.35,body);
    for(const side of[-1,1]){line([[-.87,side*.14],[-1.17,side*.34],[-1.35,side*(.24+sway)]],light,.035);oval(-.82,side*.17,.06,.07,'#17263b');}
  } else if(id==='nautilus') {
    for(let i=0;i<8;i++){
      const y=(i-3.5)*.11;line([[-.51,.2],[-.99,y+.18],[-1.28-Math.sin(i)*.08,y+.3+sway]],body,.06);
    }
    oval(.17,-.06,.77,.76,body);
    for(let i=0;i<11;i++){
      const a=i*.5;line([[.17+Math.cos(a)*.55,-.06+Math.sin(a)*.55],[.17+Math.cos(a+.12)*.73,-.06+Math.sin(a+.12)*.73]],light,.085);
    }
    c.strokeStyle=light;c.lineWidth=.055;c.beginPath();
    for(let i=0;i<=100;i++){const a=i*.15,r=.03+i*.0056;const px=.17+Math.cos(a)*r,py=-.06+Math.sin(a)*r;i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();
    c.strokeStyle='#1b2440';c.lineWidth=.045;
    oval(-.53,.27,.32,.25,light);eye(-.63,.2);
  } else if(id==='sea-pig') {
    for(let i=0;i<5;i++)for(const side of[-1,1])oval(-.62+i*.31,side*.4,.11,.27,light,side*.2+sway);
    for(const x of[-.45,.4]){
      line([[x,-.24],[x-.08,-.78+sway],[x+.03,-.9+sway]],body,.09);oval(x+.03,-.9+sway,.075,.065,light);
    }
    oval(0,.02,.95,.44,body);oval(.1,-.14,.55,.13,light,-.08);
    for(let i=0;i<4;i++)oval(-.35+i*.22,.17,.055,.055,light);
    oval(-.8,.1,.17,.2,light);line([[-.94,.08],[-1.07,.02],[-1.13,.13]],body,.055);
  }
  if(shiny){c.strokeStyle='#fff2a6';c.lineWidth=.045;c.beginPath();c.moveTo(.8,-.85);c.lineTo(1.04,-.85);c.moveTo(.92,-.97);c.lineTo(.92,-.73);c.stroke();}
  c.restore();
}

function drawDeepCreature(id,c,x,y,s,shiny=false,t=0) {
  const palettes={
    'giant-squid':['#c66c75','#f7b3b4','#529de0','#c9efff'],
    'colossal-squid':['#99485c','#e88e91','#9565df','#ead1ff'],
    'great-white-shark':['#7894aa','#f3f6e9','#d6a54d','#fff0ae'],
    'tiger-shark':['#788e72','#dce5bb','#be7bd2','#f3d7ff'],
    orca:['#25374c','#f4f8ef','#9067c4','#f6d8ff'],
    mosasaurus:['#467d82','#b2dacc','#bf8e3f','#ffe4a8'],
    megalodon:['#4a5e7c','#b6cbd6','#a35579','#f8c2db'],
    elasmosaurus:['#6c91b7','#d1ebf1','#65b388','#d4ffd4'],
  };
  const p=palettes[id],body=p[shiny?2:0],belly=p[shiny?3:1],sway=Math.sin(t*4)*.1;
  c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#1d2b42';c.lineWidth=.045;c.lineJoin='round';c.lineCap='round';
  const oval=(x,y,rx,ry,color,angle=0)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,Math.PI*2);c.fill();c.stroke();};
  const shape=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke();};
  const line=(points,color,width=.045)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.strokeStyle='#1d2b42';c.lineWidth=.045;};
  const eye=(x,y,size=.1)=>{oval(x,y,size,size*1.15,'#fff');oval(x-.025,y,size*.43,size*.65,'#17293f');};
  if(id==='giant-squid'||id==='colossal-squid') {
    const colossal=id==='colossal-squid';
    for(let i=0;i<8;i++) {
      const start=-.35+i*.1,end=(i-3.5)*.2;
      c.strokeStyle='#1d2b42';c.lineWidth=colossal?.17:.12;c.beginPath();c.moveTo(start,.1);
      c.bezierCurveTo(start,.7,end+sway,1.15,end+(i%2?.12:-.12),.95+Math.sin(t*3+i)*.08);c.stroke();
      c.strokeStyle=body;c.lineWidth=colossal?.11:.07;c.stroke();
    }
    for(const side of[-1,1]) {
      line([[side*.3,.1],[side*.85,.6+sway],[side*1.15,colossal?.65:1.1]],body,colossal?.14:.07);
      oval(side*1.15,colossal?.65:1.1,.16,.1,belly,side*.4);
    }
    shape([[0,-1.12],[-.85,colossal?-.35:-.55],[.85,colossal?-.35:-.55]],belly);
    oval(0,-.4,colossal?.65:.37,colossal?.65:.8,body);oval(.2,-.65,.12,.22,belly,-.35);
    eye(-.22,-.02,colossal?.18:.12);eye(.22,-.02,colossal?.18:.12);
  } else if(id==='elasmosaurus') {
    for(const px of[-.35,.45])for(const side of[-1,1])
      shape([[px,side*.12],[px+.42,side*(.8+sway)],[px+.55,side*.2]],body);
    shape([[.55,-.13],[1.4,.14+sway],[.5,.25]],body);
    oval(.1,.1,.72,.36,body);oval(.05,.24,.53,.15,belly);
    c.strokeStyle='#1d2b42';c.lineWidth=.29;c.beginPath();c.moveTo(-.35,.02);c.bezierCurveTo(-1,.05,-.45,-.85,-1.05,-.88);c.stroke();
    c.strokeStyle=body;c.lineWidth=.2;c.stroke();c.strokeStyle='#1d2b42';c.lineWidth=.045;
    oval(-1.1,-.88,.3,.16,body);eye(-1.16,-.92,.055);line([[-1.36,-.83],[-1.13,-.8]],'#1d2b42',.025);
  } else if(id==='mosasaurus') {
    shape([[.5,-.2],[1.4,-.65+sway],[1.1,.04],[1.4,.42+sway],[.5,.2]],body);
    for(const px of[-.5,.35])for(const side of[-1,1])shape([[px,side*.12],[px+.4,side*(.65+sway)],[px+.55,side*.2]],body);
    oval(0,0,.85,.33,body);oval(-.1,.14,.6,.14,belly);
    shape([[-.5,-.26],[-1.42,-.12],[-1.48,.1],[-.55,.24]],body);
    line([[-1.4,.06],[-.65,.12]],'#1d2b42');
    for(let i=0;i<5;i++)shape([[-1.35+i*.13,.06],[-1.28+i*.13,.18],[-1.22+i*.13,.08]],'#fff9d6');
    eye(-.65,-.16,.08);
  } else {
    const orca=id==='orca',mega=id==='megalodon',tiger=id==='tiger-shark';
    shape([[.65,-.13],[1.4,-.6+sway],[1.12,sway],[1.4,.5+sway],[.65,.2]],body);
    shape([[-.2,-.22],[orca?-.05:.08,orca?-1.05:-.86],[.5,-.2]],body);
    shape([[-.08,.1],[.35,.8],[.53,.19]],body);
    oval(-.03,0,mega?1.08:1,orca?.43:mega?.46:.36,body);
    oval(-.15,.19,.72,orca?.2:.15,belly);
    if(orca){oval(-.46,-.17,.22,.1,belly,-.2);oval(.45,-.15,.19,.1,'#8eacc1');}
    if(tiger)for(let i=0;i<6;i++)line([[-.4+i*.19,-.29],[-.5+i*.19,-.07]],'#425d54',.065);
    if(!orca)for(let i=0;i<3;i++)line([[-.33+i*.12,-.12],[-.38+i*.12,.1]],'#31465d',.03);
    eye(-.72,-.11,orca?.055:.085);line([[-.98,.08],[-.6,.15]],'#1d2b42',.035);
    if(!orca)for(let i=0;i<(mega?5:3);i++)shape([[-1+i*.08,.09],[-.96+i*.08,mega?.24:.18],[-.92+i*.08,.11]],'#fff8da');
  }
  if(shiny){c.strokeStyle='#fff2a0';c.lineWidth=.04;for(const [px,py]of[[-1.2,-.6],[1.2,.75]]){c.beginPath();c.moveTo(px-.1,py);c.lineTo(px+.1,py);c.moveTo(px,py-.1);c.lineTo(px,py+.1);c.stroke();}}
  c.restore();
}

function drawSeaCreature(id, c, x, y, s, shiny = false, t = 0, palette = null) {
  const palettes = {
    narwhal: ['#73aecb', '#d6eff7', '#ee97c4', '#ffe1f1'],
    crab: ['#ef7646', '#ffcc89', '#5ad3d0', '#c9fff3'],
    lobster: ['#d8514b', '#ffac85', '#558aff', '#bcecff'],
    starfish: ['#f3ba50', '#ffdd93', '#b18af3', '#eddaff'],
    mussel: ['#495a9a', '#a5b9ed', '#319d85', '#b4f5d1'],
    octopus: ['#da7aa9', '#ffc1d9', '#e8b33c', '#fff0a7'],
    squid: ['#a688d8', '#dfccf6', '#69c38a', '#d8ffb6'],
  };
  const p = palette || palettes[id], body = p[shiny ? 2 : 0], light = p[shiny ? 3 : 1];
  c.save(); c.translate(x, y); c.scale(s, s);
  c.strokeStyle = '#23394b'; c.lineWidth = .05; c.lineJoin = 'round'; c.lineCap = 'round';
  const oval = (px, py, rx, ry, color, angle = 0) => {
    c.fillStyle = color; c.beginPath(); c.ellipse(px, py, rx, ry, angle, 0, Math.PI * 2); c.fill(); c.stroke();
  };
  const shape = (points, color) => {
    c.fillStyle = color; c.beginPath(); points.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.closePath(); c.fill(); c.stroke();
  };
  const line = (points, color, width = .05) => {
    c.strokeStyle = color; c.lineWidth = width; c.beginPath();
    points.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke();
    c.strokeStyle = '#23394b'; c.lineWidth = .05;
  };
  const sway = Math.sin(t * 4) * .1;
  let eyeY = -.13, eyeX = .23;
  if (id === 'narwhal') {
    shape([[.55,-.12],[1.3,-.6+sway],[1.05,0],[1.3,.5+sway],[.55,.16]], body);
    oval(0, 0, .95, .5, body); oval(-.12, .2, .67, .2, light);
    shape([[-.15,.15],[.4,.7],[.5,.2]], body);
    shape([[-.65,-.2],[-1.65,-.5],[-.65,-.35]], '#fff1c9');
    for (let i = 0; i < 4; i++) line([[-.8-i*.16,-.33-i*.035],[-.85-i*.16,-.26-i*.06]], '#ba9b78', .025);
    oval(-.58, -.17, .1, .12, '#fff'); oval(-.61, -.15, .045, .07, '#23394b');
    c.restore(); return;
  } else if (id === 'crab' || id === 'lobster') {
    const lobster = id === 'lobster';
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) line([[side*.35,i*.23],[side*(.85+i*.07),i*.2+sway],[side*1.05,.45+i*.2]], body, .1);
      line([[side*.4,-.2],[side*.95,-.55],[side*1.1,-.8]], body, .16);
      oval(side*1.05,-.85,lobster?.32:.26,.32,body,side*.4);
      shape([[side*1.08,-1.16],[side*.99,-.88],[side*1.3,-1.03]], '#c0f0f4');
    }
    if (lobster) {
      for (let i = 3; i >= 0; i--) oval(0,.2+i*.21,.29-i*.03,.2,body);
      shape([[0,.73],[-.5,1.12],[0,1.03],[.5,1.12]],light);
      oval(0,-.13,.35,.58,body);
      for (const side of [-1,1]) line([[side*.12,-.55],[side*.25,-.95],[side*.55,-1.2+sway]], light, .04);
    } else oval(0,.1,.65,.43,body);
    eyeY = -.36; eyeX = lobster ? .15 : .32;
    for (const side of [-1,1]) line([[side*eyeX,-.1],[side*eyeX,eyeY]],body,.1);
  } else if (id === 'starfish') {
    const points = [];
    for (let i=0;i<10;i++) { const a=-Math.PI/2+i*Math.PI/5, r=i%2?.45:1.1; points.push([Math.cos(a)*r,Math.sin(a)*r]); }
    shape(points,body);
    for(let i=0;i<5;i++) {const a=-Math.PI/2+i*Math.PI*2/5;oval(Math.cos(a)*.65,Math.sin(a)*.65,.07,.07,light);}
    oval(0,.2,.13,.08,light); eyeY=-.08; eyeX=.17;
  } else if (id === 'mussel') {
    oval(0,0,.59,.99,body,-.35); oval(.18,.04,.4,.81,light,-.35);
    line([[-.25,-.85],[.05,-.35],[.36,.67]],body,.08);
    for(let i=0;i<3;i++) line([[-.5+i*.1,-.4],[-.24+i*.1,.2],[-.02+i*.1,.65]], light,.035);
    oval(.24,.37,.16,.16,'#fff2e6'); eyeY=-.2; eyeX=.15;
  } else {
    const squid = id === 'squid', arms = squid ? 10 : 8;
    for(let i=0;i<arms;i++) {
      const start=-.55+i*1.1/(arms-1), end=(i-(arms-1)/2)*(squid?.18:.29);
      c.strokeStyle='#23394b';c.lineWidth=.16;c.beginPath();c.moveTo(start,.1);
      c.bezierCurveTo(start,.65,end+sway,1.17,end+(i%2?.12:-.12),.78+Math.sin(t*3+i)*.13);c.stroke();
      c.strokeStyle=body;c.lineWidth=.1;c.stroke();
    }
    c.strokeStyle='#23394b';c.lineWidth=.05;
    if(squid) {
      shape([[0,-1.15],[-.85,-.2],[.85,-.2]],light);
      oval(0,-.33,.43,.72,body);
    } else oval(0,-.32,.73,.72,body);
    oval(.2,-.52,.15,.22,light,-.4);eyeY=-.12;eyeX=squid?.18:.28;
  }
  for (const side of [-1,1]) {oval(side*eyeX,eyeY,.1,.12,'#fff');oval(side*eyeX-.015,eyeY+.015,.045,.065,'#23394b');}
  c.restore();
}

// Fixed colors keep the shiny frog visibly blue even without color emoji fonts.
function drawFrog(c, x, y, s, shiny = false, t = 0) {
  c.save(); c.translate(x, y + Math.sin(t * 3) * s * .03); c.scale(s, s);
  c.strokeStyle = '#243b42'; c.lineWidth = .05;
  const oval = (x, y, rx, ry, color) => {
    c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); c.stroke();
  };
  const body = shiny ? '#479bff' : '#68bb54', dark = shiny ? '#2753b5' : '#34853b';
  oval(-.65, .5, .4, .24, dark); oval(.65, .5, .4, .24, dark);
  oval(0, .25, .68, .55, body); oval(0, .4, .42, .3, shiny ? '#b6e5ff' : '#dcf0a4');
  oval(0, -.2, .85, .5, body);
  for (const side of [-1, 1]) {
    oval(side * .48, -.57, .29, .31, body); oval(side * .48, -.58, .18, .21, '#fff'); oval(side * .48, -.57, .08, .13, '#192b36');
  }
  c.beginPath(); c.arc(0, -.25, .4, .2, Math.PI - .2); c.stroke(); c.restore();
}

function drawLandAnimal(id, c, x, y, s, shiny = false, t = 0) {
  const palette = {
    deer: ['#b87c4f','#734c31','#f9dfb4','#78cce0','#417aaf'],
    bear: ['#8c613e','#503b30','#e1b985','#c7a3ee','#7252a8'],
    raccoon: ['#9a9c9c','#343f49','#f4ead7','#7dd0c4','#356e83'],
    badger: ['#717b85','#273441','#f3eee0','#e8b96e','#96623f'],
    skunk: ['#414652','#252936','#f8eee5','#ae82da','#604a91'],
    turtle: ['#70a060','#3f6850','#edcf83','#70badf','#395ca5'],
    owl: ['#b28c64','#634934','#f6dfaf','#ec9cb8','#985c9b'],
    mouse: ['#a9a3ab','#716775','#f1c9ce','#9ecb80','#557c55'],
    porcupine: ['#b18b60','#674b36','#f3ddb0','#ecb683','#a45c70'],
    'red-panda': ['#d77b43','#713c34','#fff0cf','#879ee4','#454f96'],
  }[id];
  const [normal, darkNormal, cream, bright, darkBright] = palette;
  const body = shiny ? bright : normal, dark = shiny ? darkBright : darkNormal;
  c.save();c.translate(x,y+Math.sin(t*3)*s*.025);c.scale(s,s);
  c.strokeStyle='#28303c';c.lineWidth=.045;c.lineJoin='round';c.lineCap='round';
  const oval=(x,y,rx,ry,color,angle=0)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,Math.PI*2);c.fill();c.stroke();};
  const shape=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke();};
  if(id==='raccoon'||id==='red-panda'){
    oval(.72,.2,.27,.75,body,-.5);
    for(let i=0;i<4;i++)oval(.44+i*.13,-.28+i*.24,.22,.07,dark,-.5);
  }
  if(id==='skunk'){
    oval(.6,-.3,.42,.78,body,.35);oval(.6,-.36,.17,.65,cream,.35);
  }
  if(id==='mouse'){
    c.strokeStyle=cream;c.lineWidth=.075;c.beginPath();c.moveTo(.45,.6);c.bezierCurveTo(1.35,.9,1.25,-.1,.8,.2);c.stroke();c.strokeStyle='#28303c';c.lineWidth=.045;
  }
  if(id==='porcupine')for(let i=0;i<17;i++){
    const a=Math.PI+i/16*Math.PI;
    shape([[Math.cos(a)*.6,Math.sin(a)*.5],[Math.cos(a)*1.03,Math.sin(a)*1.08],[Math.cos(a+.12)*.6,Math.sin(a+.12)*.5]],i%2?dark:cream);
  }
  if(id==='turtle'){
    for(const [px,py] of [[-.6,.52],[.6,.52],[-.6,-.05],[.6,-.05]])oval(px,py,.23,.18,body);
    oval(0,.2,.74,.65,dark);oval(0,.18,.56,.48,body);
    shape([[-.22,.04],[0,-.12],[.25,.04],[.25,.32],[0,.48],[-.22,.32]],dark);
    for(const [px,py] of [[-.5,-.03],[.5,-.03],[-.5,.43],[.5,.43]]){c.beginPath();c.moveTo(px,py);c.lineTo(px*.4,.19);c.stroke();}
    oval(0,-.57,.38,.35,body);
  }else{
    oval(-.35,.73,.24,.13,dark);oval(.35,.73,.24,.13,dark);
    oval(0,.22,id==='bear'?.73:.6,id==='owl'?.65:.58,body);
    oval(0,.35,.38,.38,cream);
    if(id==='deer'){
      c.strokeStyle=dark;c.lineWidth=.08;
      for(const side of [-1,1]){
        c.beginPath();c.moveTo(side*.28,-.67);c.lineTo(side*.45,-1.2);c.lineTo(side*.7,-1.35);c.moveTo(side*.45,-1.2);c.lineTo(side*.3,-1.4);c.stroke();
      }c.strokeStyle='#28303c';c.lineWidth=.045;
      oval(-.56,-.65,.27,.14,body,-.5);oval(.56,-.65,.27,.14,body,.5);
      for(const side of [-1,1])oval(side*.37,.27,.06,.08,cream);
    }else if(['bear','mouse','raccoon','red-panda'].includes(id)){
      for(const side of [-1,1]){oval(side*.43,-.77,id==='mouse'?.31:.22,id==='mouse'?.34:.23,body);oval(side*.43,-.77,.12,.13,cream);}
    }
    oval(0,-.36,id==='badger'?.61:.53,.47,body);
    if(id==='owl'){
      for(const side of [-1,1]){
        shape([[side*.18,-.67],[side*.54,-1.02],[side*.5,-.42]],dark);
        oval(side*.28,-.37,.26,.3,cream);oval(side*.56,.2,.19,.43,dark,side*-.3);
      }
      shape([[-.1,-.18],[.1,-.18],[0,.02]],'#eab44c');
    }else{
      if(id==='raccoon')for(const side of [-1,1])oval(side*.23,-.4,.24,.16,dark,side*.2);
      if(id==='badger')for(const side of [-1,1])shape([[side*.12,-.78],[side*.42,-.65],[side*.32,-.1],[side*.12,-.12]],cream);
      if(id==='skunk')oval(0,-.56,.12,.29,cream);
      if(id==='red-panda')for(const side of [-1,1])oval(side*.3,-.27,.19,.16,cream,-side*.3);
      oval(0,-.08,.26,.18,cream);oval(0,-.15,.08,.06,dark);
    }
  }
  for(const side of [-1,1]){
    const ey=id==='turtle'?-.63:-.42, ex=id==='owl'?.28:.22;
    oval(side*ex,ey,id==='owl'?.105:.07,.09,'#1c2532');
    oval(side*ex-.02,ey-.025,.022,.027,'#fff');
  }
  if(shiny){c.strokeStyle='#fff09c';for(const [px,py] of [[-.92,-.7],[.9,.45]]){c.beginPath();c.moveTo(px-.1,py);c.lineTo(px+.1,py);c.moveTo(px,py-.12);c.lineTo(px,py+.12);c.stroke();}}
  c.restore();
}

function drawWaterAnimal(id, c, x, y, s, shiny = false, t = 0) {
  const colors = {
    shark: shiny ? ['#b47bea', '#e8d8ff'] : ['#688da9', '#d9edf1'],
    catfish: shiny ? ['#e7ac42', '#fff0ad'] : ['#686c91', '#d4d5e5'],
    grunt: shiny ? ['#ec77bb', '#ffdbef'] : ['#edd268', '#fff7ca'],
    'spiny-dogfish': shiny ? ['#59cdbd', '#d9fff2'] : ['#718b91', '#d7e3e3'],
    crocodile: shiny ? ['#deaa49', '#ffebae'] : ['#729950', '#d4dfa0'],
    alligator: shiny ? ['#8c85d7', '#ddd7ff'] : ['#365b50', '#9ebd91'],
  };
  const [body, belly] = colors[id], reptile = id === 'crocodile' || id === 'alligator';
  const dogfish = id === 'spiny-dogfish', shark = id === 'shark' || dogfish;
  c.save(); c.translate(x, y); c.scale(s, s);
  c.strokeStyle = '#263b46'; c.lineWidth = .045; c.lineJoin = 'round';
  const oval = (x, y, rx, ry, color) => { c.fillStyle = color; c.beginPath(); c.ellipse(x,y,rx,ry,0,0,Math.PI*2); c.fill(); c.stroke(); };
  const shape = (points, color) => { c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke(); };
  const sway = Math.sin(t * 4) * .12;
  if (reptile) {
    shape([[.5,-.25],[1.55,.1+sway],[.5,.3]],body);
    for (const px of [-.5,.5]) for (const side of [-1,1]) {
      oval(px,side*.4,.2,.15,body);
      for(let i=0;i<3;i++) {c.beginPath();c.moveTo(px-.12+i*.1,side*.43);c.lineTo(px-.12+i*.1,side*.6);c.stroke();}
    }
    oval(0,0,.9,.36,body);
    // Crocodiles have a narrow pointed snout; alligators have a broad rounded one.
    if(id==='crocodile') shape([[-.55,-.29],[-1.55,.02],[-.6,.3]],body);
    else oval(-.94,.02,.58,.28,body);
    c.beginPath();c.moveTo(-1.43,.13);c.lineTo(-.62,.18);c.stroke();
    for(let i=0;i<5;i++) shape([[-1.35+i*.14,.13],[-1.29+i*.14,.23],[-1.23+i*.14,.14]],'#fff5d5');
    for(let i=0;i<6;i++) shape([[-.4+i*.23,-.23],[-.3+i*.23,-.44],[-.2+i*.23,-.23]],belly);
    oval(-.66,-.25,.12,.12,belly);oval(-.69,-.27,.045,.07,'#172b28');
  } else {
    shape([[.65,-.12],[1.38,-.62+sway],[1.13,sway],[1.38,.56+sway],[.65,.15]],body);
    if(shark) {
      shape([[-.22,-.2],[.05,-.98],[.45,-.22]],body);
      shape([[.05,.15],[.6,.84],[.56,.15]],body);
      if(dogfish){shape([[.55,-.12],[.78,-.6],[.95,-.12]],body);shape([[.01,-.65],[.05,-1.08],[.12,-.63]],'#f4e3b8');}
    } else shape([[-.4,-.2],[0,-.77],[.55,-.2]],body);
    oval(0,0,shark?1.05:.9,shark?.35:.53,body);
    oval(-.15,.16,.68,shark?.13:.24,belly);
    if(id==='grunt') for(let i=0;i<4;i++){c.strokeStyle='#83714b';c.beginPath();c.moveTo(-.44+i*.27,-.38);c.lineTo(-.62+i*.27,.31);c.stroke();}
    c.strokeStyle='#263b46';
    if(dogfish) for(const [px,py] of [[-.5,-.18],[0,-.22],[.45,-.13],[.2,.03]]) oval(px,py,.045,.045,'#ebf2e9');
    if(shark) for(let i=0;i<3;i++){c.beginPath();c.moveTo(-.35+i*.12,-.16);c.lineTo(-.4+i*.12,.13);c.stroke();}
    oval(-.65,-.13,.1,.1,'#fff');oval(-.69,-.13,.04,.055,'#182938');
    c.beginPath();c.moveTo(-.98,.1);c.lineTo(-.59,.16);c.stroke();
    if(id==='catfish') for(const side of [-1,1]) for(let i=0;i<2;i++) {
      c.beginPath();c.moveTo(-.8,.06);c.quadraticCurveTo(-1.2-i*.12,side*.3,-1.48,side*(.4+i*.18));c.stroke();
    }
  }
  c.restore();
}

// Preserve the frog's blue form by recoloring its green pixels.
const emojiCache = {};
function emojiCanvas(emoji, size, shiny) {
  const key = emoji + size + shiny; if (emojiCache[key]) return emojiCache[key];
  const c = document.createElement('canvas'); c.width = c.height = Math.ceil(size * 1.3);
  const x = c.getContext('2d'); x.font = `${size}px serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(emoji, c.width / 2, c.height / 2 + size * 0.05);
  if (shiny) {
    const img = x.getImageData(0, 0, c.width, c.height), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      if (!d[i + 3]) continue;
      const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), dl = mx - mn;
      let l = (mx + mn) / 2, s = dl ? dl / (1 - Math.abs(2 * l - 1)) : 0;
      let h = !dl ? 0 : mx === r ? ((g - b) / dl) % 6 : mx === g ? (b - r) / dl + 2 : (r - g) / dl + 4; h *= 60; if (h < 0) h += 360;
      if (dl < 0.08 || h < 55 || h > 170) continue;
      const nh = h + 95;
      const C = (1 - Math.abs(2 * l - 1)) * s, X = C * (1 - Math.abs((nh / 60) % 2 - 1)), m = l - C / 2, k = Math.floor(nh / 60) % 6;
      const [rr, gg, bb] = [[C, X, 0], [X, C, 0], [0, C, X], [0, X, C], [X, 0, C], [C, 0, X]][k];
      d[i] = (rr + m) * 255; d[i + 1] = (gg + m) * 255; d[i + 2] = (bb + m) * 255;
    }
    x.putImageData(img, 0, 0);
  }
  return emojiCache[key] = c;
}
function emojiEl(emoji, size, shiny) {
  const src = emojiCanvas(emoji, size, shiny), c = document.createElement('canvas');
  c.width = src.width; c.height = src.height; c.getContext('2d').drawImage(src, 0, 0); return c;
}

// Draw woodland creatures with fixed palettes so their forms match on every device.
function drawAnimal(id, c, x, y, scale, shiny = false, t = 0) {
  const palettes = {
    bunny: shiny ? ['#f08acb', '#af3d8f', '#ffe6f7'] : ['#eee8de', '#aba29a', '#fff8ed'],
    duck: shiny ? ['#62c4ff', '#235bbd', '#daf7ff'] : ['#d6ae6c', '#21875b', '#fff1d3'],
    squirrel: shiny ? ['#b783ed', '#6237a4', '#eee0ff'] : ['#bd7746', '#78432c', '#f9dfb5'],
    fox: shiny ? ['#5eabff', '#284bb2', '#e3f6ff'] : ['#ef8c38', '#994124', '#fff0d4'],
    hedgehog: shiny ? ['#8cf0d4', '#258e85', '#ddfff1'] : ['#cda777', '#72513c', '#f6dfb7'],
  };
  const [body, dark, light] = palettes[id];
  c.save(); c.translate(x, y + Math.sin(t * 3) * scale * 0.035); c.scale(scale, scale);
  c.lineWidth = 0.045; c.strokeStyle = '#253044'; c.lineJoin = 'round';
  const oval = (px, py, rx, ry, color, angle = 0) => {
    c.fillStyle = color; c.beginPath(); c.ellipse(px, py, rx, ry, angle, 0, Math.PI * 2); c.fill(); c.stroke();
  };
  const shape = (points, color) => {
    c.fillStyle = color; c.beginPath(); points.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.closePath(); c.fill(); c.stroke();
  };
  if (id === 'squirrel') {
    oval(.65, -.1, .42, .85, dark, .35); oval(.72, -.65, .3, .34, body);
  } else if (id === 'fox') {
    shape([[.25,.55],[1,.3],[.9,-.5],[.58,-.1],[-.1,.25]], body);
    shape([[.82,-.17],[.9,-.5],[1,.3],[.76,.36]], light);
  } else if (id === 'hedgehog') {
    const points = [];
    for (let i = 0; i <= 24; i++) {
      const a = Math.PI + i / 24 * Math.PI * 2, r = i % 2 ? .76 : 1;
      points.push([Math.cos(a) * r, Math.sin(a) * r * .85]);
    }
    shape(points, dark);
  }
  oval(-.25, .72, .26, .12, dark); oval(.32, .72, .26, .12, dark);
  oval(0, .15, .62, .63, body); oval(-.08, .32, .37, .4, light);
  if (id === 'bunny') {
    oval(-.38, -.85, .18, .55, body, -.18); oval(.12, -.89, .18, .58, body, .12);
    oval(-.38, -.85, .075, .37, dark, -.18); oval(.12, -.89, .075, .4, dark, .12);
    oval(.57, .4, .23, .23, light);
  } else if (id === 'squirrel' || id === 'fox') {
    shape([[-.6,-.48],[-.58,-1.05],[-.12,-.61]], body);
    shape([[.02,-.61],[.45,-1.05],[.43,-.4]], body);
    shape([[-.51,-.55],[-.52,-.86],[-.28,-.61]], dark);
    shape([[.14,-.6],[.38,-.86],[.35,-.5]], dark);
  }
  oval(-.15, -.34, .55, .48, id === 'duck' ? dark : body);
  if (id === 'duck') {
    oval(-.36, -.02, .4, .15, shiny ? '#ffe26b' : '#f4a333');
    oval(.26, .15, .28, .2, dark, -.25);
  } else {
    oval(-.34, -.12, .3, .2, light);
    oval(-.39, -.21, .075, .055, '#413048');
  }
  oval(-.37, -.45, .085, .1, '#182235'); oval(.07, -.45, .085, .1, '#182235');
  oval(-.39, -.48, .025, .03, '#fff'); oval(.05, -.48, .025, .03, '#fff');
  if (shiny) {
    c.strokeStyle = '#fff3a1'; c.lineWidth = .055;
    for (const [sx, sy] of [[.88,-.9],[-.9,.1]]) {
      c.beginPath(); c.moveTo(sx-.1,sy); c.lineTo(sx+.1,sy); c.moveTo(sx,sy-.13); c.lineTo(sx,sy+.13); c.stroke();
    }
  }
  c.restore();
}

// Snowy's triangular winter hood, bright eyes, toothy grin, mittens, and boots.
function drawSnowy(c, x, y, s, shiny = false, t = 0) {
  const hood = shiny ? '#a4e8ff' : '#ffe8a2', trim = shiny ? '#a27ae5' : '#f5a06a';
  const eye = shiny ? '#ff9ee2' : '#8be3f4', line = '#32343d';
  c.save(); c.translate(x, y + Math.sin(t * 3) * s * .04); c.scale(s, s);
  c.lineWidth = .055; c.strokeStyle = line; c.lineJoin = 'round';
  const oval = (px, py, rx, ry, color, angle = 0) => {
    c.fillStyle = color; c.beginPath(); c.ellipse(px, py, rx, ry, angle, 0, Math.PI * 2); c.fill(); c.stroke();
  };
  const hoodShape = (top, width, bottom, color) => {
    c.fillStyle = color; c.beginPath(); c.moveTo(0, top);
    c.quadraticCurveTo(.06, top-.08, .14, top+.08);
    c.lineTo(width, bottom-.2); c.quadraticCurveTo(width+.08, bottom, width-.18, bottom+.08);
    c.quadraticCurveTo(0, bottom+.35, -width+.18, bottom+.08);
    c.quadraticCurveTo(-width-.08, bottom, -width, bottom-.2);
    c.lineTo(-.14, top+.08); c.quadraticCurveTo(-.06, top-.08, 0, top); c.closePath(); c.fill(); c.stroke();
  };
  oval(-.4, .85, .27, .33, '#30343d', .15); oval(.4, .85, .27, .33, '#30343d', -.15);
  hoodShape(-1.35, 1, .65, hood);
  hoodShape(-1.08, .82, .43, trim);
  hoodShape(-.86, .66, .29, '#34383f');
  // Keep the grin clipped to the dark face, with individually outlined teeth.
  c.save(); c.beginPath(); c.ellipse(0, .12, .55, .27, 0, 0, Math.PI * 2); c.clip();
  c.fillStyle = '#fffdf5'; c.fillRect(-.6, -.18, 1.2, .6);
  c.strokeStyle = '#454951'; c.lineWidth = .025;
  for (const tx of [-.32, -.1, .12, .34]) { c.beginPath(); c.moveTo(tx, -.16); c.lineTo(tx, .4); c.stroke(); }
  c.restore(); c.beginPath(); c.ellipse(0, .12, .55, .27, 0, 0, Math.PI * 2); c.stroke();
  oval(-.32, -.35, .075, .105, eye); oval(.32, -.35, .075, .105, eye);
  c.strokeStyle = trim; c.lineWidth = .12; c.beginPath(); c.moveTo(0, .4); c.lineTo(.04, .86); c.stroke();
  c.strokeStyle = line; c.lineWidth = .055;
  oval(.05, .43, .21, .2, '#30343d'); oval(-.14, .69, .22, .19, '#393e47');
  if (shiny) {
    c.strokeStyle = '#fff3a1'; c.lineWidth = .04;
    for (const [sx, sy] of [[-.95,-.75],[.9,-.45]]) {
      c.beginPath(); c.moveTo(sx-.1,sy); c.lineTo(sx+.1,sy); c.moveTo(sx,sy-.13); c.lineTo(sx,sy+.13); c.stroke();
    }
  }
  c.restore();
}

// Procedural Bouldersaur: boulder shell of stone plates, pale head, claws
function drawBoulder(c, x, y, s, shiny = false, t = 0) {
  const skin = shiny ? '#b9d8e8' : '#cdbfbb', limb = shiny ? '#7fa6c4' : '#9d91a2', shell = shiny ? '#8a5a12' : '#4c4e4b', plate = shiny ? '#e8b030' : '#7d807b', line = '#232323';
  const flex = Math.sin(t * 3) * 0.06;
  c.save(); c.translate(x, y); c.scale(s, s); c.lineWidth = 0.05; c.strokeStyle = line; c.lineJoin = 'round';
  const claws = (px, py, ang) => { c.fillStyle = '#eee'; for (let i = -1; i <= 1; i++) { const a = ang + i * 0.5;
    c.beginPath(); c.moveTo(px + Math.cos(a + 1.4) * 0.07, py + Math.sin(a + 1.4) * 0.07); c.lineTo(px + Math.cos(a) * 0.32, py + Math.sin(a) * 0.32);
    c.lineTo(px + Math.cos(a - 1.4) * 0.07, py + Math.sin(a - 1.4) * 0.07); c.closePath(); c.fill(); c.stroke(); } };
  const arm = (x1, y1, x2, y2, w, col, ang) => { c.strokeStyle = line; c.lineWidth = w + 0.1; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
    c.lineWidth = 0.05; claws(x2, y2, ang); };
  // back arm (raised left) and back leg
  arm(-0.5, -0.1, -1.15, -0.55 - flex, 0.28, limb, Math.PI * 1.1);
  arm(-0.4, 0.6, -0.75, 1.1, 0.34, limb, Math.PI * 0.75);
  // shell
  c.fillStyle = shell; c.beginPath(); c.arc(0.15, -0.05, 1.0, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = plate;
  [[-0.2, -0.75, .32], [0.35, -0.8, .3], [0.85, -0.35, .26], [-0.35, -0.25, .32], [0.25, -0.25, .32], [0.75, 0.25, .28], [-0.1, 0.35, .28], [0.4, 0.65, .26], [0.95, -0.85, .1]]
    .forEach(([px, py, r]) => { c.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + 0.3; c.lineTo(px + Math.cos(a) * r, py + Math.sin(a) * r * 0.85); } c.closePath(); c.fill(); c.stroke(); });
  // front leg + raised front arm
  arm(0.65, 0.55, 0.95, 1.15, 0.38, skin, Math.PI * 0.5);
  arm(0.45, -0.15, 0.6, -0.85 + flex, 0.26, skin, -Math.PI * 0.45);
  // head
  c.fillStyle = skin; c.beginPath(); c.ellipse(-0.75, 0.1, 0.5, 0.36, -0.15, 0, Math.PI * 2); c.fill(); c.stroke();
  // open mouth + fangs
  c.fillStyle = '#e88aa0'; c.beginPath(); c.moveTo(-1.2, 0.2); c.quadraticCurveTo(-0.85, 0.75, -0.45, 0.3); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#fff'; [[-1.05, 0.25], [-0.6, 0.32]].forEach(([fx, fy]) => { c.beginPath(); c.moveTo(fx - 0.05, fy); c.lineTo(fx, fy + 0.13); c.lineTo(fx + 0.05, fy); c.fill(); });
  // angry eye
  c.fillStyle = '#fff'; c.beginPath(); c.ellipse(-0.68, -0.05, 0.11, 0.08, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#c0392b'; c.beginPath(); c.arc(-0.71, -0.04, 0.055, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.moveTo(-0.85, -0.17); c.lineTo(-0.52, -0.08); c.stroke();
  c.restore();
}

// Procedural Magikarp: red carp, yellow crown fin + whiskers, white tail
function drawCarp(c, x, y, s, shiny = false, t = 0) {
  const body = shiny ? '#f2b632' : '#ea5a3d', dark = shiny ? '#c98a14' : '#b8372a';
  const fin = shiny ? '#fff1b8' : '#f2b65a';
  const sway = Math.sin(t * 6) * 0.15;
  c.save(); c.translate(x, y); c.scale(s, s); c.lineWidth = 0.05; c.strokeStyle = '#3a1a10'; c.lineJoin = 'round';
  // tail
  c.save(); c.translate(0.85, 0); c.rotate(sway);
  c.fillStyle = '#f4f4f4'; c.beginPath(); c.moveTo(0, 0); c.lineTo(0.9, -0.75); c.quadraticCurveTo(0.7, 0, 1.0, 0.8); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = body; c.lineWidth = 0.08; c.beginPath(); c.moveTo(0, 0); c.lineTo(0.9, -0.75); c.stroke(); c.restore();
  c.strokeStyle = '#3a1a10'; c.lineWidth = 0.05;
  // crown fin
  c.fillStyle = fin; c.beginPath(); c.moveTo(-0.3, -0.7);
  c.lineTo(-0.45, -1.35); c.lineTo(-0.1, -1.0); c.lineTo(0.1, -1.6); c.lineTo(0.3, -1.0); c.lineTo(0.7, -1.2); c.lineTo(0.5, -0.6); c.closePath(); c.fill(); c.stroke();
  // bottom fin
  c.beginPath(); c.moveTo(-0.1, 0.7); c.lineTo(-0.3, 1.25); c.lineTo(0.05, 1.0); c.lineTo(0.3, 1.3); c.lineTo(0.4, 0.65); c.closePath(); c.fill(); c.stroke();
  // body
  const g = c.createRadialGradient(-0.3, -0.35, 0.1, 0, 0, 1.1); g.addColorStop(0, shiny ? '#ffe08a' : '#ff8a6a'); g.addColorStop(1, body);
  c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 1.0, 0.8, 0, 0, Math.PI * 2); c.fill(); c.stroke();
  // scales
  c.strokeStyle = dark; c.beginPath(); c.arc(0.1, 0, 0.75, -1.2, 1.2); c.stroke(); c.beginPath(); c.arc(0.45, 0, 0.55, -1.1, 1.1); c.stroke();
  c.strokeStyle = '#3a1a10';
  // side fin
  c.fillStyle = '#f4f4f4'; c.beginPath(); c.moveTo(-0.15, 0.05); c.lineTo(0.55, -0.05); c.lineTo(0.25, 0.55 + sway * 0.5); c.closePath(); c.fill(); c.stroke();
  // lips
  c.fillStyle = '#f7a8b8'; c.beginPath(); c.ellipse(-0.95, 0.05, 0.14, 0.26, 0, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = '#7a2030'; c.beginPath(); c.ellipse(-0.95, 0.05, 0.06, 0.15, 0, 0, Math.PI * 2); c.fill();
  // eye
  c.fillStyle = '#fff'; c.beginPath(); c.arc(-0.5, -0.2, 0.22, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = '#000'; c.beginPath(); c.arc(-0.52, -0.2, 0.035, 0, Math.PI * 2); c.fill();
  // whiskers
  c.strokeStyle = fin; c.lineWidth = 0.09; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-0.9, 0.25); c.quadraticCurveTo(-1.3, 0.9 + sway, -1.0, 1.6); c.stroke();
  c.beginPath(); c.moveTo(-0.65, 0.4); c.quadraticCurveTo(-0.5, 1.0 - sway, -0.2, 1.7); c.stroke();
  c.restore();
}

// ---------- Map ----------
function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const R = rng(7);
const map = Array.from({ length: H }, () => Array(W).fill(G));
let activeMap = map, underground = false, halloweenCavern = false, deepDiving = false, abyssDiving = false;
const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
const tile = (x, y) => inb(x, y) ? activeMap[y][x] : TR;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (x < 1 || y < 1 || x >= W - 1 || y >= H - 1) map[y][x] = TR;
  if ((x >= 18 && x <= 20) || (x >= 40 && x <= 42)) map[y][x] = WA;
  if (y >= 22 && y <= 24 && x > 20 && x < 40) map[y][x] = WA;
}
for (let i = 0; i < 30; i++) {
  const cx = 2 + R() * (W - 4) | 0, cy = 2 + R() * (H - 4) | 0, r = 2 + R() * 3;
  for (let y = cy - 5; y <= cy + 5; y++) for (let x = cx - 5; x <= cx + 5; x++)
    if (inb(x, y) && map[y][x] === G && Math.hypot(x - cx, y - cy) < r + R()) map[y][x] = TG;
}
for (let i = 0; i < 140; i++) { const x = R() * W | 0, y = R() * H | 0; if (map[y][x] === G) map[y][x] = TR; }
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++)
  if (map[y][x] !== WA && [[1,0],[-1,0],[0,1],[0,-1]].some(([a, b]) => map[y + b][x + a] === WA)) map[y][x] = SA;
const docks = [[17, 8], [21, 8], [17, 36], [21, 36], [39, 12], [43, 12], [39, 34], [43, 34], [30, 21], [30, 25]];
for (const [x, y] of docks) {
  for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) if (tile(x + a, y + b) === TR) map[y + b][x + a] = G;
  map[y][x] = DK;
}
for (let y = 3; y <= 7; y++) for (let x = 3; x <= 7; x++) map[y][x] = G;

// Mountain Biome (Eastern lands across the eastern river: x >= 44)
for (let y = 1; y < H - 1; y++) {
  for (let x = 44; x < W - 1; x++) {
    map[y][x] = MT;
  }
}
// Impassable outer mountain peaks
for (let y = 0; y < H; y++) map[y][W - 1] = MP;
for (let x = 44; x < W; x++) { map[0][x] = MP; map[H - 1][x] = MP; }
// Trails from docks
map[12][44] = G; map[12][45] = MT;
map[34][44] = G; map[34][45] = MT;
// Scatter mountain crags and peaks
for (let i = 0; i < 75; i++) {
  const mx = 45 + (R() * (W - 47) | 0), my = 2 + (R() * (H - 4) | 0);
  if ((mx !== 45 || (my !== 12 && my !== 34))) map[my][mx] = MP;
}
for (let i = 0; i < 18; i++) {
  const mx = 45 + (R() * (W - 47) | 0), my = 2 + (R() * (H - 4) | 0);
  if (map[my][mx] === MT) map[my][mx] = TR;
}

// Winter Area: south of the starting meadow, reachable without a boat.
for (let y = 28; y <= 42; y++) for (let x = 2; x <= 15; x++) map[y][x] = SN;
// A clear path from the starting clearing to the winter entrance.
for (let y = 8; y < 28; y++) if (tile(5, y) === TR) map[y][5] = G;

// A handful of stationary rivals, leaving most of the map free to explore.
const TRAINERS = [
  { id: 'mia', name: 'Scout Mia', x: 10, y: 8, color: '#ed957e', team: [{ id: 'bunny', lv: 3 }] },
  { id: 'leo', name: 'Angler Leo', x: 12, y: 20, color: '#70c9e8', team: [{ id: 'magikarp', lv: 4 }] },
  { id: 'ivy', name: 'Ranger Ivy', x: 29, y: 10, color: '#9bce78', team: [{ id: 'frog', lv: 5 }, { id: 'duck', lv: 4 }] },
  { id: 'kit', name: 'Explorer Kit', x: 31, y: 31, color: '#ce9ae8', team: [{ id: 'fox', lv: 6 }] },
  { id: 'ash', name: 'Hiker Ash', x: 46, y: 12, color: '#f2b85b', team: [{ id: 'bouldersaur', lv: 6 }] },
  { id: 'sage', name: 'Climber Sage', x: 51, y: 32, color: '#ef839d', team: [{ id: 'hedgehog', lv: 6 }, { id: 'bouldersaur', lv: 7 }] },
  { id: 'noa', name: 'Snow Scout Noa', x: 8, y: 34, color: '#8ccbe8', team: [{ id: 'snowy', lv: 5 }] },
  { id: 'elle', name: 'Skier Elle', x: 12, y: 40, color: '#d5a3ef', team: [{ id: 'bunny', lv: 6 }, { id: 'snowy', lv: 7 }] },
];
for (const trainer of TRAINERS) {
  // Small clearings keep rivals visible and accessible without changing rivers.
  const ground = trainer.x >= 44 ? MT : trainer.y >= 28 && trainer.x <= 15 ? SN : G;
  for (let y = trainer.y - 1; y <= trainer.y + 1; y++) for (let x = trainer.x - 1; x <= trainer.x + 1; x++)
    if (inb(x, y) && ![WA, DK].includes(tile(x, y))) map[y][x] = ground;
}

// The forest replaces a small meadow northeast of spawn only during October.
const halloweenPatch=[];
for(let y=2;y<=17;y++)for(let x=8;x<=16;x++) {
  if(TRAINERS.some(t=>Math.abs(t.x-x)+Math.abs(t.y-y)<=1))continue;
  halloweenPatch.push({x,y,original:map[y][x]});
}
let halloweenSeason=halloweenCalendar();
function applyHalloweenMap() {
  for(const cell of halloweenPatch) {
    const path=cell.y===5||cell.x===12||cell.y===14;
    const trees=cell.original===TR||cell.x===8||cell.x===16||cell.y===2||cell.y===17||(cell.x*7+cell.y*11)%19===0;
    map[cell.y][cell.x]=halloweenSeason.open?(trees&&!path?HT:HF):cell.original;
  }
}
applyHalloweenMap();

// Permanent habitats leave the seasonal forest, waterways, and trainers intact.
for(const biome of NEW_BIOMES) {
  const [x1,y1,x2,y2]=biome.bounds;
  for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++) {
    if([WA,DK].includes(map[y][x])||TRAINERS.some(t=>Math.abs(t.x-x)+Math.abs(t.y-y)<=1))continue;
    map[y][x]=biome.tile;
  }
}
// Short footpaths connect the habitats to existing routes and docks.
for(const [x1,y1,x2,y2] of [[21,8,24,8],[21,36,24,36],[43,12,48,12],[48,8,48,12],[43,34,48,34],[48,34,48,36]]) {
  for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if([TR,MP].includes(map[y][x]))map[y][x]=G;
}

// Separate cave layer: connected chambers under the starting clearing.
const tunnelEntrance = { x: 5, y: 5 }, caveExit = { x: 8, y: 8 };
const caveGenerator = { x: 11, y: 10 };
const caveTreasurePiles = [
  { id:'ruby', name:'Rubies', x:10, y:5, color:'#ed5374', light:'#ffb0c4', species:'tyrannosaurus-rex', hint:'Front of the entrance chamber' },
  { id:'sapphire', name:'Sapphires', x:13, y:5, color:'#4e94ff', light:'#b8e1ff', species:'spinosaurus', hint:'Front of the entrance chamber' },
  { id:'limestone', name:'Limestone', x:16, y:5, color:'#c8c1a3', light:'#fff2cd', species:'giganotosaurus', hint:'Front of the entrance chamber' },
];
const caveMap = Array.from({ length: H }, () => Array(W).fill(CW));
const carve = (x1,y1,x2,y2) => {for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)caveMap[y][x]=CF;};
carve(3,3,20,17); carve(26,5,42,20); carve(8,25,28,39); carve(40,27,55,40);
carve(18,11,28,13); carve(14,15,16,28); carve(26,30,43,32); carve(34,18,36,32);
for(const [cx,cy] of [[16,13],[34,14],[20,33],[48,35]])
  for(let y=cy-1;y<=cy+1;y++)for(let x=cx-1;x<=cx+1;x++)caveMap[y][x]=CP;
const caveTiles = [], cavePools = [], caveDryTiles = [];
for(let y=0;y<H;y++)for(let x=0;x<W;x++) {
  if(caveMap[y][x]===CF||caveMap[y][x]===CP) {
    const spot={x,y};caveTiles.push(spot);(caveMap[y][x]===CP?cavePools:caveDryTiles).push(spot);
  }
}
const caveRandom = rng(91), caveWildlife = [];
const caveFirstSpawns = {
  mole:{x:10,y:9},ant:{x:12,y:6},spider:{x:7,y:12},cricket:{x:15,y:7},
  'praying-mantis':{x:18,y:10},'cave-crawfish':{x:16,y:13},
};
for(const sp of SPECIES.filter(sp=>sp.habitat==='cave'))for(let i=0;i<3;i++) {
  const habitat=sp.id==='cave-crawfish'?cavePools:caveDryTiles;
  const free=habitat.filter(spot=>Math.hypot(spot.x-caveExit.x,spot.y-caveExit.y)>2 && !Object.values(caveFirstSpawns).some(pos=>pos.x===spot.x&&pos.y===spot.y) && !caveWildlife.some(m=>m.x===spot.x&&m.y===spot.y));
  const spot=i===0?caveFirstSpawns[sp.id]:free[Math.floor(caveRandom()*free.length)];
  caveWildlife.push({id:sp.id,...spot,fx:spot.x,fy:spot.y,progress:1,shiny:caveRandom()<1/8,moveIn:2+caveRandom()*2,life:60+caveRandom()*40});
}

// October's cavern has its own map and wildlife, separate from the crystal caves.
const halloweenCavernEntrance = { x:12, y:10 }, halloweenCavernExit = { x:8, y:8 };
const halloweenCavernMap = Array.from({length:H},()=>Array(W).fill(CW));
for(const [x1,y1,x2,y2] of [[3,3,22,18],[28,4,49,21],[12,26,37,40],
  [21,10,29,12],[16,17,18,29],[31,19,33,28]]) {
  for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)halloweenCavernMap[y][x]=CF;
}
for(const [cx,cy] of [[16,13],[30,32]])
  for(let y=cy-1;y<=cy+1;y++)for(let x=cx-1;x<=cx+1;x++)halloweenCavernMap[y][x]=CP;
const halloweenCavernDryTiles=[],halloweenCavernPools=[],halloweenCavernWildlife=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++) {
  if(halloweenCavernMap[y][x]===CF)halloweenCavernDryTiles.push({x,y});
  if(halloweenCavernMap[y][x]===CP)halloweenCavernPools.push({x,y});
}
const halloweenCavernRandom=rng(1031);
const halloweenCavernSpecies=SPECIES.filter(sp=>sp.habitat==='cave'||sp.habitat==='generator').map(sp=>sp.id);
const halloweenCavernFirstSpawns={...caveFirstSpawns,
  'tyrannosaurus-rex':{x:16,y:5},spinosaurus:{x:20,y:9},giganotosaurus:{x:20,y:16},ghost:{x:17,y:16}};
function syncHalloweenCavernWildlife() {
  if(!halloweenSeason.open){halloweenCavernWildlife.length=0;return;}
  if(!halloweenSeason.ghosts) {
    for(let i=halloweenCavernWildlife.length-1;i>=0;i--)
      if(halloweenCavernWildlife[i].id==='ghost')halloweenCavernWildlife.splice(i,1);
  }
  const species=[...halloweenCavernSpecies,...(halloweenSeason.ghosts?['ghost']:[])];
  for(const id of species) {
    const count=id==='ghost'?1:2;
    for(let i=halloweenCavernWildlife.filter(mon=>mon.id===id).length;i<count;i++) {
      const habitat=id==='cave-crawfish'?halloweenCavernPools:halloweenCavernDryTiles;
      const free=habitat.filter(p=>Math.hypot(p.x-halloweenCavernExit.x,p.y-halloweenCavernExit.y)>2 &&
        !halloweenCavernWildlife.some(mon=>mon.x===p.x&&mon.y===p.y));
      const first=halloweenCavernFirstSpawns[id];
      const spot=(i===0&&free.find(p=>p.x===first.x&&p.y===first.y))||free[Math.floor(halloweenCavernRandom()*free.length)];
      halloweenCavernWildlife.push({id,...spot,fx:spot.x,fy:spot.y,progress:1,shiny:true,
        moveIn:2+halloweenCavernRandom()*2,life:60+halloweenCavernRandom()*40});
    }
  }
}
syncHalloweenCavernWildlife();
function currentCave() {
  return halloweenCavern
    ? {wildlife:halloweenCavernWildlife,dryTiles:halloweenCavernDryTiles,pools:halloweenCavernPools,random:halloweenCavernRandom,exit:halloweenCavernExit}
    : {wildlife:caveWildlife,dryTiles:caveDryTiles,pools:cavePools,random:caveRandom,exit:caveExit};
}

// A separate deep-water basin, reached from any shallow scuba location.
const deepEntrance={x:8,y:8},deepGenerator={x:9,y:8};
const DIVER_TRAINERS=[
  {id:'diver-coral',name:'Diver Coral',x:14,y:7,color:'#ee967d',diver:true,team:[{id:'catfish',lv:6},{id:'crab',lv:6}]},
  {id:'diver-finn',name:'Diver Finn',x:32,y:18,color:'#62c8df',diver:true,team:[{id:'great-white-shark',lv:8},{id:'giant-squid',lv:8}]},
  {id:'diver-marina',name:'Captain Marina',x:48,y:31,color:'#bf90ed',diver:true,team:[{id:'orca',lv:10},{id:'colossal-squid',lv:10}]},
];
const deepStonePiles=[
  {id:'moonstone',name:'Moonstones',x:3,y:10,color:'#76d5e8',light:'#dcfbff',species:'mosasaurus',hint:'Left side'},
  {id:'sunstone',name:'Sunstones',x:56,y:12,color:'#efa94f',light:'#fff0bd',species:'megalodon',hint:'Right side'},
  {id:'abyss',name:'Abyss Crystals',x:3,y:34,color:'#a77bef',light:'#efddff',species:'elasmosaurus',hint:'Lower left side'},
];
const deepSeaMap=Array.from({length:H},()=>Array(W).fill(CW));
for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)deepSeaMap[y][x]=WA;
for(const [cx,cy]of[[24,13],[38,10],[20,28],[41,30]])
  for(let y=cy-2;y<=cy+2;y++)for(let x=cx-1;x<=cx+1;x++)deepSeaMap[y][x]=CW;
const deepWaterTiles=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(deepSeaMap[y][x]===WA)deepWaterTiles.push({x,y});
const deepWildlife=[],deepRandom=rng(2048);
const deepFirstSpawns={'giant-squid':{x:14,y:10},'colossal-squid':{x:18,y:14},
  'great-white-shark':{x:15,y:5},'tiger-shark':{x:22,y:8},orca:{x:21,y:16}};
for(const sp of SPECIES.filter(s=>s.fishingWeight||s.diveOnly||s.deepOnly))for(let i=0;i<3;i++) {
  const free=deepWaterTiles.filter(p=>Math.hypot(p.x-deepEntrance.x,p.y-deepEntrance.y)>3 &&
    !deepStonePiles.some(stone=>stone.x===p.x&&stone.y===p.y)&&
    !DIVER_TRAINERS.some(trainer=>trainer.x===p.x&&trainer.y===p.y)&&
    !deepWildlife.some(m=>m.x===p.x&&m.y===p.y));
  const first=deepFirstSpawns[sp.id];
  const spot=(i===0&&first&&free.find(p=>p.x===first.x&&p.y===first.y))||free[Math.floor(deepRandom()*free.length)];
  deepWildlife.push({id:sp.id,...spot,fx:spot.x,fy:spot.y,progress:1,shiny:deepRandom()<1/8,moveIn:2+deepRandom()*2,life:60+deepRandom()*40});
}

const abyssEntrance={x:8,y:8};
const abyssMap=Array.from({length:H},()=>Array(W).fill(CW));
for(let y=3;y<=34;y++)for(let x=3;x<=44;x++)abyssMap[y][x]=WA;
for(const [cx,cy]of[[22,10],[15,24],[32,22]])
  for(let y=cy-2;y<=cy+2;y++)for(let x=cx-1;x<=cx+1;x++)abyssMap[y][x]=CW;
const abyssTiles=[],abyssWildlife=[],abyssRandom=rng(3003);
for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(abyssMap[y][x]===WA)abyssTiles.push({x,y});
const abyssFirstSpawns={'anglerfish':{x:13,y:8},'gulper-eel':{x:15,y:13},'dumbo-octopus':{x:9,y:14},
  'goblin-shark':{x:18,y:6},'frilled-shark':{x:26,y:8},viperfish:{x:18,y:16},dragonfish:{x:26,y:15},
  barreleye:{x:10,y:20},'vampire-squid':{x:25,y:27},'giant-isopod':{x:36,y:14},nautilus:{x:35,y:29},'sea-pig':{x:8,y:29}};
for(const sp of SPECIES.filter(s=>s.abyssOnly))for(let i=0;i<5;i++) {
  const free=abyssTiles.filter(p=>Math.hypot(p.x-abyssEntrance.x,p.y-abyssEntrance.y)>3 &&
    !abyssWildlife.some(m=>m.x===p.x&&m.y===p.y));
  const first=abyssFirstSpawns[sp.id],spot=(i===0&&first&&free.find(p=>p.x===first.x&&p.y===first.y))||free[Math.floor(abyssRandom()*free.length)];
  abyssWildlife.push({id:sp.id,...spot,fx:spot.x,fy:spot.y,progress:1,shiny:abyssRandom()<1/8,moveIn:2+abyssRandom()*2,life:60+abyssRandom()*40});
}
function currentDiveLayer() {
  return abyssDiving?{map:abyssMap,tiles:abyssTiles,wildlife:abyssWildlife,random:abyssRandom,entrance:abyssEntrance,obstacles:[]}:
    {map:deepSeaMap,tiles:deepWaterTiles,wildlife:deepWildlife,random:deepRandom,entrance:deepEntrance,obstacles:[deepGenerator,...DIVER_TRAINERS]};
}
function activeTrainers() {
  if(underground||abyssDiving||(!deepDiving&&P.diving))return [];
  return deepDiving?DIVER_TRAINERS:TRAINERS;
}

const waterTiles = [];
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (tile(x, y) === WA) waterTiles.push({ x, y });
const waterSpecies = SPECIES.filter(sp => sp.fishingWeight).map(sp => sp.id);
const diveSites = [{ x: 19, y: 9 }, { x: 41, y: 13 }, { x: 30, y: 23 }];
const isShallowDiveWater = (x, y) => map[y]?.[x] === WA &&
  ((x >= 18 && x <= 20 && y >= 6 && y <= 38) ||
   (x >= 40 && x <= 42 && y >= 8 && y <= 36) ||
   (x >= 21 && x <= 39 && y >= 22 && y <= 24));
const isDiveWater=(x,y)=>deepDiving?currentDiveLayer().map[y]?.[x]===WA:isShallowDiveWater(x,y);
const diveWaterTiles = waterTiles.filter(spot => isDiveWater(spot.x, spot.y));
const waterWildlife = [];
for (let i = 0; i < 24; i++) {
  const start = i < 6 ? [{ x: 19, y: 9 }, { x: 19, y: 16 }, { x: 19, y: 30 }, { x: 41, y: 10 }, { x: 41, y: 27 }, { x: 30, y: 23 }][i]
    : waterTiles[Math.floor((i - 6 + .5) * waterTiles.length / 18)];
  const occupied = spot => waterWildlife.some(mon => mon.x === spot.x && mon.y === spot.y);
  const spot = occupied(start) ? waterTiles.find(candidate => !occupied(candidate)) : start;
  waterWildlife.push({ id: waterSpecies[i % waterSpecies.length], ...spot, fx: spot.x, fy: spot.y, progress: 1,
    shiny: R() < 1 / 8, moveIn: 2 + i * .1, life: 45 + i });
}
// Three of each exclusive species live below the surface in reachable dive areas.
for (const sp of SPECIES.filter(sp => sp.diveOnly)) for (let i = 0; i < 3; i++) {
  const available = diveWaterTiles.filter(spot => !waterWildlife.some(mon => mon.x === spot.x && mon.y === spot.y));
  const spot = available[Math.floor(R() * available.length)];
  waterWildlife.push({ id: sp.id, ...spot, fx: spot.x, fy: spot.y, progress: 1,
    shiny: R() < 1 / 8, moveIn: 2 + R() * 2, life: 45 + R() * 30 });
}
function pickWaterAnimal(excludeId = null) {
  const pool = SPECIES.filter(sp => sp.fishingWeight && sp.id !== excludeId), total = pool.reduce((sum, sp) => sum + sp.fishingWeight, 0);
  let roll = Math.random() * total;
  return pool.find(sp => (roll -= sp.fishingWeight) < 0) || pool[0];
}
function pickFishingAnimal(x, y) {
  // Sparkles override visible swimmers; the remaining 5% excludes Alligator.
  if (spotAt(x, y)) return Math.random() < .95 ? byId('alligator') : pickWaterAnimal('alligator');
  const swimmer = waterWildlife.find(mon => mon.x === x && mon.y === y && !byId(mon.id).diveOnly);
  return swimmer ? byId(swimmer.id) : pickWaterAnimal();
}
function updateWaterWildlife(dt) {
  const layer=currentDiveLayer(),wildlife=deepDiving?layer.wildlife:waterWildlife,random=deepDiving?layer.random:R;
  for (const mon of wildlife) {
    mon.progress = Math.min(1, mon.progress + dt / .7);
    mon.life -= dt; mon.moveIn -= dt;
    if (mon.life <= 0) {
      const habitat = deepDiving?layer.tiles:byId(mon.id).diveOnly ? diveWaterTiles : waterTiles;
      const available = habitat.filter(spot => (spot.x !== P.x || spot.y !== P.y) &&
        (!deepDiving||(Math.hypot(spot.x-layer.entrance.x,spot.y-layer.entrance.y)>3 && !layer.obstacles.some(o=>o.x===spot.x&&o.y===spot.y))) &&
        !wildlife.some(other => other !== mon && other.x === spot.x && other.y === spot.y));
      if(!available.length)continue;
      const spot = available[Math.floor(random() * available.length)];
      Object.assign(mon, spot, { fx: spot.x, fy: spot.y, progress: 1, shiny: random() < 1 / 8 }); mon.life = 45 + random() * 30;
    }
    if (mon.moveIn <= 0) {
      const [dx, dy] = [[0, 1], [0, -1], [1, 0], [-1, 0]][Math.floor(random() * 4)];
      if (tile(mon.x + dx, mon.y + dy) === WA && (!byId(mon.id).diveOnly || isDiveWater(mon.x + dx, mon.y + dy)) &&
        (!deepDiving||!layer.obstacles.some(o=>o.x===mon.x+dx&&o.y===mon.y+dy)) &&
        !wildlife.some(other => other !== mon && other.x === mon.x + dx && other.y === mon.y + dy)) {
        mon.fx = mon.x; mon.fy = mon.y; mon.progress = 0;
        mon.x += dx; mon.y += dy;
      }
      mon.moveIn = 2 + random() * 2;
    }
  }
}
function drawSwimmer(mon, c, x, y, scale) {
  const sp = byId(mon.id), shiny = mon.shiny || (!deepDiving&&!!spotAt(mon.x, mon.y));
  if (sp.id === 'magikarp') drawCarp(c, x, y, scale * .75, shiny, time);
  else if (sp.draw) sp.draw(c, x, y, scale, shiny, time);
  else { const img = emojiCanvas(sp.emoji, scale * 2, shiny); c.drawImage(img, x - img.width / 2, y - img.height / 2); }
}
function drawWaterWildlife(camX, camY) {
  for (const mon of deepDiving?currentDiveLayer().wildlife:waterWildlife) {
    if (!P.diving && byId(mon.id).diveOnly) continue;
    if (P.diving && !isDiveWater(mon.x, mon.y)) continue;
    const x = (mon.fx + (mon.x - mon.fx) * mon.progress + .5) * T - camX;
    const y = (mon.fy + (mon.y - mon.fy) * mon.progress + .5) * T - camY;
    if (x < -T || y < -T || x > cv.width + T || y > cv.height + T) continue;
    ctx.save(); ctx.globalAlpha = .9;
    drawSwimmer(mon, ctx, x, y + Math.sin(time * 2 + mon.x) * 2, deepDiving&&(byId(mon.id).deepOnly||byId(mon.id).abyssOnly)?23:P.diving ? 16 : 13);
    if (mon.shiny || (!deepDiving&&spotAt(mon.x, mon.y))) {
      ctx.fillStyle = '#fff29b'; ctx.font = 'bold 17px sans-serif'; ctx.fillText('✦', x + 14, y - 12);
    }
    ctx.restore();
  }
}

// ---------- State ----------
const save = JSON.parse(localStorage.getItem('mkrq') || '{}');
const dex = save.dex || {};
const P = { x: save.x ?? 5, y: save.y ?? 5, fx: 0, fy: 0, prog: 1, dir: [0, 1], boat: !!save.boat };
underground = !!save.underground;
halloweenCavern = underground && save.halloweenCavern === true;
if(halloweenCavern&&!halloweenSeason.open) {
  underground=false;halloweenCavern=false;P.x=7;P.y=5;P.boat=false;
}
deepDiving=!underground&&save.deepDiving===true;
abyssDiving=deepDiving&&save.abyssDiving===true;
let shallowReturn=save.shallowReturn&&isShallowDiveWater(save.shallowReturn.x,save.shallowReturn.y)?
  {x:save.shallowReturn.x,y:save.shallowReturn.y}:{...diveSites[0]};
const validDeepReturn=point=>point&&deepSeaMap[point.y]?.[point.x]===WA&&
  ![deepGenerator,...DIVER_TRAINERS].some(o=>o.x===point.x&&o.y===point.y);
let deepReturn=validDeepReturn(save.deepReturn)?{x:save.deepReturn.x,y:save.deepReturn.y}:{...deepEntrance};
activeMap = underground ? (halloweenCavern?halloweenCavernMap:caveMap) : deepDiving?currentDiveLayer().map:map;
if(underground && ![CF,CP].includes(tile(P.x,P.y))) {P.x=currentCave().exit.x;P.y=currentCave().exit.y;}
if(deepDiving&&(!isDiveWater(P.x,P.y)||currentDiveLayer().obstacles.some(o=>o.x===P.x&&o.y===P.y))) {
  P.x=currentDiveLayer().entrance.x;P.y=currentDiveLayer().entrance.y;
}
P.diving = deepDiving || (!!save.diving && isDiveWater(P.x, P.y));
if (P.diving) P.boat = false;
if (underground) { P.diving=false; P.boat=false; }
if(!underground&&!deepDiving&&halloweenPatch.some(c=>c.x===P.x&&c.y===P.y)&&[TR,HT].includes(tile(P.x,P.y))) {P.x=7;P.y=5;}
P.fx = P.x; P.fy = P.y;
let fishing = null, modal = null, time = 0;
const keys = new Set();
const party = save.party || [], box = save.box || [];
const trainerWins = save.trainerWins || {};
const caveTreasures = { collected: {}, generated: {} };
for(const pile of caveTreasurePiles) {
  caveTreasures.generated[pile.id]=save.caveTreasures?.generated?.[pile.id]===true;
  caveTreasures.collected[pile.id]=caveTreasures.generated[pile.id]||save.caveTreasures?.collected?.[pile.id]===true;
}
const deepTreasures={collected:{},generated:{}};
for(const pile of deepStonePiles) {
  deepTreasures.generated[pile.id]=save.deepTreasures?.generated?.[pile.id]===true;
  deepTreasures.collected[pile.id]=deepTreasures.generated[pile.id]||save.deepTreasures?.collected?.[pile.id]===true;
}
const persist = () => localStorage.setItem('mkrq', JSON.stringify({ dex, party, box, trainerWins, caveTreasures, deepTreasures, x: P.x, y: P.y, boat: P.boat, diving: P.diving, underground, halloweenCavern, deepDiving, shallowReturn, abyssDiving, deepReturn }));

const nearCaveObject = object => underground && !halloweenCavern && Math.abs(P.x-object.x)+Math.abs(P.y-object.y)<=1;
const nearDeepObject=object=>deepDiving&&!abyssDiving&&Math.abs(P.x-object.x)+Math.abs(P.y-object.y)<=1;
function nearbyDeepStone(){return deepStonePiles.find(pile=>!deepTreasures.collected[pile.id]&&nearDeepObject(pile));}
function collectDeepStone(pile) {
  if(modal||P.prog<1||!nearDeepObject(pile)||deepTreasures.collected[pile.id])return;
  deepTreasures.collected[pile.id]=true;encounterGrace=4;
  hud();persist();toast(`💎 Collected ${pile.name}! Take them to the generator at the deep-water entrance.`);
}
function generatorContext() {
  return deepDiving?{piles:deepStonePiles,treasures:deepTreasures,location:deepGenerator,near:nearDeepObject,title:'Deep Sea Generator',reward:'sea creature'}:
    {piles:caveTreasurePiles,treasures:caveTreasures,location:caveGenerator,near:nearCaveObject,title:'Dinosaur Generator',reward:'dinosaur'};
}
function nearbyTreasure() { return caveTreasurePiles.find(pile=>!caveTreasures.collected[pile.id]&&nearCaveObject(pile)); }
function collectCaveTreasure(pile) {
  if(modal||P.prog<1||!nearCaveObject(pile)||caveTreasures.collected[pile.id])return;
  caveTreasures.collected[pile.id]=true;encounterGrace=4;
  hud();persist();toast(`💎 Collected ${pile.name}! Bring them to the generator beside the entrance ladder.`);
}
function openGenerator() {
  const gen=generatorContext();
  if(modal||P.prog<1||!gen.near(gen.location))return;
  $('generator-title').textContent='⚡ '+gen.title;
  $('generator-description').textContent=`Insert each collected stone pile to receive its ${gen.reward}. You can earn all three!`;
  $('generator-message').textContent='Each pile gives one reward. A full party sends your creature to the Box.';
  modal='generator';keys.clear();renderGenerator();$('generator').classList.remove('hidden');
}
function closeGenerator() { $('generator').classList.add('hidden');modal=null;encounterGrace=4; }
function renderGenerator() {
  const {piles,treasures}=generatorContext();
  const list=$('generator-list');list.innerHTML='';
  for(const pile of piles) {
    const done=treasures.generated[pile.id],ready=treasures.collected[pile.id],sp=byId(pile.species);
    const card=document.createElement('div');card.className='generator-option';
    card.appendChild(monIcon({id:sp.id,shiny:false},104,70));
    const label=document.createElement('p');label.textContent=`${pile.name} → ${sp.name}`;card.appendChild(label);
    const button=document.createElement('button');button.className='btn';button.dataset.treasure=pile.id;
    button.textContent=done?'✓ Added to your collection':ready?`Insert ${pile.name}`:`Find ${pile.name}: ${pile.hint}`;
    button.disabled=done||!ready;button.onclick=()=>generateDinosaur(pile.id);card.appendChild(button);list.appendChild(card);
  }
}
function generateDinosaur(id) {
  const {piles,treasures,location,near}=generatorContext(),pile=piles.find(p=>p.id===id);
  if(!pile||modal!=='generator'||!near(location)||!treasures.collected[id]||treasures.generated[id])return;
  treasures.generated[id]=true;
  const mon={id:pile.species,shiny:false,lv:10},toParty=party.length<6;
  (toParty?party:box).push(mon);
  const entry=dex[mon.id]||={count:0,shiny:0};entry.count++;
  persist();hud();renderGenerator();
  $('generator-message').textContent=`${byId(mon.id).name} joined your ${toParty?'party':'Box'}! ${Object.values(treasures.generated).filter(Boolean).length}/3 rewards collected.`;
}
function caveAction() {
  if(modal||P.prog<1||!underground)return;
  const pile=nearbyTreasure();
  if(pile)collectCaveTreasure(pile);else if(nearCaveObject(caveGenerator))openGenerator();
}
function deepAction() {
  if(modal||P.prog<1||!deepDiving)return;
  const pile=nearbyDeepStone();
  if(pile)collectDeepStone(pile);else if(nearDeepObject(deepGenerator))openGenerator();
}

let caveGrace = underground ? 4 : 0, encounterGrace = 4;
function nearHalloweenCavern() {
  return !underground&&!P.boat&&!P.diving&&halloweenCalendar().open&&
    Math.abs(P.x-halloweenCavernEntrance.x)+Math.abs(P.y-halloweenCavernEntrance.y)<=1;
}
function nearTunnel() {
  const exit=underground?currentCave().exit:tunnelEntrance;
  return nearHalloweenCavern()||(!P.boat && !P.diving && Math.abs(P.x-exit.x)+Math.abs(P.y-exit.y)<=1);
}
function useTunnel() {
  if(modal||P.prog<1||!nearTunnel())return;
  refreshHalloweenSeason();
  if(!nearTunnel())return;
  const seasonal=underground?halloweenCavern:nearHalloweenCavern();
  underground=!underground;halloweenCavern=underground&&seasonal;
  activeMap=underground?(halloweenCavern?halloweenCavernMap:caveMap):map;
  const destination=underground?currentCave().exit:seasonal?halloweenCavernEntrance:{x:tunnelEntrance.x,y:tunnelEntrance.y+1};
  Object.assign(P,{...destination,fx:destination.x,fy:destination.y,prog:1,boat:false,diving:false});
  fishing=null;keys.clear();caveGrace=1.5;
  toast(halloweenCavern?'🎃 Welcome to Halloween Cavern! Every creature is shiny. Touch one to meet it!':underground?'🕯️ Explore the cave! Touch creatures to encounter them. Return to the ladder to leave.':seasonal?'🎃 Back in Halloween Forest!':'☀️ Back in the starting meadow!');
  hud();persist();
}
function updateCaveWildlife(dt) {
  const {wildlife,dryTiles,pools,random,exit}=currentCave();
  for(const mon of wildlife) {
    mon.progress=Math.min(1,mon.progress+dt/.7);mon.moveIn-=dt;mon.life-=dt;
    const habitat=mon.id==='cave-crawfish'?pools:dryTiles;
    if(mon.life<=0) {
      const free=habitat.filter(spot=>Math.hypot(spot.x-P.x,spot.y-P.y)>2 && Math.hypot(spot.x-exit.x,spot.y-exit.y)>2 && !wildlife.some(m=>m!==mon&&m.x===spot.x&&m.y===spot.y));
      if(!free.length)continue;
      const spot=free[Math.floor(random()*free.length)];
      Object.assign(mon,spot,{fx:spot.x,fy:spot.y,progress:1,shiny:halloweenCavern||random()<1/8,life:60+random()*40});
    }
    if(mon.moveIn<=0) {
      const [dx,dy]=[[1,0],[-1,0],[0,1],[0,-1]][Math.floor(random()*4)];
      const nx=mon.x+dx,ny=mon.y+dy;
      const valid=mon.id==='cave-crawfish'?tile(nx,ny)===CP:tile(nx,ny)===CF;
      if(valid&&!wildlife.some(m=>m!==mon&&m.x===nx&&m.y===ny)) {
        mon.fx=mon.x;mon.fy=mon.y;mon.x=nx;mon.y=ny;mon.progress=0;
      }
      mon.moveIn=2+random()*2;
    }
  }
  caveGrace=Math.max(0,caveGrace-dt);checkCaveEncounter();
}
function checkCaveEncounter() {
  const {wildlife,exit}=currentCave();
  if(!underground||modal||P.prog<1||caveGrace>0||encounterGrace>0||Math.hypot(P.x-exit.x,P.y-exit.y)<=1||nearCaveObject(caveGenerator)||nearbyTreasure())return;
  const mon=wildlife.find(m=>Math.hypot(m.fx+(m.x-m.fx)*m.progress-P.x,m.fy+(m.y-m.fy)*m.progress-P.y)<.65);
  if(!mon)return;
  const sp=byId(mon.id),shiny=mon.shiny;
  mon.x=mon.y=mon.fx=mon.fy=-100;mon.life=0;caveGrace=1.5;
  startEncounter(sp,shiny);
}

let diveGrace = P.diving ? 4 : 0;
function toggleDepth() {
  if(modal||P.prog<1||!P.diving||underground)return;
  if(abyssDiving){toast('🌌 The Abyss is the deepest level. V goes up to the Deep Sea.');return;}
  if(deepDiving){deepReturn={x:P.x,y:P.y};abyssDiving=true;}
  else {shallowReturn={x:P.x,y:P.y};deepDiving=true;}
  activeMap=currentDiveLayer().map;
  const destination=currentDiveLayer().entrance;
  Object.assign(P,{...destination,fx:destination.x,fy:destination.y,prog:1,diving:true,boat:false});
  fishing=null;keys.clear();ignoredTrainer=null;diveGrace=encounterGrace=4;
  toast(abyssDiving?'🌌 The Abyss: level 3! Discover 12 species, including Goblin Sharks, Vampire Squid, and Sea Pigs.':'🌊 Deep Sea: level 2! Meet diver trainers, find stones, or press B to explore the Abyss.');
  hud();persist();
}
function toggleDive() {
  if (modal || P.prog < 1 || underground) return;
  if(deepDiving) {
    const destination=abyssDiving?deepReturn:shallowReturn;
    if(abyssDiving)abyssDiving=false;else deepDiving=false;
    activeMap=deepDiving?deepSeaMap:map;
    Object.assign(P,{...destination,fx:destination.x,fy:destination.y,prog:1,diving:true,boat:false});
    keys.clear();fishing=null;ignoredTrainer=null;diveGrace=encounterGrace=4;
    toast(deepDiving?'🌊 Back in the Deep Sea. V goes up to the shallows.':'🫧 Back in the shallows. V returns to your boat.');
    hud();persist();return;
  }
  if (!P.diving && (!P.boat || !diveSites.some(site => site.x === P.x && site.y === P.y))) {
    toast('🤿 Sail to a marked dive buoy, then press V or Dive!'); return;
  }
  P.diving = !P.diving; P.boat = !P.diving; fishing = null; keys.clear(); diveGrace = 1.5;
  toast(P.diving ? '🤿 Swim into creatures! B or Dive deeper explores the deep sea. V returns to your boat.' : '⛵ Back in your boat!');
  hud(); persist();
}
function checkDiveEncounter() {
  if (!P.diving || modal || P.prog < 1 || diveGrace > 0 || encounterGrace > 0) return;
  const layer=currentDiveLayer();
  if(deepDiving&&(Math.hypot(P.x-layer.entrance.x,P.y-layer.entrance.y)<=2||nearDeepObject(deepGenerator)||nearbyDeepStone()))return;
  const mon = (deepDiving?layer.wildlife:waterWildlife).find(m => Math.hypot(
    m.fx + (m.x - m.fx) * m.progress - P.x,
    m.fy + (m.y - m.fy) * m.progress - P.y) < .65);
  if (!mon) return;
  const shiny = mon.shiny || (!deepDiving&&!!spotAt(mon.x, mon.y));
  if(!deepDiving)removeSpot(mon.x, mon.y);
  const sp = byId(mon.id);
  // Remove this swimmer immediately; it returns elsewhere on the next update.
  mon.x = mon.y = mon.fx = mon.fy = -100; mon.life = 0; diveGrace = 1.5;
  startEncounter(sp, shiny, true);
}

let toastT;
function toast(msg) { const el = $('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2200); }
function hud() {
  $('hud-caught').textContent = 'Caught: ' + Object.values(dex).reduce((a, d) => a + d.count, 0);
  $('hud-mode').textContent = underground ? '🕯️ Underground' : P.diving ? '🤿 Diving' : P.boat ? '⛵ Boating' : '🚶 On foot';
  $('btn-tunnel').hidden = !nearTunnel();
  $('btn-tunnel').textContent = halloweenCavern ? '🎃 Exit to forest (Space)' : underground ? '☀️ Exit cave (Space)' : nearHalloweenCavern() ? '✨ Enter Halloween Cavern (Space)' : '🕳️ Enter tunnel (Space)';
  const treasure=nearbyTreasure();
  $('btn-cave-action').hidden=!treasure&&!nearCaveObject(caveGenerator);
  $('btn-cave-action').textContent=treasure?`💎 Collect ${treasure.name} (Space)`:'⚡ Use generator (Space)';
  $('cave-quest').hidden=!underground||halloweenCavern;
  $('cave-quest').textContent=caveTreasurePiles.map(p=>`${p.name}: ${caveTreasures.generated[p.id]?'✓ Dinosaur':caveTreasures.collected[p.id]?'✓ Collected':'Find pile'}`).join(' · ');
  $('btn-dive').textContent = P.diving ? '↑ Surface (V)' : '🤿 Dive (V)';
  if(deepDiving)$('btn-dive').textContent=abyssDiving?'↑ Deep Sea (V)':'↑ Shallows (V)';
  $('btn-depth').hidden=!P.diving||abyssDiving;
  $('btn-depth').textContent=deepDiving?'🌌 Dive to Abyss (B)':'🌊 Dive deeper (B)';
  const deepStone=nearbyDeepStone();
  $('btn-deep-action').hidden=!deepStone&&!nearDeepObject(deepGenerator);
  $('btn-deep-action').textContent=deepStone?`💎 Collect ${deepStone.name} (Space)`:'⚡ Use deep sea generator (Space)';
  $('deep-quest').hidden=!deepDiving||abyssDiving;
  $('deep-quest').textContent=deepStonePiles.map(p=>`${p.name}: ${deepTreasures.generated[p.id]?'✓ Reward':deepTreasures.collected[p.id]?'✓ Collected':p.hint}`).join(' · ');
  $('btn-dive').hidden = !P.diving && !(P.boat && diveSites.some(site => site.x === P.x && site.y === P.y));
  $('hud-biome').textContent = abyssDiving?'🌌 Abyss (3/3)':deepDiving?'🌊 Deep Sea (2/3)':halloweenCavern ? '✨ Halloween Cavern' : underground ? '💎 Crystal Caves' : P.diving ? '🫧 Shallows (1/3)' : tile(P.x,P.y)===HF ? '🎃 Halloween Forest' : tile(P.x, P.y) === SN ? '❄ Winter Area' : P.x >= 44 ? '🏔️ Mountains' : '🌿 Meadows';
  document.querySelector('.hint').textContent = abyssDiving
    ? '🌌 Deepest level · Swim into glowing creatures · V: return to Deep Sea'
    : deepDiving
    ? 'Divers !: trainer battles · Space: stones / generator · B: Abyss · V: shallows'
    : halloweenCavern
    ? `✨ Every creature is shiny! · Touch one to encounter it · Ladder: exit · ${halloweenSeason.ghosts?'Shiny Ghost is here today!':'Ghost: October 31 only'}`
    : underground
    ? 'Space: collect piles / use generator · Generator: beside the entrance ladder · Return to the ladder to exit'
    : P.diving ? 'Swim into creatures · B / Dive deeper: explore the deep sea · V: surface'
    : tile(P.x,P.y)===HF ? `🎃 October forest · ✨ Sparkles = Shiny! · ${halloweenSeason.ghosts?'Halloween today: rare Ghosts can appear!':'Rare Ghosts appear on October 31 only'}`
    : 'Arrows/WASD: move · Space: fish / use tunnel · V at DIVE buoys: scuba · ✨ Sparkles = Shiny!';
  const biome=!underground&&!P.diving&&newBiomeByTile(tile(P.x,P.y));
  if(biome) {
    $('hud-biome').textContent=`${biome.icon} ${biome.name}`;
    document.querySelector('.hint').textContent=`${biome.icon} Walk to meet six new creatures · Rare: ${byId(biome.special).name} · ✨ Sparkles = Shiny · M: Explore`;
  }
  renderPartyBar();
}

// ---------- Exploration guide ----------
const canTravel = () => !underground&&!P.diving&&!P.boat;
function openExplore() {
  if(modal&&!['explore','dex','party'].includes(modal))return;
  if(modal==='dex')closeDex();
  if(modal==='party')closeParty();
  fishing=null;keys.clear();modal='explore';
  $('explore-help').textContent=canTravel()?'Walk through each habitat to meet its creatures. Golden sparkles guarantee a shiny. Choose Travel to start exploring!':'Return to land at the surface to travel. Your caves, diving areas, and catches are still waiting for you.';
  const list=$('explore-list');list.innerHTML='';
  for(const biome of NEW_BIOMES) {
    const pool=SPECIES.filter(s=>s.habitat===biome.id),caught=pool.filter(s=>dex[s.id]?.count).length;
    const card=document.createElement('article');card.className='explore-region';
    card.innerHTML=`<h3>${biome.icon} ${biome.name}</h3><p>${biome.description}</p><div class="region-creatures"></div><p>${pool.map(s=>s.name).join(' · ')}</p><p>${biome.direction}<br><b>${caught}/6 discovered</b> · Rare: ${byId(biome.special).name}</p>`;
    for(const s of pool)card.querySelector('.region-creatures').appendChild(monIcon({id:s.id,shiny:false},44,34));
    const button=document.createElement('button');button.className='btn';button.textContent=`Travel to ${biome.name}`;
    button.dataset.biome=biome.id;button.disabled=!canTravel();button.onclick=()=>travelToBiome(biome.id);
    card.appendChild(button);list.appendChild(card);
  }
  $('btn-home').disabled=!canTravel();$('explore').classList.remove('hidden');
}
function closeExplore() {$('explore').classList.add('hidden');modal=null;keys.clear();$('btn-explore').focus();}
function travelToBiome(id) {
  if(modal!=='explore'||!canTravel())return;
  const biome=newBiomeById(id);
  if(id!=='home'&&!biome)return;
  const destination=biome||{x:5,y:7};
  P.x=P.fx=destination.x;P.y=P.fy=destination.y;P.prog=1;
  fishing=null;ignoredTrainer=null;encounterGrace=4;
  closeExplore();hud();updateSpots(0);persist();
  toast(biome?`${biome.icon} Welcome to ${biome.name}! Six new creatures live here.`:'🏡 Back in the starting meadow!');
}
$('btn-explore').onclick=openExplore;
$('btn-explore-close').onclick=closeExplore;
$('btn-home').onclick=()=>travelToBiome('home');

// ---------- Movement ----------
function tryMove(dx, dy) {
  P.dir = [dx, dy];
  const nx = P.x + dx, ny = P.y + dy, t = tile(nx, ny), cur = tile(P.x, P.y);
  if(underground&&!halloweenCavern&&nx===caveGenerator.x&&ny===caveGenerator.y)return;
  if(deepDiving&&!abyssDiving&&nx===deepGenerator.x&&ny===deepGenerator.y)return;
  if (activeTrainers().some(trainer => trainer.x === nx && trainer.y === ny)) return;
  let ok;
  if (underground) ok = t === CF || t === CP;
  else if (P.diving) ok = isDiveWater(nx, ny);
  else if (P.boat) ok = t === WA || t === DK;
  else ok = t === G || t === TG || t === SA || t === DK || t === MT || t === SN || t === HF || !!newBiomeByTile(t) || (t === WA && cur === DK);
  if (!ok) return;
  P.fx = P.x; P.fy = P.y; P.x = nx; P.y = ny; P.prog = 0;
}
function arrive() {
  const t = tile(P.x, P.y);
  if (underground) {
    const pile=!halloweenCavern&&caveTreasurePiles.find(p=>p.x===P.x&&p.y===P.y);
    if(pile)collectCaveTreasure(pile);
    checkCaveEncounter();hud();return;
  }
  if (P.diving) {
    if(deepDiving&&!abyssDiving){const stone=deepStonePiles.find(p=>p.x===P.x&&p.y===P.y);if(stone)collectDeepStone(stone);}
    if(challengeTrainer()){hud();return;}
    checkDiveEncounter(); hud(); return;
  }
  if (challengeTrainer()) { hud(); return; }
  const biome=newBiomeByTile(t), forestSparkle = t === HF && spotAt(P.x, P.y);
  const biomeSparkle=biome&&spotAt(P.x,P.y);
  if (encounterGrace > 0 && t !== WA && t !== DK && !forestSparkle && !biomeSparkle) { hud(); return; }
  if(biome) {
    if(biomeSparkle||Math.random()<.1) {
      if(biomeSparkle) {removeSpot(P.x,P.y);toast(`✨ A shiny creature appeared in ${biome.name}!`);}
      startEncounter(pickBiomeAnimal(biome.id),!!biomeSparkle||Math.random()<1/8);
    }
    hud();return;
  }
  if(t===HF) {
    if(forestSparkle || Math.random()<.08) {
      const sp=pickHalloweenAnimal();
      if(sp) {
        if(forestSparkle) {
          removeSpot(P.x,P.y);
          toast('✨ A shiny creature appeared in the sparkling Halloween Forest!');
        }
        startEncounter(sp,!!forestSparkle || Math.random()<1/8);
      }
    }
    hud();return;
  }
  if (t === WA && !P.boat) { P.boat = true; toast('⛵ You hopped into a boat!'); }
  else if (t === DK && P.boat) { P.boat = false; toast('🟫 You docked the boat.'); }
  else if (t === SN && spotAt(P.x, P.y)) {
    removeSpot(P.x, P.y);
    toast('✨ A shiny Snowy appeared in the sparkling snow!');
    startEncounter(byId('snowy'), true, false, false, true);
  }
  else if (t === SN && Math.random() < 0.1) {
    const sp = byId(Math.random() < 0.85 ? 'snowy' : 'bunny');
    startEncounter(sp, Math.random() < 1 / 8, false, false, true);
  }
  else if (t === MT && spotAt(P.x, P.y)) {
    removeSpot(P.x, P.y);
    toast('✨ A shiny Bouldersaur emerged from the mountain crags!');
    startEncounter(byId('bouldersaur'), true, false, true);
  }
  else if (t === MT && Math.random() < 0.08) {
    const r = Math.random();
    const sp = r < 0.75 ? byId('bouldersaur') : (r < 0.9 ? byId('fox') : byId('hedgehog'));
    startEncounter(sp, Math.random() < 1 / 8, false, true);
  }
  else if (t === TG && spotAt(P.x, P.y)) {
    removeSpot(P.x, P.y);
    toast('✨ A shiny creature appeared in the sparkling grass!');
    startEncounter(pickAnimal(), true, false, false);
  }
  else if (t === TG && Math.random() < 0.08) {
    startEncounter(pickAnimal(), Math.random() < 1 / 8, false, false);
  }
  hud();
}
function pickAnimal() {
  const land = SPECIES.filter(s => !s.water && s.id !== 'bouldersaur' && !s.habitat), tot = land.reduce((a, s) => a + s.weight, 0);
  let r = Math.random() * tot; for (const s of land) if ((r -= s.weight) < 0) return s; return land[0];
}

function pickBiomeAnimal(habitat) {
  const pool=SPECIES.filter(s=>s.habitat===habitat&&newBiomeById(habitat));
  let roll=Math.random()*pool.reduce((sum,s)=>sum+s.weight,0);
  for(const s of pool)if((roll-=s.weight)<0)return s;
  return pool[0];
}

// ---------- Trainer battles ----------
let battle = null, ignoredTrainer = null;
const maxHP = mon => 24 + mon.lv * 5;
function challengeTrainer() {
  if (underground || P.boat || modal) return false;
  const trainers=activeTrainers();
  if (ignoredTrainer && !trainers.some(t => t.id === ignoredTrainer && Math.abs(t.x - P.x) + Math.abs(t.y - P.y) <= 1)) ignoredTrainer = null;
  const trainer = trainers.find(t => !trainerWins[t.id] && t.id !== ignoredTrainer && Math.abs(t.x - P.x) + Math.abs(t.y - P.y) === 1);
  if (!trainer) return false;
  fishing = null; keys.clear();
  if (!party.length) {
    ignoredTrainer = trainer.id;
    encounterGrace=4;
    toast(box.length ? `${trainer.name}: Add a creature from your Box to your party to battle!` : `${trainer.name}: Catch a creature first, then come back to battle!`);
    return true;
  }
  battle = {
    trainer, allies: party.map(mon => ({ ...mon, hp: maxHP(mon) })),
    foes: trainer.team.map(mon => ({ ...mon, hp: maxHP(mon) })),
    ally: 0, foe: 0, healed: false, over: false, switching: false,
  };
  modal = 'battle';
  clearTimeout(toastT); $('toast').classList.remove('show');
  $('battle').classList.remove('hidden');
  $('battle').classList.toggle('underwater',!!trainer.diver);
  $('battle-title').textContent = `${trainer.name} challenges you!`;
  $('battle-run').textContent = 'Run';
  updateBattle(`Go, ${byId(battle.allies[0].id).name}!`);
  $('battle-attack').focus();
  return true;
}
function updateBattle(message) {
  const ally = battle.allies[battle.ally], foe = battle.foes[battle.foe];
  for (const [side, mon] of [['ally', ally], ['foe', foe]]) {
    $(side + '-name').textContent = `${mon.shiny ? '✨ ' : ''}${byId(mon.id).name} · Lv ${mon.lv}`;
    $(side + '-hp').textContent = `HP ${mon.hp} / ${maxHP(mon)}`;
    $(side + '-bar').max = maxHP(mon); $(side + '-bar').value = mon.hp;
  }
  $('battle-text').textContent = message;
  $('battle-attack').disabled = battle.over;
  $('battle-heal').disabled = battle.over || battle.healed || ally.hp === maxHP(ally);
  $('battle-heal').textContent = battle.healed ? 'Heal used' : 'Heal (1)';
  $('battle-switch').disabled = battle.over || !battle.allies.some((mon, i) => i !== battle.ally && mon.hp > 0);
  renderBattleSwitch();
  drawBattle();
}
function renderBattleSwitch() {
  const open = battle.switching && !battle.over;
  $('battle-attack').disabled = battle.over || open;
  const ally = battle.allies[battle.ally];
  $('battle-heal').disabled = battle.over || open || battle.healed || ally.hp === maxHP(ally);
  $('battle-switch-panel').classList.toggle('hidden', !open);
  $('battle-switch').setAttribute('aria-expanded', String(open));
  const list = $('battle-switch-list'); list.replaceChildren();
  if (!open) return;
  battle.allies.forEach((mon, i) => {
    const button = document.createElement('button');
    button.className = 'btn battle-choice';
    button.disabled = i === battle.ally || mon.hp <= 0;
    button.appendChild(monIcon(mon));
    const label = document.createElement('span');
    label.textContent = `${mon.shiny ? '✨ ' : ''}${byId(mon.id).name} · Lv ${mon.lv} · HP ${mon.hp}/${maxHP(mon)}${i === battle.ally ? ' · Active' : mon.hp <= 0 ? ' · Fainted' : ''}`;
    button.appendChild(label);
    button.onclick = () => switchBattleAlly(i);
    list.appendChild(button);
  });
}
function toggleBattleSwitch() {
  if (!battle || battle.over || $('battle-switch').disabled) return;
  battle.switching = !battle.switching;
  renderBattleSwitch();
  if (battle.switching) $('battle-switch-list').querySelector('button:not(:disabled)').focus();
  else $('battle-switch').focus();
}
function switchBattleAlly(index) {
  if (!battle || battle.over || !battle.switching || !Number.isInteger(index) || index === battle.ally || !battle.allies[index] || battle.allies[index].hp <= 0) return;
  battle.switching = false; battle.ally = index;
  enemyBattleTurn(`Go, ${byId(battle.allies[index].id).name}! `);
  $('battle-attack').focus();
}
function drawBattle() {
  const c = $('battle-canvas').getContext('2d');
  c.clearRect(0, 0, 520, 240);
  const draw = (mon, x, y) => {
    const sp = byId(mon.id);
    c.fillStyle = '#0003'; c.beginPath(); c.ellipse(x, y + 48, 70, 13, 0, 0, Math.PI * 2); c.fill();
    if (sp.id === 'magikarp') drawCarp(c, x, y, 38, mon.shiny, 0);
    else if (sp.draw) sp.draw(c, x, y, 44, mon.shiny, 0);
    else { const img = emojiCanvas(sp.emoji, 85, mon.shiny); c.drawImage(img, x - img.width / 2, y - img.height / 2); }
  };
  draw(battle.allies[battle.ally], 130, 145);
  draw(battle.foes[battle.foe], 390, 90);
}
function battleTurn(heal = false) {
  if (!battle || battle.over || battle.switching) return;
  const ally = battle.allies[battle.ally], foe = battle.foes[battle.foe];
  let message;
  if (heal) {
    if (battle.healed || ally.hp === maxHP(ally)) return;
    ally.hp = Math.min(maxHP(ally), ally.hp + Math.ceil(maxHP(ally) / 2));
    battle.healed = true; message = `${byId(ally.id).name} recovered HP. `;
  } else {
    const damage = 7 + ally.lv * 2 + Math.floor(Math.random() * 4);
    foe.hp = Math.max(0, foe.hp - damage);
    message = `${byId(ally.id).name} dealt ${damage} damage! `;
    if (!foe.hp) {
      message += `${byId(foe.id).name} fainted. `;
      if (battle.foe + 1 === battle.foes.length) {
        battle.over = true; trainerWins[battle.trainer.id] = true;
        party.forEach(mon => { mon.lv = Math.min(100, mon.lv + 1); });
        persist(); hud(); $('battle-run').textContent = 'Back to exploring';
        updateBattle(`You beat ${battle.trainer.name}! Each party creature gained a level. Everyone is healed!`);
        return;
      }
      battle.foe++;
      updateBattle(message + `${battle.trainer.name} sends out ${byId(battle.foes[battle.foe].id).name}!`);
      return;
    }
  }
  enemyBattleTurn(message);
}
function enemyBattleTurn(message) {
  const ally = battle.allies[battle.ally], foe = battle.foes[battle.foe];
  const damage = 4 + foe.lv + Math.floor(Math.random() * 3);
  ally.hp = Math.max(0, ally.hp - damage);
  message += `${byId(foe.id).name} dealt ${damage} damage.`;
  if (!ally.hp) {
    message += ` ${byId(ally.id).name} fainted.`;
    const next = battle.allies.findIndex(mon => mon.hp > 0);
    if (next === -1) {
      battle.over = true; $('battle-run').textContent = 'Back to exploring';
      updateBattle('Your party is out of HP. Everyone has been healed—catch more creatures or try again!');
      return;
    }
    battle.ally = next;
    message += ` Go, ${byId(battle.allies[battle.ally].id).name}!`;
  }
  updateBattle(message);
}
function closeBattle() {
  if (!battle) return;
  ignoredTrainer = battle.trainer.id;
  battle = null; modal = null; keys.clear();
  encounterGrace=diveGrace=4;
  $('battle').classList.add('hidden');
}
$('battle-attack').onclick = () => battleTurn();
$('battle-heal').onclick = () => battleTurn(true);
$('battle-switch').onclick = toggleBattleSwitch;
$('battle-switch-cancel').onclick = toggleBattleSwitch;
$('battle-run').onclick = closeBattle;

// ---------- Fishing ----------
function action() {
  if (modal) return;
  if(deepDiving&&(nearbyDeepStone()||nearDeepObject(deepGenerator))){deepAction();return;}
  if (nearTunnel()) { useTunnel(); return; }
  if(underground&&(nearbyTreasure()||nearCaveObject(caveGenerator))){caveAction();return;}
  if (underground) { toast('🕯️ Touch cave creatures to encounter them. Use the ladder to return outside.'); return; }
  if (P.diving) { toast(abyssDiving?'🌌 Swim into Abyss creatures. V returns to the Deep Sea.':deepDiving?'🌊 Meet diver trainers or find stones. B goes deeper; V goes up.':'🤿 Swim into creatures. B dives deeper; V returns to your boat.'); return; }
  if (fishing) {
    if (fishing.bite) {
      const sh = fishing.shiny, fishingSpecies = fishing.species;
      if (sh) removeSpot(fishing.x, fishing.y);
      fishing = null;
      const sp = byId(fishingSpecies);
      startEncounter(sp, sh || Math.random() < (sp.fishingShinyRate ?? 1 / 8), true, false);
    }
    else { fishing = null; toast('Too early... the fish swam off.'); }
    return;
  }
  const fx = P.x + P.dir[0], fy = P.y + P.dir[1];
  if (tile(fx, fy) !== WA) { toast(P.boat ? 'Face open water to fish!' : 'Face the water to cast your rod 🎣'); return; }
  const swimmer = waterWildlife.find(mon => mon.x === fx && mon.y === fy && !byId(mon.id).diveOnly);
  fishing = { x: fx, y: fy, wait: 1.5 + Math.random() * 3, bite: false, shiny: !!spotAt(fx, fy) || !!swimmer?.shiny, species: pickFishingAnimal(fx, fy).id };
  toast(fishing.shiny ? '✨ You cast into the sparkles! A shiny is biting!' : '🎣 Cast! Wait for a bite…');
}

// ---------- Shiny sparkle spots ----------
let spots = [];
const spotAt = (x, y) => spots.find(s => s.x === x && s.y === y);
const removeSpot = (x, y) => { spots = spots.filter(s => !(s.x === x && s.y === y)); };
function updateSpots(dt) {
  spots.forEach(s => s.life -= dt); spots = spots.filter(s => s.life > 0);
  if(deepDiving)return;
  for (let tries = 0; spots.length < 8 && tries < 60; tries++) {
    const x = P.x + Math.round((Math.random() - 0.5) * 26);
    const y = P.y + Math.round((Math.random() - 0.5) * 20);
    const t = tile(x, y);
    if ((t === TG || t === WA || t === MT || t === SN || t === HF || newBiomeByTile(t)) && !spotAt(x, y) && Math.hypot(x - P.x, y - P.y) > 1.5) {
      spots.push({ x, y, life: 45 + Math.random() * 45 });
    }
  }
  // Keep sparkles discoverable in the habitat being explored, even after travel.
  const biome=!underground&&!P.diving&&newBiomeByTile(tile(P.x,P.y));
  if(biome) {
    let local=spots.filter(s=>map[s.y]?.[s.x]===biome.tile&&Math.hypot(s.x-P.x,s.y-P.y)<9).length;
    const candidates=[];
    for(let y=P.y-6;y<=P.y+6;y++)for(let x=P.x-6;x<=P.x+6;x++)
      if(map[y]?.[x]===biome.tile&&Math.hypot(x-P.x,y-P.y)>1.5&&!spotAt(x,y))candidates.push({x,y});
    while(local<2&&candidates.length) {
      const [s]=candidates.splice(Math.floor(Math.random()*candidates.length),1);
      if(spots.length>=10) {
        const distant=spots.findIndex(p=>Math.hypot(p.x-P.x,p.y-P.y)>=9||map[p.y]?.[p.x]!==biome.tile);
        if(distant<0)break;
        spots.splice(distant,1);
      }
      spots.push({...s,life:60+Math.random()*30});local++;
    }
  }
}
function drawSparkles(camX, camY) {
  for (const s of spots) {
    const bx = s.x * T - camX, by = s.y * T - camY;
    if (bx < -T || bx > cv.width + T || by < -T || by > cv.height + T) continue;
    // Glowing golden beacon aura
    const pulse = 0.55 + Math.sin(time * 4 + s.x * 2) * 0.35;
    const g = ctx.createRadialGradient(bx + T / 2, by + T / 2, 2, bx + T / 2, by + T / 2, 22);
    g.addColorStop(0, `rgba(255, 238, 120, ${0.8 * pulse})`);
    g.addColorStop(0.5, `rgba(255, 195, 60, ${0.4 * pulse})`);
    g.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(bx + T / 2, by + T / 2, 22, 0, Math.PI * 2); ctx.fill();

    // 4 twinkling golden/white stars
    for (let i = 0; i < 4; i++) {
      const ph = time * 3.8 + i * 1.5 + s.x * 1.1;
      const a = (Math.sin(ph) + 1) / 2;
      const r = 3 + a * 6;
      const px = bx + 8 + ((i * 11 + s.y * 7) % 24);
      const py = by + 8 + ((i * 13 + s.x * 5) % 24) - Math.sin(time * 2 + i) * 3;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(time * 2 + i);
      ctx.globalAlpha = 0.45 + a * 0.55;
      ctx.fillStyle = i % 2 ? '#ffffff' : '#ffe169';
      ctx.beginPath();
      ctx.moveTo(0, -r); ctx.lineTo(r * 0.25, -r * 0.25);
      ctx.lineTo(r, 0); ctx.lineTo(r * 0.25, r * 0.25);
      ctx.lineTo(0, r); ctx.lineTo(-r * 0.25, r * 0.25);
      ctx.lineTo(-r, 0); ctx.lineTo(-r * 0.25, -r * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
}
function updateFishing(dt) {
  if (!fishing) return;
  fishing.wait -= dt;
  if (!fishing.bite && fishing.wait <= 0) { fishing.bite = true; fishing.wait = 4; toast('❗ Something bit! Press Space!'); }
  else if (fishing.bite && fishing.wait <= 0) { fishing = null; toast('It got away…'); }
}

// ---------- Encounter ----------
const ec = $('enc-canvas'), ectx = ec.getContext('2d');
let enc = null;
function startEncounter(sp, shiny, inWater = false, inMountain = false, inWinter = false) {
  if(halloweenCavern) {
    const season=halloweenCalendar();
    if(!season.open||(!halloweenCavernSpecies.includes(sp.id)&&!(sp.id==='ghost'&&season.ghosts)))return;
    shiny=true;
  }
  if(sp.habitat==='halloween') {
    const season=halloweenCalendar();
    if(!season.open||(sp.id==='ghost'&&!season.ghosts))return;
  }
  encounterGrace = 4;
  const lv=2+Math.floor(Math.random()*8),health=24+lv*5;
  enc = { sp, shiny: !!shiny, busy: false, attempts: 0, lv, hp:health, maxHp:health,
    allies:party.map(mon=>({...mon,hp:maxHP(mon)})),ally:0,lost:false };
  modal = 'enc'; keys.clear();
  $('encounter').classList.remove('hidden');
  $('enc-scene').className = 'enc-scene ' + (abyssDiving?'abyss':deepDiving?'deep-sea':halloweenCavern?'halloween-cavern':sp.habitat==='halloween'?'halloween':underground ? 'cave' : inWater ? 'water' : inWinter ? 'winter' : (inMountain ? 'mountain' : 'land'));
  ec.classList.remove('gone'); $('ball').className = 'ball hidden';
  setText(`${abyssDiving ? 'In the Abyss, you swam into' : deepDiving ? 'In the deep sea, you swam into' : halloweenCavern ? 'In Halloween Cavern, a wild' : sp.habitat==='halloween' ? 'In Halloween Forest, a wild' : underground ? 'Deep underground, a wild' : inWater ? (P.diving ? 'You swam into' : 'You fished up') : inWinter ? 'In the snow, a wild' : (inMountain ? 'From the crags appeared' : 'A wild')} ${enc.shiny ? '✨SHINY✨ ' : ''}${sp.name} (Lv ${enc.lv})${inWater ? '!' : ' appeared!'}`);
  const biome=newBiomeById(sp.habitat);
  if(biome) {
    $('enc-scene').className=`enc-scene ${biome.id}`;
    setText(`In ${biome.name}, ${sp.special?'a rare':'a wild'} ${enc.shiny?'✨SHINY✨ ':''}${sp.name} (Lv ${enc.lv}) appeared!`);
  }
  setBtns(true);
}
const setText = s => $('enc-text').textContent = s;
const setBtns = on => {
  $('btn-throw').disabled = !on||!!enc?.lost;$('btn-run').disabled = !on;
  $('btn-run').textContent=enc?.lost?'Back to exploring':'🏃 Run';updateEncounterHealth();
};
function encounterCatchChance() {
  if(!enc)return 0;
  if(enc.attempts>=1||enc.hp===1)return 1;
  return Math.min(1,enc.sp.rate+(1-enc.hp/enc.maxHp)*.1);
}
function updateEncounterHealth() {
  if(!enc)return;
  $('enc-hp').max=enc.maxHp;$('enc-hp').value=enc.hp;
  $('enc-health').textContent=`HP ${enc.hp} / ${enc.maxHp} · Catch chance: ${Math.floor(encounterCatchChance()*100)}%`;
  const ally=enc.allies[enc.ally];
  $('enc-ally').hidden=!ally;
  if(ally){$('enc-ally-hp').max=maxHP(ally);$('enc-ally-hp').value=ally.hp;$('enc-ally-text').textContent=`Your ${byId(ally.id).name}: HP ${ally.hp} / ${maxHP(ally)}`;}
  $('btn-weaken').disabled=enc.busy||!ally||enc.lost||enc.hp<=1;
  $('enc-help').textContent=enc.lost?'Your party is knocked out. Leave this encounter to recover.':!ally?'Catch your first creature to unlock Attack.':enc.hp<=1?'Fully weakened! Throw a ball for a guaranteed catch.':`Attack with ${byId(ally.id).name} to lower HP. The wild creature will fight back!`;
}
function weakenEncounter() {
  if(modal!=='enc'||!enc||enc.busy||enc.lost||!enc.allies.length||enc.hp<=1)return;
  const ally=enc.allies[enc.ally];
  const damage=Math.min(enc.hp-1,7+ally.lv*2+Math.floor(Math.random()*4));
  enc.hp-=damage;
  wildRetaliation(`${byId(ally.id).name} dealt ${damage} damage! ${enc.sp.name} ${enc.hp===1?'is fully weakened.':'is easier to catch now.'} `);
}
function wildRetaliation(message) {
  const ally=enc.allies[enc.ally];
  if(ally) {
    const damage=4+enc.lv+Math.floor(Math.random()*3);ally.hp=Math.max(0,ally.hp-damage);
    message+=`${enc.sp.name} fought back for ${damage} damage. `;
    if(!ally.hp) {
      message+=`${byId(ally.id).name} was knocked out! `;
      const next=enc.allies.findIndex(mon=>mon.hp>0);
      if(next<0){enc.lost=true;message+='Your whole party is knocked out. Leave to recover.';}
      else {enc.ally=next;message+=`Go, ${byId(enc.allies[next].id).name}!`;}
    }
  }
  setText(message);setBtns(true);
}
function closeEnc() { $('encounter').classList.add('hidden'); modal = null; enc = null; }
function drawEnc() {
  if (!enc) return;
  ectx.clearRect(0, 0, ec.width, ec.height);
  const bob = Math.sin(time * 3) * 6, cx = 160, cy = 120 + bob;
  ectx.fillStyle = '#0003'; ectx.beginPath(); ectx.ellipse(160, 185, 60, 12, 0, 0, Math.PI * 2); ectx.fill();
  if (enc.sp.id === 'magikarp') {
    const hop = Math.abs(Math.sin(time * 4)) * 20;
    drawCarp(ectx, cx, cy - hop, 52, enc.shiny, time);
  } else if (enc.sp.draw) {
    enc.sp.draw(ectx, cx, cy - 10, 62, enc.shiny, time);
  } else {
    const e = emojiCanvas(enc.sp.emoji, 110, enc.shiny); ectx.drawImage(e, cx - e.width / 2, cy - e.height / 2);
  }
}
const wait = ms => new Promise(r => setTimeout(r, ms));
async function throwBall() {
  if (!enc || enc.busy || enc.lost) return;
  const currentEncounter=enc;
  enc.busy = true; setBtns(false);
  const chance=encounterCatchChance();
  enc.attempts++;
  const ball = $('ball'), success = Math.random() < chance;
  const shakes = success ? 3 : Math.floor(Math.random() * 3);
  setText('You threw a ball!');
  ball.className = 'ball throw'; await wait(600);
  if(enc!==currentEncounter)return;
  ec.classList.add('gone'); ball.className = 'ball';
  for (let i = 0; i < shakes; i++) {
    await wait(250);if(enc!==currentEncounter)return;ball.className = 'ball wobble';
    await wait(500);if(enc!==currentEncounter)return;ball.className = 'ball';
  }
  await wait(300);
  if(enc!==currentEncounter)return;
  if (success) {
    ball.classList.add('caught');
    const d = dex[enc.sp.id] ||= { count: 0, shiny: 0 }; d.count++; if (enc.shiny) d.shiny++;
    const mon = { id: enc.sp.id, shiny: enc.shiny, lv: enc.lv };
    const toParty = party.length < 6; (toParty ? party : box).push(mon);
    setText(`Gotcha! ${enc.sp.name} was caught! 🎉 ${toParty ? 'Added to your party.' : 'Party full: sent to the Box.'}`); persist(); hud();
    await wait(1400);if(enc===currentEncounter)closeEnc();
  } else {
    ball.className = 'ball hidden'; ec.classList.remove('gone');
    setText('Oh no! It broke free!');
    await wait(900);
    if(enc!==currentEncounter)return;
    enc.busy = false;
    wildRetaliation('It broke free! Your next ball is guaranteed to catch it. ');
  }
}
$('btn-throw').onclick = throwBall;
$('btn-weaken').onclick=weakenEncounter;
$('btn-run').onclick = () => { if (enc && !enc.busy) { closeEnc(); toast('Got away safely!'); } };

// ---------- Collection ----------
let previewShinies = false;
function openDex() {
  if (modal === 'enc' || modal === 'battle' || modal === 'generator') return;
  if(modal==='explore')closeExplore();
  modal = 'dex'; keys.clear();
  const list = $('dex-list'); list.innerHTML = '';
  const filter=$('dex-filter').value;
  const found=SPECIES.filter(s=>dex[s.id]?.count).length;
  $('dex-progress').textContent=`${found}/${SPECIES.length} species discovered · ${SPECIES.filter(s=>dex[s.id]?.shiny).length} shiny forms caught`;
  for (const s of SPECIES) {
    if(filter==='new'&&!newBiomeById(s.habitat))continue;
    if(filter!=='all'&&filter!=='new'&&s.habitat!==filter)continue;
    const d = dex[s.id], el = document.createElement('div'), visible = d || previewShinies;
    const shiny = previewShinies || d?.shiny > 0;
    el.className = 'dex-item' + (visible ? '' : ' unseen');
    const icon = document.createElement('div'); icon.className = 'icon';
    if (s.id === 'magikarp') { const c = document.createElement('canvas'); c.width = 90; c.height = 60; drawCarp(c.getContext('2d'), 48, 26, 17, shiny); icon.appendChild(c); }
    else if (visible && s.draw) { const c = document.createElement('canvas'); c.width = 90; c.height = 60; s.draw(c.getContext('2d'), 45, 30, 22, shiny); icon.appendChild(c); }
    else if (visible) icon.appendChild(emojiEl(s.emoji, 40, shiny)); else icon.textContent = '❔';
    el.appendChild(icon);
    el.insertAdjacentHTML('beforeend', `<b>${visible ? s.name : '???'}</b><br><small>${previewShinies ? `✨ Shiny preview · ${d?.shiny ? 'caught' : 'not caught'}` : d ? `×${d.count}${d.shiny ? ` · ✨${d.shiny}` : ''}` : (s.abyssOnly ? '🌌 Abyss · third diving level' : s.habitat === 'deep-generator' ? '⚡ Deep sea generator' : s.deepOnly ? '🌊 Deep sea only' : s.habitat === 'halloween' ? (s.id==='ghost'?'🎃 October 31 only · Rare':'🎃 Halloween Forest · October only') : s.habitat === 'generator' ? '⚡ Generator · ✨ October cavern' : s.habitat === 'cave' ? '🕳️ Tunnel in the starting meadow' : s.diveOnly ? '🤿 Diving only' : s.habitat === 'winter' ? '❄ Winter Area · South' : s.id === 'bouldersaur' ? '🏔️ East Mountains' : s.water ? 'Fish in rivers' : s.id === 'frog' ? 'Grass or rivers' : 'Tall grass')}</small>`);
    const biome=newBiomeById(s.habitat);
    if(biome) {
      const habitat=document.createElement('p');habitat.className='dex-habitat';habitat.textContent=`${biome.icon} ${biome.name}${s.special?' · Rare':''}`;
      el.appendChild(habitat);
      if(!visible)el.querySelector('small').textContent='Explore this area to discover me';
    }
    list.appendChild(el);
  }
  $('dex').classList.remove('hidden');
}
const closeDex = () => { $('dex').classList.add('hidden'); modal = null; };
for(const b of NEW_BIOMES){const option=document.createElement('option');option.value=b.id;option.textContent=`${b.icon} ${b.name}`;$('dex-filter').appendChild(option);}
$('dex-filter').onchange=openDex;
$('btn-dex').onclick = openDex; $('btn-dex-close').onclick = closeDex;
$('btn-shiny-preview').onclick = () => {
  previewShinies = !previewShinies;
  $('btn-shiny-preview').textContent = previewShinies ? 'Show collection' : '✨ Preview shiny forms';
  $('btn-shiny-preview').setAttribute('aria-pressed', String(previewShinies));
  openDex();
};

// ---------- Party ----------
function monIcon(m, w = 70, h = 46) {
  const s = byId(m.id), el = document.createElement('div'); el.className = 'icon';
  if (s.id === 'magikarp') { const c = document.createElement('canvas'); c.width = w; c.height = h; drawCarp(c.getContext('2d'), w * .53, h * .42, h * .27, m.shiny); el.appendChild(c); }
  else if (s.draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; s.draw(c.getContext('2d'), w * .5, h * .5, h * .36, m.shiny); el.appendChild(c); }
  else el.appendChild(emojiEl(s.emoji, h * 0.75, m.shiny));
  return el;
}
function monCard(m, onClick, label) {
  const el = document.createElement('button'); el.className = 'mon' + (m.shiny ? ' shiny' : ''); el.title = label;
  el.appendChild(monIcon(m));
  el.insertAdjacentHTML('beforeend', `<b>${m.shiny ? '✨' : ''}${byId(m.id).name}</b><small>Lv ${m.lv}</small>`);
  el.onclick = onClick; return el;
}
function renderParty() {
  const pl = $('party-list'), bl = $('box-list'); pl.innerHTML = ''; bl.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const m = party[i];
    if (m) pl.appendChild(monCard(m, () => { box.push(party.splice(i, 1)[0]); refresh(); }, 'Click to send to Box'));
    else { const e = document.createElement('div'); e.className = 'mon empty'; e.textContent = 'Empty'; pl.appendChild(e); }
  }
  box.forEach((m, i) => bl.appendChild(monCard(m, () => { if (party.length < 6) { party.push(box.splice(i, 1)[0]); refresh(); } else toast('Party is full (6)!'); }, 'Click to add to party')));
  if (!box.length) bl.innerHTML = '<p class="muted">Box is empty.</p>';
  $('box-count').textContent = box.length;
  $('btn-party-store-all').disabled = party.length === 0;
}
function refresh() { renderParty(); renderPartyBar(); persist(); }
function renderPartyBar() {
  const bar = $('party-bar'); bar.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const slot = document.createElement('div'); slot.className = 'pslot' + (party[i]?.shiny ? ' shiny' : '');
    if (party[i]) slot.appendChild(monIcon(party[i], 44, 30)); bar.appendChild(slot);
  }
}
function openParty() { if (modal === 'enc' || modal === 'battle' || modal === 'generator') return; if (modal === 'dex') closeDex(); if(modal==='explore')closeExplore(); modal = 'party'; keys.clear(); renderParty(); $('party').classList.remove('hidden'); }
const closeParty = () => { $('party').classList.add('hidden'); modal = null; };
$('btn-party').onclick = openParty; $('btn-party-close').onclick = closeParty; $('party-bar').onclick = openParty;
$('btn-party-store-all').onclick = () => {
  if (modal !== 'party' || !party.length) return;
  box.push(...party.splice(0)); refresh();
};

// ---------- Input ----------
const DIRS = { ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1], ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0] };
addEventListener('keydown', e => {
  if(e.target.matches('select,input,textarea'))return;
  if(modal==='explore') {if(e.code==='Escape'||e.code==='KeyM'){e.preventDefault();closeExplore();}return;}
  if(e.code==='KeyM'&&!e.repeat){e.preventDefault();openExplore();return;}
  if(modal==='generator'){if(e.code==='Escape')closeGenerator();return;}
  if(modal==='enc'&&e.code==='KeyX'){e.preventDefault();if(!e.repeat)weakenEncounter();return;}
  if(e.code==='KeyB'&&!e.repeat&&P.diving){e.preventDefault();toggleDepth();return;}
  if (e.code === 'KeyV' && !e.repeat && (P.diving || (P.boat && diveSites.some(site => site.x === P.x && site.y === P.y)))) { e.preventDefault(); toggleDive(); return; }
  if (modal === 'battle') {
    if (e.code === 'Space' && !e.target.closest('button')) { e.preventDefault(); if (!e.repeat) battleTurn(); }
    if (e.code === 'Escape') battle.switching ? toggleBattleSwitch() : closeBattle();
    return;
  }
  if (DIRS[e.code]) { keys.add(e.code); e.preventDefault(); }
  if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'KeyF') { e.preventDefault(); if (modal === 'enc') throwBall(); else action(); }
  if (e.code === 'KeyC' && modal !== 'party') modal === 'dex' ? closeDex() : openDex();
  if (e.code === 'KeyP' && modal !== 'dex') modal === 'party' ? closeParty() : openParty();
  if (e.code === 'Escape') { if (modal === 'dex') closeDex(); else if (modal === 'party') closeParty(); else $('btn-run').click(); }
});
addEventListener('keyup', e => keys.delete(e.code));
document.querySelectorAll('.dpad button').forEach(b => {
  b.onpointerdown = e => { e.preventDefault(); keys.add(b.dataset.k); };
  b.onpointerup = b.onpointerleave = () => keys.delete(b.dataset.k);
});
$('btn-a').onclick = () => modal === 'battle' ? battleTurn() : action();
$('btn-dive').onclick = toggleDive;
$('btn-depth').onclick=toggleDepth;
$('btn-deep-action').onclick=deepAction;
$('btn-tunnel').onclick = useTunnel;
$('btn-cave-action').onclick = caveAction;
$('btn-generator-close').onclick = closeGenerator;

// ---------- Render ----------
function resize() { cv.width = innerWidth; cv.height = innerHeight; }
addEventListener('resize', resize); resize();
const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

function drawTile(t, x, y, px, py) {
  const h = hash(x, y);
  const biome=newBiomeByTile(t);
  if(biome&&!underground&&!deepDiving){drawNewBiomeTile(ctx,biome,x,y,px,py,T,time);return;}
  const grass = () => { ctx.fillStyle = h & 1 ? '#63c25c' : '#5bb954'; ctx.fillRect(px, py, T, T); };
  if(deepDiving) {
    ctx.fillStyle=abyssDiving?(t===WA?(h&1?'#14243e':'#18213b'):'#0b1429'):t===WA?(h&1?'#16435b':'#193c55'):'#10263d';ctx.fillRect(px,py,T,T);
    if(t===WA) {
      ctx.strokeStyle='#42768d55';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px+4,py+27);ctx.quadraticCurveTo(px+20,py+18,px+36,py+26);ctx.stroke();
      if((h&15)===0) {
        ctx.strokeStyle=abyssDiving?((h&16)?'#8e8eee':'#8bddd9'):(h&16)?'#b686ce':'#6ac6be';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px+20,py+36);ctx.lineTo(px+20,py+17);
        ctx.moveTo(px+20,py+26);ctx.lineTo(px+10,py+18);ctx.moveTo(px+20,py+28);ctx.lineTo(px+29,py+13);ctx.stroke();
        ctx.fillStyle='#b5fff4';ctx.fillRect(px+18,py+14,4,4);
      }
    } else {
      ctx.fillStyle='#29475b';ctx.beginPath();ctx.moveTo(px+3,py+33);ctx.lineTo(px+9,py+6);ctx.lineTo(px+28,py+4);ctx.lineTo(px+38,py+29);ctx.closePath();ctx.fill();
      if((h&7)===0){ctx.fillStyle='#62bfbd';ctx.beginPath();ctx.arc(px+20,py+17,3,0,Math.PI*2);ctx.fill();}
    }
  } else if(t===HF||t===HT) {
    ctx.fillStyle=h&1?'#54405e':'#493954';ctx.fillRect(px,py,T,T);
    if(t===HT) {
      ctx.strokeStyle='#242238';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(px+20,py+36);ctx.lineTo(px+18,py+6);ctx.moveTo(px+18,py+17);ctx.lineTo(px+5,py+8);ctx.moveTo(px+18,py+23);ctx.lineTo(px+33,py+10);ctx.stroke();
      ctx.fillStyle='#765276';for(const [dx,dy]of [[8,10],[20,5],[32,10]]){ctx.beginPath();ctx.arc(px+dx,py+dy,8,0,Math.PI*2);ctx.fill();}
    } else if((h&7)===0) {
      ctx.fillStyle='#ed943b';ctx.beginPath();ctx.ellipse(px+21,py+23,11,9,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#7b984a';ctx.fillRect(px+19,py+10,4,5);
      ctx.fillStyle='#fff2a5';ctx.fillRect(px+15,py+20,3,3);ctx.fillRect(px+24,py+20,3,3);ctx.fillRect(px+18,py+27,7,2);
    } else {ctx.fillStyle='#bd805b';ctx.fillRect(px+((h>>2)%27)+4,py+((h>>7)%27)+4,6,3);}
  } else if (t === CF || t === CW || t === CP) {
    ctx.fillStyle=halloweenCavern?(t===CW?'#251a38':t===CP?'#673f8d':(h&1?'#5a3864':'#51325e')):
      t===CW?'#282735':t===CP?'#286875':(h&1?'#68565a':'#604e55');ctx.fillRect(px,py,T,T);
    if(t===CW) {
      ctx.fillStyle='#3c394a';ctx.beginPath();ctx.moveTo(px+3,py+29);ctx.lineTo(px+10,py+5);ctx.lineTo(px+30,py+3);ctx.lineTo(px+38,py+25);ctx.lineTo(px+24,py+36);ctx.closePath();ctx.fill();
      if((h&7)===0){ctx.fillStyle=halloweenCavern?'#ffc765':'#87d7ee';ctx.beginPath();ctx.moveTo(px+12,py+27);ctx.lineTo(px+17,py+8);ctx.lineTo(px+24,py+23);ctx.lineTo(px+29,py+12);ctx.lineTo(px+31,py+30);ctx.closePath();ctx.fill();}
    } else if(t===CP) {
      ctx.strokeStyle='#87d4df';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px+6,py+19);ctx.quadraticCurveTo(px+20,py+12+Math.sin(time*2+x)*3,px+34,py+19);ctx.stroke();
    } else {
      ctx.fillStyle='#88717b';ctx.fillRect(px+((h>>2)%28)+3,py+((h>>6)%28)+3,5,3);
      if((h&31)===0){ctx.fillStyle='#e7bea0';ctx.fillRect(px+18,py+20,3,12);ctx.fillStyle='#cda1ed';ctx.beginPath();ctx.ellipse(px+19,py+20,9,5,0,Math.PI,0);ctx.fill();}
    }
  } else if (t === WA) {
    ctx.fillStyle = '#2f86d6'; ctx.fillRect(px, py, T, T);
    ctx.strokeStyle = '#7cc4ff88'; ctx.lineWidth = 2; ctx.beginPath();
    const o = Math.sin(time * 2 + x * 0.7 + y) * 4;
    ctx.moveTo(px + 6, py + 14 + o); ctx.quadraticCurveTo(px + 14, py + 10 + o, px + 22, py + 14 + o);
    ctx.moveTo(px + 18, py + 30 - o); ctx.quadraticCurveTo(px + 26, py + 26 - o, px + 34, py + 30 - o); ctx.stroke();
  } else if (t === SN) {
    ctx.fillStyle = h & 1 ? '#edf8ff' : '#ddecf7'; ctx.fillRect(px, py, T, T);
    ctx.strokeStyle = '#b9d6e9'; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(px+5,py+28); ctx.quadraticCurveTo(px+18,py+21,px+34,py+29); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.fillRect(px+((h>>2)%28)+4,py+((h>>6)%24)+4,3,3);
    if ((h & 15) === 0) {
      ctx.fillStyle = '#a9ccdf'; ctx.beginPath(); ctx.moveTo(px+12,py+16); ctx.lineTo(px+20,py+4); ctx.lineTo(px+28,py+16); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(px+15,py+11); ctx.lineTo(px+20,py+4); ctx.lineTo(px+25,py+11); ctx.fill();
    }
  } else if (t === SA) { ctx.fillStyle = h & 1 ? '#ecd9a0' : '#e6d194'; ctx.fillRect(px, py, T, T); }
  else if (t === DK) {
    ctx.fillStyle = '#9c6a3a'; ctx.fillRect(px, py, T, T); ctx.strokeStyle = '#6e4622'; ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(px, py + i * 10); ctx.lineTo(px + T, py + i * 10); ctx.stroke(); }
  } else if (t === TG) {
    ctx.fillStyle = '#3f9a45'; ctx.fillRect(px, py, T, T); ctx.fillStyle = '#2d7a33';
    const sw = Math.sin(time * 2.5 + x + y) * 3;
    for (let i = 0; i < 4; i++) {
      const bx = px + 5 + i * 9, by = py + (i % 2 ? 34 : 24);
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 4 + sw, by - 16); ctx.lineTo(bx + 8, by); ctx.fill();
    }
  } else if (t === TR) {
    grass(); ctx.fillStyle = '#6b4423'; ctx.fillRect(px + 16, py + 22, 8, 14);
    ctx.fillStyle = '#2e7d32'; ctx.beginPath(); ctx.arc(px + 20, py + 16, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#43a047'; ctx.beginPath(); ctx.arc(px + 15, py + 12, 7, 0, Math.PI * 2); ctx.fill();
  } else if (t === MT) {
    ctx.fillStyle = h & 1 ? '#73787f' : '#686c73'; ctx.fillRect(px, py, T, T);
    ctx.fillStyle = '#54585e'; ctx.fillRect(px + ((h >> 2) % 24), py + ((h >> 4) % 24), 8, 4);
    ctx.fillStyle = '#8f959e'; ctx.fillRect(px + ((h >> 6) % 26), py + ((h >> 8) % 26), 6, 3);
    if ((h & 7) === 0) {
      ctx.strokeStyle = '#474a50'; ctx.lineWidth = 1.5; ctx.beginPath();
      ctx.moveTo(px + 10, py + 8); ctx.lineTo(px + 20, py + 22); ctx.lineTo(px + 28, py + 26); ctx.stroke();
    }
  } else if (t === MP) {
    ctx.fillStyle = '#585c63'; ctx.fillRect(px, py, T, T);
    ctx.fillStyle = '#3a3d42'; ctx.beginPath(); ctx.moveTo(px + 4, py + 36); ctx.lineTo(px + 20, py + 4); ctx.lineTo(px + 36, py + 36); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7a818c'; ctx.beginPath(); ctx.moveTo(px + 20, py + 4); ctx.lineTo(px + 36, py + 36); ctx.lineTo(px + 20, py + 36); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#dbe3ec'; ctx.beginPath(); ctx.moveTo(px + 16, py + 13); ctx.lineTo(px + 20, py + 4); ctx.lineTo(px + 24, py + 13); ctx.lineTo(px + 20, py + 11); ctx.closePath(); ctx.fill();
  } else { grass(); if ((h & 15) === 0) { ctx.fillStyle = '#ffeb7a'; ctx.fillRect(px + 12, py + 18, 4, 4); } }
}

function drawPlayer(px, py) {
  const cx = px + T / 2, cy = py + T / 2;
  if (P.diving) {
    const bob = Math.sin(time * 4) * 2;
    ctx.fillStyle = '#f6d04d'; ctx.fillRect(cx - 14, cy + 10 + bob, 10, 5); ctx.fillRect(cx + 4, cy + 10 - bob, 10, 5);
    ctx.fillStyle = '#193e64'; ctx.fillRect(cx - 8, cy - 5, 16, 19);
    ctx.fillStyle = '#bac9d3'; ctx.fillRect(cx + 6, cy - 6, 7, 17);
    ctx.fillStyle = '#ffd7b0'; ctx.beginPath(); ctx.arc(cx, cy - 9, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#76f3ff'; ctx.fillRect(cx - 9, cy - 13, 18, 7);
    ctx.strokeStyle = '#173449'; ctx.lineWidth = 2; ctx.strokeRect(cx - 9, cy - 13, 18, 7);
    ctx.strokeStyle = '#b8f5ff'; ctx.beginPath(); ctx.arc(cx + 15, cy - 20 - (time * 15 % 22), 3, 0, Math.PI * 2); ctx.stroke();
    return;
  }
  if (P.boat) {
    const rock = Math.sin(time * 3) * 2;
    ctx.fillStyle = '#7a4a22'; ctx.beginPath(); ctx.ellipse(cx, cy + 8 + rock, 19, 10, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#a0682f'; ctx.fillRect(cx - 19, cy + 4 + rock, 38, 5);
  } else { ctx.fillStyle = '#0003'; ctx.beginPath(); ctx.ellipse(cx, cy + 15, 11, 4, 0, 0, Math.PI * 2); ctx.fill(); }
  const walk = P.prog < 1 ? Math.sin(P.prog * Math.PI * 2) * 2 : 0, by = cy + (P.boat ? -4 : 0) + walk;
  ctx.fillStyle = '#3a5bd9'; ctx.fillRect(cx - 8, by - 2, 16, 14);
  ctx.fillStyle = '#ffd7b0'; ctx.beginPath(); ctx.arc(cx, by - 9, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(cx, by - 11, 8.5, Math.PI, 0); ctx.fill(); ctx.fillRect(cx + P.dir[0] * 4 - 6, by - 12, 12, 3);
  ctx.fillStyle = '#222'; if (P.dir[1] >= 0 || P.dir[0]) { ctx.fillRect(cx - 4 + P.dir[0] * 3, by - 9, 2, 3); ctx.fillRect(cx + 2 + P.dir[0] * 3, by - 9, 2, 3); }
}

function drawTrainers(camX, camY) {
  for (const trainer of activeTrainers()) {
    const x = trainer.x * T + T / 2 - camX, y = trainer.y * T + T / 2 - camY;
    if (x < -60 || y < -60 || x > cv.width + 60 || y > cv.height + 60) continue;
    ctx.fillStyle = '#0004'; ctx.beginPath(); ctx.ellipse(x, y + 15, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#27364f'; ctx.fillRect(x - 8, y + 8, 6, 10); ctx.fillRect(x + 2, y + 8, 6, 10);
    ctx.fillStyle = trainer.color; ctx.fillRect(x - 9, y - 4, 18, 17);
    ctx.fillStyle = '#f4caa1'; ctx.beginPath(); ctx.arc(x, y - 10, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#304361'; ctx.fillRect(x - 9, y - 18, 18, 6);
    ctx.fillStyle = '#27364f'; ctx.fillRect(x - 4, y - 11, 2, 3); ctx.fillRect(x + 3, y - 11, 2, 3);
    if(trainer.diver) {
      ctx.fillStyle='#a9c5d4';ctx.fillRect(x+8,y-7,7,19);
      ctx.fillStyle='#8de7ee';ctx.fillRect(x-9,y-15,18,8);ctx.strokeStyle='#1d3b55';ctx.lineWidth=2;ctx.strokeRect(x-9,y-15,18,8);
      ctx.fillStyle=trainer.color;ctx.fillRect(x-12,y+16,10,5);ctx.fillRect(x+2,y+16,10,5);
      ctx.strokeStyle='#bcecff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x+18,y-16-(time*12%20),3,0,Math.PI*2);ctx.stroke();
    }
    ctx.textAlign = 'center'; ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = trainerWins[trainer.id] ? '#a6f4b4' : '#ffd166';
    ctx.fillText(trainerWins[trainer.id] ? '✓' : '!', x, y - 25);
  }
}

function render() {
  const t = P.prog < 1 ? P.prog : 1;
  const ppx = (P.fx + (P.x - P.fx) * t) * T, ppy = (P.fy + (P.y - P.fy) * t) * T;
  const camX = Math.max(0, Math.min(W * T - cv.width, ppx + T / 2 - cv.width / 2));
  const camY = Math.max(0, Math.min(H * T - cv.height, ppy + T / 2 - cv.height / 2));
  ctx.fillStyle = '#1d4d2a'; ctx.fillRect(0, 0, cv.width, cv.height);
  const x0 = Math.floor(camX / T), y0 = Math.floor(camY / T);
  for (let y = y0; y <= y0 + cv.height / T + 1; y++) for (let x = x0; x <= x0 + cv.width / T + 1; x++)
    if (inb(x, y)) drawTile(tile(x,y), x, y, Math.round(x * T - camX), Math.round(y * T - camY));
  if (underground) { drawCaveScene(camX,camY,ppx,ppy); return; }
  if(deepDiving){drawDeepSeaScene(camX,camY,ppx,ppy);return;}
  // Surface ambience is separate from the creatures that divers can encounter.
  if (!P.diving) {
  // frog heads popping out of the water
  for (let i = 0; i < 8; i++) {
    const ph = (time * 0.35 + i * 0.29) % 2.5;
    if (ph < 1.2) {
      const k = [[20, 9 + i * 5], [40, 6 + i * 5], [26 + i * 2, 24]][i % 3];
      const fx = k[0] * T + T / 2 - camX, fy = k[1] * T + T / 2 - camY;
      const rise = Math.sin(ph / 1.2 * Math.PI) * 14, img = emojiCanvas('🐸', 26, false);
      ctx.strokeStyle = '#cfeaff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(fx, fy + 4, 10 + rise * 0.6, 4, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.rect(fx - 30, fy - 40, 60, 44); ctx.clip(); // only the head above the waterline
      ctx.drawImage(img, fx - img.width / 2, fy + 18 - rise - img.height / 2); ctx.restore();
    }
  }
  // jumping Magikarp ambience
  for (let i = 0; i < 6; i++) {
    const ph = (time * 0.4 + i * 0.37) % 3;
    if (ph < 0.6) {
      const k = [[19, 5 + i * 7], [41, 3 + i * 7], [24 + i * 3, 23]][i % 3], hop = Math.sin(ph / 0.6 * Math.PI) * 22;
      drawCarp(ctx, k[0] * T + T / 2 - camX, k[1] * T + T / 2 - camY - hop, 7, false, time);
    }
  }
  }
  // fishing line & bobber
  if (fishing) {
    const bx = fishing.x * T + T / 2 - camX, by = fishing.y * T + T / 2 - camY + (fishing.bite ? Math.sin(time * 30) * 4 + 4 : Math.sin(time * 3) * 2);
    ctx.strokeStyle = '#fff9'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ppx - camX + T / 2 + P.dir[0] * 12, ppy - camY + 4); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(bx, by, 5, Math.PI, 0); ctx.fill();
  }
  drawSparkles(camX, camY);
  if (P.diving) {
    ctx.fillStyle = '#062c49cc'; ctx.fillRect(0, 0, cv.width, cv.height);
    for (const tilePos of waterTiles) {
      if (!isDiveWater(tilePos.x, tilePos.y)) continue;
      const x = tilePos.x * T - camX, y = tilePos.y * T - camY;
      if (x < -T || y < -T || x > cv.width || y > cv.height) continue;
      ctx.fillStyle = hash(tilePos.x, tilePos.y) & 1 ? '#167c91' : '#187489'; ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = '#73e1af'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 9, y + 37); ctx.quadraticCurveTo(x + 20 + Math.sin(time + tilePos.y) * 6, y + 25, x + 12, y + 15); ctx.stroke();
    }
  }
  for (const site of diveSites) {
    const x = (site.x + .5) * T - camX, y = (site.y + .5) * T - camY;
    ctx.strokeStyle = '#8dfff3'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 17 + Math.sin(time * 3) * 2, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(P.diving ? '↑' : 'DIVE', x, y + 4);
  }
  drawWaterWildlife(camX, camY);
  if (!P.diving) drawTrainers(camX, camY);
  if (!P.diving) drawTunnelMarker(tunnelEntrance.x*T-camX,tunnelEntrance.y*T-camY,false);
  if(halloweenSeason.open) {
    const sx=8*T+T/2-camX,sy=5*T-camY;
    ctx.fillStyle='#302239';ctx.fillRect(sx-84,sy-44,168,38);
    ctx.strokeStyle='#efaf53';ctx.lineWidth=2;ctx.strokeRect(sx-84,sy-44,168,38);
    ctx.fillStyle='#ffe8b2';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('HALLOWEEN FOREST',sx,sy-28);
    ctx.font='11px sans-serif';ctx.fillText(halloweenSeason.ghosts?'Oct 31: rare Ghosts today!':'October only · Ghosts Oct 31',sx,sy-13);
    drawTunnelMarker(halloweenCavernEntrance.x*T-camX,halloweenCavernEntrance.y*T-camY,false,true);
  }
  if(!P.diving)for(const biome of NEW_BIOMES) {
    const sx=(biome.x+.5)*T-camX,sy=(biome.y-1)*T-camY;
    if(sx< -150||sx>cv.width+150||sy< -50||sy>cv.height+50)continue;
    ctx.fillStyle='#182e40e8';ctx.fillRect(sx-88,sy-20,176,38);
    ctx.strokeStyle=biome.colors[2];ctx.lineWidth=2;ctx.strokeRect(sx-88,sy-20,176,38);
    ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText(biome.name,sx,sy-4);
    ctx.font='11px sans-serif';ctx.fillText('6 creatures · Sparkles = Shiny',sx,sy+10);
  }
  drawPlayer(ppx - camX, ppy - camY);
  // A sign at the entrance helps players find the new biome.
  const signX = 5*T + T/2 - camX, signY = 27*T - camY;
  if (signX > -100 && signX < cv.width+100 && signY > -50 && signY < cv.height+50) {
    ctx.fillStyle = '#765338'; ctx.fillRect(signX-3,signY+10,6,25);
    ctx.fillStyle = '#244b6d'; ctx.fillRect(signX-77,signY-12,154,28);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('↓ Winter Area',signX,signY+7);
  }
  if (tile(P.x, P.y) === SN) {
    ctx.fillStyle = '#ffffffc9';
    for (let i=0;i<45;i++) {
      const sx = (i*137 + Math.sin(time+i)*15) % cv.width;
      const sy = (i*83 + time*(18+i%5*4)) % cv.height;
      ctx.beginPath(); ctx.arc(sx,sy,1+i%3*.4,0,Math.PI*2); ctx.fill();
    }
  }
  if (fishing?.bite) { ctx.fillStyle = '#ffd166'; ctx.font = 'bold 28px Outfit'; ctx.textAlign = 'center'; ctx.fillText('!', ppx - camX + T / 2, ppy - camY - 18); }
}

function drawTunnelMarker(px,py,exit,seasonal=false) {
  const x=px+T/2,y=py+T/2;
  if(seasonal) {
    const glow=ctx.createRadialGradient(x,y,8,x,y,42);
    glow.addColorStop(0,'#ffce6c99');glow.addColorStop(1,'#ffce6c00');ctx.fillStyle=glow;ctx.fillRect(x-42,y-42,84,84);
  }
  ctx.fillStyle=seasonal?'#d98a45':'#b39b78';ctx.beginPath();ctx.ellipse(x,y,22,17,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#171e30';ctx.beginPath();ctx.ellipse(x,y+2,17,12,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#e5c88d';ctx.lineWidth=3;
  for(const dx of [-7,7]){ctx.beginPath();ctx.moveTo(x+dx,y-7);ctx.lineTo(x+dx,y+13);ctx.stroke();}
  for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x-7,y-5+i*5);ctx.lineTo(x+7,y-5+i*5);ctx.stroke();}
  ctx.fillStyle='#fce0a4';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.fillText(seasonal?(exit?'↑ EXIT TO FOREST':'↓ HALLOWEEN CAVERN'):exit?'↑ EXIT TO MEADOW':'↓ UNDERGROUND',x,y-23);
  if(seasonal&&!exit){ctx.font='11px sans-serif';ctx.fillText('October only · ALL SHINY',x,y+33);}
}
function drawCaveScene(camX,camY,ppx,ppy) {
  const {wildlife,exit}=currentCave();
  if(halloweenCavern)drawHalloweenCavernDecorations(camX,camY);
  drawTunnelMarker(exit.x*T-camX,exit.y*T-camY,true,halloweenCavern);
  for(const mon of wildlife) {
    const x=(mon.fx+(mon.x-mon.fx)*mon.progress+.5)*T-camX,y=(mon.fy+(mon.y-mon.fy)*mon.progress+.5)*T-camY;
    if(x < -T || y < -T || x > cv.width+T || y > cv.height+T)continue;
    const sp=byId(mon.id);
    sp.draw(ctx,x,y,halloweenCavern&&sp.habitat==='generator'?22:15,mon.shiny,time);
    if(mon.shiny){ctx.fillStyle='#fff09a';ctx.font='bold 18px sans-serif';ctx.textAlign='center';ctx.fillText('✦',x+15,y-15);}
  }
  if(!halloweenCavern)drawCaveTreasures(camX,camY);
  drawPlayer(ppx-camX,ppy-camY);
  const x=ppx-camX+T/2,y=ppy-camY+T/2;
  const light=ctx.createRadialGradient(x,y,100,x,y,Math.max(cv.width,cv.height));
  light.addColorStop(0,'#090d2000');light.addColorStop(1,'#090d2099');ctx.fillStyle=light;ctx.fillRect(0,0,cv.width,cv.height);
}

function drawHalloweenCavernDecorations(camX,camY) {
  for(const [tx,ty] of [[5,5],[20,4],[5,16],[21,17],[29,6],[47,19],[14,28],[35,38]]) {
    const x=(tx+.5)*T-camX,y=(ty+.5)*T-camY;
    ctx.fillStyle='#ed933e';ctx.beginPath();ctx.ellipse(x,y,12,10,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#7ba665';ctx.fillRect(x-2,y-15,4,6);
    ctx.fillStyle='#fff4ab';ctx.fillRect(x-7,y-3,4,3);ctx.fillRect(x+3,y-3,4,3);ctx.fillRect(x-5,y+4,10,3);
  }
  ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  for(const [tx,ty,label] of [[13,4,'✨ EVERY CREATURE IS SHINY'],[26,10,'DINOSAURS →'],[17,23,'↓ GLOWING POOLS'],[31,24,'↑ EXIT LADDER']]) {
    const x=(tx+.5)*T-camX,y=(ty+.5)*T-camY,width=ctx.measureText(label).width+18;
    ctx.fillStyle='#2a1c3e';ctx.fillRect(x-width/2,y-12,width,24);ctx.fillStyle='#ffe2a1';ctx.fillText(label,x,y+4);
  }
  ctx.fillStyle='#ffe9a4';
  for(let i=0;i<24;i++) {
    const x=(i*137+Math.sin(time+i)*10)%cv.width,y=(i*89+time*9)%cv.height;
    ctx.globalAlpha=.25+.25*Math.sin(time*2+i);ctx.fillRect(x,y,3,3);
  }
  ctx.globalAlpha=1;
}

function drawCaveTreasures(camX,camY) {
  const {piles,treasures,location,title}=generatorContext();
  for(const pile of piles) {
    const x=(pile.x+.5)*T-camX,y=(pile.y+.5)*T-camY,got=treasures.collected[pile.id];
    if(x < -100 || y < -80 || x > cv.width+100 || y > cv.height+80)continue;
    ctx.fillStyle='#171e32';ctx.strokeStyle=got?'#658a78':pile.light;ctx.lineWidth=3;
    ctx.beginPath();ctx.roundRect(x-23,y-22,46,48,8);ctx.fill();ctx.stroke();
    if(!got) {
      const glow=ctx.createRadialGradient(x,y,3,x,y,50);glow.addColorStop(0,pile.color+'aa');glow.addColorStop(1,pile.color+'00');ctx.fillStyle=glow;ctx.fillRect(x-50,y-50,100,100);
      for(const [dx,dy,size] of [[-12,5,12],[9,4,14],[0,-4,17]]) {
        ctx.fillStyle=pile.color;ctx.strokeStyle=pile.light;ctx.lineWidth=1.5;ctx.beginPath();
        ctx.moveTo(x+dx-size*.55,y+dy+size*.6);ctx.lineTo(x+dx-size*.55,y+dy-size*.35);ctx.lineTo(x+dx,y+dy-size);ctx.lineTo(x+dx+size*.55,y+dy-size*.35);ctx.lineTo(x+dx+size*.55,y+dy+size*.6);ctx.closePath();ctx.fill();ctx.stroke();
        ctx.beginPath();ctx.moveTo(x+dx,y+dy-size);ctx.lineTo(x+dx,y+dy+size*.6);ctx.stroke();
      }
    }
    ctx.fillStyle='#101827';ctx.fillRect(x-48,y-48,96,21);
    ctx.fillStyle=got?'#b3d8bc':'#ffffff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText((got?pile.name+' ✓':pile.name).toUpperCase(),x,y-33);
    if(!got){ctx.fillStyle=pile.light;ctx.font='bold 20px sans-serif';ctx.fillText('↓',x,y-56-Math.sin(time*3)*3);}
  }
  const x=(location.x+.5)*T-camX,y=(location.y+.5)*T-camY;
  ctx.fillStyle='#202638';ctx.fillRect(x-26,y-28,52,54);ctx.strokeStyle='#99b4d2';ctx.lineWidth=3;ctx.strokeRect(x-26,y-28,52,54);
  ctx.fillStyle='#64829c';ctx.fillRect(x-18,y-44,36,14);ctx.fillStyle='#a6f6db';ctx.fillRect(x-17,y-20,34,22);
  ctx.fillStyle='#274658';ctx.font='bold 20px sans-serif';ctx.textAlign='center';ctx.fillText('⚡',x,y-2);
  piles.forEach((pile,i)=>{ctx.fillStyle=treasures.generated[pile.id]?'#a4f5bd':treasures.collected[pile.id]?pile.color:'#526172';ctx.beginPath();ctx.arc(x-14+i*14,y+13,4,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#e4f4ff';ctx.font='bold 12px sans-serif';ctx.fillText(title.toUpperCase(),x,y-54);
  for(const sign of deepDiving?[]:[{x:27,y:31},{x:41,y:30}]) {
    const sx=(sign.x+.5)*T-camX,sy=(sign.y+.5)*T-camY;
    ctx.fillStyle='#292f48';ctx.fillRect(sx-53,sy-12,106,24);ctx.fillStyle='#f9dc95';ctx.fillText('← Entrance',sx,sy+4);
  }
}

function drawDeepSeaScene(camX,camY,ppx,ppy) {
  if(abyssDiving){drawAbyssScene(camX,camY,ppx,ppy);return;}
  drawWaterWildlife(camX,camY);drawCaveTreasures(camX,camY);
  drawTrainers(camX,camY);
  const x=(deepEntrance.x+.5)*T-camX,y=(deepEntrance.y+.5)*T-camY;
  ctx.strokeStyle='#a2e8ff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,21,12,0,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#dbf8ff';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('↑ SHALLOWS (V)',x-20,y+36);
  for(const [tx,ty,label]of[[14,4,'MOONSTONES ←  ·  SUNSTONES →'],[10,17,'↓ ABYSS CRYSTALS'],[45,20,'↑ SUNSTONES'],[29,30,'↖ ENTRANCE GENERATOR']]) {
    const sx=(tx+.5)*T-camX,sy=(ty+.5)*T-camY,w=ctx.measureText(label).width+16;
    ctx.fillStyle='#0b253e';ctx.fillRect(sx-w/2,sy-12,w,24);ctx.fillStyle='#b8eef1';ctx.fillText(label,sx,sy+4);
  }
  drawPlayer(ppx-camX,ppy-camY);
  ctx.strokeStyle='#bdeaff66';ctx.lineWidth=1;
  for(let i=0;i<20;i++) {
    const bx=(i*157+Math.sin(time+i)*9)%cv.width,by=(cv.height+(i*83-time*(8+i%4*3))%cv.height)%cv.height;
    ctx.beginPath();ctx.arc(bx,by,2+i%3,0,Math.PI*2);ctx.stroke();
  }
}

function drawAbyssScene(camX,camY,ppx,ppy) {
  for(const [tx,ty]of[[20,10],[31,22],[14,24]]) {
    const x=(tx+.5)*T-camX,y=(ty+.5)*T-camY;
    ctx.fillStyle='#364559';ctx.fillRect(x-8,y-6,16,30);ctx.fillStyle='#8bb9cf';ctx.fillRect(x-6,y-10,12,5);
    for(let i=0;i<5;i++){ctx.fillStyle=`rgba(136,177,207,${.3-i*.045})`;ctx.beginPath();ctx.arc(x+Math.sin(time+i)*8,y-15-(time*15+i*13)%80,6+i*2,0,Math.PI*2);ctx.fill();}
  }
  drawWaterWildlife(camX,camY);drawPlayer(ppx-camX,ppy-camY);
  const x=(abyssEntrance.x+.5)*T-camX,y=(abyssEntrance.y+.5)*T-camY;
  ctx.strokeStyle='#b7c5ff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,22,12,0,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#e1e8ff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('↑ DEEP SEA (V)',x,y+35);
  const sx=14*T-camX,sy=5*T-camY;ctx.fillStyle='#0a142b';ctx.fillRect(sx-98,sy-18,196,39);
  ctx.fillStyle='#c0d7ff';ctx.fillText('THE ABYSS · LEVEL 3',sx,sy-2);ctx.font='11px sans-serif';ctx.fillText('Follow the glowing creatures',sx,sy+13);
  ctx.fillStyle='#b8e9ff';for(let i=0;i<30;i++){ctx.globalAlpha=.25+.2*Math.sin(time+i);ctx.fillRect((i*137+time*3)%cv.width,(i*89+Math.sin(time+i)*8)%cv.height,2,2);}ctx.globalAlpha=1;
}

function refreshHalloweenSeason() {
  const next=halloweenCalendar();
  if(next.key===halloweenSeason.key)return;
  halloweenSeason=next;applyHalloweenMap();
  syncHalloweenCavernWildlife();
  if(halloweenCavern&&!next.open) {
    if(modal==='enc')closeEnc();
    halloweenCavern=false;underground=false;activeMap=map;
    Object.assign(P,{x:7,y:5,fx:7,fy:5,prog:1,boat:false,diving:false});
    fishing=null;keys.clear();encounterGrace=4;
    toast('🎃 Halloween Cavern has closed until next October. Your caught shinies are safe!');
  }
  spots=spots.filter(s=>[TG,WA,MT,SN,HF].includes(map[s.y]?.[s.x])||newBiomeByTile(map[s.y]?.[s.x]));
  if(!underground&&!deepDiving&&halloweenPatch.some(c=>c.x===P.x&&c.y===P.y)&&[TR,HT].includes(tile(P.x,P.y))) {
    Object.assign(P,{x:7,y:5,fx:7,fy:5,prog:1});keys.clear();
  }
  hud();persist();
}
addEventListener('visibilitychange',()=>{if(!document.hidden)refreshHalloweenSeason();});

// ---------- Loop ----------
let last = performance.now(), saveT = 0;
let seasonT=0;
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
  if((seasonT+=dt)>=1){seasonT=0;refreshHalloweenSeason();}
  if (!modal) {
    encounterGrace = Math.max(0, encounterGrace - dt);
    if (P.prog < 1) { P.prog += dt / (P.boat ? 0.2 : 0.16); if (P.prog >= 1) { P.prog = 1; arrive(); } }
    if (P.prog >= 1 && !modal) {
      const k = [...keys].reverse().find(c => DIRS[c]);
      if (k) { if (fishing) { fishing = null; toast('Reeled in.'); } tryMove(...DIRS[k]); }
    }
    updateFishing(dt);
  }
  if (!modal) {
    if(underground)updateCaveWildlife(dt);
    else {updateWaterWildlife(dt);diveGrace=Math.max(0,diveGrace-dt);checkDiveEncounter();}
  }
  updateSpots(dt);
  render(); if (modal === 'enc') drawEnc();
  if ((saveT += dt) > 3) { saveT = 0; persist(); }
  requestAnimationFrame(loop);
}
hud();
toast(abyssDiving?'🌌 Welcome back to the Abyss! V returns to the Deep Sea.':deepDiving?'🌊 B explores the Abyss. V returns to the shallows.':halloweenCavern?'✨ Halloween Cavern: every creature is shiny! Return to the ladder to leave.':underground?'🕯️ Explore the caves; return to the ladder to leave.':P.diving ? '🤿 B dives deeper. V returns to your boat.' : 'Welcome! Space at the starting tunnel: explore underground 🕳️');
requestAnimationFrame(loop);
