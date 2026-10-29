// ===== Magikarp River Quest =====
const T = 40, W = 60, H = 45;
const G = 0, TG = 1, WA = 2, DK = 3, TR = 4, SA = 5, MT = 6, MP = 7, SN = 8;
const $ = id => document.getElementById(id);
const cv = $('world'), ctx = cv.getContext('2d');

// ---------- Creatures ----------
const SPECIES = [
  { id: 'magikarp', name: 'Magikarp', water: true, fishingWeight: 30, rate: 0.8 },
  { id: 'bunny', name: 'Bunny', weight: 40, rate: 0.7, draw: (...a) => drawAnimal('bunny', ...a) },
  { id: 'duck', name: 'Duck', weight: 25, rate: 0.6, draw: (...a) => drawAnimal('duck', ...a) },
  { id: 'frog', name: 'Frog', emoji: '🐸', weight: 45, fishingWeight: 20, rate: 0.55 },
  { id: 'squirrel', name: 'Squirrel', weight: 12, rate: 0.5, draw: (...a) => drawAnimal('squirrel', ...a) },
  { id: 'fox', name: 'Fox', weight: 6, rate: 0.35, draw: (...a) => drawAnimal('fox', ...a) },
  { id: 'hedgehog', name: 'Hedgehog', weight: 2, rate: 0.25, draw: (...a) => drawAnimal('hedgehog', ...a) },
  { id: 'bouldersaur', name: 'Bouldersaur', weight: 4, rate: 0.2, draw: (...a) => drawBoulder(...a) },
  { id: 'snowy', name: 'Snowy', habitat: 'winter', rate: 0.55, draw: (...a) => drawSnowy(...a) },
  { id: 'shark', name: 'Shark', water: true, fishingWeight: 8, rate: 0.35, draw: (...a) => drawWaterAnimal('shark', ...a) },
  { id: 'catfish', name: 'Catfish', water: true, fishingWeight: 12, rate: 0.65, draw: (...a) => drawWaterAnimal('catfish', ...a) },
  { id: 'grunt', name: 'Grunt', water: true, fishingWeight: 12, rate: 0.7, draw: (...a) => drawWaterAnimal('grunt', ...a) },
  { id: 'spiny-dogfish', name: 'Spiny Dogfish', water: true, fishingWeight: 8, rate: 0.45, draw: (...a) => drawWaterAnimal('spiny-dogfish', ...a) },
  { id: 'crocodile', name: 'Crocodile', water: true, fishingWeight: 5, rate: 0.3, draw: (...a) => drawWaterAnimal('crocodile', ...a) },
  { id: 'alligator', name: 'Alligator', water: true, fishingWeight: 5, rate: 0.3, draw: (...a) => drawWaterAnimal('alligator', ...a) },
];
const byId = id => SPECIES.find(s => s.id === id);

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
const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
const tile = (x, y) => inb(x, y) ? map[y][x] : TR;
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

const waterTiles = [];
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (tile(x, y) === WA) waterTiles.push({ x, y });
const waterWildlife = ['shark', 'catfish', 'grunt', 'spiny-dogfish', 'crocodile', 'alligator'].map((id, i) => ({
  id, ...[{ x: 19, y: 9 }, { x: 19, y: 16 }, { x: 19, y: 30 }, { x: 41, y: 10 }, { x: 41, y: 27 }, { x: 30, y: 23 }][i],
  moveIn: 2 + i * .3, life: 45 + i * 5,
}));
function pickWaterAnimal() {
  const pool = SPECIES.filter(sp => sp.fishingWeight), total = pool.reduce((sum, sp) => sum + sp.fishingWeight, 0);
  let roll = Math.random() * total;
  return pool.find(sp => (roll -= sp.fishingWeight) < 0) || pool[0];
}
function updateWaterWildlife(dt) {
  for (const mon of waterWildlife) {
    mon.life -= dt; mon.moveIn -= dt;
    if (mon.life <= 0) {
      const spot = waterTiles[Math.floor(R() * waterTiles.length)];
      Object.assign(mon, spot); mon.life = 45 + R() * 30;
    }
    if (mon.moveIn <= 0) {
      const [dx, dy] = [[0, 1], [0, -1], [1, 0], [-1, 0]][Math.floor(R() * 4)];
      if (tile(mon.x + dx, mon.y + dy) === WA && !waterWildlife.some(other => other !== mon && other.x === mon.x + dx && other.y === mon.y + dy)) {
        mon.x += dx; mon.y += dy;
      }
      mon.moveIn = 2 + R() * 2;
    }
  }
}
function drawWaterWildlife(camX, camY) {
  for (const mon of waterWildlife) {
    const x = (mon.x + .5) * T - camX, y = (mon.y + .5) * T - camY;
    if (x < -T || y < -T || x > cv.width + T || y > cv.height + T) continue;
    ctx.save(); ctx.globalAlpha = .9;
    byId(mon.id).draw(ctx, x, y + Math.sin(time * 2 + mon.x) * 2, 13, false, time);
    ctx.restore();
  }
}

// ---------- State ----------
const save = JSON.parse(localStorage.getItem('mkrq') || '{}');
const dex = save.dex || {};
const P = { x: save.x ?? 5, y: save.y ?? 5, fx: 0, fy: 0, prog: 1, dir: [0, 1], boat: !!save.boat };
P.fx = P.x; P.fy = P.y;
let fishing = null, modal = null, time = 0;
const keys = new Set();
const party = save.party || [], box = save.box || [];
const trainerWins = save.trainerWins || {};
const persist = () => localStorage.setItem('mkrq', JSON.stringify({ dex, party, box, trainerWins, x: P.x, y: P.y, boat: P.boat }));

let toastT;
function toast(msg) { const el = $('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2200); }
function hud() {
  $('hud-caught').textContent = 'Caught: ' + Object.values(dex).reduce((a, d) => a + d.count, 0);
  $('hud-mode').textContent = P.boat ? '⛵ Boating' : '🚶 On foot';
  $('hud-biome').textContent = tile(P.x, P.y) === SN ? '❄ Winter Area' : P.x >= 44 ? '🏔️ Mountains' : '🌿 Meadows';
  renderPartyBar();
}

// ---------- Movement ----------
function tryMove(dx, dy) {
  P.dir = [dx, dy];
  const nx = P.x + dx, ny = P.y + dy, t = tile(nx, ny), cur = tile(P.x, P.y);
  if (TRAINERS.some(trainer => trainer.x === nx && trainer.y === ny)) return;
  let ok;
  if (P.boat) ok = t === WA || t === DK;
  else ok = t === G || t === TG || t === SA || t === DK || t === MT || t === SN || (t === WA && cur === DK);
  if (!ok) return;
  P.fx = P.x; P.fy = P.y; P.x = nx; P.y = ny; P.prog = 0;
}
function arrive() {
  const t = tile(P.x, P.y);
  if (challengeTrainer()) { hud(); return; }
  if (t === WA && !P.boat) { P.boat = true; toast('⛵ You hopped into a boat!'); }
  else if (t === DK && P.boat) { P.boat = false; toast('🟫 You docked the boat.'); }
  else if (t === SN && spotAt(P.x, P.y)) {
    removeSpot(P.x, P.y);
    toast('✨ A shiny Snowy appeared in the sparkling snow!');
    startEncounter(byId('snowy'), true, false, false, true);
  }
  else if (t === SN && Math.random() < 0.3) {
    const sp = byId(Math.random() < 0.85 ? 'snowy' : 'bunny');
    startEncounter(sp, Math.random() < 1 / 8, false, false, true);
  }
  else if (t === MT && spotAt(P.x, P.y)) {
    removeSpot(P.x, P.y);
    toast('✨ A shiny Bouldersaur emerged from the mountain crags!');
    startEncounter(byId('bouldersaur'), true, false, true);
  }
  else if (t === MT && Math.random() < 0.22) {
    const r = Math.random();
    const sp = r < 0.75 ? byId('bouldersaur') : (r < 0.9 ? byId('fox') : byId('hedgehog'));
    startEncounter(sp, Math.random() < 1 / 8, false, true);
  }
  else if (t === TG && spotAt(P.x, P.y)) {
    removeSpot(P.x, P.y);
    toast('✨ A shiny creature appeared in the sparkling grass!');
    startEncounter(pickAnimal(), true, false, false);
  }
  else if (t === TG && Math.random() < 0.22) {
    startEncounter(pickAnimal(), Math.random() < 1 / 8, false, false);
  }
  hud();
}
function pickAnimal() {
  const land = SPECIES.filter(s => !s.water && s.id !== 'bouldersaur' && !s.habitat), tot = land.reduce((a, s) => a + s.weight, 0);
  let r = Math.random() * tot; for (const s of land) if ((r -= s.weight) < 0) return s; return land[0];
}

// ---------- Trainer battles ----------
let battle = null, ignoredTrainer = null;
const maxHP = mon => 24 + mon.lv * 5;
function challengeTrainer() {
  if (P.boat || modal) return false;
  if (ignoredTrainer && TRAINERS.some(t => t.id === ignoredTrainer && Math.abs(t.x - P.x) + Math.abs(t.y - P.y) > 1)) ignoredTrainer = null;
  const trainer = TRAINERS.find(t => !trainerWins[t.id] && t.id !== ignoredTrainer && Math.abs(t.x - P.x) + Math.abs(t.y - P.y) === 1);
  if (!trainer) return false;
  fishing = null; keys.clear();
  if (!party.length) {
    ignoredTrainer = trainer.id;
    toast(`${trainer.name}: Catch a creature first, then come back to battle!`);
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
  if (fishing) {
    if (fishing.bite) {
      const sh = fishing.shiny, fishingSpecies = fishing.species;
      if (sh) removeSpot(fishing.x, fishing.y);
      fishing = null;
      const sp = byId(fishingSpecies);
      startEncounter(sp, sh || Math.random() < 1 / 8, true, false);
    }
    else { fishing = null; toast('Too early... the fish swam off.'); }
    return;
  }
  const fx = P.x + P.dir[0], fy = P.y + P.dir[1];
  if (tile(fx, fy) !== WA) { toast(P.boat ? 'Face open water to fish!' : 'Face the water to cast your rod 🎣'); return; }
  fishing = { x: fx, y: fy, wait: 1.5 + Math.random() * 3, bite: false, shiny: !!spotAt(fx, fy), species: waterWildlife.find(mon => mon.x === fx && mon.y === fy)?.id || pickWaterAnimal().id };
  toast(fishing.shiny ? '✨ You cast into the sparkles! A shiny is biting!' : '🎣 Cast! Wait for a bite…');
}

// ---------- Shiny sparkle spots ----------
let spots = [];
const spotAt = (x, y) => spots.find(s => s.x === x && s.y === y);
const removeSpot = (x, y) => { spots = spots.filter(s => !(s.x === x && s.y === y)); };
function updateSpots(dt) {
  spots.forEach(s => s.life -= dt); spots = spots.filter(s => s.life > 0);
  for (let tries = 0; spots.length < 8 && tries < 60; tries++) {
    const x = P.x + Math.round((Math.random() - 0.5) * 26);
    const y = P.y + Math.round((Math.random() - 0.5) * 20);
    const t = tile(x, y);
    if ((t === TG || t === WA || t === MT || t === SN) && !spotAt(x, y) && Math.hypot(x - P.x, y - P.y) > 1.5) {
      spots.push({ x, y, life: 45 + Math.random() * 45 });
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
  if (!fishing.bite && fishing.wait <= 0) { fishing.bite = true; fishing.wait = 0.9; toast('❗ Something bit! Press Space!'); }
  else if (fishing.bite && fishing.wait <= 0) { fishing = null; toast('It got away…'); }
}

// ---------- Encounter ----------
const ec = $('enc-canvas'), ectx = ec.getContext('2d');
let enc = null;
function startEncounter(sp, shiny, inWater = false, inMountain = false, inWinter = false) {
  enc = { sp, shiny: !!shiny, busy: false, lv: 2 + Math.floor(Math.random() * 8) };
  modal = 'enc'; keys.clear();
  $('encounter').classList.remove('hidden');
  $('enc-scene').className = 'enc-scene ' + (inWater ? 'water' : inWinter ? 'winter' : (inMountain ? 'mountain' : 'land'));
  ec.classList.remove('gone'); $('ball').className = 'ball hidden';
  setText(`${inWater ? 'You fished up' : inWinter ? 'In the snow, a wild' : (inMountain ? 'From the crags appeared' : 'A wild')} ${enc.shiny ? '✨SHINY✨ ' : ''}${sp.name} (Lv ${enc.lv})${inWater ? '!' : ' appeared!'}`);
  setBtns(true);
}
const setText = s => $('enc-text').textContent = s;
const setBtns = on => { $('btn-throw').disabled = !on; $('btn-run').disabled = !on; };
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
  if (!enc || enc.busy) return;
  enc.busy = true; setBtns(false);
  const ball = $('ball'), success = Math.random() < enc.sp.rate;
  const shakes = success ? 3 : Math.floor(Math.random() * 3);
  setText('You threw a ball!');
  ball.className = 'ball throw'; await wait(600);
  ec.classList.add('gone'); ball.className = 'ball';
  for (let i = 0; i < shakes; i++) { await wait(250); ball.className = 'ball wobble'; await wait(500); ball.className = 'ball'; }
  await wait(300);
  if (success) {
    ball.classList.add('caught');
    const d = dex[enc.sp.id] ||= { count: 0, shiny: 0 }; d.count++; if (enc.shiny) d.shiny++;
    const mon = { id: enc.sp.id, shiny: enc.shiny, lv: enc.lv };
    const toParty = party.length < 6; (toParty ? party : box).push(mon);
    setText(`Gotcha! ${enc.sp.name} was caught! 🎉 ${toParty ? 'Added to your party.' : 'Party full: sent to the Box.'}`); persist(); hud();
    await wait(1400); closeEnc();
  } else {
    ball.className = 'ball hidden'; ec.classList.remove('gone');
    setText('Oh no! It broke free!');
    await wait(900);
    if (Math.random() < 0.25) { setText(`${enc.sp.name} ran away!`); await wait(1100); closeEnc(); return; }
    setText(`What will you do?`); enc.busy = false; setBtns(true);
  }
}
$('btn-throw').onclick = throwBall;
$('btn-run').onclick = () => { if (enc && !enc.busy) { closeEnc(); toast('Got away safely!'); } };

// ---------- Collection ----------
let previewShinies = false;
function openDex() {
  if (modal === 'enc' || modal === 'battle') return;
  modal = 'dex'; keys.clear();
  const list = $('dex-list'); list.innerHTML = '';
  for (const s of SPECIES) {
    const d = dex[s.id], el = document.createElement('div'), visible = d || previewShinies;
    const shiny = previewShinies || d?.shiny > 0;
    el.className = 'dex-item' + (visible ? '' : ' unseen');
    const icon = document.createElement('div'); icon.className = 'icon';
    if (s.id === 'magikarp') { const c = document.createElement('canvas'); c.width = 90; c.height = 60; drawCarp(c.getContext('2d'), 48, 26, 17, shiny); icon.appendChild(c); }
    else if (visible && s.draw) { const c = document.createElement('canvas'); c.width = 90; c.height = 60; s.draw(c.getContext('2d'), 45, 30, 22, shiny); icon.appendChild(c); }
    else if (visible) icon.appendChild(emojiEl(s.emoji, 40, shiny)); else icon.textContent = '❔';
    el.appendChild(icon);
    el.insertAdjacentHTML('beforeend', `<b>${visible ? s.name : '???'}</b><br><small>${previewShinies ? `✨ Shiny preview · ${d?.shiny ? 'caught' : 'not caught'}` : d ? `×${d.count}${d.shiny ? ` · ✨${d.shiny}` : ''}` : (s.habitat === 'winter' ? '❄ Winter Area · South' : s.id === 'bouldersaur' ? '🏔️ East Mountains' : s.water ? 'Fish in rivers' : s.id === 'frog' ? 'Grass or rivers' : 'Tall grass')}</small>`);
    list.appendChild(el);
  }
  $('dex').classList.remove('hidden');
}
const closeDex = () => { $('dex').classList.add('hidden'); modal = null; };
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
    if (m) pl.appendChild(monCard(m, () => { if (party.length > 1) { box.push(party.splice(i, 1)[0]); refresh(); } else toast('Keep at least one in your party!'); }, 'Click to send to Box'));
    else { const e = document.createElement('div'); e.className = 'mon empty'; e.textContent = 'Empty'; pl.appendChild(e); }
  }
  box.forEach((m, i) => bl.appendChild(monCard(m, () => { if (party.length < 6) { party.push(box.splice(i, 1)[0]); refresh(); } else toast('Party is full (6)!'); }, 'Click to add to party')));
  if (!box.length) bl.innerHTML = '<p class="muted">Box is empty.</p>';
  $('box-count').textContent = box.length;
}
function refresh() { renderParty(); renderPartyBar(); persist(); }
function renderPartyBar() {
  const bar = $('party-bar'); bar.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const slot = document.createElement('div'); slot.className = 'pslot' + (party[i]?.shiny ? ' shiny' : '');
    if (party[i]) slot.appendChild(monIcon(party[i], 44, 30)); bar.appendChild(slot);
  }
}
function openParty() { if (modal === 'enc' || modal === 'battle') return; if (modal === 'dex') closeDex(); modal = 'party'; keys.clear(); renderParty(); $('party').classList.remove('hidden'); }
const closeParty = () => { $('party').classList.add('hidden'); modal = null; };
$('btn-party').onclick = openParty; $('btn-party-close').onclick = closeParty; $('party-bar').onclick = openParty;

// ---------- Input ----------
const DIRS = { ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1], ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0] };
addEventListener('keydown', e => {
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

// ---------- Render ----------
function resize() { cv.width = innerWidth; cv.height = innerHeight; }
addEventListener('resize', resize); resize();
const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

function drawTile(t, x, y, px, py) {
  const h = hash(x, y);
  const grass = () => { ctx.fillStyle = h & 1 ? '#63c25c' : '#5bb954'; ctx.fillRect(px, py, T, T); };
  if (t === WA) {
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
  for (const trainer of TRAINERS) {
    const x = trainer.x * T + T / 2 - camX, y = trainer.y * T + T / 2 - camY;
    if (x < -60 || y < -60 || x > cv.width + 60 || y > cv.height + 60) continue;
    ctx.fillStyle = '#0004'; ctx.beginPath(); ctx.ellipse(x, y + 15, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#27364f'; ctx.fillRect(x - 8, y + 8, 6, 10); ctx.fillRect(x + 2, y + 8, 6, 10);
    ctx.fillStyle = trainer.color; ctx.fillRect(x - 9, y - 4, 18, 17);
    ctx.fillStyle = '#f4caa1'; ctx.beginPath(); ctx.arc(x, y - 10, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#304361'; ctx.fillRect(x - 9, y - 18, 18, 6);
    ctx.fillStyle = '#27364f'; ctx.fillRect(x - 4, y - 11, 2, 3); ctx.fillRect(x + 3, y - 11, 2, 3);
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
    if (inb(x, y)) drawTile(map[y][x], x, y, Math.round(x * T - camX), Math.round(y * T - camY));
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
  // fishing line & bobber
  if (fishing) {
    const bx = fishing.x * T + T / 2 - camX, by = fishing.y * T + T / 2 - camY + (fishing.bite ? Math.sin(time * 30) * 4 + 4 : Math.sin(time * 3) * 2);
    ctx.strokeStyle = '#fff9'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ppx - camX + T / 2 + P.dir[0] * 12, ppy - camY + 4); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(bx, by, 5, Math.PI, 0); ctx.fill();
  }
  drawSparkles(camX, camY);
  drawWaterWildlife(camX, camY);
  drawTrainers(camX, camY);
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

// ---------- Loop ----------
let last = performance.now(), saveT = 0;
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
  if (!modal) {
    if (P.prog < 1) { P.prog += dt / (P.boat ? 0.2 : 0.16); if (P.prog >= 1) { P.prog = 1; arrive(); } }
    if (P.prog >= 1 && !modal) {
      const k = [...keys].reverse().find(c => DIRS[c]);
      if (k) { if (fishing) { fishing = null; toast('Reeled in.'); } tryMove(...DIRS[k]); }
    }
    updateFishing(dt);
  }
  if (!modal) updateWaterWildlife(dt);
  updateSpots(dt);
  render(); if (modal === 'enc') drawEnc();
  if ((saveT += dt) > 3) { saveT = 0; persist(); }
  requestAnimationFrame(loop);
}
hud();
toast('Welcome! Find a river and press Space to fish for Magikarp 🎣');
requestAnimationFrame(loop);
