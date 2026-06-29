
class PolarityWars extends BaseGame{
  constructor(){ super('polarity-wars','Polarity Wars'); this.canvas.addEventListener('pointerdown',e=>this.pick(e)); }
  rewardWin(message,reward,bonus=1100){ if(this.over)return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-polarity-wars','Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }
  reset(){ this.poles=[]; this.enemies=[]; this.energy=120; this.wave=1; this.spawnTimer=0; this.toSpawn=8; this.leaks=0; this.nextPolarity=1; this.score=0; this.lives=20; }
  pick(e){ if(this.over||this.paused)return; const p=this.pointer(e); if(this.energy>=35){ this.energy-=35; this.poles.push({x:p.x,y:p.y,q:this.nextPolarity,str:140}); this.nextPolarity*=-1; AudioEngine.play('powerup'); } else AudioEngine.play('warning'); }
  spawn(){ const q=Math.random()<.5?1:-1; this.enemies.push({x:25,y:80+Math.random()*440,vx:50+this.wave*7,vy:0,q,hp:80+this.wave*12,r:9}); }
  update(dt){
    this.energy=Math.min(220,this.energy+24*dt); this.spawnTimer-=dt; if(this.toSpawn>0&&this.spawnTimer<=0){ this.spawn(); this.toSpawn--; this.spawnTimer=.7; }
    for(const e of [...this.enemies]){ let fx=34, fy=0; for(const p of this.poles){ const dx=e.x-p.x,dy=e.y-p.y, d2=Math.max(900,dx*dx+dy*dy), f=(e.q*p.q>0?1:-1)*p.str*900/d2; fx+=dx/Math.sqrt(d2)*f; fy+=dy/Math.sqrt(d2)*f; if(Math.sqrt(d2)<55){ e.hp-=35*dt; } } e.vx=(e.vx+fx*dt)*.992; e.vy=(e.vy+fy*dt)*.992; const sp=Math.hypot(e.vx,e.vy); if(sp>180){ e.vx=e.vx/sp*180; e.vy=e.vy/sp*180; } e.x+=e.vx*dt; e.y+=e.vy*dt; if(e.y<30||e.y>570)e.vy*=-1; if(e.hp<=0){ this.enemies.splice(this.enemies.indexOf(e),1); this.score+=90; AudioEngine.play('coin'); this.particles.push(...Utils.makeParticles(e.x,e.y,10,e.q>0?'#ff4d6d':'#18e0ff')); } if(e.x>805){ this.enemies.splice(this.enemies.indexOf(e),1); this.leaks++; this.lives=20-this.leaks; AudioEngine.play('failure'); if(this.leaks>=20)this.gameOver('Too many particles escaped'); } }
    if(this.toSpawn===0&&!this.enemies.length){ if(this.wave>=10){ this.rewardWin('Wave field stabilized','Magnetic Field Marshal',1600); return; } this.wave++; this.level=this.wave; this.toSpawn=7+this.wave*2; this.spawnTimer=1.4; AudioEngine.play('success'); }
    this.updateHUD({Wave:`${this.wave}/10`,Energy:Math.floor(this.energy),Leaks:`${this.leaks}/20`,Next:this.nextPolarity>0?'North +':'South -',Goal:'Survive 10 waves',Reward:'Magnetic Field Marshal'});
  }
  draw(){ const c=this.ctx; c.fillStyle='#061020'; c.fillRect(0,0,800,600); c.fillStyle='#0b1a2d'; c.fillRect(0,50,800,500); c.strokeStyle='#ffffff22'; for(let x=0;x<800;x+=50){ c.beginPath(); c.moveTo(x,50); c.lineTo(x,550); c.stroke(); } c.fillStyle='#ff4d6d'; c.fillRect(760,50,8,500); c.fillStyle='#cbd7ff'; c.font='15px system-ui'; c.fillText('Click to place alternating magnetic poles. Particles decay when trapped near poles.',92,32);
    for(const p of this.poles){ c.fillStyle=p.q>0?'#ff4d6d':'#18e0ff'; c.beginPath(); c.arc(p.x,p.y,18,0,Math.PI*2); c.fill(); c.fillStyle='#fff'; c.font='bold 18px system-ui'; c.textAlign='center'; c.fillText(p.q>0?'+':'−',p.x,p.y+6); c.strokeStyle=p.q>0?'rgba(255,77,109,.18)':'rgba(24,224,255,.18)'; c.beginPath(); c.arc(p.x,p.y,60,0,Math.PI*2); c.stroke(); c.textAlign='left'; }
    for(const e of this.enemies){ c.fillStyle=e.q>0?'#ff9aae':'#91f2ff'; c.beginPath(); c.arc(e.x,e.y,e.r,0,Math.PI*2); c.fill(); c.fillStyle='#071020'; c.font='bold 11px system-ui'; c.textAlign='center'; c.fillText(e.q>0?'+':'−',e.x,e.y+4); c.textAlign='left'; }
  }
}
window.currentGame=new PolarityWars(); window.currentGame.start();
