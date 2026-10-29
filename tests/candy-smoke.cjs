// GAME_URL=http://127.0.0.1:8000 node tests/candy-smoke.cjs
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
        party:[{id:'frog',lv:9,shiny:true},{id:'orca',lv:99},{id:'phoenix',lv:100,shiny:true}],
        box:[{id:'frog',lv:6}],dex:{frog:{count:2,shiny:1},orca:{count:1,shiny:0},phoenix:{count:1,shiny:1}},
        journey:{coins:60,lure:{id:'rare',remaining:7},gymWins:{'gym-meadow':true},championReward:true,eliteRound:2},
        trainerWins:{mia:true},caveTreasures:{generated:{ruby:true}}}));
    });
    await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.ok(await page.evaluate(()=>journey.candies===0&&journey.eliteRound===2&&journey.gymWins['gym-meadow']&&trainerWins.mia&&caveTreasures.generated.ruby));
    assert.ok(await page.evaluate(()=>[undefined,null,-1,1.5,'2',Infinity].every(candies=>loadJourney({candies}).candies===0)));
    const progress=await page.evaluate(()=>({dex:JSON.parse(JSON.stringify(dex)),lure:{...journey.lure}}));
    async function travel(id){
      await page.keyboard.press('g');
      const name=await page.evaluate(id=>MARKETS.find(s=>s.id===id).name,id);
      await page.locator('.league-option').filter({has:page.locator('h3',{hasText:name})}).getByRole('button',{name:'Travel here'}).click();
      await page.locator('#btn-site').click();
    }
    await page.evaluate(()=>buyCandy());assert.equal(await page.evaluate(()=>journey.coins),60);
    await travel('market-meadow');
    // Being in the market dialog alone is insufficient if the player is no longer nearby.
    assert.ok(await page.evaluate(()=>{const x=P.x;P.x=5;buyCandy();P.x=x;return journey.coins===60&&journey.candies===0;}));
    assert.equal(await page.locator('[data-lure="rare"]').isDisabled(),true);
    for(let i=1;i<=3;i++){
      await page.locator('#btn-buy-candy').click();
      assert.deepEqual(await page.evaluate(()=>[journey.coins,journey.candies]),[60-i*20,i]);
    }
    assert.equal(await page.locator('#btn-buy-candy').isDisabled(),true);
    await page.evaluate(()=>buyCandy());assert.equal(await page.evaluate(()=>journey.candies),3);
    await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.deepEqual(await page.evaluate(()=>[journey.coins,journey.candies,journey.lure]),[0,3,progress.lure]);
    await page.locator('#btn-site').click();await page.locator('#btn-market-give-candy').click();
    assert.equal(await page.evaluate(()=>modal),'party');
    assert.equal(await page.locator('#btn-party-candy').getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#party-list button').nth(2).isDisabled(),true);
    // Space should activate the focused creature button without triggering world actions.
    await page.locator('#party-list button').first().focus();await page.keyboard.press('Space');
    assert.ok(await page.evaluate(()=>party[0].lv===10&&party[0].shiny&&party.length===3&&box.length===1&&journey.candies===2));
    await page.locator('#box-list button').first().click();
    assert.ok(await page.evaluate(()=>box[0].lv===7&&!box[0].shiny&&party[0].lv===10&&journey.candies===1));
    await page.evaluate(()=>{giveCandy('party',2);giveCandy('party',99);giveCandy('unknown',0);giveCandy('party',.5);});
    assert.equal(await page.evaluate(()=>journey.candies),1);
    await page.locator('#party-list button').nth(1).click();
    assert.match(await page.locator('#candy-message').textContent(),/Lv 100/);
    assert.ok(await page.evaluate(()=>party[1].lv===100&&journey.candies===0));
    assert.equal(await page.locator('#party-list button:enabled').count(),0);
    assert.equal(await page.locator('#box-list button:enabled').count(),0);
    await page.evaluate(()=>giveCandy('party',0));assert.equal(await page.evaluate(()=>party[0].lv),10);
    assert.equal(await page.locator('#btn-party-store-all').isDisabled(),true);
    await page.locator('#btn-party-candy').click();
    await page.locator('#party-list button').first().click();
    assert.ok(await page.evaluate(()=>party.length===2&&box.length===2&&box[1].id==='frog'&&box[1].lv===10));
    await page.locator('#box-list button').nth(1).click();
    assert.ok(await page.evaluate(()=>party.length===3&&box.length===1&&party[2].lv===10));
    await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.deepEqual(await page.evaluate(()=>party.map(m=>m.lv)),[100,100,10]);
    assert.equal(await page.evaluate(()=>box[0].lv),7);
    assert.deepEqual(await page.evaluate(()=>dex),progress.dex);
    console.log('PASS: old-save migration, guarded purchases, lure compatibility, keyboard feeding, Party/Box selection, level cap, empty bag, transfers and reload');
    // Each market supplies the same item, including when every party slot is occupied.
    await page.evaluate(()=>{while(party.length<6)party.push({id:'bunny',lv:5});});
    for(const id of await page.evaluate(()=>MARKETS.map(m=>m.id))){
      await page.evaluate(()=>journey.coins=20);
      await travel(id);await page.locator('#btn-buy-candy').click();await page.keyboard.press('Escape');
    }
    assert.equal(await page.evaluate(()=>journey.candies),6);
    // Strength comes from the stored level when a subsequent battle starts.
    await page.evaluate(()=>{const [frog]=party.splice(2,1);party.unshift(frog);startTrainerBattle(GYMS[1]);});
    assert.ok(await page.evaluate(()=>battle.allies[0].lv===10&&battle.allies[0].hp===74));
    await page.evaluate(()=>{giveCandy('party',0);buyCandy();});
    assert.equal(await page.evaluate(()=>journey.candies),6);
    await page.locator('#battle-attack').click();
    assert.ok(await page.evaluate(()=>maxHP(battle.foes[0])-battle.foes[0].hp>=27));
    await page.locator('#battle-run').click();
    await page.keyboard.press('p');
    await page.evaluate(()=>giveCandy('party',0));assert.equal(await page.evaluate(()=>journey.candies),6);
    await page.locator('#btn-party-candy').click();await page.locator('#box-list button').first().click();
    assert.ok(await page.evaluate(()=>box[0].lv===8&&party.length===6&&journey.candies===5));
    await page.waitForTimeout(350);await page.screenshot({path:'/tmp/river-quest-candy-party.png'});
    await page.keyboard.press('Escape');await page.keyboard.press('p');
    assert.equal(await page.locator('#btn-party-candy').getAttribute('aria-pressed'),'false');
    console.log('PASS: all six markets, full-party Box feeding, battle HP/damage, combat guards and mode reset');
    const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    mobile.on('pageerror',e=>errors.push(e.message));await mobile.route('https://fonts.googleapis.com/**',r=>r.abort());
    await mobile.addInitScript(()=>{if(!localStorage.getItem('mkrq'))localStorage.setItem('mkrq',JSON.stringify({x:3,y:9,party:[],box:[{id:'snowy',lv:4,shiny:true}]}));});
    await mobile.goto(url,{waitUntil:'domcontentloaded'});await mobile.waitForFunction(()=>time>.1);
    await mobile.locator('#btn-site').tap();await mobile.locator('#btn-buy-candy').tap();
    await mobile.waitForTimeout(350);await mobile.screenshot({path:'/tmp/river-quest-candy-market-mobile.png'});
    await mobile.locator('#btn-market-give-candy').tap();await mobile.locator('#box-list button').first().tap();
    assert.ok(await mobile.evaluate(()=>box[0].lv===5&&box[0].shiny&&party.length===0&&journey.candies===0));
    assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),390);
    await mobile.reload({waitUntil:'domcontentloaded'});await mobile.waitForFunction(()=>time>.1);
    assert.ok(await mobile.evaluate(()=>box[0].lv===5&&journey.coins===40&&journey.candies===0));
    assert.deepEqual(errors,[]);console.log('PASS: mobile shopping, Box-only candy feeding, save persistence and no runtime errors');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
