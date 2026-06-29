
class VectorSurge extends BaseGame{
  constructor(){ super('vector-surge','Vector Surge'); this.pointerAim={x:650,y:300}; this.firing=false; this.canvas.addEventListener('pointermove',e=>{this.pointerAim=this.pointer(e);}); this.canvas.addEventListener('pointerdown',e=>{this.firing=true; this.pointerAim=this.pointer(e); this.canvas.focus?.();}); window.addEventListener('pointerup',()=>this.firing=false); }
  rewardWin(message,reward,bonus=1200){ if(this.over) return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-vector-surge','Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }
  reset(){ this.player={x:400,y:300,r:14,vx:0,vy:0,cd:0,inv:1}; this.wave=1; this.enemies=[]; this.bullets=[]; this.gems=[]; this.mult=1; this.lives=3; this.spawnWave(); }
  spawnWave(){ this.enemies=[]; for(let i=0;i<5+this.wave*3;i++){ const a=Math.random()*Math.PI*2, d=420+Math.random()*120; this.enemies.push({x:400+Math.cos(a)*d,y:300+Math.sin(a)*d,r:12+Math.random()*8,hp:1+Math.floor(this.wave/2),type:i%3}); } }
  shoot(){ const p=this.player; if(p.cd>0) return; const a=Math.atan2(this.pointerAim.y-p.y,this.pointerAim.x-p.x); this.bullets.push({x:p.x,y:p.y,vx:Math.cos(a)*520,vy:Math.sin(a)*520,life:.9}); p.cd=.09; AudioEngine.play('shoot'); }
  update(dt){
    const p=this.player; let ax=(this.input.isPressed('right')?1:0)-(this.input.isPressed('left')?1:0), ay=(this.input.isPressed('down')?1:0)-(this.input.isPressed('up')?1:0); const len=Math.hypot(ax,ay)||1; p.vx+=ax/len*520*dt; p.vy+=ay/len*520*dt; p.vx*=.88; p.vy*=.88; p.x=Utils.clamp(p.x+p.vx*dt,25,775); p.y=Utils.clamp(p.y+p.vy*dt,25,575); p.cd=Math.max(0,p.cd-dt); p.inv=Math.max(0,p.inv-dt); if(this.firing||this.input.isPressed('action')) this.shoot();
    for(const b of this.bullets){ b.x+=b.vx*dt; b.y+=b.vy*dt; b.life-=dt; } this.bullets=this.bullets.filter(b=>b.life>0&&b.x>-20&&b.x<820&&b.y>-20&&b.y<620);
    for(const e of this.enemies){ const a=Math.atan2(p.y-e.y,p.x-e.x), sp=55+this.wave*10+e.type*16; e.x+=Math.cos(a)*sp*dt; e.y+=Math.sin(a)*sp*dt; }
    for(const b of [...this.bullets]) for(const e of [...this.enemies]) if(Math.hypot(b.x-e.x,b.y-e.y)<e.r+4){ b.life=0; e.hp--; this.particles.push(...Utils.makeParticles(e.x,e.y,8,'#18e0ff')); if(e.hp<=0){ this.enemies.splice(this.enemies.indexOf(e),1); this.gems.push({x:e.x,y:e.y,r:6,life:7}); this.score+=50*this.mult; AudioEngine.play('explosion'); } break; }
    for(const g of [...this.gems]){ g.life-=dt; if(Math.hypot(p.x-g.x,p.y-g.y)<p.r+g.r){ this.gems.splice(this.gems.indexOf(g),1); this.mult=Math.min(20,this.mult+1); this.score+=25*this.mult; AudioEngine.play('coin'); } } this.gems=this.gems.filter(g=>g.life>0);
    if(p.inv<=0) for(const e of this.enemies) if(Math.hypot(p.x-e.x,p.y-e.y)<p.r+e.r){ this.lives--; this.mult=1; p.x=400;p.y=300;p.vx=p.vy=0;p.inv=1.5; AudioEngine.play('failure'); if(this.lives<=0)this.gameOver('Vector core collapsed'); break; }
    if(!this.enemies.length){ if(this.wave>=5){ this.rewardWin('Arena wave five cleared','Neon Multiplier Crown',2000); return; } this.wave++; this.level=this.wave; this.spawnWave(); AudioEngine.play('success'); }
    this.updateHUD({Wave:`${this.wave}/5`,Multiplier:`x${this.mult}`,Enemies:this.enemies.length,Goal:'Clear 5 waves',Reward:'Neon Multiplier Crown'});
  }
  draw(){
    const c=this.ctx; c.fillStyle='rgba(3,7,18,.65)'; c.fillRect(0,0,800,600); c.strokeStyle='rgba(24,224,255,.18)'; c.lineWidth=1; for(let x=0;x<800;x+=32){ c.beginPath(); for(let y=0;y<600;y+=16){ const warp=Math.sin((y+this.elapsed*80+x)*.025)*4; c.lineTo(x+warp,y); } c.stroke(); } for(let y=0;y<600;y+=32){ c.beginPath(); for(let x=0;x<800;x+=16){ const warp=Math.cos((x+this.elapsed*70+y)*.02)*4; c.lineTo(x,y+warp); } c.stroke(); }
    for(const g of this.gems){ c.fillStyle='#ffd166'; c.beginPath(); c.arc(g.x,g.y,g.r,0,Math.PI*2); c.fill(); }
    c.fillStyle='#18e0ff'; for(const b of this.bullets){ c.beginPath(); c.arc(b.x,b.y,4,0,Math.PI*2); c.fill(); }
    for(const e of this.enemies){ c.strokeStyle=['#ff4d6d','#b47cff','#36e28f'][e.type]; c.lineWidth=3; c.beginPath(); c.rect(e.x-e.r,e.y-e.r,e.r*2,e.r*2); c.stroke(); }
    const p=this.player; c.save(); c.translate(p.x,p.y); c.rotate(Math.atan2(this.pointerAim.y-p.y,this.pointerAim.x-p.x)); c.strokeStyle=p.inv>0?'#fff':'#18e0ff'; c.lineWidth=3; c.beginPath(); c.moveTo(18,0); c.lineTo(-12,-11); c.lineTo(-6,0); c.lineTo(-12,11); c.closePath(); c.stroke(); c.restore();
  }
}
window.currentGame=new VectorSurge(); window.currentGame.start();
