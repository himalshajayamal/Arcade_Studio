
class PixelOracle extends BaseGame{
  constructor(){ super('pixel-oracle','Pixel Oracle'); this.canvas.addEventListener('pointerdown',e=>this.pick(e)); }
  rewardWin(message,reward,bonus=800){ if(this.over)return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-pixel-oracle','Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }
  reset(){
    this.solution=[
      '0011110000','0111111000','1111111100','1111111110','1111111110','0111111100','0011111000','0001110000','0000100000','0001110000'
    ].map(r=>r.split('').map(Number));
    this.n=10; this.cell=38; this.ox=285; this.oy=115; this.state=Array.from({length:this.n},()=>Array(this.n).fill(0)); this.score=0; this.lives=3; this.rowClues=this.solution.map(r=>this.clue(r)); this.colClues=Array.from({length:this.n},(_,x)=>this.clue(this.solution.map(r=>r[x])));
  }
  clue(arr){ const out=[]; let c=0; for(const v of arr){ if(v)c++; else if(c){out.push(c); c=0;} } if(c)out.push(c); return out.length?out:[0]; }
  pick(e){ if(this.over||this.paused)return; const p=this.pointer(e), x=Math.floor((p.x-this.ox)/this.cell), y=Math.floor((p.y-this.oy)/this.cell); if(x<0||y<0||x>=this.n||y>=this.n)return; this.state[y][x]=(this.state[y][x]+1)%3; const filled=this.state[y][x]===1; if(filled&&this.solution[y][x]){ this.score+=10; AudioEngine.play('click'); } else if(filled&&!this.solution[y][x]){ this.lives--; AudioEngine.play('failure'); if(this.lives<=0)this.gameOver('Oracle image corrupted'); } else AudioEngine.play('click'); }
  solved(){ for(let y=0;y<this.n;y++)for(let x=0;x<this.n;x++) if((this.state[y][x]===1?1:0)!==this.solution[y][x]) return false; return true; }
  update(){ let good=0,bad=0; for(let y=0;y<this.n;y++)for(let x=0;x<this.n;x++){ if(this.state[y][x]===1&&this.solution[y][x])good++; if(this.state[y][x]===1&&!this.solution[y][x])bad++; } this.updateHUD({Filled:good,Wrong:bad,Goal:'Reveal pixel art',Reward:'Oracle Pixel Seal'}); if(this.solved())this.rewardWin('Hidden image revealed','Oracle Pixel Seal',1000); }
  draw(){ const c=this.ctx; c.fillStyle='#061020'; c.fillRect(0,0,800,600); c.fillStyle='#cbd7ff'; c.font='16px system-ui'; c.fillText('Nonogram: use row/column clues to fill the hidden pixel art. Click cycles fill → X → empty.',88,54);
    c.font='13px monospace'; c.fillStyle='#ffd166'; for(let y=0;y<this.n;y++) c.fillText(this.rowClues[y].join(' '),210-this.rowClues[y].join(' ').length*7,this.oy+y*this.cell+24); for(let x=0;x<this.n;x++){ const txt=this.colClues[x].join('/'); c.fillText(txt,this.ox+x*this.cell+6,this.oy-16); }
    for(let y=0;y<this.n;y++)for(let x=0;x<this.n;x++){ const px=this.ox+x*this.cell,py=this.oy+y*this.cell; c.fillStyle=this.state[y][x]===1?'#18e0ff':this.state[y][x]===2?'#1e293b':'#e9f2ff'; c.fillRect(px,py,this.cell-2,this.cell-2); c.strokeStyle='#0b1324'; c.strokeRect(px,py,this.cell,this.cell); if(this.state[y][x]===2){ c.strokeStyle='#ff4d6d'; c.beginPath(); c.moveTo(px+8,py+8); c.lineTo(px+this.cell-10,py+this.cell-10); c.moveTo(px+this.cell-10,py+8); c.lineTo(px+8,py+this.cell-10); c.stroke(); } }
  }
}
window.currentGame=new PixelOracle(); window.currentGame.start();
