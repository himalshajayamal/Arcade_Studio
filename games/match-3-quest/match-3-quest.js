class Match3Quest extends BaseGame{
  rewardWin(message, reward, bonus=250){ if(this.over) return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-'+reward.toLowerCase().replace(/[^a-z0-9]+/g,'-'),'Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }

  reset(){
    this.n=8; this.cell=58; this.off={x:168,y:60}; this.gems=['💎','🔥','⭐','🌙','🍀','⚡']; this.sel=null; this.score=0; this.moves=30; this.goal=1800;
    this.board=this.makeBoard();
    if(!this.boundControls){this.boundControls=true;this.canvas.addEventListener('pointerdown',e=>this.pick(e));}
  }
  makeBoard(){
    let b;
    do{
      b=Array.from({length:this.n},()=>Array.from({length:this.n},()=>Utils.choice(this.gems)));
      this.board=b; this.resolve(false);
    }while(!this.hasMove());
    return b;
  }
  pick(e){
    if(this.over||this.paused)return;
    let p=this.pointer(e),x=Math.floor((p.x-this.off.x)/this.cell),y=Math.floor((p.y-this.off.y)/this.cell);
    if(x<0||y<0||x>=this.n||y>=this.n)return;
    if(!this.sel){this.sel={x,y}; AudioEngine.play('click'); return;}
    let dx=Math.abs(this.sel.x-x),dy=Math.abs(this.sel.y-y);
    if(dx+dy===1){
      this.swap(this.sel.x,this.sel.y,x,y);
      if(!this.resolve(true)){
        this.swap(this.sel.x,this.sel.y,x,y); AudioEngine.play('failure');
      }else{
        this.moves--; AudioEngine.play('success');
        if(!this.hasMove()) this.shuffleUntilMove();
      }
    } else AudioEngine.play('click');
    this.sel=null;
  }
  swap(x1,y1,x2,y2){ [this.board[y1][x1],this.board[y2][x2]]=[this.board[y2][x2],this.board[y1][x1]]; }
  findMatches(b=this.board){
    const mark=new Set();
    for(let y=0;y<this.n;y++) for(let x=0;x<this.n;x++){
      let v=b[y][x]; if(!v) continue;
      if(x<=this.n-3&&b[y][x+1]===v&&b[y][x+2]===v){mark.add(x+','+y);mark.add((x+1)+','+y);mark.add((x+2)+','+y);}
      if(y<=this.n-3&&b[y+1][x]===v&&b[y+2][x]===v){mark.add(x+','+y);mark.add(x+','+(y+1));mark.add(x+','+(y+2));}
    }
    return mark;
  }
  resolve(scoreIt=true){
    let found=false, safety=0;
    while(safety++<20){
      let mark=this.findMatches(); if(!mark.size) break;
      found=true; if(scoreIt) this.score+=mark.size*25;
      for(const k of mark){let [x,y]=k.split(',').map(Number);this.board[y][x]=null;}
      for(let x=0;x<this.n;x++){
        let col=[]; for(let y=this.n-1;y>=0;y--) if(this.board[y][x]) col.push(this.board[y][x]);
        for(let y=this.n-1;y>=0;y--) this.board[y][x]=col[this.n-1-y]||Utils.choice(this.gems);
      }
    }
    return found;
  }
  hasMove(){
    for(let y=0;y<this.n;y++) for(let x=0;x<this.n;x++) for(const [dx,dy] of [[1,0],[0,1]]){
      let nx=x+dx,ny=y+dy; if(nx>=this.n||ny>=this.n) continue;
      this.swap(x,y,nx,ny); let ok=this.findMatches().size>0; this.swap(x,y,nx,ny); if(ok) return true;
    }
    return false;
  }
  shuffleUntilMove(){
    const flat=this.board.flat();
    for(let tries=0;tries<30;tries++){
      for(let i=flat.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [flat[i],flat[j]]=[flat[j],flat[i]];}
      this.board=Array.from({length:this.n},(_,y)=>flat.slice(y*this.n,(y+1)*this.n));
      this.resolve(false);
      if(this.hasMove()) return;
    }
    this.board=this.makeBoard();
  }
  update(){
    if(this.score>=this.goal){this.rewardWin('Quest Complete','Gem Quest Trophy',900); return;}
    if(this.moves<=0){this.gameOver('No Moves Left'); return;}
    this.updateHUD({Moves:this.moves,Goal:this.goal,Progress:Math.min(this.goal,Math.floor(this.score))+'/'+this.goal,Reward:'Gem Quest Trophy'});
  }
  draw(){
    let c=this.ctx; c.font='32px serif'; c.textAlign='center'; c.textBaseline='middle';
    for(let y=0;y<this.n;y++) for(let x=0;x<this.n;x++){
      let px=this.off.x+x*this.cell,py=this.off.y+y*this.cell;
      c.fillStyle=(this.sel&&this.sel.x===x&&this.sel.y===y)?'rgba(255,209,102,.28)':'rgba(255,255,255,.08)';
      c.fillRect(px+3,py+3,this.cell-6,this.cell-6); c.fillText(this.board[y][x],px+this.cell/2,py+this.cell/2);
    }
  }
}
document.addEventListener('DOMContentLoaded',()=>{window.currentGame=new Match3Quest('match-3-quest','Match-3 Quest');window.currentGame.start();});
