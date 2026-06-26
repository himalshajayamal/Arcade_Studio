
class VoltCourt extends BaseGame{
  constructor(){ super('volt-court','Volt Court'); }
  rewardWin(message,reward,bonus=900){ if(this.over)return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-volt-court','Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }
  reset(){ this.player={y:250,h:95}; this.ai={y:250,h:95}; this.ball={x:400,y:300,vx:250,vy:160,r:9,trail:[]}; this.ps=0; this.as=0; this.power=null; this.powerTimer=2.5; this.level=1; this.lives=1; this.score=0; }
  resetBall(dir){ this.ball={x:400,y:300,vx:dir*260,vy:(Math.random()-.5)*220,r:9,trail:[]}; }
  spawnPower(){ const types=['expand','speed','split','slowAI']; this.power={x:310+Math.random()*180,y:90+Math.random()*420,type:types[Math.floor(Math.random()*types.length)],r:15}; }
  update(dt){
    let sp=340; if(this.input.isPressed('up')) this.player.y-=sp*dt; if(this.input.isPressed('down')) this.player.y+=sp*dt; this.player.y=Utils.clamp(this.player.y,30,570-this.player.h);
    const b=this.ball; const target=b.y-this.ai.h/2; this.ai.y+=Utils.clamp(target-this.ai.y,-260*dt,260*dt); this.ai.y=Utils.clamp(this.ai.y,30,570-this.ai.h);
    b.x+=b.vx*dt; b.y+=b.vy*dt; b.trail.push({x:b.x,y:b.y}); if(b.trail.length>24)b.trail.shift(); if(b.y<34||b.y>566){ b.vy*=-1; AudioEngine.play('click'); }
    const hitP=b.x<70&&b.x>45&&b.y>this.player.y&&b.y<this.player.y+this.player.h, hitA=b.x>730&&b.x<755&&b.y>this.ai.y&&b.y<this.ai.y+this.ai.h;
    if(hitP){ b.vx=Math.abs(b.vx)*1.05; b.vy+=(b.y-(this.player.y+this.player.h/2))*4; this.score+=25; AudioEngine.play('coin'); }
    if(hitA){ b.vx=-Math.abs(b.vx)*1.05; b.vy+=(b.y-(this.ai.y+this.ai.h/2))*4; AudioEngine.play('click'); }
    if(b.x<0){ this.as++; this.resetBall(1); AudioEngine.play('failure'); }
    if(b.x>800){ this.ps++; this.score+=120; this.resetBall(-1); AudioEngine.play('success'); }
    this.powerTimer-=dt; if(!this.power&&this.powerTimer<=0) this.spawnPower();
    if(this.power&&Math.hypot(b.x-this.power.x,b.y-this.power.y)<this.power.r+b.r){ if(this.power.type==='expand')this.player.h=135; if(this.power.type==='speed'){ b.vx*=1.25;b.vy*=1.25; } if(this.power.type==='slowAI')this.ai.h=60; if(this.power.type==='split')this.score+=300; this.power=null; this.powerTimer=4; AudioEngine.play('powerup'); }
    if(this.ps>=7) this.rewardWin('Set won 7 points','Volt Court Trophy',1000); if(this.as>=7) this.gameOver('AI won the set');
    this.updateHUD({Score:`${this.ps}-${this.as}`,Goal:'Win 7 points',Power:this.power?this.power.type:'charging',Reward:'Volt Court Trophy'});
  }
  draw(){ const c=this.ctx,b=this.ball; c.fillStyle='#030712'; c.fillRect(0,0,800,600); c.strokeStyle='rgba(24,224,255,.4)'; c.lineWidth=2; for(let y=40;y<560;y+=30){ c.beginPath(); c.moveTo(400,y); c.lineTo(400,y+16); c.stroke(); }
    for(let i=0;i<b.trail.length;i++){ const t=b.trail[i]; c.globalAlpha=i/b.trail.length; c.fillStyle='#18e0ff'; c.beginPath(); c.arc(t.x,t.y,3+i*.18,0,Math.PI*2); c.fill(); } c.globalAlpha=1;
    c.fillStyle='#ffffff'; c.fillRect(48,this.player.y,16,this.player.h); c.fillStyle='#ff4d6d'; c.fillRect(736,this.ai.y,16,this.ai.h); c.fillStyle='#18e0ff'; c.beginPath(); c.arc(b.x,b.y,b.r,0,Math.PI*2); c.fill();
    if(this.power){ c.fillStyle='#ffd166'; c.beginPath(); c.arc(this.power.x,this.power.y,this.power.r,0,Math.PI*2); c.fill(); c.fillStyle='#111827'; c.font='bold 10px system-ui'; c.textAlign='center'; c.fillText('P',this.power.x,this.power.y+4); c.textAlign='left';}
  }
}
window.currentGame=new VoltCourt(); window.currentGame.start();
