
class DungeonSector extends BaseGame {
  constructor(){
    super('dungeon-sector','Dungeon Sector');
    this.mouseDX=0; this.firing=false; this.touchAim=null;
    this.canvas.addEventListener('click',()=>{ this.canvas.focus(); this.shoot(); });
    this.canvas.addEventListener('pointerdown',e=>{ if(e.pointerType==='touch'){ this.touchAim=this.pointer(e); this.shoot(); } });
    this.canvas.addEventListener('pointermove',e=>{ const p=this.pointer(e); if(e.buttons){ this.player.a += (p.x-400)*0.00025; } });
  }
  reset(){
    this.level=1; this.score=0; this.lives=3; this.hp=100; this.armor=40; this.ammo=42; this.keys=0; this.sector=0; this.flash=0; this.cooldown=0; this.damageFlash=0; this.depth=[];
    this.levels=[
      {name:'Data Vault', reward:'Raycaster Operative Badge', map:[
        '111111111111','100000000001','101111011101','100001000101','111101110101','100100000101','101101111101','101000000001','101011111101','1000000000E1','111111111111'], start:[1.5,1.5], exit:[10.5,9.5], keys:[[5.5,3.5]], pickups:[[3.5,7.5,'ammo'],[8.5,1.5,'med']], enemies:[[8.5,2.5,'guard'],[6.5,7.5,'trooper']]},
      {name:'Reactor Ring', reward:'Sector Breach Medal', map:[
        '111111111111','100000010001','101110010101','101000000101','101011111101','100010000001','111010111101','100000100001','101110101101','1E0000000001','111111111111'], start:[1.5,8.5], exit:[1.5,9.5], keys:[[9.5,1.5]], pickups:[[4.5,5.5,'ammo'],[10.5,8.5,'armor']], enemies:[[6.5,2.5,'trooper'],[9.5,6.5,'captain'],[3.5,8.5,'guard']]},
      {name:'Command Core', reward:'Dungeon Sector Commander', map:[
        '111111111111','100000000001','101111110101','100000010101','111101010101','100001000001','101111011101','101000000101','101011110101','1000000000E1','111111111111'], start:[1.5,1.5], exit:[10.5,9.5], keys:[[5.5,5.5]], pickups:[[2.5,8.5,'med'],[8.5,3.5,'ammo']], enemies:[[8.5,1.5,'captain'],[8.5,7.5,'trooper'],[3.5,6.5,'guard'],[5.5,8.5,'trooper']]}
    ];
    this.loadSector(0);
  }
  loadSector(i){
    this.sector=i; const L=this.levels[i]; this.map=L.map.map(r=>r.split('')); const [sx,sy]=L.start; this.player={x:sx,y:sy,a:0.15};
    this.exit={x:L.exit[0],y:L.exit[1]}; this.keys=0; this.requiredKeys=L.keys.length;
    this.pickups=[...L.keys.map(k=>({x:k[0],y:k[1],type:'key',taken:false})),...L.pickups.map(p=>({x:p[0],y:p[1],type:p[2],taken:false}))];
    this.enemies=L.enemies.map((e,idx)=>({x:e[0],y:e[1],type:e[2],hp:e[2]==='captain'?90:e[2]==='trooper'?55:35,max:e[2]==='captain'?90:e[2]==='trooper'?55:35,cd:1+idx*.35,alive:true,hit:0,alert:false}));
    this.level=i+1;
  }
  wallAt(x,y){ const mx=Math.floor(x), my=Math.floor(y); return my<0||my>=this.map.length||mx<0||mx>=this.map[0].length||this.map[my][mx]==='1'; }
  lineClear(x1,y1,x2,y2){ const steps=Math.ceil(Math.hypot(x2-x1,y2-y1)*10); for(let i=1;i<steps;i++){ const t=i/steps; if(this.wallAt(x1+(x2-x1)*t,y1+(y2-y1)*t)) return false; } return true; }
  move(dx,dy){ const nx=this.player.x+dx, ny=this.player.y+dy; if(!this.wallAt(nx,this.player.y)) this.player.x=nx; if(!this.wallAt(this.player.x,ny)) this.player.y=ny; }
  update(dt){
    if(this.input.isPressed('left')) this.player.a-=2.4*dt; if(this.input.isPressed('right')) this.player.a+=2.4*dt;
    const sp=this.input.isPressed('secondary')?3.2:2.1; let vx=0,vy=0;
    if(this.input.isPressed('up')){ vx+=Math.cos(this.player.a)*sp*dt; vy+=Math.sin(this.player.a)*sp*dt; }
    if(this.input.isPressed('down')){ vx-=Math.cos(this.player.a)*sp*dt; vy-=Math.sin(this.player.a)*sp*dt; }
    this.move(vx,vy); this.cooldown=Math.max(0,this.cooldown-dt); this.flash=Math.max(0,this.flash-dt); this.damageFlash=Math.max(0,this.damageFlash-dt);
    for(const p of this.pickups){ if(!p.taken && Math.hypot(this.player.x-p.x,this.player.y-p.y)<.55){ p.taken=true; if(p.type==='key'){ this.keys++; this.score+=250; AudioEngine.play('powerup'); } if(p.type==='ammo'){ this.ammo+=18; this.score+=80; AudioEngine.play('coin'); } if(p.type==='med'){ this.hp=Math.min(100,this.hp+35); AudioEngine.play('success'); } if(p.type==='armor'){ this.armor=Math.min(70,this.armor+35); AudioEngine.play('powerup'); } } }
    for(const e of this.enemies){ if(!e.alive) continue; e.cd-=dt; e.hit=Math.max(0,e.hit-dt); const d=Math.hypot(e.x-this.player.x,e.y-this.player.y); const seen=d<7&&this.lineClear(e.x,e.y,this.player.x,this.player.y); if(seen) e.alert=true; if(e.alert && d>1.15){ const ax=(this.player.x-e.x)/d, ay=(this.player.y-e.y)/d; const speed=e.type==='captain'?1.05:e.type==='trooper'?1.25:.85; const nx=e.x+ax*speed*dt, ny=e.y+ay*speed*dt; if(!this.wallAt(nx,e.y)) e.x=nx; if(!this.wallAt(e.x,ny)) e.y=ny; }
      if(seen && e.cd<=0){ e.cd=e.type==='captain'?.55:1.1; let dmg=e.type==='captain'?15:e.type==='trooper'?10:7; if(this.armor>0){ const block=Math.min(this.armor,dmg*.55); this.armor-=block; dmg-=block; } this.hp-=dmg; this.damageFlash=.18; AudioEngine.play('warning'); if(this.hp<=0){ this.lives=0; this.gameOver('Sector failed — operator down'); } }
    }
    const live=this.enemies.filter(e=>e.alive).length; const atExit=Math.hypot(this.player.x-this.exit.x,this.player.y-this.exit.y)<.75;
    if(atExit && this.keys>=this.requiredKeys && live===0){ this.score+=1000+Math.floor(this.hp*5)+this.ammo*5; if(this.sector<this.levels.length-1){ AudioEngine.play('reward'); this.loadSector(this.sector+1); } else { StorageManager.saveAchievement(this.gameId,'dungeon-sector-commander','Reward: Dungeon Sector Commander'); this.win('Facility cleared — Reward: Dungeon Sector Commander'); } }
    this.updateHUD({HP:Math.max(0,Math.floor(this.hp)),Armor:Math.floor(this.armor),Ammo:this.ammo,Keys:`${this.keys}/${this.requiredKeys}`,Sector:this.levels[this.sector].name,Enemies:live,Goal:'Key + clear + exit',Reward:this.levels[this.sector].reward});
  }
  handleAction(a){ if(a==='action') this.shoot(); }
  shoot(){
    if(this.cooldown>0||this.over||this.paused) return; if(this.ammo<=0){ AudioEngine.play('failure'); this.cooldown=.25; return; }
    this.ammo--; this.cooldown=.28; this.flash=.08; AudioEngine.play('shoot'); let best=null,bestScore=999;
    for(const e of this.enemies){ if(!e.alive) continue; const dx=e.x-this.player.x, dy=e.y-this.player.y; const d=Math.hypot(dx,dy); if(!this.lineClear(this.player.x,this.player.y,e.x,e.y)) continue; let da=Math.atan2(Math.sin(Math.atan2(dy,dx)-this.player.a),Math.cos(Math.atan2(dy,dx)-this.player.a)); const aim=Math.abs(da); if(aim<0.12+0.16/d && d<bestScore){ best=e; bestScore=d; } }
    if(best){ best.hp-=34; best.hit=.16; this.particles.push(...Utils.makeParticles(400,300,10,'#ff4d6d')); if(best.hp<=0){ best.alive=false; this.score += best.type==='captain'?500:220; AudioEngine.play('explosion'); } else AudioEngine.play('success'); } else { this.particles.push(...Utils.makeParticles(400,300,4,'#ffd166')); }
  }
  castRay(angle){
    let dist=0, hit=false, x=this.player.x, y=this.player.y, step=.025;
    while(dist<14&&!hit){ dist+=step; x=this.player.x+Math.cos(angle)*dist; y=this.player.y+Math.sin(angle)*dist; hit=this.wallAt(x,y); }
    return {dist:dist*Math.cos(angle-this.player.a), raw:dist, x,y};
  }
  draw(){
    const c=this.ctx,w=800,h=600; const ceiling=c.createLinearGradient(0,0,0,h/2); ceiling.addColorStop(0,'#05091a'); ceiling.addColorStop(1,'#111a38'); c.fillStyle=ceiling; c.fillRect(0,0,w,h/2); const floor=c.createLinearGradient(0,h/2,0,h); floor.addColorStop(0,'#15101f'); floor.addColorStop(1,'#03050d'); c.fillStyle=floor; c.fillRect(0,h/2,w,h/2);
    const cols=240,fov=Math.PI/3; this.depth=[]; for(let i=0;i<cols;i++){ const a=this.player.a-fov/2+fov*i/cols; const r=this.castRay(a); const wallH=Math.min(620,420/(r.dist||.01)); const shade=Utils.clamp(1-r.raw/12,.12,1); const x=i*w/cols, cw=w/cols+1; c.fillStyle=`rgb(${Math.floor(30+80*shade)},${Math.floor(80+140*shade)},${Math.floor(120+100*shade)})`; c.fillRect(x,h/2-wallH/2,cw,wallH); if(i%8===0){ c.fillStyle=`rgba(255,255,255,${.08*shade})`; c.fillRect(x,h/2-wallH/2,1,wallH); } this.depth[i]=r.raw; }
    const sprites=[...this.pickups.filter(p=>!p.taken).map(p=>({...p,kind:'pickup'})),...this.enemies.filter(e=>e.alive).map(e=>({...e,kind:'enemy'}))].sort((a,b)=>Math.hypot(b.x-this.player.x,b.y-this.player.y)-Math.hypot(a.x-this.player.x,a.y-this.player.y));
    for(const s of sprites){ const dx=s.x-this.player.x,dy=s.y-this.player.y,dist=Math.hypot(dx,dy); let ang=Math.atan2(Math.sin(Math.atan2(dy,dx)-this.player.a),Math.cos(Math.atan2(dy,dx)-this.player.a)); if(Math.abs(ang)>fov*.62||dist<.15) continue; const sx=w/2+(ang/(fov/2))*w/2; const size=Utils.clamp(270/dist,16,240); const col=Math.floor(sx/w*cols); if(this.depth[col] && this.depth[col]<dist-.15) continue; c.save(); c.translate(sx,h/2+size*.15); c.shadowBlur=18; c.shadowColor=s.kind==='enemy'?'#ff4d6d':'#36e28f'; c.fillStyle=s.kind==='enemy'?(s.hit?'#fff':s.type==='captain'?'#ff4d6d':'#ff8fab'):(s.type==='key'?'#ffd166':s.type==='ammo'?'#18e0ff':'#36e28f'); if(s.kind==='enemy'){ c.beginPath(); c.roundRect?.(-size*.32,-size*.7,size*.64,size*.95,8); c.fill(); c.fillStyle='#101020'; c.fillRect(-size*.22,-size*.45,size*.44,size*.12); c.fillStyle='#ff4d6d'; c.fillRect(-size*.35,-size*.88,size*.7*(s.hp/s.max),5); } else { c.beginPath(); c.arc(0,-size*.25,size*.22,0,Math.PI*2); c.fill(); c.fillText(s.type==='key'?'🔑':s.type==='ammo'?'▣':'✚',-size*.16,-size*.18); } c.restore(); }
    // weapon and crosshair
    if(this.damageFlash){ c.fillStyle=`rgba(255,0,50,${this.damageFlash*1.8})`; c.fillRect(0,0,w,h); }
    c.strokeStyle=this.flash?'#ffd166':'#18e0ff'; c.lineWidth=2; c.beginPath(); c.moveTo(388,300); c.lineTo(412,300); c.moveTo(400,288); c.lineTo(400,312); c.stroke();
    c.save(); c.translate(400,548+Math.sin(this.elapsed*5)*3); c.fillStyle='#1b2444'; c.fillRect(-64,-42,128,74); c.fillStyle=this.flash?'#fff2a8':'#18e0ff'; c.fillRect(-12,-86,24,58); if(this.flash){ c.globalAlpha=.85; c.beginPath(); c.arc(0,-95,30,0,Math.PI*2); c.fillStyle='#ffd166'; c.fill(); } c.restore();
    // minimap
    const sc=8, ox=18, oy=18; c.globalAlpha=.86; c.fillStyle='rgba(0,0,0,.55)'; c.fillRect(ox-6,oy-6,this.map[0].length*sc+12,this.map.length*sc+12); c.globalAlpha=1; for(let y=0;y<this.map.length;y++)for(let x=0;x<this.map[0].length;x++){ if(this.map[y][x]==='1'){ c.fillStyle='#164a77'; c.fillRect(ox+x*sc,oy+y*sc,sc-1,sc-1); }} c.fillStyle='#ffd166'; c.fillRect(ox+this.exit.x*sc-2,oy+this.exit.y*sc-2,4,4); c.fillStyle='#36e28f'; c.beginPath(); c.arc(ox+this.player.x*sc,oy+this.player.y*sc,3,0,Math.PI*2); c.fill(); c.strokeStyle='#36e28f'; c.beginPath(); c.moveTo(ox+this.player.x*sc,oy+this.player.y*sc); c.lineTo(ox+(this.player.x+Math.cos(this.player.a)*1.5)*sc,oy+(this.player.y+Math.sin(this.player.a)*1.5)*sc); c.stroke();
  }
}
window.currentGame=new DungeonSector(); window.currentGame.start();
