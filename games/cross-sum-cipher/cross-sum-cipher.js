
class CrossSumCipher extends BaseGame{
  constructor(){ super('cross-sum-cipher','Cross-Sum Cipher'); this.canvas.addEventListener('pointerdown',e=>this.pick(e)); }
  rewardWin(message,reward,bonus=600){ if(this.over) return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-cross-sum','Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }
  reset(){
    this.n=6; this.cell=72; this.ox=184; this.oy=74; this.score=0; this.lives=3;
    this.solution={'1,1':1,'2,1':2,'1,2':3,'2,2':4,'4,1':1,'5,1':5,'4,2':2,'5,2':7};
    this.values={}; this.sel=null;
    this.clues={'1,0':'↓4','2,0':'↓6','0,1':'→3','0,2':'→7','4,0':'↓3','5,0':'↓12','3,1':'→6','3,2':'→9'};
    this.white=new Set(Object.keys(this.solution));
  }
  pick(e){ if(this.over||this.paused) return; const p=this.pointer(e), x=Math.floor((p.x-this.ox)/this.cell), y=Math.floor((p.y-this.oy)/this.cell), k=x+','+y; if(!this.white.has(k)) return; this.sel=k; this.values[k]=((this.values[k]||0)%9)+1; const ok=this.values[k]===this.solution[k]; if(ok){ this.score+=15; AudioEngine.play('click'); } else { this.score=Math.max(0,this.score-5); AudioEngine.play('warning'); } }
  update(){
    let filled=0, wrong=0; for(const k of this.white){ if(this.values[k]) filled++; if(this.values[k]&&this.values[k]!==this.solution[k]) wrong++; }
    this.updateHUD({Filled:`${filled}/8`,Mistakes:wrong,Goal:'Fill all clue sums',Reward:'Cipher Sum Badge'});
    if(filled===this.white.size && wrong===0) this.rewardWin('All cross sums solved','Cipher Sum Badge',800);
  }
  draw(){
    const c=this.ctx; c.fillStyle='#061020'; c.fillRect(0,0,800,600); c.fillStyle='#dbe7ff'; c.font='16px system-ui'; c.fillText('Kakuro rule: each run must add to its clue; digits cannot repeat in the same run.',94,45);
    for(let y=0;y<this.n;y++)for(let x=0;x<this.n;x++){ const k=x+','+y, px=this.ox+x*this.cell, py=this.oy+y*this.cell; if(this.white.has(k)){ c.fillStyle=k===this.sel?'#1e4462':'#e9f2ff'; c.fillRect(px,py,this.cell,this.cell); c.strokeStyle='#0b1324'; c.strokeRect(px,py,this.cell,this.cell); const v=this.values[k]||''; c.fillStyle=(v&&v!==this.solution[k])?'#ff4d6d':'#0f172a'; c.font='bold 34px system-ui'; c.textAlign='center'; c.fillText(v,px+this.cell/2,py+46); } else { c.fillStyle='#101827'; c.fillRect(px,py,this.cell,this.cell); c.strokeStyle='#30394f'; c.strokeRect(px,py,this.cell,this.cell); if(this.clues[k]){ c.fillStyle='#ffd166'; c.font='bold 18px system-ui'; c.textAlign='center'; c.fillText(this.clues[k],px+this.cell/2,py+42); } } }
    c.textAlign='left'; c.font='15px system-ui'; c.fillStyle='#9fb3ff'; c.fillText('Click a white cell to cycle 1–9. Green-free board wins.',190,548);
  }
}
window.currentGame=new CrossSumCipher(); window.currentGame.start();
