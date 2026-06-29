class CrosswordMini extends BaseGame{
  rewardWin(message, reward, bonus=250){ if(this.over) return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-'+reward.toLowerCase().replace(/[^a-z0-9]+/g,'-'),'Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }

  reset(){
    this.grid=[['B','A','L','L'],['A','R','E','A'],['L','E','A','D'],['L','A','D','Y']];
    this.user=this.grid.map(r=>r.map(()=>''));
    this.givens=new Set(['0,0','3,0','0,3']);
    for(const k of this.givens){const [x,y]=k.split(',').map(Number);this.user[y][x]=this.grid[y][x];}
    this.cell=86; this.off={x:228,y:118}; this.sel={x:0,y:0}; this.score=0; this.errors=0;
    if(!this.boundControls){
      this.boundControls=true; this.canvas.addEventListener('pointerdown',e=>this.pick(e));
      window.addEventListener('keydown',e=>{
        if(this.over||this.paused) return;
        if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)){
          const dx=e.code==='ArrowLeft'?-1:e.code==='ArrowRight'?1:0, dy=e.code==='ArrowUp'?-1:e.code==='ArrowDown'?1:0;
          this.sel={x:Utils.clamp(this.sel.x+dx,0,3),y:Utils.clamp(this.sel.y+dy,0,3)};
        }
        if(/^[a-zA-Z]$/.test(e.key)) this.type(e.key.toUpperCase());
        if(e.key==='Backspace'||e.key==='Delete') this.clear();
      });
    }
  }
  key(x=this.sel.x,y=this.sel.y){return x+','+y;}
  pick(e){let p=this.pointer(e),x=Math.floor((p.x-this.off.x)/this.cell),y=Math.floor((p.y-this.off.y)/this.cell);if(x>=0&&y>=0&&x<4&&y<4){this.sel={x,y};AudioEngine.play('click');}}
  clear(){let {x,y}=this.sel;if(!this.givens.has(this.key(x,y))){this.user[y][x]='';AudioEngine.play('click');}}
  type(ch){let {x,y}=this.sel;if(this.givens.has(this.key(x,y))){AudioEngine.play('warning');return;}this.user[y][x]=ch;if(ch===this.grid[y][x]){this.score+=10;AudioEngine.play('click');}else{this.errors++;this.score=Math.max(0,this.score-5);AudioEngine.play('failure');}this.sel={x:(x+1)%4,y:y+(x===3?1:0)};if(this.sel.y>3)this.sel={x:3,y:3};}
  status(){let filled=true,ok=true;for(let y=0;y<4;y++)for(let x=0;x<4;x++){if(!this.user[y][x])filled=false;if(this.user[y][x]&&this.user[y][x]!==this.grid[y][x])ok=false;}return {filled,ok};}
  update(){let st=this.status();if(st.filled&&st.ok){this.score=Math.max(this.score,900-this.errors*30);this.rewardWin('Crossword Solved','Crossword Solver Pen',700);return;}this.updateHUD({Status:st.ok?'Valid':'Check letters',Errors:this.errors,Goal:'Complete word square',Reward:'Crossword Solver Pen'});}
  draw(){let c=this.ctx;c.font='38px sans-serif';c.textAlign='center';c.textBaseline='middle';for(let y=0;y<4;y++)for(let x=0;x<4;x++){let px=this.off.x+x*this.cell,py=this.off.y+y*this.cell;let given=this.givens.has(this.key(x,y));c.fillStyle=this.sel.x===x&&this.sel.y===y?'rgba(255,209,102,.3)':given?'rgba(24,224,255,.18)':'rgba(255,255,255,.1)';c.fillRect(px,py,this.cell-4,this.cell-4);c.fillStyle=given?'#fff':'#ffd166';c.fillText(this.user[y][x]||'',px+43,py+43);}c.font='18px sans-serif';c.textAlign='left';c.fillStyle='#ffd166';c.fillText('Word square clues: BALL, AREA, LEAD, LADY (rows and columns).',80,520);c.fillStyle='#c7d2fe';c.fillText('Type letters, use arrows to move, Backspace clears non-given cells.',80,548);}
}
document.addEventListener('DOMContentLoaded',()=>{window.currentGame=new CrosswordMini('crossword-mini','Crossword Mini');window.currentGame.start();});
