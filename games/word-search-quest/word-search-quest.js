class WordSearchQuest extends BaseGame{
  rewardWin(message, reward, bonus=250){
    if(this.over) return;
    this.score += bonus;
    StorageManager.saveAchievement(this.gameId, 'reward-'+reward.toLowerCase().replace(/[^a-z0-9]+/g,'-'), 'Reward: '+reward);
    AudioEngine.play('reward');
    this.win(message + ' — Reward: ' + reward);
  }

  reset(){
    this.words=['CODE','GAME','PIXEL','HTML'];
    this.grid=['C O D E X P I X E L','A R C A D E Q Z Y X','G A M E T O U C H W','H T M L J S C S S V','P L A Y E R N E O N','B R O W S E R A I M','S C O R E L E V E L','T I L E S M A T C H'].map(r=>r.split(' '));
    this.cell=54; this.off={x:130,y:78};
    this.startCell=null; this.hoverCell=null; this.found=new Set(); this.paths={}; this.score=0;
    if(!this.boundControls){
      this.boundControls=true;
      this.canvas.addEventListener('pointerdown',e=>{this.startCell=this.cellAt(e);this.hoverCell=this.startCell;});
      this.canvas.addEventListener('pointermove',e=>{if(this.startCell)this.hoverCell=this.cellAt(e);});
      this.canvas.addEventListener('pointerup',e=>{const end=this.cellAt(e); if(this.startCell) this.check(this.startCell,end); this.startCell=null; this.hoverCell=null;});
      this.canvas.addEventListener('pointerleave',()=>{this.startCell=null;this.hoverCell=null;});
    }
  }

  cellAt(e){
    let p=this.pointer(e);
    return {x:Math.floor((p.x-this.off.x)/this.cell),y:Math.floor((p.y-this.off.y)/this.cell)};
  }

  inBounds(cell){ return cell && cell.x>=0 && cell.y>=0 && cell.y<this.grid.length && cell.x<this.grid[0].length; }

  makePath(a,b){
    if(!this.inBounds(a)||!this.inBounds(b)) return null;
    let dx=Math.sign(b.x-a.x), dy=Math.sign(b.y-a.y);
    const ax=Math.abs(b.x-a.x), ay=Math.abs(b.y-a.y);
    if(!(ax===0 || ay===0 || ax===ay)) return null;
    if(dx===0 && dy===0) return null;
    let x=a.x,y=a.y,s='',cells=[];
    while(true){
      if(x<0||y<0||y>=this.grid.length||x>=this.grid[0].length) return null;
      s+=this.grid[y][x]; cells.push({x,y});
      if(x===b.x&&y===b.y) break;
      x+=dx; y+=dy;
    }
    return {text:s, reverse:s.split('').reverse().join(''), cells};
  }

  check(a,b){
    const path=this.makePath(a,b);
    if(!path){ AudioEngine.play('failure'); return; }
    for(const w of this.words){
      if(path.text===w || path.reverse===w){
        if(!this.found.has(w)){
          this.found.add(w); this.paths[w]=path.cells; this.score+=150; AudioEngine.play('success');
        } else AudioEngine.play('click');
        return;
      }
    }
    AudioEngine.play('failure');
  }

  cellIsFound(x,y){ return Object.values(this.paths).some(path=>path.some(c=>c.x===x&&c.y===y)); }
  cellIsPreview(x,y){ const p=this.startCell&&this.hoverCell?this.makePath(this.startCell,this.hoverCell):null; return p ? p.cells.some(c=>c.x===x&&c.y===y) : false; }

  update(){
    if(this.found.size===this.words.length){
      this.rewardWin('All Words Found', 'Word Hunter Ribbon', 900);
      return;
    }
    this.updateHUD({Found:this.found.size+'/'+this.words.length,Goal:'Find all words',Reward:'Word Hunter Ribbon'});
  }

  draw(){
    let c=this.ctx;
    c.font='30px monospace'; c.textAlign='center'; c.textBaseline='middle';
    for(let y=0;y<this.grid.length;y++) for(let x=0;x<this.grid[y].length;x++){
      const found=this.cellIsFound(x,y), preview=this.cellIsPreview(x,y);
      c.fillStyle=found?'rgba(54,226,143,.38)':preview?'rgba(255,209,102,.28)':'rgba(255,255,255,.08)';
      c.fillRect(this.off.x+x*this.cell+3,this.off.y+y*this.cell+3,this.cell-6,this.cell-6);
      c.fillStyle=found?'#ffffff':'#e5e7eb';
      c.fillText(this.grid[y][x],this.off.x+x*this.cell+27,this.off.y+y*this.cell+27);
    }
    c.textAlign='left'; c.font='22px sans-serif'; c.fillStyle='#fff';
    c.fillText('Words: '+this.words.map(w=>this.found.has(w)?'✓'+w:w).join('  '),80,555);
    c.font='16px sans-serif'; c.fillStyle='#c7d2fe';
    c.fillText('Drag or click from the first letter to the last letter in a straight line.',80,580);
  }
}
document.addEventListener('DOMContentLoaded',()=>{window.currentGame=new WordSearchQuest('word-search-quest','Word Search Quest');window.currentGame.start();});
