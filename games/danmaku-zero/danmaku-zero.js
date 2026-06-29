
class DanmakuZero extends BaseGame{
  constructor(){ super('danmaku-zero','Danmaku Zero'); }
  rewardWin(message,reward,bonus=1500){ if(this.over)return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-danmaku-zero','Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }
  reset(){ this.player={x:400,y:520,r:5,cd:0,bombs:2,inv:1}; this.boss={x:400,y:90,hp:260,phase:1,t:0}; this.pbullets=[]; this.ebullets=[]; this.lives=3; this.level=1; this.score=0; this.graze=0; }
  handleAction(a){ if(a==='secondary'&&this.player.bombs>0){ this.player.bombs--; this.ebullets=[]; this.score+=200; this.particles.push(...Utils.makeParticles(this.player.x,this.player.y,40,'#fff')); AudioEngine.play('explosion'); } }
  update(dt){
    const p=this.player; let sp=this.input.isPressed('secondary')?145:230; let ax=(this.input.isPressed('right')?1:0)-(this.input.isPressed('left')?1:0), ay=(this.input.isPressed('down')?1:0)-(this.input.isPressed('up')?1:0); const len=Math.hypot(ax,ay)||1; p.x=Utils.clamp(p.x+ax/len*sp*dt,25,775); p.y=Utils.clamp(p.y+ay/len*sp*dt,70,575); p.cd-=dt; p.inv=Math.max(0,p.inv-dt); if(p.cd<=0){ this.pbullets.push({x:p.x-8,y:p.y,vx:0,vy:-520},{x:p.x+8,y:p.y,vx:0,vy:-520}); p.cd=.1; }
    const b=this.boss; b.t+=dt; b.x=400+Math.sin(this.elapsed*.8)*210; if(b.t>.055){ b.t=0; const count=10+this.level*3; for(let i=0;i<count;i++){ const a=i/count*Math.PI*2+this.elapsed*(.8+this.level*.2); this.ebullets.push({x:b.x,y:b.y,vx:Math.cos(a)*(75+this.level*18),vy:Math.sin(a)*(75+this.level*18),r:5}); } }
    for(const q of this.pbullets){ q.x+=q.vx*dt; q.y+=q.vy*dt; } this.pbullets=this.pbullets.filter(q=>q.y>-20);
    for(const q of this.ebullets){ q.x+=q.vx*dt; q.y+=q.vy*dt; } this.ebullets=this.ebullets.filter(q=>q.x>-30&&q.x<830&&q.y>-30&&q.y<630);
    for(const q of [...this.pbullets]) if(Math.hypot(q.x-b.x,q.y-b.y)<34){ this.pbullets.splice(this.pbullets.indexOf(q),1); b.hp-=3; this.score+=8; if(b.hp<=0){ if(this.level>=3){ this.rewardWin('Final pattern broken','Danmaku Lotus Medal',2500); return; } this.level++; b.hp=230+this.level*90; this.ebullets=[]; AudioEngine.play('success'); } }
    for(const q of [...this.ebullets]){ const d=Math.hypot(q.x-p.x,q.y-p.y); if(d<20&&d>p.r+q.r&&!q.g){ q.g=true; this.graze++; this.score+=3; } if(p.inv<=0&&d<p.r+q.r){ this.lives--; p.inv=1.4; this.ebullets.splice(this.ebullets.indexOf(q),1); AudioEngine.play('failure'); if(this.lives<=0)this.gameOver('Hitbox overwhelmed'); break; } }
    this.updateHUD({Stage:`${this.level}/3`,BossHP:Math.max(0,Math.floor(b.hp)),Graze:this.graze,Bombs:p.bombs,Goal:'Defeat stage 3 boss',Reward:'Danmaku Lotus Medal'});
  }
  draw(){
    const c=this.ctx; c.fillStyle='rgba(4,8,20,.5)'; c.fillRect(0,0,800,600); c.fillStyle='#b47cff'; c.beginPath(); c.arc(this.boss.x,this.boss.y,32,0,Math.PI*2); c.fill(); c.fillStyle='#fff'; c.fillRect(this.boss.x-50,this.boss.y-47,100*(this.boss.hp/(230+this.level*90)),6);
    c.fillStyle='#18e0ff'; for(const q of this.pbullets)c.fillRect(q.x-2,q.y-10,4,14);
    for(const q of this.ebullets){ c.fillStyle=q.g?'#ffd166':'#ff4d6d'; c.beginPath(); c.arc(q.x,q.y,q.r,0,Math.PI*2); c.fill(); }
    const p=this.player; c.strokeStyle='#fff'; c.lineWidth=2; c.beginPath(); c.moveTo(p.x,p.y-16); c.lineTo(p.x-12,p.y+12); c.lineTo(p.x+12,p.y+12); c.closePath(); c.stroke(); c.fillStyle=this.input.isPressed('secondary')?'#36e28f':'#fff'; c.beginPath(); c.arc(p.x,p.y,p.r,0,Math.PI*2); c.fill();
  }
}
window.currentGame=new DanmakuZero(); window.currentGame.start();
