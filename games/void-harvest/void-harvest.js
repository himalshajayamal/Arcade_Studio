
class VoidHarvest extends BaseGame{
  constructor(){ super('void-harvest','Void Harvest'); }
  rewardWin(message,reward,bonus=1600){ if(this.over)return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-void-harvest','Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }
  reset(){ this.ship={x:400,y:300,a:-Math.PI/2,vx:0,vy:0,hull:100,fuel:100,cd:0,cargo:0}; this.rocks=[]; this.bullets=[]; this.station={x:400,y:300,r:42}; this.credits=0; this.lives=1; for(let i=0;i<16;i++)this.spawnRock(); }
  spawnRock(){ const a=Math.random()*Math.PI*2,d=180+Math.random()*330; this.rocks.push({x:400+Math.cos(a)*d,y:300+Math.sin(a)*d,z:1+Math.random()*2,r:18+Math.random()*26,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30,spin:Math.random()*6,ore:80+Math.floor(Math.random()*170)}); }
  shoot(){ const s=this.ship; if(s.cd>0)return; this.bullets.push({x:s.x,y:s.y,vx:Math.cos(s.a)*520,vy:Math.sin(s.a)*520,life:1}); s.cd=.18; AudioEngine.play('shoot'); }
  update(dt){ const s=this.ship; if(this.input.isPressed('left'))s.a-=4*dt; if(this.input.isPressed('right'))s.a+=4*dt; if(this.input.isPressed('up')&&s.fuel>0){ s.vx+=Math.cos(s.a)*170*dt; s.vy+=Math.sin(s.a)*170*dt; s.fuel-=9*dt; } if(this.input.isPressed('action'))this.shoot(); if(Math.hypot(s.x-this.station.x,s.y-this.station.y)<70){ this.credits+=s.cargo; this.score=this.credits; s.cargo=0; s.fuel=Math.min(100,s.fuel+30*dt); s.hull=Math.min(100,s.hull+12*dt); if(this.credits>=3000)this.rewardWin('Miner returned rich','Void Harvest Charter',2200); }
    s.vx*=.992; s.vy*=.992; s.x=(s.x+s.vx*dt+800)%800; s.y=(s.y+s.vy*dt+600)%600; s.cd=Math.max(0,s.cd-dt);
    for(const b of this.bullets){ b.x+=b.vx*dt; b.y+=b.vy*dt; b.life-=dt; } this.bullets=this.bullets.filter(b=>b.life>0&&b.x>-20&&b.x<820&&b.y>-20&&b.y<620);
    for(const r of this.rocks){ r.x=(r.x+r.vx*dt+800)%800; r.y=(r.y+r.vy*dt+600)%600; r.spin+=dt; if(Math.hypot(s.x-r.x,s.y-r.y)<r.r+12){ s.hull-=25*dt; if(s.hull<=0)this.gameOver('Hull destroyed in asteroid field'); } }
    for(const b of [...this.bullets]) for(const r of [...this.rocks]) if(Math.hypot(b.x-r.x,b.y-r.y)<r.r){ this.bullets.splice(this.bullets.indexOf(b),1); this.rocks.splice(this.rocks.indexOf(r),1); s.cargo+=r.ore; this.particles.push(...Utils.makeParticles(r.x,r.y,18,'#ffd166')); AudioEngine.play('explosion'); this.spawnRock(); break; }
    this.updateHUD({Credits:this.credits,Cargo:s.cargo,Hull:Math.floor(s.hull),Fuel:Math.floor(s.fuel),Goal:'Bank 3000 credits',Reward:'Void Harvest Charter'});
  }
  draw(){ const c=this.ctx,s=this.ship; c.fillStyle='#02040b'; c.fillRect(0,0,800,600); c.fillStyle='#ffffff88'; for(let i=0;i<90;i++)c.fillRect((i*97+this.elapsed*12)%800,(i*47)%600,2,2); c.strokeStyle='#36e28f'; c.lineWidth=3; c.beginPath(); c.arc(this.station.x,this.station.y,this.station.r,0,Math.PI*2); c.stroke(); c.fillStyle='#36e28f'; c.font='bold 13px system-ui'; c.fillText('STATION',365,305);
    for(const r of this.rocks){ c.save(); c.translate(r.x,r.y); c.rotate(r.spin); c.strokeStyle='#ffd166'; c.lineWidth=2; c.beginPath(); for(let i=0;i<9;i++){ const a=i/9*Math.PI*2, rad=r.r*(.75+((i*17)%7)/20); const x=Math.cos(a)*rad,y=Math.sin(a)*rad; i?c.lineTo(x,y):c.moveTo(x,y); } c.closePath(); c.stroke(); c.restore(); }
    c.fillStyle='#18e0ff'; for(const b of this.bullets)c.fillRect(b.x-2,b.y-2,4,4);
    c.save(); c.translate(s.x,s.y); c.rotate(s.a); c.strokeStyle='#18e0ff'; c.lineWidth=3; c.beginPath(); c.moveTo(18,0); c.lineTo(-12,-10); c.lineTo(-7,0); c.lineTo(-12,10); c.closePath(); c.stroke(); c.restore();
  }
}
window.currentGame=new VoidHarvest(); window.currentGame.start();
