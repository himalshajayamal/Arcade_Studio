class DartsArcade extends BaseGame{
  rewardWin(message, reward, bonus=250){ if(this.over) return; this.score += bonus; StorageManager.saveAchievement(this.gameId, 'reward-'+reward.toLowerCase().replace(/[^a-z0-9]+/g,'-'), 'Reward: '+reward); this.win(message + ' — Reward: ' + reward); }

 reset(){this.center={x:400,y:300};this.ret={x:400,y:300};this.throws=12;this.score=0;this.phase=0;}
 handleAction(a){if(a==='action'&&this.throws>0){let d=Math.hypot(this.ret.x-400,this.ret.y-300),pts=d<18?100:d<55?60:d<105?25:d<150?10:0;this.score+=pts;this.throws--;this.particles.push(...Utils.makeParticles(this.ret.x,this.ret.y,12,pts?'#ffd166':'#ff4d6d'));AudioEngine.play(pts?'success':'failure');}}
 update(dt){this.phase+=dt;let r=120+Math.sin(this.phase*1.7)*40;this.ret.x=400+Math.cos(this.phase*2.2)*r;this.ret.y=300+Math.sin(this.phase*2.9)*r*.85;if(this.throws<=0){this.score>=420?this.rewardWin('Darts Champion', 'Darts Champion Badge'):this.gameOver('Round Complete');}this.updateHUD({Throws:this.throws,Goal:'420 pts',Reward:'Darts Champion Badge'});}
 draw(){let c=this.ctx;for(let r of [170,125,80,35]){c.fillStyle=r===35?'#ffd166':r===80?'#ff4d6d':r===125?'#111827':'#18e0ff';c.beginPath();c.arc(400,300,r,0,7);c.fill();}c.strokeStyle='#fff';for(let i=0;i<20;i++){let a=i/20*Math.PI*2;c.beginPath();c.moveTo(400,300);c.lineTo(400+Math.cos(a)*170,300+Math.sin(a)*170);c.stroke();}c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.moveTo(this.ret.x-14,this.ret.y);c.lineTo(this.ret.x+14,this.ret.y);c.moveTo(this.ret.x,this.ret.y-14);c.lineTo(this.ret.x,this.ret.y+14);c.stroke();}
}
document.addEventListener('DOMContentLoaded',()=>{window.currentGame=new DartsArcade('darts-arcade','Darts Arcade');window.currentGame.start();});
