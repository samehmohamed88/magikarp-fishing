// GAME_URL=http://127.0.0.1:8000 node tests/dragon-flight-smoke.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const url=process.env.GAME_URL||'http://127.0.0.1:8000';
(async()=>{
  const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox']});
  try {
    const errors=[];
    async function makePage(saved,mobile=false){
      const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile});
      page.on('pageerror',e=>errors.push(e.message));await page.route('https://fonts.googleapis.com/**',r=>r.abort());
      await page.clock.setFixedTime(new Date('2026-10-29T12:00:00Z'));
      await page.addInitScript(saved=>{if(!localStorage.getItem('mkrq'))localStorage.setItem('mkrq',JSON.stringify(saved));},saved);
      await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);return page;
    }
    const page=await makePage({x:3,y:4,party:[{id:'orca',lv:100}],box:[],journey:{eliteCleared:true,candies:3}});
    await page.keyboard.press('3');assert.equal(await page.evaluate(()=>P.flying),false);
    assert.ok(await page.evaluate(()=>!dragonChampionsUnlocked()&&fireCaveWildlife.length===0));
    await page.evaluate(()=>{startEncounter(byId('squirt-turtle'),false);startEncounter(byId('fire-dragon'),true,false,false,false,'sky');});
    assert.equal(await page.evaluate(()=>modal),null);
    await page.locator('#btn-site').click();
    await page.evaluate(()=>{Object.assign(P,{...FIRE_DRAGON_NEST,fx:FIRE_DRAGON_NEST.x,fy:FIRE_DRAGON_NEST.y,prog:1});meetFireDragon();});
    await page.locator('#btn-run').click();assert.equal(await page.evaluate(()=>dragonChampionsUnlocked()),false);
    await page.locator('#btn-dragon').click();
    while(await page.evaluate(()=>enc.hp>0))await page.locator('#btn-weaken').click();
    assert.ok(await page.evaluate(()=>dragonChampionsUnlocked()&&fireCaveWildlife.length===6&&JSON.parse(localStorage.getItem('mkrq')).journey.fireDragonDefeated));
    await page.locator('#btn-defeat-coins').click();
    assert.equal(await page.evaluate(()=>journey.fireDragonCaught),false);
    // All six creatures are reachable; their spawn/respawn movement avoids the ladder and boss.
    assert.ok(await page.evaluate(()=>{
      const queue=[FIRE_CAVE_EXIT],seen=new Set([`${FIRE_CAVE_EXIT.x},${FIRE_CAVE_EXIT.y}`]);
      for(let i=0;i<queue.length;i++)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){
        const x=queue[i].x+dx,y=queue[i].y+dy,key=`${x},${y}`;
        if(fireCaveMap[y]?.[x]===CF&&!seen.has(key)){seen.add(key);queue.push({x,y});}
      }
      encounterGrace=999;
      for(let i=0;i<500;i++)updateCaveWildlife(.5);
      return DRAGON_CHAMPIONS.every(sp=>fireCaveWildlife.filter(m=>m.id===sp.id).length===2)&&fireCaveWildlife.every(m=>seen.has(`${m.x},${m.y}`)&&fireCaveTiles.some(p=>p.x===m.x&&p.y===m.y));
    }));
    for(const id of ['squirt-turtle','bulb-toad','fire-lizard']){
      await page.evaluate(id=>{
        const mon=fireCaveWildlife.find(m=>m.id===id);mon.progress=1;mon.fx=mon.x;mon.fy=mon.y;mon.shiny=id==='bulb-toad';
        Object.assign(P,{x:mon.x,y:mon.y,fx:mon.x,fy:mon.y,prog:1});caveGrace=encounterGrace=0;checkCaveEncounter();
      },id);
      assert.ok(await page.evaluate(id=>enc.sp.id===id&&enc.lv===100&&enc.maxHp===524&&enc.shiny===(id==='bulb-toad'),id));
      await page.locator('#btn-perfect-ball').click();await page.waitForFunction(()=>modal===null);
    }
    assert.ok(await page.evaluate(()=>DRAGON_CHAMPIONS.every(s=>party.some(m=>m.id===s.id&&m.lv===100)&&!s.weight&&!s.fishingWeight)));
    await page.keyboard.press('p');await page.locator('#btn-party-candy').click();
    assert.equal(await page.locator('#party-list .mon').filter({hasText:'Squirt Turtle'}).isDisabled(),true);
    assert.equal(await page.evaluate(()=>journey.candies),3);await page.keyboard.press('Escape');
    // Capture the boss and check saved migration for players who already caught it before this update.
    await page.evaluate(()=>{Object.assign(P,{...FIRE_DRAGON_NEST,fx:FIRE_DRAGON_NEST.x,fy:FIRE_DRAGON_NEST.y,prog:1});meetFireDragon();});
    await page.locator('#btn-perfect-ball').click();await page.waitForFunction(()=>modal===null);
    await page.evaluate(()=>{const saved=JSON.parse(localStorage.getItem('mkrq'));delete saved.journey.fireDragonDefeated;localStorage.setItem('mkrq',JSON.stringify(saved));});
    await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.ok(await page.evaluate(()=>dragonChampionsUnlocked()&&fireCaveWildlife.length===6&&party.filter(m=>m.lv===100).length===4));
    assert.ok(await page.evaluate(()=>DRAGON_CHAMPIONS.every(sp=>{
      const pics=[false,true].map(shiny=>{const c=document.createElement('canvas');c.width=240;c.height=200;sp.draw(c.getContext('2d'),110,110,65,shiny);return c.toDataURL();});return pics[0]!==pics[1];
    })));
    await page.evaluate(()=>{
      const gallery=document.createElement('canvas');gallery.id='champion-gallery';gallery.width=960;gallery.height=460;
      gallery.style='position:fixed;inset:0;z-index:9999';document.body.appendChild(gallery);
      const c=gallery.getContext('2d');c.fillStyle='#292337';c.fillRect(0,0,960,460);
      c.textAlign='center';c.font='bold 24px sans-serif';c.fillStyle='#ffe4ac';c.fillText('FIRE DRAGON CAVE · LEVEL 100',480,36);
      DRAGON_CHAMPIONS.forEach((sp,i)=>{
        sp.draw(c,160+i*320,145,65,false);sp.draw(c,160+i*320,345,65,true);
        c.fillStyle='#fff1cb';c.font='bold 18px sans-serif';c.fillText(sp.name,160+i*320,244);
        c.font='16px sans-serif';c.fillText('Shiny form',160+i*320,443);
      });
    });
    await page.locator('#champion-gallery').screenshot({path:'/tmp/dragon-champions.png'});
    await page.evaluate(()=>document.getElementById('champion-gallery').remove());
    await page.evaluate(()=>{
      Object.assign(P,{x:6,y:8,fx:6,fy:8,prog:1});leaveFireCave();
      Object.assign(P,{x:5,y:7,fx:5,fy:7,prog:1});hud();persist();
    });
    // Actual hover plus keyboard input works from Party, the party bar, and the Box.
    await page.keyboard.press('p');await page.locator('#party-list [data-ride-dragon]').hover();await page.keyboard.press('3');
    assert.ok(await page.evaluate(()=>P.flying&&!modal&&!P.flightShiny));
    assert.match(await page.locator('#hud-mode').textContent(),/Flying/);
    await page.keyboard.press('3');assert.equal(await page.evaluate(()=>P.flying),false);
    await page.locator('#party-bar [data-ride-dragon]').hover();await page.keyboard.press('3');
    assert.equal(await page.evaluate(()=>P.flying),true);await page.keyboard.press('3');
    await page.keyboard.press('p');await page.locator('#party-list [data-ride-dragon]').click();
    await page.locator('#box-list [data-ride-dragon]').hover();await page.keyboard.press('3');
    assert.equal(await page.evaluate(()=>P.flying),true);
    assert.ok(await page.evaluate(()=>skyWildlife.length===18&&skyWildlife.every(m=>m.shiny&&m.x>=m.x1&&m.x<=m.x2&&m.y>=m.y1&&m.y<=m.y2)));
    // Fly across blocked ground using game movement, without landing, fishing, or ground encounters.
    assert.ok(await page.evaluate(()=>{
      encounterGrace=999;
      for(const ground of [WA,TR,MP]){
        let point;for(let y=2;y<H-2&&!point;y++)for(let x=2;x<W-2;x++)if(map[y][x]===ground){point={x,y};break;}
        Object.assign(P,{x:point.x-1,y:point.y,fx:point.x-1,fy:point.y,prog:1});tryMove(1,0);P.prog=1;arrive();
        if(P.x!==point.x||modal||canLandDragon())return false;
        landFireDragon();toggleDive();action();if(!P.flying||P.diving||fishing)return false;
      }
      Object.assign(P,{x:1,y:1,fx:1,fy:1,prog:1});tryMove(-1,0);if(P.x!==1)return false;
      Object.assign(P,{x:5,y:5,fx:5,fy:5,prog:1});if(nearTunnel()||nearLeagueSite()||canTravel()||challengeTrainer())return false;
      Object.assign(P,{x:22,y:24,fx:22,fy:24,prog:1});persist();return true;
    }));
    await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.ok(await page.evaluate(()=>P.flying&&P.x===22&&P.y===24&&box.some(m=>m.id==='fire-dragon')));
    // Capture a sky dragon into a full-party Box. Sky catches must not alter cave flags.
    await page.evaluate(()=>{
      journey.fireDragonCaught=false;journey.fireDragonDefeated=false;
      while(party.length<6)party.push({id:'orca',lv:100});
      const mon=skyWildlife[8];Object.assign(P,{x:mon.x,y:mon.y,fx:mon.x,fy:mon.y,prog:1});mon.progress=1;encounterGrace=0;checkSkyEncounter();
    });
    assert.ok(await page.evaluate(()=>enc.inSky&&enc.shiny&&enc.lv===70&&enc.maxHp===374));
    await page.keyboard.press('3');assert.equal(await page.evaluate(()=>P.flying),true);
    await page.waitForTimeout(200);await page.screenshot({path:'/tmp/shiny-sky-dragon.png'});
    await page.locator('#btn-perfect-ball').click();await page.waitForFunction(()=>modal===null);
    assert.ok(await page.evaluate(()=>box.at(-1).id==='fire-dragon'&&box.at(-1).lv===70&&box.at(-1).shiny&&!journey.fireDragonCaught&&!journey.fireDragonDefeated));
    await page.evaluate(()=>{
      encounterGrace=999;updateSkyWildlife(1);
      const mon=skyWildlife[0];Object.assign(P,{x:mon.x,y:mon.y,fx:mon.x,fy:mon.y,prog:1});mon.progress=1;encounterGrace=0;checkSkyEncounter();
    });
    const before=await page.evaluate(()=>journey.coins);
    while(await page.evaluate(()=>enc.hp>0))await page.locator('#btn-weaken').click();
    await page.locator('#btn-defeat-coins').click();
    assert.equal(await page.evaluate(()=>journey.coins),before+1000);
    assert.ok(await page.evaluate(()=>!journey.fireDragonDefeated&&P.flying));
    // Choose the shiny mount from the Box; show the ridden dragon and roaming sky sprites.
    await page.evaluate(()=>{Object.assign(P,{x:5,y:7,fx:5,fy:7,prog:1});landFireDragon();});
    await page.keyboard.press('p');await page.locator('#box-list .shiny[data-ride-dragon]').hover();await page.keyboard.press('3');
    assert.equal(await page.evaluate(()=>P.flightShiny),true);
    await page.evaluate(()=>{Object.assign(P,{x:24,y:18,fx:24,fy:18,prog:1});encounterGrace=999;});
    await page.waitForTimeout(250);await page.screenshot({path:'/tmp/dragon-flight.png'});
    const mobile=await makePage({x:5,y:7,party:[{id:'fire-dragon',lv:70,shiny:true}]},true);
    await mobile.locator('#btn-flight').tap();assert.equal(await mobile.evaluate(()=>P.flying),true);
    await mobile.screenshot({path:'/tmp/dragon-flight-mobile.png'});
    await mobile.locator('#btn-flight').tap();assert.equal(await mobile.evaluate(()=>P.flying),false);
    assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),390);
    // A grounded player cannot collide with sky wildlife, and a stale flight save recovers safely.
    assert.ok(await mobile.evaluate(()=>{
      const mon=skyWildlife[0];Object.assign(mon,{x:P.x,y:P.y,fx:P.x,fy:P.y,progress:1});encounterGrace=0;
      checkSkyEncounter();return !modal&&!P.flying;
    }));
    await mobile.evaluate(()=>localStorage.setItem('mkrq',JSON.stringify({x:22,y:24,flying:true,party:[],box:[]})));
    await mobile.reload({waitUntil:'domcontentloaded'});await mobile.waitForFunction(()=>time>.1);
    assert.ok(await mobile.evaluate(()=>!P.flying&&P.x===5&&P.y===7));
    assert.deepEqual(errors,[]);
    console.log('PASS: boss defeat/catch unlock, old-save migration, six reachable roaming level-100 creatures, capture and shiny art, level cap and persistence');
    console.log('PASS: Party/Box/bar hover + 3 riding, touch Ride/Land, terrain and action guards, saved flight, 18 shiny sky dragons, level-70 collision catches, Box overflow and shiny coin rewards without cave progression');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
