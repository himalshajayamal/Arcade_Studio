
class ChromaticFlow extends BaseGame{
  constructor(){ super('chromatic-flow','Chromatic Flow'); this.canvas.addEventListener('pointerdown',e=>this.pick(e)); }
  rewardWin(message,reward,bonus=650){ if(this.over) return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-chromatic-flow','Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }
  reset(){
    this.cell=76; this.ox=210; this.oy=88; this.score=0; this.level=1; this.lives=3;
    this.colors={A:'#18e0ff',B:'#ff4d6d',C:'#36e28f',D:'#ffd166',E:'#b47cff'};
    this.paths={A:[[0,0],[1,0],[2,0],[2,1]],B:[[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],C:[[0,1],[1,1],[1,2],[0,2],[0,3],[0,4]],D:[[3,1],[3,2],[3,3],[3,4],[2,4],[1,4]],E:[[2,2],[2,3],[1,3]]};
    this.progress={A:1,B:1,C:1,D:1,E:1}; this.grid={}; for(const k of Object.keys(this.paths)){ const [x,y]=this.paths[k][0]; this.grid[x+','+y]=k; }
    this.active=null; this.endpoints={}; for(const k of Object.keys(this.paths)){ const p=this.paths[k]; this.endpoints[p[0].join(',')]=k; this.endpoints[p[p.length-1].join(',')]=k; }
  }
  pick(e){
    if(this.over||this.paused) return; const p=this.pointer(e), x=Math.floor((p.x-this.ox)/this.cell), y=Math.floor((p.y-this.oy)/this.cell); if(x<0||y<0||x>=5||y>=5) return; const key=x+','+y;
    if(this.endpoints[key]){ this.active=this.endpoints[key]; AudioEngine.play('click'); return; }
    if(!this.active) return; const path=this.paths[this.active], idx=this.progress[this.active], want=path[idx]; if(want&&want[0]===x&&want[1]===y){ this.grid[key]=this.active; this.progress[this.active]++; this.score+=20; AudioEngine.play('click'); } else { this.score=Math.max(0,this.score-10); AudioEngine.play('warning'); }
  }
  update(){
    let filled=Object.keys(this.grid).length; this.updateHUD({Filled:`${filled}/25`,Active:this.active||'pick dot',Goal:'Connect and fill grid',Reward:'Liquid Flow Ribbon'});
    if(filled===25) this.rewardWin('Every cell is flowing','Liquid Flow Ribbon',850);
  }
  draw(){
    const c=this.ctx; c.fillStyle='#061020'; c.fillRect(0,0,800,600); c.fillStyle='#cbd7ff'; c.font='16px system-ui'; c.fillText('Click a colored dot, then extend it along the hidden no-crossing path until the grid is full.',82,48);
    for(let y=0;y<5;y++)for(let x=0;x<5;x++){ const px=this.ox+x*this.cell, py=this.oy+y*this.cell, k=x+','+y, col=this.grid[k]; c.fillStyle=col?this.colors[col]:'#152033'; c.globalAlpha=col?.95:1; c.fillRect(px+3,py+3,this.cell-6,this.cell-6); c.globalAlpha=1; c.strokeStyle='#30405c'; c.strokeRect(px,py,this.cell,this.cell); if(this.endpoints[k]){ c.fillStyle='#fff'; c.beginPath(); c.arc(px+this.cell/2,py+this.cell/2,18,0,Math.PI*2); c.fill(); c.fillStyle=this.colors[this.endpoints[k]]; c.beginPath(); c.arc(px+this.cell/2,py+this.cell/2,12,0,Math.PI*2); c.fill(); } }
    c.strokeStyle='#fff'; c.lineWidth=4; if(this.active){ for(const id of Object.keys(this.paths)){ const p=this.paths[id].slice(0,this.progress[id]); c.strokeStyle=this.colors[id]; c.beginPath(); p.forEach(([x,y],i)=>{ const px=this.ox+x*this.cell+this.cell/2, py=this.oy+y*this.cell+this.cell/2; i?c.lineTo(px,py):c.moveTo(px,py); }); c.stroke(); } }
  }
}
window.currentGame=new ChromaticFlow(); window.currentGame.start();
