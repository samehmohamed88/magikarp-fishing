// Markets and the six-badge journey. Loaded before game.js; functions run after game state exists.
const GYMS = [
  { id:'gym-meadow', name:'Meadow Gym', leader:'Wren', badge:'Leaf', icon:'🌿', x:3, y:12, color:'#72c593', team:[{id:'bunny',lv:5},{id:'fox',lv:6}] },
  { id:'gym-frost', name:'Frost Gym', leader:'Flurry', badge:'Snowflake', icon:'❄️', x:10, y:30, color:'#8ed7fa', team:[{id:'snowy',lv:8},{id:'bear',lv:9}] },
  { id:'gym-jungle', name:'Jungle Gym', leader:'Fern', badge:'Vine', icon:'🌴', x:27, y:6, color:'#83da75', team:[{id:'tiger',lv:10},{id:'chameleon',lv:11},{id:'leaf-dragon',lv:12}] },
  { id:'gym-dunes', name:'Dunes Gym', leader:'Solis', badge:'Sun', icon:'☀️', x:28, y:38, color:'#f7ca76', team:[{id:'cobra',lv:12},{id:'scorpion',lv:13},{id:'sun-sphinx',lv:14}] },
  { id:'gym-ember', name:'Ember Gym', leader:'Blaze', badge:'Flame', icon:'🔥', x:52, y:6, color:'#ff9b74', team:[{id:'ash-wolf',lv:15},{id:'ember-ram',lv:16},{id:'phoenix',lv:17}] },
  { id:'gym-moon', name:'Moon Gym', leader:'Selene', badge:'Moon', icon:'🌙', x:53, y:38, color:'#cbb3ff', team:[{id:'moon-lynx',lv:18},{id:'silver-stag',lv:19},{id:'moon-unicorn',lv:20}] },
].map(gym=>({...gym,gym:true}));
const MARKETS = [
  {id:'market-meadow',name:'Meadow Market',x:3,y:8},
  {id:'market-frost',name:'Snow Market',x:13,y:30},
  {id:'market-jungle',name:'Jungle Market',x:27,y:13},
  {id:'market-dunes',name:'Dunes Market',x:33,y:37},
  {id:'market-ember',name:'Ember Market',x:55,y:9},
  {id:'market-moon',name:'Moon Market',x:50,y:40},
];
const CHAMPION_DOOR = {id:'champion-door',name:'Champion Door',x:6,y:3};
const ELITE_FOUR = [
  {id:'elite-marina',name:'Marina',title:'Master of the Tides',icon:'🌊',color:'#7ed4ed',species:['shark','great-white-shark','orca','narwhal','megalodon','mosasaurus']},
  {id:'elite-rowan',name:'Rowan',title:'Keeper of the Wilds',icon:'🌿',color:'#a7df92',species:['gorilla','tiger','leaf-dragon','bear','bouldersaur','mushroom-guardian']},
  {id:'elite-cinder',name:'Cinder',title:'Heart of the Volcano',icon:'🔥',color:'#ffb084',species:['lava-gecko','ash-wolf','ember-ram','phoenix','tyrannosaurus-rex','spinosaurus']},
  {id:'elite-luna',name:'Luna',title:'Guardian of Midnight',icon:'🌙',color:'#d0b4ff',species:['moon-hare','luna-moth','silver-stag','moon-lynx','moon-unicorn','dragonfish']},
].map((member,index)=>({...member,elite:true,index,team:member.species.map(id=>({id,lv:30}))}));
const ELITE_PRIZES = ['megalodon','mosasaurus','elasmosaurus'];
const LURES = [
  {id:'rare',name:'Rare Lure',price:40,uses:10,multiplier:3,bonus:.05},
  {id:'deluxe',name:'Deluxe Rare Lure',price:90,uses:20,multiplier:5,bonus:.1},
];
const LEVEL_CANDY = {name:'Level Candy',price:20,maxLevel:100};
const RARE_CREATURES = new Set(['fox','hedgehog','bouldersaur','ghost','shark','spiny-dogfish','alligator','narwhal','giant-squid','colossal-squid','great-white-shark','orca','anglerfish','goblin-shark','dragonfish']);
const isRareCreature = sp => !!sp.special || RARE_CREATURES.has(sp.id);
function loadJourney(saved) {
  const data=saved&&typeof saved==='object'?saved:{};
  const lure=LURES.find(l=>l.id===data.lure?.id);
  return {
    coins:Number.isSafeInteger(data.coins)&&data.coins>=0?data.coins:60,
    candies:Number.isSafeInteger(data.candies)&&data.candies>=0?data.candies:0,
    gymWins:Object.fromEntries(GYMS.map(g=>[g.id,data.gymWins?.[g.id]===true])),
    lure:lure&&Number.isSafeInteger(data.lure.remaining)&&data.lure.remaining>0?{id:lure.id,remaining:data.lure.remaining}:null,
    championReward:data.championReward===true,
    eliteRound:Number.isInteger(data.eliteRound)&&data.eliteRound>=0&&data.eliteRound<=4?data.eliteRound:0,
    eliteCleared:data.eliteCleared===true||data.eliteRound===4,
    eliteReward:data.eliteReward===true,
    perfectBalls:Number.isSafeInteger(data.perfectBalls)&&data.perfectBalls>=0&&data.perfectBalls<=Number.MAX_SAFE_INTEGER-20?data.perfectBalls:0,
    fireCaveGift:data.fireCaveGift===true,
    fireDragonCaught:data.fireDragonCaught===true,
  };
}
const badgeCount = () => GYMS.filter(g=>journey.gymWins[g.id]).length;
const championDoorOpen = () => badgeCount()===GYMS.length;
const eliteFourUnlocked = () => championDoorOpen()&&journey.championReward;
const activeLure = () => journey.lure ? LURES.find(l=>l.id===journey.lure.id) : null;
function lureWeight(sp,weight) {return weight*(isRareCreature(sp)?activeLure()?.multiplier||1:1);}
function useEncounterLure() {
  const lure=activeLure();
  if(!lure)return 0;
  if(--journey.lure.remaining<=0)journey.lure=null;
  return lure.bonus;
}
function prepareLeagueMap() {
  for(const site of [...MARKETS,...GYMS,CHAMPION_DOOR,FIRE_CAVE_SITE]) {
    const ground=map[site.y][site.x];
    for(let y=site.y-1;y<=site.y+1;y++)for(let x=site.x-1;x<=site.x+1;x++)
      if([TR,MP,TG].includes(map[y][x]))map[y][x]=[TR,MP,TG].includes(ground)?G:ground;
  }
  // Keep the first gym connected to the established north/south footpath.
  for(let x=3;x<=5;x++)map[12][x]=G;
}
function surfaceSites() {return [...MARKETS,...GYMS,...(championDoorOpen()?[CHAMPION_DOOR]:[]),...(fireCaveUnlocked()?[FIRE_CAVE_SITE]:[])];}
function nearLeagueSite() {
  if(underground||P.diving||P.boat)return null;
  return surfaceSites().find(site=>Math.abs(site.x-P.x)+Math.abs(site.y-P.y)<=1)||null;
}
function leagueSafeTile(x,y) {
  return !underground&&!P.diving&&surfaceSites().some(site=>Math.abs(site.x-x)+Math.abs(site.y-y)<=1);
}
function leagueHud() {
  const lure=activeLure();
  $('journey-status').textContent=`🪙 ${journey.coins} · 🍬 ${journey.candies} · 🏅 ${badgeCount()}/6${journey.fireCaveGift?` · 💎 100% balls: ${journey.perfectBalls}`:''}${lure?` · 🪶 ${lure.name}: ${journey.lure.remaining} left`:''}`;
  const site=nearLeagueSite();
  $('btn-site').hidden=!site;
  if(site)$('btn-site').textContent=site===FIRE_CAVE_SITE?'🐉 Enter Fire Dragon Cave (Space)':site===CHAMPION_DOOR&&eliteFourUnlocked()?'🚪 Elite Four / Champion Hall (Space)':`${site.gym?'🏅':site===CHAMPION_DOOR?'🚪':'🛒'} ${site.name} (Space)`;
}
let leagueSite=null;
function openLeaguePanel(mode) {
  if(modal&&!['party','dex','explore'].includes(modal))return false;
  if(modal==='party')closeParty();
  if(modal==='dex')closeDex();
  if(modal==='explore')closeExplore();
  keys.clear();fishing=null;modal=mode;
  clearTimeout(toastT);$('toast').classList.remove('show');
  $('league').classList.remove('hidden');
  return true;
}
function closeLeague() {
  if(!['league','market','gym','champion'].includes(modal))return;
  $('league').classList.add('hidden');modal=null;leagueSite=null;keys.clear();encounterGrace=4;
  $('btn-league').focus();hud();
}
function leagueButton(text,handler,disabled=false) {
  const button=document.createElement('button');button.className='btn';button.textContent=text;
  button.disabled=disabled;button.onclick=handler;return button;
}
function openLeagueGuide() {
  if(!openLeaguePanel('league'))return;
  leagueSite=null;
  $('league-title').textContent='🏅 Six badges, one secret door';
  $('league-intro').textContent=`${badgeCount()}/6 badges · ${journey.coins} coins. Win all six gyms to reveal a door north of the starting tunnel. Catches earn 10–25 coins; defeating a wild creature lets you choose 100 coins instead, or 1000 for a shiny! Trainer wins earn 30, gym wins 120.${fireCaveUnlocked()?' Your Fire Dragon Cave is open!':''}`;
  const list=$('league-content');list.replaceChildren();
  for(const site of [...GYMS,...MARKETS,...(championDoorOpen()?[CHAMPION_DOOR]:[]),...(fireCaveUnlocked()?[FIRE_CAVE_SITE]:[])]) {
    const card=document.createElement('article');card.className='league-option';
    const won=site.gym&&journey.gymWins[site.id];
    const heading=document.createElement('h3');heading.textContent=`${site.icon||(site===CHAMPION_DOOR?'🚪':'🛒')} ${site.name}${won?' ✓':''}`;
    const detail=document.createElement('p');detail.textContent=site.gym?`${site.badge} Badge · ${site.leader} · Lv ${site.team[0].lv}–${site.team.at(-1).lv}`:site===CHAMPION_DOOR?(eliteFourUnlocked()?`Elite Four: ${journey.eliteRound}/4 defeated. Walk into the door to battle!`:'Your Champion Hall is open!'):'Buy lures for rare creatures and candies to level up your team.';
    if(site===FIRE_CAVE_SITE)detail.textContent=`${journey.fireDragonCaught?'Fire Dragon caught!':'A level-70 Fire Dragon awaits at the end.'} First visit: 20 balls with a 100% catch chance.`;
    card.append(heading,detail,leagueButton('Travel here',()=>travelToLeagueSite(site.id),!canTravel()));list.append(card);
  }
  if(!canTravel()){$('league-intro').textContent+=' Return to surface land to travel.';}
  $('btn-league-close').focus();
}
function travelToLeagueSite(id) {
  if(modal!=='league'||!canTravel())return;
  const site=surfaceSites().find(s=>s.id===id);if(!site)return;
  closeLeague();P.x=P.fx=site.x;P.y=P.fy=site.y+1;P.prog=1;
  ignoredTrainer=null;encounterGrace=4;hud();persist();
  toast(`${site.name}: press Space or tap the nearby button to enter.`);
}
function openLeagueSite() {
  if(modal||P.prog<1)return;
  const site=nearLeagueSite();if(!site)return;
  if(site===FIRE_CAVE_SITE){enterFireCave();return;}
  const mode=site.gym?'gym':site===CHAMPION_DOOR?'champion':'market';
  if(!openLeaguePanel(mode))return;
  leagueSite=site;renderLeagueSite();$('btn-league-close').focus();
}
function renderLeagueSite() {
  const list=$('league-content');list.replaceChildren();
  $('league-title').textContent=leagueSite.name;
  if(modal==='market') {
    const lure=activeLure();
    $('league-intro').textContent=`You have ${journey.coins} coins and ${journey.candies} ${journey.candies===1?'candy':'candies'}. ${lure?`${lure.name} active: ${journey.lure.remaining} encounters left. Finish it before buying another.`:'Lures activate immediately and last for a number of wild encounters. Running away also uses one charge.'} Catch creatures to earn more coins!`;
    const candy=document.createElement('article');candy.className='league-option candy-shop';
    candy.innerHTML=`<h3>🍬 ${LEVEL_CANDY.name}</h3><p>1 candy · ${LEVEL_CANDY.price} coins</p><p>Give a creature +1 level, up to Lv ${LEVEL_CANDY.maxLevel}. Choose any creature in your Party or Box. Unused candies stay in your bag.</p>`;
    const buyCandyButton=leagueButton(`Buy candy · ${LEVEL_CANDY.price} coins`,buyCandy,journey.coins<LEVEL_CANDY.price||journey.candies>=Number.MAX_SAFE_INTEGER);
    buyCandyButton.id='btn-buy-candy';
    const give=leagueButton('Give candies →',()=>{
      if(modal!=='market')return;
      closeLeague();openParty();toggleCandyMode();
    },!journey.candies||!party.length&&!box.length);
    give.id='btn-market-give-candy';candy.append(buyCandyButton,give);list.append(candy);
    for(const item of LURES) {
      const card=document.createElement('article');card.className='league-option';
      card.innerHTML=`<h3>🪶 ${item.name}</h3><p>${item.uses} encounters · ${item.price} coins</p><p>Rare creatures appear more often in random land and fishing encounters (${item.multiplier}× weight). Catch chance increases by ${Math.round(item.bonus*100)} percentage points everywhere.</p><p>Visible swimmers, shiny odds, and seasonal dates stay the same.</p>`;
      const buy=leagueButton(`Buy & activate · ${item.price} coins`,()=>buyLure(item.id),!!lure||journey.coins<item.price);
      buy.dataset.lure=item.id;card.append(buy);list.append(card);
    }
  } else if(modal==='gym') {
    const won=journey.gymWins[leagueSite.id];
    $('league-intro').textContent=won?`You earned the ${leagueSite.badge} Badge! ${badgeCount()}/6 gyms beaten.`:`Leader ${leagueSite.leader} guards the ${leagueSite.badge} Badge. Beat the whole team to earn this badge and 120 coins. Your party is healed after the battle.`;
    const card=document.createElement('article');card.className='league-option gym-team';
    for(const mon of leagueSite.team){const entry=document.createElement('div');entry.append(monIcon(mon));const label=document.createElement('p');label.textContent=`${byId(mon.id).name} · Lv ${mon.lv}`;entry.append(label);card.append(entry);}
    const gym=leagueSite;
    const button=leagueButton(won?'Badge earned':party.length?'Challenge gym':'Add a creature to your party first',()=>challengeGym(gym.id),won||!party.length);
    button.id='btn-gym-challenge';list.append(card,button);
  } else if(modal==='champion') {
    $('league-title').textContent=journey.championReward?'🏆 The Elite Four':'✨ Champion Hall';
    $('league-intro').textContent=journey.championReward
      ?`Four masters. Six level-30 creatures each. ${journey.eliteRound}/4 defeated. Your party heals between battles and your progress saves. Enter with an empty party to receive six random level-20 creatures to keep—even ones you have never caught!`
      :'All six badges opened this door. Welcome, Champion! Claim your shiny Phoenix (Lv 20) and 200 coins to unlock the Elite Four beyond the door.';
    if(fireCaveUnlocked())$('league-intro').textContent+=' Fire Dragon Cave is now open northwest of the starting tunnel! Find it in Gyms & Markets (G).';
    const card=document.createElement('article');card.className='league-option champion-prize';
    card.append(monIcon({id:'phoenix',shiny:true},160,110));
    const label=document.createElement('p');label.textContent=GYMS.map(g=>`${g.icon} ${g.badge}`).join(' · ');card.append(label);
    const reward=leagueButton(journey.championReward?'Prize already collected':'Claim Champion prize',claimChampionReward,journey.championReward);
    reward.id='btn-champion-reward';card.append(reward);list.append(card);
    if(journey.championReward) {
      const start=leagueButton(journey.eliteRound===4?'Rematch the Elite Four':`Face ${ELITE_FOUR[journey.eliteRound].name} · Round ${journey.eliteRound+1}/4`,()=>enterEliteFour());
      start.id='btn-elite-enter';start.classList.add('primary');list.append(start);
      const prizes=document.createElement('article');prizes.className='league-option elite-prizes';
      const prizeTitle=document.createElement('h3');prizeTitle.textContent=journey.eliteReward?'🏆 Elite Four prize collected':'🏆 Defeat all four to win these shinies!';
      const prizeTeam=document.createElement('div');prizeTeam.className='elite-roster';
      for(const id of ELITE_PRIZES){const slot=document.createElement('div');slot.append(monIcon({id,shiny:true},72,52));const label=document.createElement('small');label.textContent=`✨ ${byId(id).name} · Lv 30`;slot.append(label);prizeTeam.append(slot);}
      prizes.append(prizeTitle,prizeTeam);list.append(prizes);
      for(const member of ELITE_FOUR) {
        const preview=document.createElement('article');preview.className='league-option elite-preview';
        const title=document.createElement('h3');title.textContent=`${member.icon} ${member.index+1}. ${member.name}${journey.eliteRound>member.index?' ✓':''}`;
        const subtitle=document.createElement('p');subtitle.textContent=`${member.title} · Six creatures, all Lv 30`;
        const team=document.createElement('div');team.className='elite-roster';
        for(const mon of member.team){const slot=document.createElement('div');slot.append(monIcon(mon,62,44));const label=document.createElement('small');label.textContent=byId(mon.id).name;slot.append(label);team.append(slot);}
        preview.append(title,subtitle,team);list.append(preview);
      }
    }
  }
}
function buyLure(id) {
  if(modal!=='market'||nearLeagueSite()!==leagueSite||activeLure())return;
  const lure=LURES.find(l=>l.id===id);if(!lure||journey.coins<lure.price)return;
  journey.coins-=lure.price;journey.lure={id,remaining:lure.uses};persist();hud();renderLeagueSite();
}
function buyCandy() {
  if(modal!=='market'||nearLeagueSite()!==leagueSite||journey.coins<LEVEL_CANDY.price||journey.candies>=Number.MAX_SAFE_INTEGER)return;
  journey.coins-=LEVEL_CANDY.price;journey.candies++;
  persist();hud();renderLeagueSite();
  $('league-intro').textContent=`🍬 Bought a Level Candy! ${journey.coins} coins left · ${journey.candies} ${journey.candies===1?'candy':'candies'} in your bag. Choose “Give candies” now, or use Party (P) later.`;
  // Keep keyboard shopping usable when the purchase rebuilds the market cards.
  const next=['btn-buy-candy','btn-market-give-candy','btn-league-close'].map($).find(button=>!button.disabled);
  next.focus();
}
function challengeGym(id) {
  const gym=GYMS.find(g=>g.id===id);
  if(!gym||modal!=='gym'||nearLeagueSite()!==gym||journey.gymWins[id]||!party.length)return;
  closeLeague();startTrainerBattle(gym);
}
function awardBattleVictory(trainer) {
  if(trainer.elite) {
    if(ELITE_FOUR[journey.eliteRound]?.id!==trainer.id)return '';
    journey.eliteRound++;
    if(journey.eliteRound===4){
      journey.eliteCleared=true;
      const awarded=awardElitePrizes();
      return ` You defeated all four masters and all 24 creatures! You are the Elite Four Champion!${awarded?' Prizes: shiny Megalodon, Mosasaurus, and Elasmosaurus (Lv 30)! Check your Party and Box.':' Your Elite Four prizes were already collected.'} Fire Dragon Cave is open northwest of the starting tunnel! Enter to receive 20 guaranteed-catch balls and meet a level-70 dragon. Find the cave with G.`;
    }
    return ` Elite Four: ${journey.eliteRound}/4 defeated. ${ELITE_FOUR[journey.eliteRound].name} is next!`;
  }
  const wins=trainer.gym?journey.gymWins:trainerWins;
  if(wins[trainer.id])return '';
  wins[trainer.id]=true;const coins=trainer.gym?120:30;journey.coins+=coins;
  return trainer.gym?` ${trainer.badge} Badge earned! +${coins} coins. ${championDoorOpen()?'All six badges! A glowing door has appeared north of the starting tunnel.':`${badgeCount()}/6 badges collected.`}`:` +${coins} coins!`;
}
function awardCatchCoins(sp,shiny) {
  const reward=shiny?25:isRareCreature(sp)?15:10;journey.coins+=reward;return reward;
}
function claimChampionReward() {
  if(modal!=='champion'||!championDoorOpen()||nearLeagueSite()!==CHAMPION_DOOR||journey.championReward)return;
  journey.championReward=true;journey.coins+=200;
  const mon={id:'phoenix',shiny:true,lv:20};(party.length<6?party:box).push(mon);
  const entry=dex.phoenix||={count:0,shiny:0};entry.count++;entry.shiny++;
  persist();hud();renderLeagueSite();
}
function giveEliteStarterParty() {
  if(party.length)return false;
  const season=halloweenCalendar();
  // Seasonal creatures keep their calendar rules; collection ownership is never a filter.
  const pool=SPECIES.filter(sp=>!sp.postgameOnly&&(sp.habitat!=='halloween'||(season.open&&(sp.id!=='ghost'||season.ghosts))));
  for(let i=0;i<6;i++) {
    const [sp]=pool.splice(Math.floor(Math.random()*pool.length),1);
    party.push({id:sp.id,lv:20,shiny:false});
    const entry=dex[sp.id]||={count:0,shiny:0};entry.count++;
  }
  return true;
}
function awardElitePrizes() {
  if(journey.eliteRound!==4||journey.eliteReward)return false;
  journey.eliteReward=true;
  for(const id of ELITE_PRIZES) {
    const mon={id,shiny:true,lv:30};(party.length<6?party:box).push(mon);
    const entry=dex[id]||={count:0,shiny:0};entry.count++;entry.shiny++;
  }
  return true;
}
function enterEliteFour() {
  if(!eliteFourUnlocked()||nearLeagueSite()!==CHAMPION_DOOR||P.prog<1||
    (modal!==null&&modal!=='champion'))return;
  if(modal==='champion')closeLeague();
  if(journey.eliteRound===4)journey.eliteRound=0;
  const supplied=giveEliteStarterParty();
  // Keep the saved return position outside the door, including after a browser reload.
  P.x=P.fx=CHAMPION_DOOR.x;P.y=P.fy=CHAMPION_DOOR.y+1;P.prog=1;
  const member=ELITE_FOUR[journey.eliteRound];
  startTrainerBattle(member);hud();persist();
  if(supplied)updateBattle(`You received six random level-20 creatures to keep! ${member.name} has six level-30 creatures. Go, ${byId(party[0].id).name}!`);
}
function continueEliteFour() {
  if(!battle?.trainer.elite||!battle.over||!battle.won||journey.eliteRound>=4)return;
  closeBattle();enterEliteFour();
}
function drawLeagueSites(camX,camY) {
  if(P.diving)return;
  for(const site of surfaceSites()) {
    const x=(site.x+.5)*T-camX,y=(site.y+.5)*T-camY;
    if(x< -100||x>cv.width+100||y< -70||y>cv.height+70)continue;
    ctx.save();ctx.textAlign='center';ctx.lineWidth=2;
    if(site===FIRE_CAVE_SITE) {
      ctx.fillStyle='#864950';ctx.beginPath();ctx.ellipse(x,y,27,30,0,Math.PI,0);ctx.lineTo(x+27,y+20);ctx.lineTo(x-27,y+20);ctx.closePath();ctx.fill();
      ctx.fillStyle='#261b2d';ctx.beginPath();ctx.ellipse(x,y+5,18,24,0,Math.PI,0);ctx.lineTo(x+18,y+20);ctx.lineTo(x-18,y+20);ctx.closePath();ctx.fill();
      ctx.fillStyle='#ffc16d';ctx.font='bold 18px sans-serif';ctx.fillText('🔥',x,y+6);
    } else if(site===CHAMPION_DOOR) {
      ctx.shadowColor='#f8d878';ctx.shadowBlur=18+Math.sin(time*3)*6;
      ctx.fillStyle='#f8d878';ctx.fillRect(x-18,y-28,36,50);ctx.shadowBlur=0;
      ctx.fillStyle='#493d7c';ctx.fillRect(x-13,y-23,26,45);ctx.fillStyle='#fff2bc';ctx.fillRect(x+6,y,4,4);
    } else {
      ctx.fillStyle=site.gym?'#dfd8c6':'#e4c398';ctx.fillRect(x-20,y-12,40,34);
      ctx.fillStyle=site.gym?site.color:'#df8d71';ctx.beginPath();ctx.moveTo(x-25,y-12);ctx.lineTo(x,y-33);ctx.lineTo(x+25,y-12);ctx.closePath();ctx.fill();
      if(!site.gym)for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#ffedc5':'#d67360';ctx.fillRect(x-25+i*10,y-12,10,9);}
      ctx.fillStyle='#354858';ctx.fillRect(x-6,y+2,12,20);
      if(site.gym){ctx.fillStyle=journey.gymWins[site.id]?'#fff0ad':'#243b56';ctx.font='bold 17px sans-serif';ctx.fillText(journey.gymWins[site.id]?'✓':'★',x,y-15);}
    }
    ctx.font='bold 11px sans-serif';const w=ctx.measureText(site.name).width+12;
    ctx.fillStyle='#132637e8';ctx.fillRect(x-w/2,y+24,w,19);ctx.fillStyle='#fff2d6';ctx.fillText(site.name,x,y+37);
    ctx.restore();
  }
}
