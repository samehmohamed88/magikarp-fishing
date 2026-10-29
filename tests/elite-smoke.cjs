// Requires a local game server and Playwright; see DEVELOPMENT.md.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const url=process.env.GAME_URL||'http://127.0.0.1:8000';
(async()=>{
  const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox']});
  try {
    const errors=[];
    const page=await browser.newPage({viewport:{width:1280,height:1000}});
    page.on('pageerror',e=>errors.push(e.message));await page.route('https://fonts.googleapis.com/**',r=>r.abort());
    await page.clock.setFixedTime(new Date('2026-10-29T12:00:00-04:00'));
    await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    // Old Champion save, before claiming the original prize; no Elite fields exist yet.
    await page.evaluate(()=>localStorage.setItem('mkrq',JSON.stringify({x:6,y:4,party:[],box:[{id:'snowy',lv:8}],dex:{snowy:{count:1,shiny:0}},journey:{coins:100,gymWins:Object.fromEntries(GYMS.map(g=>[g.id,true])),championReward:false}})));
    await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.equal(await page.evaluate(()=>eliteFourUnlocked()),false);
    await page.evaluate(()=>enterEliteFour());assert.equal(await page.evaluate(()=>modal),null);assert.equal(await page.evaluate(()=>party.length),0);
    assert.ok(await page.evaluate(()=>ELITE_FOUR.length===4&&ELITE_FOUR.every(m=>m.team.length===6&&m.team.every(mon=>mon.lv===30&&byId(mon.id)))));
    await page.locator('#btn-site').click();
    assert.equal(await page.locator('#btn-elite-enter').count(),0);
    await page.locator('#btn-champion-reward').click();assert.equal(await page.evaluate(()=>eliteFourUnlocked()),true);
    assert.equal(await page.locator('.elite-preview').count(),4);
    assert.equal(await page.locator('.elite-preview canvas').count(),24);
    await page.keyboard.press('Escape');
    // Empty the party through the existing UI; the Box must not prevent a random team gift.
    await page.keyboard.press('p');await page.locator('#btn-party-store-all').click();await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(()=>party.length),0);assert.equal(await page.evaluate(()=>box.length),2);
    await page.keyboard.down('ArrowUp');await page.waitForFunction(()=>modal==='battle');await page.keyboard.up('ArrowUp');
    assert.equal(await page.evaluate(()=>battle.trainer.id),'elite-marina');
    const starter=await page.evaluate(()=>party.map(m=>({...m})));
    assert.equal(starter.length,6);assert.equal(new Set(starter.map(m=>m.id)).size,6);assert.ok(starter.every(m=>m.lv===20&&!m.shiny));
    assert.ok(starter.some(m=>!['snowy','phoenix'].includes(m.id)));assert.ok(starter.every(m=>m.id!=='ghost'));
    assert.ok(await page.evaluate(()=>party.every(m=>dex[m.id].count>=1)&&box.length===2));
    assert.equal(await page.locator('#battle-ally-team canvas').count(),6);assert.equal(await page.locator('#battle-foe-team canvas').count(),6);
    assert.equal(await page.locator('#battle-ally-team .active').count(),1);
    assert.ok(await page.evaluate(()=>{
      const c=$('battle-canvas').getContext('2d');
      return [c.getImageData(0,0,260,240),c.getImageData(260,0,260,240)].every(img=>img.data.some((v,i)=>i%4===3&&v));
    }));
    await page.waitForTimeout(350);await page.screenshot({path:'/tmp/river-quest-elite-battle.png'});
    // Switching updates the active portrait; fainted portraits track the battle state.
    await page.locator('#battle-switch').click();await page.locator('.battle-choice').nth(1).click();
    assert.equal(await page.evaluate(()=>battle.ally),1);
    assert.ok(await page.evaluate(()=>$('battle-ally-team').children[1].classList.contains('active')));
    await page.locator('#battle-heal').click();assert.equal(await page.evaluate(()=>battle.healed),true);
    await page.evaluate(()=>battle.allies.forEach(m=>m.hp=1));
    for(let i=0;i<12&&!await page.evaluate(()=>battle.over);i++)await page.locator('#battle-attack').click();
    assert.ok(await page.evaluate(()=>battle.over&&!battle.won&&journey.eliteRound===0&&!journey.eliteReward));
    assert.equal(await page.locator('#battle-ally-team .fainted').count(),6);assert.equal(await page.locator('#battle-next').isHidden(),true);
    await page.locator('#battle-run').click();
    await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.deepEqual(await page.evaluate(()=>party.map(m=>({...m}))),starter);
    // Existing teams are kept at their own levels on entry; losing and returning grant no extra creatures.
    await page.keyboard.down('ArrowUp');await page.waitForFunction(()=>modal==='battle');await page.keyboard.up('ArrowUp');
    assert.deepEqual(await page.evaluate(()=>party.map(m=>({...m}))),starter);
    assert.equal(await page.evaluate(()=>box.length),2);
    await page.locator('#battle-run').click();assert.equal(await page.evaluate(()=>journey.eliteRound),0);
    assert.ok(await page.evaluate(()=>!awardElitePrizes()));
    console.log('PASS: prize gate, walking through door, unique random level-20 party with occupied Box, full visible teams, switching/heal/loss/run, save persistence');
    async function startFromDoor(){await page.locator('#btn-site').click();await page.locator('#btn-elite-enter').click();}
    await startFromDoor();
    for(let round=0;round<4;round++) {
      assert.equal(await page.evaluate(()=>battle.trainer.index),round);
      assert.ok(await page.evaluate(()=>battle.foes.every(m=>m.lv===30)&&battle.foes.length===6));
      assert.ok(await page.evaluate(()=>battle.allies.every(m=>m.hp===maxHP(m))));
      // Real combat at the gifted levels; deterministic damage avoids flaky runs.
      await page.evaluate(()=>{window.eliteRandom=Math.random;Math.random=()=>.5;});
      for(let i=0;i<100&&!await page.evaluate(()=>battle.over);i++)await page.locator('#battle-attack').click();
      await page.evaluate(()=>{Math.random=window.eliteRandom;});
      assert.ok(await page.evaluate(()=>battle.won));
      assert.equal(await page.locator('#battle-foe-team .fainted').count(),6);
      assert.equal(await page.evaluate(()=>journey.eliteRound),round+1);
      assert.equal(await page.evaluate(()=>journey.eliteReward),round===3);
      if(round===0) {
        await page.locator('#battle-run').click();
        await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
        assert.equal(await page.evaluate(()=>journey.eliteRound),1);await startFromDoor();
      } else if(round<3)await page.locator('#battle-next').click();
    }
    assert.equal(await page.locator('#battle-next').isHidden(),true);
    assert.match(await page.locator('#battle-text').textContent(),/Megalodon, Mosasaurus, and Elasmosaurus/);
    assert.ok(await page.evaluate(()=>journey.eliteCleared&&journey.eliteReward&&ELITE_PRIZES.every(id=>box.some(m=>m.id===id&&m.shiny&&m.lv===30)&&dex[id].shiny>=1)));
    assert.equal(await page.evaluate(()=>box.length),5);
    await page.evaluate(()=>{awardElitePrizes();battleTurn();});assert.equal(await page.evaluate(()=>box.length),5);
    await page.locator('#battle-run').click();
    await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.ok(await page.evaluate(()=>journey.eliteRound===4&&journey.eliteReward&&box.length===5));
    await startFromDoor();assert.equal(await page.evaluate(()=>battle.trainer.index),0);
    assert.equal(await page.evaluate(()=>journey.eliteRound),0);assert.equal(await page.evaluate(()=>journey.eliteReward),true);
    await page.locator('#battle-run').click();
    // Partial parties do not get filled or replaced; prizes fit in Party first, then overflow into Box.
    const routing=await page.evaluate(()=>{
      party.splice(0,party.length,{id:'bunny',lv:7});const unchanged=giveEliteStarterParty()===false&&party.length===1&&party[0].lv===7;
      while(party.length<5)party.push({id:'frog',lv:10});
      journey.eliteRound=4;journey.eliteReward=false;const before=box.length;awardElitePrizes();
      return {unchanged,length:party.length,partyPrize:party.at(-1),boxPrizes:box.slice(before)};
    });
    assert.ok(routing.unchanged);assert.equal(routing.length,6);assert.equal(routing.partyPrize.id,'megalodon');
    assert.deepEqual(routing.boxPrizes.map(m=>m.id),['mosasaurus','elasmosaurus']);
    console.log('PASS: all 24 level-30 opponents defeated in real combat, next/resume/healing, three shiny level-30 prizes, full/partial party routing, one-time rewards, rematch');
    const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    mobile.on('pageerror',e=>errors.push(e.message));await mobile.route('https://fonts.googleapis.com/**',r=>r.abort());
    await mobile.goto(url,{waitUntil:'domcontentloaded'});
    await mobile.evaluate(()=>{journey.gymWins=Object.fromEntries(GYMS.map(g=>[g.id,true]));journey.championReward=true;Object.assign(P,{x:6,y:4,fx:6,fy:4,prog:1});persist();hud();});
    await mobile.locator('#btn-site').tap();await mobile.locator('#btn-elite-enter').tap();
    await mobile.waitForTimeout(350);await mobile.screenshot({path:'/tmp/river-quest-elite-mobile.png'});
    assert.equal(await mobile.locator('#battle-ally-team canvas').count(),6);assert.equal(await mobile.locator('#battle-foe-team canvas').count(),6);
    await mobile.locator('#battle-attack').tap();assert.ok(await mobile.evaluate(()=>battle.foes[0].hp<maxHP(battle.foes[0])));
    assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),390);
    assert.deepEqual(errors,[]);console.log('PASS: mobile entry, sprites, attack and no page errors');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
