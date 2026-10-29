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
const LURES = [
  {id:'rare',name:'Rare Lure',price:40,uses:10,multiplier:3,bonus:.05},
  {id:'deluxe',name:'Deluxe Rare Lure',price:90,uses:20,multiplier:5,bonus:.1},
];
const RARE_CREATURES = new Set(['fox','hedgehog','bouldersaur','ghost','shark','spiny-dogfish','alligator','narwhal','giant-squid','colossal-squid','great-white-shark','orca','anglerfish','goblin-shark','dragonfish']);
const isRareCreature = sp => !!sp.special || RARE_CREATURES.has(sp.id);
function loadJourney(saved) {
  const data=saved&&typeof saved==='object'?saved:{};
  const lure=LURES.find(l=>l.id===data.lure?.id);
  return {
    coins:Number.isSafeInteger(data.coins)&&data.coins>=0?data.coins:60,
    gymWins:Object.fromEntries(GYMS.map(g=>[g.id,data.gymWins?.[g.id]===true])),
    lure:lure&&Number.isSafeInteger(data.lure.remaining)&&data.lure.remaining>0?{id:lure.id,remaining:data.lure.remaining}:null,
    championReward:data.championReward===true,
  };
}
const badgeCount = () => GYMS.filter(g=>journey.gymWins[g.id]).length;
const championDoorOpen = () => badgeCount()===GYMS.length;
const activeLure = () => journey.lure ? LURES.find(l=>l.id===journey.lure.id) : null;
function lureWeight(sp,weight) {return weight*(isRareCreature(sp)?activeLure()?.multiplier||1:1);}
function useEncounterLure() {
  const lure=activeLure();
  if(!lure)return 0;
  if(--journey.lure.remaining<=0)journey.lure=null;
  return lure.bonus;
}
function prepareLeagueMap() {
  for(const site of [...MARKETS,...GYMS,CHAMPION_DOOR]) {
    const ground=map[site.y][site.x];
    for(let y=site.y-1;y<=site.y+1;y++)for(let x=site.x-1;x<=site.x+1;x++)
      if([TR,MP,TG].includes(map[y][x]))map[y][x]=[TR,MP,TG].includes(ground)?G:ground;
  }
  // Keep the first gym connected to the established north/south footpath.
  for(let x=3;x<=5;x++)map[12][x]=G;
}
function surfaceSites() {return [...MARKETS,...GYMS,...(championDoorOpen()?[CHAMPION_DOOR]:[])];}
function nearLeagueSite() {
  if(underground||P.diving||P.boat)return null;
  return surfaceSites().find(site=>Math.abs(site.x-P.x)+Math.abs(site.y-P.y)<=1)||null;
}
function leagueSafeTile(x,y) {
  return !underground&&!P.diving&&surfaceSites().some(site=>Math.abs(site.x-x)+Math.abs(site.y-y)<=1);
}
function leagueHud() {
  const lure=activeLure();
  $('journey-status').textContent=`🪙 ${journey.coins} · 🏅 ${badgeCount()}/6${lure?` · 🪶 ${lure.name}: ${journey.lure.remaining} left`:''}`;
  const site=nearLeagueSite();
  $('btn-site').hidden=!site;
  if(site)$('btn-site').textContent=`${site.gym?'🏅':site===CHAMPION_DOOR?'🚪':'🛒'} ${site.name} (Space)`;
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
  $('league-intro').textContent=`${badgeCount()}/6 badges · ${journey.coins} coins. Win all six gyms to reveal a door north of the starting tunnel. Catches earn 10–25 coins, trainer wins 30, gym wins 120.`;
  const list=$('league-content');list.replaceChildren();
  for(const site of [...GYMS,...MARKETS,...(championDoorOpen()?[CHAMPION_DOOR]:[])]) {
    const card=document.createElement('article');card.className='league-option';
    const won=site.gym&&journey.gymWins[site.id];
    const heading=document.createElement('h3');heading.textContent=`${site.icon||(site===CHAMPION_DOOR?'🚪':'🛒')} ${site.name}${won?' ✓':''}`;
    const detail=document.createElement('p');detail.textContent=site.gym?`${site.badge} Badge · ${site.leader} · Lv ${site.team[0].lv}–${site.team.at(-1).lv}`:site===CHAMPION_DOOR?'Your Champion Hall is open!':'Buy lures to find and catch rare creatures.';
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
  const mode=site.gym?'gym':site===CHAMPION_DOOR?'champion':'market';
  if(!openLeaguePanel(mode))return;
  leagueSite=site;renderLeagueSite();$('btn-league-close').focus();
}
function renderLeagueSite() {
  const list=$('league-content');list.replaceChildren();
  $('league-title').textContent=leagueSite.name;
  if(modal==='market') {
    const lure=activeLure();
    $('league-intro').textContent=`You have ${journey.coins} coins. ${lure?`${lure.name} active: ${journey.lure.remaining} encounters left. Finish it before buying another.`:'Lures activate immediately and last for a number of wild encounters. Running away also uses one charge.'} Catch creatures to earn more coins!`;
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
    $('league-title').textContent='✨ Champion Hall';
    $('league-intro').textContent='All six badges opened this door. Welcome, Champion! Your prize is a shiny Phoenix (Lv 20) and 200 coins.';
    const card=document.createElement('article');card.className='league-option champion-prize';
    card.append(monIcon({id:'phoenix',shiny:true},160,110));
    const label=document.createElement('p');label.textContent=GYMS.map(g=>`${g.icon} ${g.badge}`).join(' · ');card.append(label);
    const reward=leagueButton(journey.championReward?'Prize already collected':'Claim Champion prize',claimChampionReward,journey.championReward);
    reward.id='btn-champion-reward';card.append(reward);list.append(card);
  }
}
function buyLure(id) {
  if(modal!=='market'||nearLeagueSite()!==leagueSite||activeLure())return;
  const lure=LURES.find(l=>l.id===id);if(!lure||journey.coins<lure.price)return;
  journey.coins-=lure.price;journey.lure={id,remaining:lure.uses};persist();hud();renderLeagueSite();
}
function challengeGym(id) {
  const gym=GYMS.find(g=>g.id===id);
  if(!gym||modal!=='gym'||nearLeagueSite()!==gym||journey.gymWins[id]||!party.length)return;
  closeLeague();startTrainerBattle(gym);
}
function awardBattleVictory(trainer) {
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
function drawLeagueSites(camX,camY) {
  if(P.diving)return;
  for(const site of surfaceSites()) {
    const x=(site.x+.5)*T-camX,y=(site.y+.5)*T-camY;
    if(x< -100||x>cv.width+100||y< -70||y>cv.height+70)continue;
    ctx.save();ctx.textAlign='center';ctx.lineWidth=2;
    if(site===CHAMPION_DOOR) {
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
