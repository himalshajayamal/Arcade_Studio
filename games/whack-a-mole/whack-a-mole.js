class WhackAMoleGame extends BaseGame {
  constructor(){ super('whack-a-mole','Whack-a-Mole Extreme'); this.canvas.addEventListener('pointerdown', e=>this.click(e)); }
  reset(){ this.holes=Array.from({length:9},(_,i)=>({x:220+(i%3)*150,y:130+Math.floor(i/3)*115,active:false,time:0})); this.timer=45; this.spawn=0; }
  click(e){ if(this.over||this.paused) return; const p=this.pointer(e); for(const h of this.holes){ if(Math.hypot(p.x-h.x,p.y-h.y)<42){ if(h.active){ h.active=false; this.score+=20; this.particles.push(...Utils.makeParticles(h.x,h.y,12,'#ffd166')); AudioEngine.play('coin'); } else { this.score=Math.max(0,this.score-5); AudioEngine.play('failure'); } } } }
  update(dt){ this.timer-=dt; this.spawn-=dt; if(this.spawn<=0){ this.spawn=.45+Math.random()*.45; const h=Utils.choice(this.holes); h.active=true; h.time=.75+Math.random()*.6; } for(const h of this.holes){ if(h.active){ h.time-=dt; if(h.time<=0) h.active=false; } } if(this.timer<=0) this.gameOver('Time is up'); this.level=Math.floor(this.score/160)+1; this.updateHUD({TimeLeft:Math.ceil(this.timer)}); }
  draw(){ const c=this.ctx; c.fillStyle='rgba(255,255,255,.07)'; c.fillRect(160,80,480,420); for(const h of this.holes){ c.fillStyle='#25180d'; c.beginPath(); c.ellipse(h.x,h.y+20,55,22,0,0,Math.PI*2); c.fill(); if(h.active){ c.fillStyle='#a56b34'; c.beginPath(); c.arc(h.x,h.y,34,0,Math.PI*2); c.fill(); c.fillStyle='#111'; c.fillRect(h.x-12,h.y-8,6,6); c.fillRect(h.x+8,h.y-8,6,6); } } }
}
window.currentGame = new WhackAMoleGame(); window.addEventListener('DOMContentLoaded', () => currentGame.start());
