// Run with Playwright installed: GAME_URL=http://127.0.0.1:8000 node tests/league-smoke.cjs
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
    await page.addInitScript(()=>{
      if(!localStorage.getItem('mkrq'))localStorage.setItem('mkrq',JSON.stringify({x:5,y:7,
        party:[{id:'orca',lv:30,shiny:true}],box:[{id:'snowy',lv:6}],
        dex:{orca:{count:1,shiny:1}},trainerWins:{mia:true},caveTreasures:{generated:{ruby:true}}}));
    });
    await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.equal(await page.evaluate(()=>journey.coins),60);
    assert.ok(await page.evaluate(()=>party[0].id==='orca'&&box[0].id==='snowy'&&trainerWins.mia&&caveTreasures.generated.ruby));
    assert.equal(await page.evaluate(()=>championDoorOpen()),false);
    // All buildings must be reachable by ordinary walking and boat travel, not just fast travel.
    const reach=await page.evaluate(()=>{
      const queue=[{x:5,y:7,boat:false}],seen=new Set(['5,7,false']);
      for(let i=0;i<queue.length;i++)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]) {
        const a=queue[i],x=a.x+dx,y=a.y+dy,t=map[y]?.[x];
        if([...TRAINERS,...GYMS,...MARKETS,CHAMPION_DOOR].some(o=>o.x===x&&o.y===y))continue;
        const ok=a.boat?[WA,DK].includes(t):[G,TG,SA,DK,MT,SN,HF,...NEW_BIOMES.map(b=>b.tile)].includes(t)||(t===WA&&map[a.y][a.x]===DK);
        if(!ok)continue;const boat=t===WA,key=`${x},${y},${boat}`;
        if(!seen.has(key)){seen.add(key);queue.push({x,y,boat});}
      }
      return [...GYMS,...MARKETS,CHAMPION_DOOR].map(s=>({id:s.id,reachable:seen.has(`${s.x},${s.y+1},false`)}));
    });
    assert.ok(reach.every(s=>s.reachable),JSON.stringify(reach));
    // The guide and market use actual buttons, including fast travel and proximity guards.
    async function travel(id){
      await page.keyboard.press('g');
      const index=await page.evaluate(id=>surfaceSites().find(s=>s.id===id).name,id);
      await page.locator('.league-option').filter({has:page.locator('h3',{hasText:index})}).getByRole('button',{name:'Travel here'}).click();
      await page.locator('#btn-site').click();
    }
    await travel('market-meadow');
    assert.equal(await page.locator('[data-lure="deluxe"]').isDisabled(),true);
    await page.locator('[data-lure="rare"]').click();
    assert.deepEqual(await page.evaluate(()=>[journey.coins,journey.lure.remaining]),[20,10]);
    await page.evaluate(()=>buyLure('rare'));assert.equal(await page.evaluate(()=>journey.coins),20);
    assert.equal(await page.locator('[data-lure="rare"]').isDisabled(),true);
    await page.waitForTimeout(350);await page.screenshot({path:'/tmp/river-quest-market.png'});
    await page.keyboard.press('p');assert.equal(await page.evaluate(()=>modal),'market');
    await page.keyboard.press('m');assert.equal(await page.evaluate(()=>modal),'market');
    await page.keyboard.press('Escape');
    await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.deepEqual(await page.evaluate(()=>[journey.coins,journey.lure.remaining]),[20,10]);
    // Stratified random sampling verifies observable changes in encounter selection.
    const rates=await page.evaluate(()=>{
      const random=Math.random,original=journey.lure,results=[];
      try {
        for(const lure of [null,{id:'rare',remaining:10},{id:'deluxe',remaining:20}]) {
          journey.lure=lure;let specials=0,waterRares=0,ghosts=0;
          for(let i=0;i<1000;i++){
            Math.random=()=>((i+.5)/1000);
            specials+=pickBiomeAnimal('jungle').special?1:0;
            waterRares+=isRareCreature(pickWaterAnimal())?1:0;
            ghosts+=pickHalloweenAnimal(new Date(2026,9,31)).id==='ghost'?1:0;
            if(pickHalloweenAnimal(new Date(2026,9,29)).id==='ghost')throw Error('Season bypass');
          }
          results.push({specials,waterRares,ghosts});
        }
      }finally{Math.random=random;journey.lure=original;}
      return results;
    });
    assert.ok(rates[0].specials<rates[1].specials&&rates[1].specials<rates[2].specials);
    assert.ok(rates[0].waterRares<rates[1].waterRares&&rates[1].waterRares<rates[2].waterRares);
    assert.deepEqual(rates.map(r=>r.ghosts),[50,150,250]);
    // Catch one real creature, verify coins and use exactly the advertised number of charges.
    await page.evaluate(()=>{window.testRandom=Math.random;Math.random=()=>.5;startEncounter(byId('phoenix'),true);});
    assert.equal(await page.evaluate(()=>journey.lure.remaining),9);
    assert.equal(await page.evaluate(()=>encounterCatchChance()),1);
    await page.locator('#btn-throw').click();await page.waitForFunction(()=>modal===null,{timeout:15000});
    assert.ok(await page.evaluate(()=>journey.coins===45&&party.some(m=>m.id==='phoenix'&&m.shiny)));
    assert.ok(await page.evaluate(()=>{
      for(let i=0;i<9;i++){startEncounter(byId('fox'),false);if(enc.lureBonus!==.05)throw Error('Missing last charge boost');closeEnc();}
      startEncounter(byId('fox'),false);const expired=enc.lureBonus===0&&journey.lure===null;closeEnc();Math.random=window.testRandom;return expired;
    }));
    console.log('PASS: migration, building reachability, purchase guards, lure persistence/rarity/catch boost/expiry, catch coins');
    // Running or losing cannot grant badges. A victory must defeat every gym creature.
    await travel('gym-meadow');await page.locator('#btn-gym-challenge').click();
    await page.locator('#battle-run').click();assert.equal(await page.evaluate(()=>badgeCount()),0);
    await page.evaluate(()=>{window.savedParty=party.splice(0,party.length,{id:'bunny',lv:1});});
    await travel('gym-moon');await page.locator('#btn-gym-challenge').click();
    for(let i=0;i<20&&!await page.evaluate(()=>battle.over);i++)await page.locator('#battle-attack').click();
    assert.equal(await page.evaluate(()=>badgeCount()),0);
    assert.equal(await page.evaluate(()=>journey.coins),45);
    await page.locator('#battle-run').click();
    await page.evaluate(()=>{party.splice(0,party.length,...window.savedParty);});
    const gyms=await page.evaluate(()=>GYMS.map(g=>g.id));
    for(let i=0;i<gyms.length;i++){
      await travel(gyms[i]);await page.locator('#btn-gym-challenge').click();
      await page.keyboard.press('g');assert.equal(await page.evaluate(()=>modal),'battle');
      for(let n=0;n<80&&!await page.evaluate(()=>battle.over);n++)await page.locator('#battle-attack').click();
      assert.equal(await page.evaluate(()=>badgeCount()),i+1);
      assert.equal(await page.evaluate(()=>championDoorOpen()),i===5);
      assert.equal(await page.evaluate(()=>journey.coins),45+120*(i+1));
      await page.evaluate(()=>battleTurn());assert.equal(await page.evaluate(()=>journey.coins),45+120*(i+1));
      await page.locator('#battle-run').click();
      if(i===4){await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);assert.equal(await page.evaluate(()=>badgeCount()),5);assert.equal(await page.evaluate(()=>championDoorOpen()),false);}
    }
    await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.equal(await page.evaluate(()=>championDoorOpen()),true);
    await travel('gym-meadow');assert.equal(await page.locator('#btn-gym-challenge').isDisabled(),true);await page.keyboard.press('Escape');
    await travel('champion-door');
    await page.evaluate(()=>{while(party.length<6)party.push({id:'bunny',lv:5});});
    const before=await page.evaluate(()=>box.length);
    await page.locator('#btn-champion-reward').click();
    assert.equal(await page.evaluate(()=>box.length),before+1);
    assert.ok(await page.evaluate(()=>journey.coins===965&&box.at(-1).id==='phoenix'&&box.at(-1).shiny));
    await page.evaluate(()=>claimChampionReward());assert.equal(await page.evaluate(()=>box.length),before+1);
    await page.waitForTimeout(350);await page.screenshot({path:'/tmp/river-quest-champion.png'});
    await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.ok(await page.evaluate(()=>journey.championReward&&championDoorOpen()&&journey.coins===965));
    console.log('PASS: run/loss without rewards, six real gym victories, five-badge reload gate, door unlock, one-time full-party reward');
    // Trainers, caves, and scuba keep their existing behavior and cannot open distant markets.
    await page.evaluate(()=>{Object.assign(P,{x:12,y:19,fx:12,fy:19,prog:1});challengeTrainer();});
    assert.equal(await page.evaluate(()=>battle.trainer.id),'leo');
    for(let n=0;n<30&&!await page.evaluate(()=>battle.over);n++)await page.locator('#battle-attack').click();
    assert.equal(await page.evaluate(()=>journey.coins),995);
    await page.locator('#battle-run').click();
    await page.evaluate(()=>{Object.assign(P,{x:19,y:9,fx:19,fy:9,boat:true});toggleDive();toggleDepth();toggleDepth();});
    assert.ok(await page.evaluate(()=>abyssDiving));
    await page.keyboard.press('g');assert.equal(await page.locator('#league-content button:not(:disabled)').count(),0);
    await page.keyboard.press('Escape');
    await page.evaluate(()=>{toggleDive();toggleDive();toggleDive();Object.assign(P,{x:5,y:7,fx:5,fy:7,boat:false});hud();});
    assert.equal(await page.evaluate(()=>nearLeagueSite()),null);
    await page.evaluate(()=>openLeagueSite());assert.equal(await page.evaluate(()=>modal),null);
    const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    mobile.on('pageerror',e=>errors.push(e.message));await mobile.route('https://fonts.googleapis.com/**',r=>r.abort());
    await mobile.goto(url,{waitUntil:'domcontentloaded'});
    await mobile.locator('#btn-league').tap();
    await mobile.locator('.league-option').filter({has:mobile.locator('h3',{hasText:'Meadow Market'})}).getByRole('button',{name:'Travel here'}).tap();
    await mobile.locator('#btn-site').tap();await mobile.locator('[data-lure="rare"]').tap();
    assert.equal(await mobile.evaluate(()=>journey.lure.remaining),10);
    await mobile.waitForTimeout(350);await mobile.screenshot({path:'/tmp/river-quest-market-mobile.png'});
    assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),390);
    assert.deepEqual(errors,[]);
    console.log('PASS: normal trainer coin reward, diving/travel guards, mobile purchase, no runtime errors');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
