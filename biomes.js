// Permanent surface habitats. These IDs stay separate from seasonal and dive maps.
const NEW_BIOMES = [
  { id:'jungle', name:'Emerald Jungle', icon:'🌴', tile:14, bounds:[23,2,37,17], x:24, y:8,
    colors:['#206d55','#28795c','#71d8a0'], direction:'Across the western river, north of the crossing',
    special:'leaf-dragon', description:'Vines, bright birds, and a dragon hidden among the leaves.' },
  { id:'desert', name:'Sunstone Desert', icon:'🏜️', tile:15, bounds:[23,28,37,42], x:24, y:36,
    colors:['#d8ad6a','#e2b975','#fff0b4'], direction:'Across the western river, south of the crossing',
    special:'sun-sphinx', description:'Golden dunes, desert animals, and a rare Sun Sphinx.' },
  { id:'marsh', name:'Mushroom Marsh', icon:'🍄', tile:16, bounds:[2,19,15,25], x:5, y:22,
    colors:['#48776d','#3e6b65','#bce2cb'], direction:'South of the starting meadow, before the snow',
    special:'mushroom-guardian', description:'Glowing mushrooms, tiny insects, and a gentle guardian.' },
  { id:'volcano', name:'Ember Highlands', icon:'🌋', tile:17, bounds:[47,2,57,10], x:48, y:8,
    colors:['#584754','#4b414e','#ffad73'], direction:'Northern mountains, beyond the eastern river',
    special:'phoenix', description:'Warm stone trails, ember creatures, and a fiery Phoenix.' },
  { id:'moon', name:'Moonlit Grove', icon:'🌙', tile:18, bounds:[47,35,57,42], x:48, y:36,
    colors:['#414f80','#394772','#d3d4ff'], direction:'Southern mountains, beyond the eastern river',
    special:'moon-unicorn', description:'Silver trees, starry creatures, and a Moon Unicorn.' },
];
const newBiomeByTile = tile => NEW_BIOMES.find(b => b.tile === tile);
const newBiomeById = id => NEW_BIOMES.find(b => b.id === id);

// Each entry defines body, accent, and belly colors for normal and shiny forms.
const BIOME_ANIMALS = [
  ['tiger','Tiger','jungle','cat',['#efa04c','#553c42','#fff0c9'],['#8edbdc','#5450a6','#ebffff']],
  ['toucan','Toucan','jungle','bird',['#344957','#f5b640','#fff0d2'],['#b16cdd','#75efc8','#ffecfb']],
  ['chameleon','Chameleon','jungle','lizard',['#80c96d','#38736b','#dcf3a2'],['#d679ed','#6942af','#fbe0ff']],
  ['gorilla','Gorilla','jungle','ape',['#526070','#a7a8ad','#d3c5af'],['#9d76bb','#ddd3f0','#f8edff']],
  ['sloth','Sloth','jungle','ape',['#b2a182','#6b5b58','#f2dfbd'],['#85c5bc','#4d7d9f','#e1fff5']],
  ['leaf-dragon','Leaf Dragon','jungle','dragon',['#54ae77','#c2e478','#e4f8b0'],['#bc7edf','#f4acd5','#fff2de']],
  ['fennec-fox','Fennec Fox','desert','cat',['#e4bd7b','#ad7858','#fff0d2'],['#9db9f4','#7355b7','#edfaff']],
  ['camel','Camel','desert','hoof',['#c89558','#895e43','#f6da9c'],['#b37fce','#66538f','#f2d7ff']],
  ['scorpion','Scorpion','desert','bug',['#aa6b42','#efbd67','#f7daa3'],['#668fdf','#a9e5f4','#f0f9ff']],
  ['meerkat','Meerkat','desert','ape',['#d5b17c','#806046','#fff1cc'],['#8cc9b2','#476d8d','#e5fff0']],
  ['cobra','Cobra','desert','snake',['#c7a34e','#674c42','#f9de8e'],['#8877cf','#394786','#d8f8ff']],
  ['sun-sphinx','Sun Sphinx','desert','cat',['#e9ba51','#4789a6','#fff0af'],['#dbe8f8','#8768c2','#e5ccff']],
  ['axolotl','Axolotl','marsh','lizard',['#f2a4bc','#d66893','#ffe6e4'],['#a5a1ee','#6251ad','#e4f4ff']],
  ['salamander','Salamander','marsh','lizard',['#374e59','#f5c652','#9bbca8'],['#9c66bd','#8cf1d8','#e8ccff']],
  ['firefly','Firefly','marsh','bug',['#6d5e70','#f5e47b','#e8fcb4'],['#9b6cc6','#7cf1fa','#e1ffff']],
  ['snail','Snail','marsh','snail',['#c8b992','#ae6e99','#eadbc2'],['#91d7d2','#7160c1','#d5fff2']],
  ['dragonfly','Dragonfly','marsh','bug',['#55bca5','#bfdfeb','#eaefd1'],['#e399c8','#e6c4ff','#fff0cf']],
  ['mushroom-guardian','Mushroom Guardian','marsh','mushroom',['#c3d6bc','#d273ab','#fff1d5'],['#b2e7e0','#6e7de0','#f7eaff']],
  ['lava-gecko','Lava Gecko','volcano','lizard',['#f08d4e','#6d4b5d','#ffe0a4'],['#66c5e3','#4b568e','#def8ff']],
  ['obsidian-beetle','Obsidian Beetle','volcano','bug',['#47465f','#bb7498','#dba4c0'],['#d9b66e','#578da2','#fff3ba']],
  ['cinder-bat','Cinder Bat','volcano','bat',['#8d6579','#ed9666','#f4c9b4'],['#809dd8','#c0a5fa','#e0faff']],
  ['ash-wolf','Ash Wolf','volcano','cat',['#92939b','#ef9c69','#e2dfd7'],['#8cbfc7','#a27ce5','#e4fbff']],
  ['ember-ram','Ember Ram','volcano','hoof',['#a66952','#efb457','#f2c59c'],['#a491dd','#6cc3df','#ebe7ff']],
  ['phoenix','Phoenix','volcano','bird',['#ed7954','#ffd474','#fff0ad'],['#6ebcfa','#c6a0f3','#ddfdff']],
  ['moon-hare','Moon Hare','moon','hare',['#cdd3ec','#8d92c3','#f5f0ff'],['#e9acd7','#b875bd','#fff0da']],
  ['luna-moth','Luna Moth','moon','bug',['#b7e1c9','#608ba4','#f5eeba'],['#e3a7d4','#9d71bd','#fff2c9']],
  ['silver-stag','Silver Stag','moon','hoof',['#aabdd2','#e7e8f5','#eff9ff'],['#dbab6c','#9066a9','#fff3c8']],
  ['moon-lynx','Moon Lynx','moon','cat',['#a7a6d1','#63679b','#e9e9ff'],['#99d6c7','#497ba3','#efffd9']],
  ['star-tortoise','Star Tortoise','moon','tortoise',['#a2b4cb','#586a9c','#fff0ad'],['#ca9dc5','#9671b5','#bdf6ee']],
  ['moon-unicorn','Moon Unicorn','moon','hoof',['#e1e4fa','#9d9be3','#fff1c5'],['#efb4d3','#65c6c8','#fff2b9']],
];
const BIOME_SPECIES = BIOME_ANIMALS.map(([id,name,habitat]) => ({
  id,name,habitat,rate:.96,weight:newBiomeById(habitat).special===id?6:20,
  special:newBiomeById(habitat).special===id,draw:(...args)=>drawBiomeCreature(id,...args),
}));

function drawBiomeCreature(id,c,x,y,size,shiny=false,time=0) {
  const entry=BIOME_ANIMALS.find(a=>a[0]===id),kind=entry[3];
  const [body,accent,light]=entry[shiny?5:4];
  c.save();c.translate(x,y+Math.sin(time*3)*size*.025);c.scale(size,size);
  c.lineWidth=.045;c.lineJoin='round';c.lineCap='round';c.strokeStyle='#263344';
  const oval=(x,y,rx,ry,color,angle=0)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,Math.PI*2);c.fill();c.stroke();};
  const shape=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke();};
  const line=(points,color,width=.07)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.strokeStyle='#263344';c.lineWidth=.045;};
  const eye=(x,y)=>{oval(x,y,.07,.09,'#233345');oval(x-.018,y-.025,.02,.025,'#fff');};
  const star=(x,y,r,color)=>{const p=[];for(let i=0;i<8;i++){const a=i*Math.PI/4;const d=i%2?r*.3:r;p.push([x+Math.cos(a)*d,y+Math.sin(a)*d]);}shape(p,color);};
  if(kind==='bug') {
    const scorpion=id==='scorpion',beetle=id==='obsidian-beetle',moth=id==='luna-moth',fly=id==='dragonfly';
    if(scorpion) {
      line([[.2,.45],[.75,.15],[.9,-.45],[.7,-.85],[.4,-.7]],accent,.17);
      shape([[.43,-.85],[.2,-.65],[.46,-.58]],light);
    }
    for(const side of[-1,1]) {
      for(let i=0;i<3;i++)line([[side*.2,-.1+i*.24],[side*.65,.02+i*.25],[side*.85,-.06+i*.32]],body,.06);
      if(!scorpion&&!beetle) {
        oval(side*.52,-.25,moth?.53:.55,fly?.12:.32,accent,side*-.3);
        oval(side*.5,.22,moth?.45:.5,fly?.11:.26,light,side*.3);
        if(moth){oval(side*.62,-.26,.11,.13,light);oval(side*.62,-.26,.05,.06,body);line([[side*.5,.43],[side*.65,.91]],accent,.12);}
      }
      if(scorpion){line([[side*.2,-.4],[side*.62,-.6]],body,.13);oval(side*.73,-.66,.24,.18,accent);line([[side*.77,-.76],[side*.83,-.6]],'#263344',.04);}
    }
    oval(0,.22,beetle?.52:.24,.58,body);
    if(beetle){line([[0,-.3],[0,.77]],accent,.05);shape([[-.12,-.47],[0,-1],[.12,-.47]],accent);oval(-.22,.13,.12,.28,accent,-.2);}
    else if(id==='firefly'){oval(0,.56,.25,.27,light);c.save();c.globalAlpha=.2;oval(0,.56,.42,.4,accent);c.restore();}
    else {for(let i=0;i<3;i++)line([[-.17,.12+i*.19],[.17,.12+i*.19]],accent,.05);}
    oval(0,-.44,.27,.25,body);eye(-.12,-.47);eye(.12,-.47);
    for(const side of[-1,1])line([[side*.12,-.63],[side*.24,-.91]],accent,.04);
  } else if(kind==='lizard'||kind==='snake'||kind==='dragon') {
    const dragon=kind==='dragon',snake=kind==='snake',axolotl=id==='axolotl';
    if(snake) {
      oval(.14,.58,.79,.34,body);oval(.15,.58,.45,.13,accent);
      shape([[-.35,.5],[-.72,-.26],[-.6,-.75],[0,-.92],[.6,-.75],[.72,-.26],[.35,.5]],accent);
      oval(0,-.05,.35,.66,light);
    } else {
      if(id==='chameleon') {
        c.strokeStyle=body;c.lineWidth=.19;c.beginPath();c.arc(.67,.34,.38,-Math.PI*.5,Math.PI*1.6);c.stroke();c.strokeStyle='#263344';c.lineWidth=.045;
      } else shape([[.25,.25],[1,.18],[1.1,-.22],[.72,.5],[.18,.62]],accent);
      if(dragon)for(const side of[-1,1])shape([[side*.15,-.12],[side*.92,-.88],[side*.83,-.08],[side*.51,-.28],[side*.4,.19]],accent);
      for(const side of[-1,1]){line([[side*.28,.2],[side*.65,.65],[side*.85,.6]],body,.17);line([[side*.3,-.17],[side*.75,-.04]],body,.12);}
      oval(0,.2,.53,.48,body);oval(-.1,.32,.32,.25,light);
      if(id==='salamander'||id==='lava-gecko')for(const [sx,sy]of [[.2,.1],[-.3,.2],[.18,.43]])oval(sx,sy,.09,.08,accent);
      if(dragon)for(let i=0;i<3;i++)shape([[.3+i*.22,.2],[.4+i*.22,-.08],[.55+i*.22,.24]],light);
    }
    if(axolotl)for(const side of[-1,1])for(let i=0;i<3;i++)line([[side*.35,-.38],[side*(.74+i*.04),-.72+i*.24]],accent,.12);
    oval(-.1,-.4,.5,.34,body);
    if(id==='chameleon'){oval(-.35,-.53,.2,.2,light);eye(-.38,-.52);}
    else {eye(-.31,-.43);eye(.13,-.43);}
    line([[-.25,-.22],[.12,-.2]],'#263344',.03);
    if(dragon){shape([[-.4,-.66],[-.5,-1],[-.19,-.65]],accent);shape([[.08,-.68],[.3,-1],[.3,-.55]],accent);}
    if(snake){line([[0,-.1],[0,.08],[-.08,.13]],'#e97b96',.035);line([[0,.08],[.08,.13]],'#e97b96',.035);}
  } else if(kind==='bird'||kind==='bat') {
    const phoenix=id==='phoenix',bat=kind==='bat';
    if(phoenix)for(let i=-1;i<=1;i++)shape([[i*.15,.25],[i*.45,.99],[i*.1+.12,.45]],i===0?light:accent);
    if(bat||phoenix)for(const side of[-1,1])shape([[side*.1,-.1],[side*.6,-.7],[side*1.08,-.9],[side*.93,-.12],[side*.66,-.26],[side*.47,.2]],accent);
    else {shape([[.18,.3],[.95,.78],[.75,.15]],body);line([[-.2,.45],[-.25,.85]],accent);line([[.18,.45],[.2,.85]],accent);}
    oval(0,.12,.44,.53,body);oval(-.07,.27,.28,.32,light);
    if(!phoenix&&!bat)oval(.3,.05,.25,.35,accent,.3);
    if(bat)for(const side of[-1,1])shape([[side*.12,-.4],[side*.4,-1],[side*.45,-.38]],body);
    oval(-.08,-.42,.38,.35,body);
    if(bat){eye(-.24,-.45);eye(.1,-.45);shape([[-.15,-.2],[-.08,-.03],[0,-.2]],light);}
    else {shape([[-.34,-.47],[-1,-.44],[-.83,-.1],[-.28,-.15]],accent);eye(-.14,-.52);}
    if(phoenix){shape([[-.3,-.68],[-.16,-1.08],[0,-.72],[.2,-1],[.26,-.62]],light);}
  } else if(kind==='snail'||kind==='tortoise'||kind==='mushroom') {
    if(kind==='mushroom') {
      line([[-.35,.23],[-.77,.5]],body,.16);line([[.35,.23],[.77,.5]],body,.16);
      oval(-.27,.82,.22,.14,body);oval(.27,.82,.22,.14,body);oval(0,.28,.46,.57,body);
      c.fillStyle=accent;c.beginPath();c.moveTo(-.95,-.2);c.quadraticCurveTo(-.72,-1.35,0,-1);c.quadraticCurveTo(.7,-1.1,.95,-.2);c.quadraticCurveTo(0,.15,-.95,-.2);c.fill();c.stroke();
      for(const [sx,sy,rx]of [[-.46,-.5,.16],[.03,-.75,.19],[.5,-.42,.13]])oval(sx,sy,rx,.1,light);
      eye(-.17,.19);eye(.17,.19);
    } else {
      oval(0,.62,.94,.19,body);
      if(kind==='tortoise')for(const side of[-1,1]){oval(side*.48,.6,.18,.24,body);oval(side*.63,.18,.15,.22,body);}
      oval(.16,.08,.62,.57,accent);
      if(kind==='snail') {
        c.strokeStyle=light;c.lineWidth=.065;c.beginPath();for(let i=0;i<70;i++){const a=i*.16,r=.03+i*.005;c.lineTo(.16+Math.cos(a)*r,.08+Math.sin(a)*r);}c.stroke();c.strokeStyle='#263344';c.lineWidth=.045;
        oval(-.62,.33,.25,.36,body);for(const side of[-1,1]){line([[-.62+side*.13,.12],[-.62+side*.19,-.27]],body,.065);eye(-.62+side*.19,-.27);}
      } else {star(.16,.08,.38,light);oval(-.67,.28,.3,.26,body);eye(-.78,.2);}
    }
  } else {
    const hoof=kind==='hoof',ape=kind==='ape',hare=kind==='hare';
    const cat=kind==='cat',sphinx=id==='sun-sphinx';
    if(id==='sloth')line([[-.95,-.95],[.95,-.95]],accent,.1);
    if(cat) {
      line([[.33,.43],[.87,.22],[.89,-.25]],accent,.17);
      if(id==='fennec-fox'||id==='ash-wolf')oval(.72,.35,.28,.43,body,.5);
    }
    if(id==='camel') {oval(.03,-.18,.34,.55,body);oval(.5,-.15,.29,.48,body);}
    if(id==='gorilla'){oval(-.5,.12,.26,.65,body,.18);oval(.5,.12,.26,.65,body,-.18);}
    if(sphinx)for(const side of[-1,1])shape([[side*.25,.1],[side*.95,-.45],[side*.8,.4]],accent);
    oval(0,.26,hoof?.64:.51,hoof?.36:.55,body);oval(-.06,.35,.3,.32,light);
    for(const side of[-1,1]) {
      oval(side*.32,.75,.2,.17,hoof?accent:body);
      if(hoof)line([[side*.4,.35],[side*.43,.73]],body,.18);
      if(id==='sloth')line([[side*.32,.14],[side*.58,-.44],[side*.59,-.95]],body,.18);
      else if(ape&&id!=='gorilla')line([[side*.36,.03],[side*.45,.37]],accent,.09);
    }
    const headY=hoof?-.38:-.42;
    if(hare||id==='fennec-fox')for(const side of[-1,1]){oval(side*.25,-.86,.14,.43,body,side*.25);oval(side*.25,-.86,.06,.29,accent,side*.25);}
    else if(cat)for(const side of[-1,1]){shape([[side*.12,-.65],[side*.49,-1],[side*.49,-.43]],body);if(id==='moon-lynx')line([[side*.49,-.91],[side*.54,-1.15]],accent,.04);}
    else for(const side of[-1,1])oval(side*.37,headY-.15,.16,.19,body);
    oval(-.07,headY,hoof?.34:.45,.38,body);
    if(ape)oval(-.07,headY+.07,.32,.27,light);
    if(hoof)oval(-.33,-.24,.33,.21,light);else oval(-.07,headY+.22,.25,.14,light);
    if(id==='sloth'||id==='meerkat')for(const side of[-1,1])oval(-.07+side*.2,headY,.14,.12,accent,side*.35);
    eye(-.25,headY-.02);eye(.1,headY-.02);
    if(!hoof)oval(-.07,headY+.16,.055,.04,'#263344');
    if(id==='tiger')for(const side of[-1,1])for(let i=0;i<3;i++)line([[side*.48,-.05+i*.19],[side*.3,.04+i*.19]],accent,.07);
    if(id==='ash-wolf')shape([[-.42,-.2],[-.5,.05],[-.2,-.03],[0,.13],[.22,-.13]],accent);
    if(id==='moon-hare')oval(.51,.4,.22,.22,light);
    if(id==='silver-stag')for(const side of[-1,1]){line([[side*.22,-.62],[side*.36,-1.1],[side*.65,-1.22]],accent,.07);line([[side*.4,-1.1],[side*.27,-1.3]],accent,.06);}
    if(id==='ember-ram')for(const side of[-1,1]){oval(side*.38,-.57,.26,.3,accent);oval(side*.4,-.56,.12,.15,body);}
    if(id==='moon-unicorn') {
      shape([[-.16,-.68],[-.04,-1.25],[.12,-.65]],light);
      line([[.2,-.7],[.4,-.4],[.37,.15]],accent,.19);star(.1,.28,.17,accent);
    }
    if(sphinx){shape([[-.5,-.5],[-.48,-.92],[.32,-.92],[.44,-.48],[.55,-.06],[.25,-.16],[.17,-.69],[-.31,-.69],[-.4,-.06],[-.61,-.04]],accent);oval(-.07,-.83,.09,.08,light);}
  }
  if(shiny) {star(.91,-.85,.13,'#fff2a1');star(-.96,.31,.09,'#fff2a1');}
  c.restore();
}

function drawNewBiomeTile(c,biome,x,y,px,py,size,time) {
  const h=((x*73856093)^(y*19349663))>>>0;
  c.fillStyle=biome.colors[h&1];c.fillRect(px,py,size,size);
  c.save();c.translate(px,py);c.lineCap='round';
  if(biome.id==='jungle') {
    c.strokeStyle='#3d9f78';c.lineWidth=2;c.beginPath();c.moveTo(5,39);c.quadraticCurveTo(13+Math.sin(time+x)*2,12,30,4);c.stroke();
    c.fillStyle='#6cbf80';for(let i=0;i<3;i++){c.beginPath();c.ellipse(13+i*6,25-i*7,8,3,-.6,0,Math.PI*2);c.fill();}
    if((h&7)===0){c.fillStyle='#f5a5b6';c.beginPath();c.arc(28,30,4,0,Math.PI*2);c.fill();}
  } else if(biome.id==='desert') {
    c.strokeStyle='#bc9155';c.lineWidth=1.5;c.beginPath();c.moveTo(2,27);c.quadraticCurveTo(20,19,39,29);c.stroke();
    if((h&7)===0){c.strokeStyle='#729166';c.lineWidth=5;c.beginPath();c.moveTo(22,34);c.lineTo(22,10);c.moveTo(22,23);c.lineTo(12,23);c.lineTo(12,16);c.moveTo(22,18);c.lineTo(30,18);c.lineTo(30,12);c.stroke();}
  } else if(biome.id==='marsh') {
    c.fillStyle='#77b2a877';c.beginPath();c.ellipse(20,28,17,6,0,0,Math.PI*2);c.fill();
    if((h&3)===0){c.fillStyle='#e1d9c2';c.fillRect(18,21,4,12);c.fillStyle=(h&4)?'#cb8dd0':'#a8cced';c.beginPath();c.ellipse(20,20,11,6,0,Math.PI,0);c.fill();c.fillStyle='#fff2ce';c.fillRect(16,17,3,3);c.fillRect(23,18,3,3);}
  } else if(biome.id==='volcano') {
    c.strokeStyle=(h&3)?'#a16868':'#ffad70';c.lineWidth=(h&3)?1:2;c.beginPath();c.moveTo(0,11);c.lineTo(13,16);c.lineTo(20,31);c.lineTo(40,27);c.stroke();
    if((h&7)===0){c.fillStyle='#bd7893';c.beginPath();c.moveTo(22,30);c.lineTo(24,10);c.lineTo(33,24);c.closePath();c.fill();}
  } else {
    c.fillStyle='#a0a5d9';for(let i=0;i<3;i++){const sx=4+(h>>(i*4))%30,sy=4+(h>>(i*5+3))%30;c.globalAlpha=.35+.3*Math.sin(time*2+x+i);c.fillRect(sx,sy,2,2);}c.globalAlpha=1;
    if((h&7)===0){c.strokeStyle='#a0b6e0';c.lineWidth=2;c.beginPath();c.moveTo(20,34);c.lineTo(20,11);c.moveTo(20,23);c.lineTo(10,17);c.moveTo(20,20);c.lineTo(30,10);c.stroke();}
  }
  c.restore();
}
