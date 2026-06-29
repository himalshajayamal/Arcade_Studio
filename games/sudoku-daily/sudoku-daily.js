class SudokuDaily extends BaseGame{
  rewardWin(message, reward, bonus=250){
    if(this.over) return;
    this.score += bonus;
    StorageManager.saveAchievement(this.gameId, 'reward-'+reward.toLowerCase().replace(/[^a-z0-9]+/g,'-'), 'Reward: '+reward);
    AudioEngine.play('reward');
    this.win(message + ' — Reward: ' + reward);
  }

  reset(){
    // A deliberately open 4x4 puzzle. Any complete grid obeying Sudoku rules wins.
    this.grid=[[1,0,0,4],[0,4,1,0],[0,1,4,0],[4,0,0,1]];
    this.fixed=this.grid.map(r=>r.map(Boolean));
    this.cell=92; this.off={x:216,y:110}; this.sel={x:0,y:0};
    this.score=0; this.errors=0;
    if(!this.boundControls){
      this.boundControls=true;
      this.canvas.addEventListener('pointerdown',e=>this.pick(e));
      window.addEventListener('keydown',e=>{
        if(this.over || this.paused) return;
        if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)){
          const dx=e.code==='ArrowLeft'?-1:e.code==='ArrowRight'?1:0;
          const dy=e.code==='ArrowUp'?-1:e.code==='ArrowDown'?1:0;
          this.sel={x:Utils.clamp(this.sel.x+dx,0,3),y:Utils.clamp(this.sel.y+dy,0,3)};
        }
        if(/[1-4]/.test(e.key)) this.place(Number(e.key));
        if(e.key==='Backspace'||e.key==='Delete'||e.key==='0') this.clearCell();
      });
    }
  }

  pick(e){
    let p=this.pointer(e),x=Math.floor((p.x-this.off.x)/this.cell),y=Math.floor((p.y-this.off.y)/this.cell);
    if(x>=0&&y>=0&&x<4&&y<4){
      this.sel={x,y};
      // Touch-friendly: tapping an editable cell cycles 1-4.
      if(!this.fixed[y][x]) this.place((this.grid[y][x]%4)+1);
    }
  }

  clearCell(){
    const {x,y}=this.sel;
    if(!this.fixed[y][x]){ this.grid[y][x]=0; AudioEngine.play('click'); }
  }

  place(n){
    const {x,y}=this.sel;
    if(this.fixed[y][x]) { AudioEngine.play('warning'); return; }
    this.grid[y][x]=n;
    if(this.valid()) { this.score=Math.max(0,this.score+5); AudioEngine.play('click'); }
    else { this.errors++; this.score=Math.max(0,this.score-10); AudioEngine.play('failure'); }
  }

  unitValid(values, requireComplete=false){
    const seen=new Set();
    for(const v of values){
      if(!v){ if(requireComplete) return false; else continue; }
      if(v<1||v>4||seen.has(v)) return false;
      seen.add(v);
    }
    return !requireComplete || seen.size===4;
  }

  valid(requireComplete=false){
    for(let i=0;i<4;i++){
      if(!this.unitValid(this.grid[i], requireComplete)) return false;
      if(!this.unitValid(this.grid.map(row=>row[i]), requireComplete)) return false;
    }
    for(let by=0;by<4;by+=2) for(let bx=0;bx<4;bx+=2){
      const box=[];
      for(let y=0;y<2;y++) for(let x=0;x<2;x++) box.push(this.grid[by+y][bx+x]);
      if(!this.unitValid(box, requireComplete)) return false;
    }
    return true;
  }

  update(){
    const complete=this.grid.flat().every(Boolean);
    const clean=this.valid(false);
    if(complete && this.valid(true)){
      this.score=Math.max(this.score,500-this.errors*25);
      this.rewardWin('Sudoku Complete', 'Logic Grid Badge');
      return;
    }
    this.updateHUD({Status:clean?'Clean':'Conflict',Errors:this.errors,Goal:'Fill valid 4x4 grid',Reward:'Logic Grid Badge'});
  }

  draw(){
    let c=this.ctx;
    c.font='42px sans-serif'; c.textAlign='center'; c.textBaseline='middle';
    for(let y=0;y<4;y++) for(let x=0;x<4;x++){
      c.fillStyle=this.sel.x===x&&this.sel.y===y?'rgba(255,209,102,.25)':(this.fixed[y][x]?'rgba(24,224,255,.18)':'rgba(255,255,255,.08)');
      c.fillRect(this.off.x+x*this.cell,this.off.y+y*this.cell,this.cell-4,this.cell-4);
      c.fillStyle=this.fixed[y][x]?'#fff':'#ffd166';
      if(this.grid[y][x]) c.fillText(this.grid[y][x],this.off.x+x*this.cell+46,this.off.y+y*this.cell+46);
    }
    c.strokeStyle='#fff'; c.lineWidth=4; c.strokeRect(this.off.x,this.off.y,this.cell*4,this.cell*4);
    c.beginPath();
    c.moveTo(this.off.x+this.cell*2,this.off.y); c.lineTo(this.off.x+this.cell*2,this.off.y+this.cell*4);
    c.moveTo(this.off.x,this.off.y+this.cell*2); c.lineTo(this.off.x+this.cell*4,this.off.y+this.cell*2);
    c.stroke();
    c.font='16px sans-serif'; c.textAlign='left'; c.fillStyle='#c7d2fe';
    c.fillText('Keys 1-4 fill, Backspace clears. Any valid completed Sudoku wins.',110,520);
  }
}
document.addEventListener('DOMContentLoaded',()=>{window.currentGame=new SudokuDaily('sudoku-daily','Sudoku Daily');window.currentGame.start();});
