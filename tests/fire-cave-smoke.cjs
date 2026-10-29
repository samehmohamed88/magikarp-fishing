// GAME_URL=http://127.0.0.1:8000 node tests/fire-cave-smoke.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const url=process.env.GAME_URL||'http://127.0.0.1:8000';
(async()=>{
  const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox']});
  try {
    const errors=[];
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('https://fonts.googleapis.com/**',r=>r.abort());
    await page.clock.setFixedTime(new Date('2026-10-29T12:00:00-04:00'));
    await page.addInitScript(()=>{if(!localStorage.getItem('mkrq'))localStorage.setItem('mkrq',JSON.stringify({x:3,y:4,
      party:Array.from({length:6},()=>({id:'orca',lv:70,shiny:true})),box:[],dex:{orca:{count:6,shiny:6}},
      journey:{coins:200,candies:4,championReward:true,eliteRound:3,gymWins:Object.fromEntries(['meadow','frost','jungle','dunes','ember','moon'].map(id=>['gym-'+id,true]))},
      trainerWins:{mia:true},caveTreasures:{generated:{ruby:true}}}));});
    async function reload(){await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);}
    await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.ok(await page.evaluate(()=>!fireCaveUnlocked()&&journey.perfectBalls===0&&!journey.fireCaveGift&&!journey.fireDragonCaught));
    await page.evaluate(()=>{enterFireCave();startEncounter(byId('fire-dragon'),false);});
    assert.ok(await page.evaluate(()=>!dragonCave&&modal===null&&!surfaceSites().includes(FIRE_CAVE_SITE)));
    await page.keyboard.press('g');assert.equal(await page.getByRole('heading',{name:'🐉 Fire Dragon Cave'}).count(),0);await page.keyboard.press('Escape');
    // Finish the actual final Elite Four battle on an older save.
    await page.evaluate(()=>startTrainerBattle(ELITE_FOUR[3]));
    for(let i=0;i<100&&!await page.evaluate(()=>battle.over);i++)await page.locator('#battle-attack').click();
    assert.ok(await page.evaluate(()=>battle.won&&journey.eliteCleared&&fireCaveUnlocked()));
    assert.match(await page.locator('#battle-text').textContent(),/Fire Dragon Cave/);
    await page.locator('#battle-run').click();
    await page.keyboard.press('g');
    await page.locator('.league-option').filter({has:page.getByRole('heading',{name:'🐉 Fire Dragon Cave'})}).getByRole('button',{name:'Travel here'}).click();
    await page.locator('#btn-site').click();
    assert.ok(await page.evaluate(()=>dragonCave&&underground&&activeMap===fireCaveMap&&journey.fireCaveGift&&journey.perfectBalls===20));
    assert.ok(await page.evaluate(()=>journey.candies===4&&trainerWins.mia&&caveTreasures.generated.ruby));
    assert.equal(await page.locator('#cave-quest').isHidden(),true);assert.equal(await page.locator('#btn-cave-action').isHidden(),true);
    await page.evaluate(()=>{enterFireCave();openGenerator();});assert.equal(await page.evaluate(()=>modal),null);
    await page.keyboard.press('Space');assert.equal(await page.evaluate(()=>dragonCave),false);
    await page.locator('#btn-site').click();await reload();
    assert.ok(await page.evaluate(()=>dragonCave&&journey.perfectBalls===20));
    // Walk a route using the game's movement/collision functions; only animations are skipped.
    async function walkTo(destination) {
      const result=await page.evaluate(destination=>{
        const queue=[{x:P.x,y:P.y,path:[]}],seen=new Set([`${P.x},${P.y}`]);let path;
        for(let i=0;i<queue.length;i++){
          const p=queue[i];if(p.x===destination.x&&p.y===destination.y){path=p.path;break;}
          for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){
            const x=p.x+dx,y=p.y+dy,key=`${x},${y}`;
            if(seen.has(key)||tile(x,y)!==CF)continue;
            seen.add(key);queue.push({x,y,path:[...p.path,[dx,dy]]});
          }
        }
        if(!path)throw Error('Cave destination is unreachable');
        for(const[dx,dy]of path){const x=P.x+dx,y=P.y+dy;tryMove(dx,dy);if(P.x!==x||P.y!==y)throw Error('Movement blocked on cave route');P.prog=1;arrive();if(modal)throw Error('Unexpected encounter on path');}
        return path.length;
      },destination);
      return result;
    }
    assert.ok(await walkTo({x:52,y:18})>60);
    await page.waitForTimeout(300);await page.screenshot({path:'/tmp/fire-dragon-cave.png'});
    // The final step uses real keyboard input and triggers the boss encounter.
    await page.keyboard.down('ArrowUp');await page.waitForFunction(()=>modal==='enc');await page.keyboard.up('ArrowUp');
    assert.ok(await page.evaluate(()=>enc.sp.id==='fire-dragon'&&enc.lv===70&&enc.maxHp===374));
    assert.match(await page.locator('#enc-text').textContent(),/Lv 70/);
    assert.equal(await page.locator('#btn-defeat-coins').isHidden(),true);
    await page.waitForTimeout(300);await page.screenshot({path:'/tmp/fire-dragon-encounter.png'});
    // New species has its own art, including a distinct shiny form, and no random/starter eligibility.
    assert.ok(await page.evaluate(()=>{
      const pictures=[false,true].map(shiny=>{const c=document.createElement('canvas');c.width=220;c.height=200;drawFireDragon(c.getContext('2d'),110,105,60,shiny);return c.toDataURL();});
      const original=party.splice(0);let excluded=true;
      for(let i=0;i<15;i++){giveEliteStarterParty();excluded&&=party.every(m=>m.id!=='fire-dragon');party.length=0;}
      party.push(...original);
      return pictures[0]!==pictures[1]&&excluded&&!FIRE_DRAGON.weight&&!FIRE_DRAGON.fishingWeight;
    }));
    const coins=await page.evaluate(()=>journey.coins),caught=await page.evaluate(()=>box.length);
    await page.evaluate(()=>claimDefeatCoins());assert.equal(await page.evaluate(()=>journey.coins),coins);
    for(let i=0;i<8&&await page.evaluate(()=>enc.hp>0);i++)await page.locator('#btn-weaken').click();
    assert.ok(await page.evaluate(()=>enc.hp===0&&!enc.lost));
    assert.equal(await page.locator('#btn-weaken').isDisabled(),true);
    assert.equal(await page.locator('#btn-defeat-coins').isVisible(),true);
    assert.match(await page.locator('#btn-defeat-coins').textContent(),/Take 100 coins/);
    await page.waitForTimeout(200);await page.screenshot({path:'/tmp/wild-defeat-choice.png'});
    await page.locator('#btn-defeat-coins').click();await page.evaluate(()=>claimDefeatCoins());
    assert.ok(await page.evaluate(()=>modal===null&&!journey.fireDragonCaught&&journey.perfectBalls===20));
    assert.equal(await page.evaluate(()=>journey.coins),coins+100);assert.equal(await page.evaluate(()=>box.length),caught);
    // The dragon remains catchable after a retreat or coin choice. One ball always catches it.
    await page.locator('#btn-dragon').click();await page.locator('#btn-run').click();
    await page.locator('#btn-dragon').click();
    await page.evaluate(()=>{window.oldRandom=Math.random;Math.random=()=>.999999;});
    await page.keyboard.press('z');await page.evaluate(()=>{throwBall(true);claimDefeatCoins();});
    assert.equal(await page.evaluate(()=>journey.perfectBalls),19);
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mkrq')).journey.perfectBalls),19);
    await page.waitForFunction(()=>modal===null,{timeout:15000});
    await page.evaluate(()=>Math.random=window.oldRandom);
    assert.ok(await page.evaluate(()=>journey.fireDragonCaught&&box.at(-1).id==='fire-dragon'&&box.at(-1).lv===70&&dex['fire-dragon'].count===1));
    assert.equal(await page.evaluate(()=>box.length),caught+1);
    await reload();assert.ok(await page.evaluate(()=>dragonCave&&journey.fireDragonCaught&&journey.perfectBalls===19));
    await page.evaluate(()=>meetFireDragon());assert.equal(await page.evaluate(()=>modal),null);
    await walkTo({x:6,y:8});await page.locator('#btn-tunnel').click();await page.locator('#btn-site').click();
    assert.equal(await page.evaluate(()=>journey.perfectBalls),19);
    await page.locator('#btn-tunnel').click();
    // Existing cave entrances still select their own layers and return points.
    await page.evaluate(()=>{Object.assign(P,{x:5,y:6,fx:5,fy:6,prog:1});hud();});
    await page.locator('#btn-tunnel').click();
    assert.ok(await page.evaluate(()=>underground&&!dragonCave&&!halloweenCavern&&activeMap===caveMap));
    await page.locator('#btn-tunnel').click();
    await page.evaluate(()=>{Object.assign(P,{x:12,y:11,fx:12,fy:11,prog:1});hud();});
    await page.locator('#btn-tunnel').click();
    assert.ok(await page.evaluate(()=>underground&&halloweenCavern&&!dragonCave&&activeMap===halloweenCavernMap));
    await page.locator('#btn-tunnel').click();
    assert.equal(await page.evaluate(()=>journey.perfectBalls),19);
    console.log('PASS: real Elite Four unlock, old-save migration, first-entry gift, connected cave, level-70 dragon art/encounter, defeat coin choice, guaranteed capture, full-party Box, saved flags and no duplicate gifts');
    // Ordinary defeat rewards are exclusive with catching, and killing blows do not retaliate.
    await page.evaluate(()=>{startEncounter(byId('bunny'),false);enc.hp=1;setBtns(true);});
    const hp=await page.evaluate(()=>enc.allies[0].hp),coinsBefore=await page.evaluate(()=>journey.coins),ballsBefore=await page.evaluate(()=>journey.perfectBalls);
    await page.locator('#btn-weaken').click();
    assert.equal(await page.evaluate(()=>enc.allies[0].hp),hp);assert.equal(await page.evaluate(()=>enc.hp),0);
    assert.equal(await page.evaluate(()=>encounterCatchChance()),1);
    await page.evaluate(()=>{window.oldRandom=Math.random;Math.random=()=>.999999;});
    await page.locator('#btn-throw').click();await page.evaluate(()=>claimDefeatCoins());
    await page.waitForFunction(()=>modal===null,{timeout:15000});await page.evaluate(()=>{Math.random=window.oldRandom;claimDefeatCoins();});
    assert.equal(await page.evaluate(()=>journey.coins),coinsBefore+10);assert.equal(await page.evaluate(()=>journey.perfectBalls),ballsBefore);
    await page.evaluate(()=>startEncounter(byId('frog'),true));
    const shinyBefore=await page.evaluate(()=>dex.frog?.shiny||0);
    await page.locator('#btn-weaken').click();
    assert.match(await page.locator('#btn-defeat-coins').textContent(),/Take 1000 coins/);
    assert.match(await page.locator('#enc-help').textContent(),/1000 coins/);
    assert.match(await page.locator('#enc-text').textContent(),/1000 coins/);
    await page.locator('#btn-defeat-coins').focus();await page.keyboard.press('Space');
    await page.evaluate(()=>claimDefeatCoins());
    assert.equal(await page.evaluate(()=>journey.coins),coinsBefore+1010);assert.equal(await page.evaluate(()=>dex.frog?.shiny||0),shinyBefore);
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mkrq')).journey.coins),coinsBefore+1010);
    assert.match(await page.locator('#toast').textContent(),/\+1000 coins/);
    // Last ball, empty bag, and no-party catches away from the cave.
    await page.evaluate(()=>{journey.perfectBalls=1;party.length=0;startEncounter(byId('fox'),false);});
    await page.locator('#btn-perfect-ball').click();await page.waitForFunction(()=>modal===null,{timeout:15000});
    assert.equal(await page.evaluate(()=>journey.perfectBalls),0);
    await page.evaluate(()=>startEncounter(byId('fox'),false));
    assert.equal(await page.locator('#btn-perfect-ball').isDisabled(),true);
    await page.keyboard.press('z');assert.ok(await page.evaluate(()=>journey.perfectBalls===0&&!enc.busy));
    await page.locator('#btn-run').click();await reload();assert.equal(await page.evaluate(()=>journey.perfectBalls),0);
    console.log('PASS: zero-HP choice, no retaliation after defeat, regular 100/shiny 1000 coin rewards, matching UI, reward exclusivity and persistence, guaranteed ball outside cave and last-ball exhaustion');
    const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    mobile.on('pageerror',e=>errors.push(e.message));await mobile.route('https://fonts.googleapis.com/**',r=>r.abort());
    await mobile.addInitScript(()=>{if(!localStorage.getItem('mkrq'))localStorage.setItem('mkrq',JSON.stringify({x:3,y:4,party:[{id:'orca',lv:70}],journey:{eliteCleared:true}}));});
    await mobile.goto(url,{waitUntil:'domcontentloaded'});await mobile.waitForFunction(()=>time>.1);
    await mobile.locator('#btn-site').tap();assert.equal(await mobile.evaluate(()=>journey.perfectBalls),20);
    await mobile.evaluate(()=>{Object.assign(P,{x:52,y:17,fx:52,fy:17,prog:1});hud();});
    await mobile.locator('#btn-dragon').tap();await mobile.waitForTimeout(250);await mobile.screenshot({path:'/tmp/fire-dragon-mobile.png'});
    await mobile.locator('#btn-perfect-ball').tap();await mobile.waitForFunction(()=>modal===null,{timeout:15000});
    assert.ok(await mobile.evaluate(()=>party.at(-1).id==='fire-dragon'&&party.at(-1).lv===70&&journey.perfectBalls===19));
    assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),390);
    await mobile.evaluate(()=>{dragonCave=underground=false;activeMap=map;Object.assign(P,{x:5,y:7,fx:5,fy:7});startEncounter(byId('bunny'),false);});
    await mobile.locator('#btn-weaken').tap();
    assert.match(await mobile.locator('#btn-defeat-coins').textContent(),/Take 100 coins/);
    await mobile.locator('#btn-defeat-coins').tap();
    assert.equal(await mobile.evaluate(()=>journey.coins),175);
    assert.deepEqual(errors,[]);console.log('PASS: mobile cave entry, boss capture and coin-choice buttons; no runtime errors');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
