// GAME_URL=http://127.0.0.1:8010 node tests/ground-smoke.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox']});
  try {
    const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('https://fonts.googleapis.com/**',r=>r.abort());
    await page.clock.setFixedTime(new Date('2026-10-30T12:00:00Z'));
    await page.addInitScript(()=>{
      if(!localStorage.getItem('mkrq'))localStorage.setItem('mkrq',JSON.stringify({x:5,y:7,party:[],box:[{id:'ghost',lv:10,shiny:true}],dex:{ghost:{count:1,shiny:1}},journey:{coins:150,candies:2}}));
    });
    await page.goto(process.env.GAME_URL||'http://127.0.0.1:8010',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>time>.1);
    const setup=await page.evaluate(()=>({count:SPECIES.length,spawns:groundWildlife.map(m=>({id:m.id,active:m.active,valid:groundFree(m,m.x,m.y)})),ids:GROUND_SPECIES.map(s=>s.id)}));
    assert.equal(setup.spawns.length,12);assert.ok(setup.spawns.every(s=>s.active&&s.valid));
    assert.equal(new Set(setup.spawns.map(s=>s.id)).size,3);
    assert.ok(await page.evaluate(()=>GROUND_SPECIES.every(s=>!waterSpecies.includes(s.id)&&!waterWildlife.some(m=>m.id===s.id)&&!deepWildlife.some(m=>m.id===s.id)&&!caveWildlife.some(m=>m.id===s.id))));
    // Every normal/shiny pair must actually differ at both icon and encounter sizes.
    assert.ok(await page.evaluate(()=>GROUND_SPECIES.every(s=>[18,52].every(size=>{
      const c=document.createElement('canvas');c.width=c.height=160;const ctx=c.getContext('2d');
      s.draw(ctx,80,80,size,false,0);const normal=ctx.getImageData(0,0,160,160).data;
      ctx.clearRect(0,0,160,160);s.draw(ctx,80,80,size,true,0);const shiny=ctx.getImageData(0,0,160,160).data;
      return normal.some((v,i)=>i%4!==3&&v!==shiny[i]);
    }))));
    for(const [i,id]of setup.ids.entries()) {
      // Use a reachable habitat tile with a clear approach and walk into its sprite.
      const target=await page.evaluate(({id,i})=>{
        groundWildlife.forEach(m=>{m.moveIn=999;});
        const mon=groundWildlife.find(m=>m.id===id);
        const point=groundHabitats[id].find(p=>groundFree(mon,p.x,p.y)&&groundFree(mon,p.x-1,p.y));
        if(!point)throw Error('No reachable approach for '+id);
        Object.assign(mon,point,{fx:point.x,fy:point.y,progress:1,active:true,shiny:i>0,moveIn:999});
        Object.assign(P,{x:point.x-1,y:point.y,fx:point.x-1,fy:point.y,prog:1,boat:false,diving:false,flying:false});
        encounterGrace=0;spots=[];Math.random=()=>.2;hud();return point;
      },{id,i});
      await page.keyboard.down('ArrowRight');
      await page.waitForFunction(x=>P.x===x,target.x);await page.keyboard.up('ArrowRight');
      await page.waitForFunction(()=>modal==='enc');
      assert.deepEqual(await page.evaluate(()=>({id:enc.sp.id,shiny:enc.shiny})),{id,shiny:i>0});
      assert.equal(await page.evaluate(id=>groundWildlife.find(m=>m.id===id).active,id),false);
      await page.locator('#btn-throw').click();
      await page.waitForFunction(()=>modal===null);
      assert.ok(await page.evaluate(({id,i})=>party.some(m=>m.id===id&&m.shiny===(i>0)),{id,i}));
    }
    await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>time>.1);
    assert.ok(await page.evaluate(()=>party.length===3&&box.some(m=>m.id==='ghost'&&m.shiny)&&journey.candies===2&&dex.ghost.count===1));
    await page.keyboard.press('c');await page.locator('#dex-filter').selectOption('ground');
    assert.equal(await page.locator('#dex-list .dex-item').count(),3);
    assert.match(await page.locator('#dex-list').innerText(),/Fire Bird[\s\S]*Garbage Hunk[\s\S]*Seabird/);
    await page.keyboard.press('Escape');
    // Collision guards: only on foot, moving has completed, outside grace, no modal.
    assert.ok(await page.evaluate(()=>{
      const mon=groundWildlife.find(m=>m.id==='seabird');mon.moveIn=999;
      Object.assign(P,{x:mon.x,y:mon.y,fx:mon.x,fy:mon.y,prog:1});encounterGrace=0;
      for(const flag of['boat','diving','flying']){P[flag]=true;if(checkGroundEncounter()||modal)return false;P[flag]=false;}
      underground=true;if(checkGroundEncounter())return false;underground=false;
      modal='party';if(checkGroundEncounter())return false;modal=null;
      P.prog=.5;if(checkGroundEncounter())return false;P.prog=1;
      encounterGrace=4;if(checkGroundEncounter())return false;encounterGrace=0;
      mon.shiny=false;spots=[{x:mon.x,y:mon.y,life:60}];
      return checkGroundEncounter()&&enc.shiny&&!spotAt(mon.x,mon.y);
    }));
    await page.locator('#btn-run').click();
    // Respawn, movement, and seasonal changes must keep creatures on valid land.
    assert.ok(await page.evaluate(()=>{
      encounterGrace=10000;Object.assign(P,{x:5,y:7,fx:5,fy:7,prog:1});
      for(let i=0;i<1000;i++)updateGroundWildlife(.1);
      return groundWildlife.every(m=>m.active&&groundFree(m,m.x,m.y));
    }));
    await page.clock.setFixedTime(new Date('2026-11-01T12:00:00Z'));
    await page.evaluate(()=>{refreshHalloweenSeason();updateGroundWildlife(1);});
    assert.ok(await page.evaluate(()=>groundWildlife.every(m=>m.active&&groundFree(m,m.x,m.y))));
    await page.evaluate(()=>{
      const c=document.createElement('canvas');c.id='ground-preview';c.width=900;c.height=500;
      const x=c.getContext('2d');x.fillStyle='#183344';x.fillRect(0,0,900,500);x.textAlign='center';
      GROUND_SPECIES.forEach((sp,i)=>{for(let row=0;row<2;row++){
        sp.draw(x,150+i*300,110+row*240,65,!!row,0);
        x.fillStyle='#fff';x.font='bold 20px sans-serif';x.fillText((row?'Shiny ':'')+sp.name,150+i*300,210+row*240);
      }});document.body.appendChild(c);c.style.cssText='position:fixed;inset:0;z-index:99999';
    });
    await page.locator('#ground-preview').screenshot({path:'/tmp/ground-creatures.png'});
    assert.deepEqual(errors,[]);
    console.log(`PASS: ${setup.count} species; 12 reachable land spawns; all three keyboard collisions, normal/shiny art, capture, save reload, Collection, collision guards, sparkle guarantee, respawn and seasonal rollover; no runtime errors.`);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
