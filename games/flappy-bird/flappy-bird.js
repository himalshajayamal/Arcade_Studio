class FlappyBirdGame extends BaseGame {
  constructor(){ super('flappy-bird','Flappy Bird Pro'); }
  reset(){ this.bird={x:175,y:280,vy:0,r:15}; this.pipes=[]; this.pipeTimer=0; this.gravity=980; this.spawnPipe(); }
  handleAction(){ this.bird.vy=-360; AudioEngine.play('jump'); }
  spawnPipe(){ const gap=155; const top=70+Math.random()*300; this.pipes.push({x:830,top, gap, w:70, passed:false}); }
  update(dt){ if(this.input.consumeAction('action')) this.handleAction(); this.bird.vy+=this.gravity*dt; this.bird.y+=this.bird.vy*dt; this.pipeTimer+=dt; if(this.pipeTimer>1.65){ this.pipeTimer=0; this.spawnPipe(); } this.pipes.forEach(p=>p.x-=185*dt); this.pipes=this.pipes.filter(p=>p.x>-90); for(const p of this.pipes){ const inX=this.bird.x+this.bird.r>p.x && this.bird.x-this.bird.r<p.x+p.w; if(inX && (this.bird.y-this.bird.r<p.top || this.bird.y+this.bird.r>p.top+p.gap)) this.gameOver('Bird hit a pipe'); if(!p.passed && p.x+p.w<this.bird.x){ p.passed=true; this.score++; this.level=Math.floor(this.score/6)+1; AudioEngine.play('coin'); } } if(this.bird.y<0||this.bird.y>600) this.gameOver('Bird fell'); this.updateHUD({Pipes:this.pipes.length}); }
  draw(){ const c=this.ctx; c.fillStyle='#0b2a4d'; c.fillRect(0,0,800,600); c.fillStyle='#36e28f'; for(const p of this.pipes){ c.fillRect(p.x,0,p.w,p.top); c.fillRect(p.x,p.top+p.gap,p.w,600-p.top-p.gap); } c.fillStyle='#ffd166'; c.beginPath(); c.arc(this.bird.x,this.bird.y,this.bird.r,0,Math.PI*2); c.fill(); c.fillStyle='#111'; c.fillRect(this.bird.x+6,this.bird.y-7,4,4); }
}
window.currentGame = new FlappyBirdGame(); window.addEventListener('DOMContentLoaded', () => currentGame.start());
