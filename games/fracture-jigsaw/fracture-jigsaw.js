
class FractureJigsaw extends BaseGame {
  constructor(){ super('fracture-jigsaw','Fracture Jigsaw'); this.bindPointer(); }
  rewardWin(message, reward, bonus=800){ if(this.over) return; this.score += bonus; StorageManager.saveAchievement(this.gameId,'reward-fracture-finisher','Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }
  bindPointer(){
    this.canvas.addEventListener('pointerdown', e=>{ const p=this.pointer(e); this.canvas.focus?.(); for(let i=this.pieces.length-1;i>=0;i--){ const q=this.pieces[i]; if(!q.locked && Math.abs(p.x-q.x)<this.size/2 && Math.abs(p.y-q.y)<this.size/2){ this.drag=q; this.drag.dx=p.x-q.x; this.drag.dy=p.y-q.y; this.selected=q; AudioEngine.play('click'); break; } } });
    this.canvas.addEventListener('pointermove', e=>{ if(!this.drag||this.paused||this.over) return; const p=this.pointer(e); this.drag.x=p.x-this.drag.dx; this.drag.y=p.y-this.drag.dy; });
    window.addEventListener('pointerup', ()=>{ if(this.drag){ this.trySnap(this.drag); this.drag=null; } });
  }
  reset(){
    this.n=4; this.size=86; this.board={x:400,y:118,w:this.n*this.size,h:this.n*this.size}; this.score=0; this.lives=3; this.level=1; this.selected=null; this.drag=null;
    this.image=document.createElement('canvas'); this.image.width=this.board.w; this.image.height=this.board.h; const g=this.image.getContext('2d');
    const grad=g.createLinearGradient(0,0,this.board.w,this.board.h); grad.addColorStop(0,'#1ce1ff'); grad.addColorStop(.45,'#7c5cff'); grad.addColorStop(1,'#ffd166'); g.fillStyle=grad; g.fillRect(0,0,this.board.w,this.board.h);
    for(let i=0;i<22;i++){ g.globalAlpha=.35; g.fillStyle=['#fff','#071020','#36e28f','#ff4d6d'][i%4]; g.beginPath(); g.arc((i*67)%this.board.w,(i*43)%this.board.h,22+(i%5)*7,0,Math.PI*2); g.fill(); }
    g.globalAlpha=.9; g.fillStyle='#061020'; g.font='bold 48px system-ui'; g.fillText('FRACTURE',34,185); g.font='18px system-ui'; g.fillText('magnetic puzzle lock',78,216);
    this.pieces=[]; let order=[]; for(let y=0;y<this.n;y++)for(let x=0;x<this.n;x++) order.push({gx:x,gy:y}); order.sort(()=>Math.random()-.5);
    order.forEach((o,i)=>{ const col=i%3,row=Math.floor(i/3); this.pieces.push({gx:o.gx,gy:o.gy,x:80+col*100+Math.random()*24,y:80+row*78+Math.random()*22,rot:Math.floor(Math.random()*4),locked:false}); });
    this.updateHUD({Locked:'0/16',Goal:'Assemble image',Reward:'Fracture Master Frame'});
  }
  handleAction(a){ if(a==='secondary' && this.selected && !this.selected.locked){ this.selected.rot=(this.selected.rot+1)%4; AudioEngine.play('click'); this.trySnap(this.selected); } }
  trySnap(p){
    const tx=this.board.x+p.gx*this.size+this.size/2, ty=this.board.y+p.gy*this.size+this.size/2;
    const d=Math.hypot(p.x-tx,p.y-ty);
    if(d<28 && p.rot%4===0){ p.x=tx; p.y=ty; p.locked=true; this.score+=75; this.particles.push(...Utils.makeParticles(tx,ty,16,'#36e28f')); AudioEngine.play('success'); }
    else if(d<28){ AudioEngine.play('warning'); }
  }
  update(){ const locked=this.pieces.filter(p=>p.locked).length; this.updateHUD({Locked:`${locked}/16`,Goal:'Assemble image',Reward:'Fracture Master Frame'}); if(locked===this.pieces.length) this.rewardWin('Photo restored', 'Fracture Master Frame', 1200); }
  draw(){
    const c=this.ctx; c.fillStyle='#071020'; c.fillRect(0,0,800,600);
    c.fillStyle='#9fb3ff'; c.font='bold 18px system-ui'; c.fillText('Drag pieces from the tray. Alt / K rotates selected piece.',42,42);
    c.globalAlpha=.22; c.drawImage(this.image,this.board.x,this.board.y); c.globalAlpha=1; c.strokeStyle='#18e0ff'; c.lineWidth=3; c.strokeRect(this.board.x,this.board.y,this.board.w,this.board.h);
    c.strokeStyle='rgba(255,255,255,.12)'; for(let i=1;i<this.n;i++){ c.beginPath(); c.moveTo(this.board.x+i*this.size,this.board.y); c.lineTo(this.board.x+i*this.size,this.board.y+this.board.h); c.moveTo(this.board.x,this.board.y+i*this.size); c.lineTo(this.board.x+this.board.w,this.board.y+i*this.size); c.stroke(); }
    for(const p of this.pieces){ c.save(); c.translate(p.x,p.y); c.rotate(p.rot*Math.PI/2); c.shadowBlur=p.locked?18:10; c.shadowColor=p.locked?'#36e28f':'#18e0ff'; c.drawImage(this.image,p.gx*this.size,p.gy*this.size,this.size,this.size,-this.size/2,-this.size/2,this.size,this.size); c.strokeStyle=p.locked?'#36e28f':'#ffffff'; c.lineWidth=p.locked?3:1.5; c.strokeRect(-this.size/2,-this.size/2,this.size,this.size); c.restore(); }
  }
}
window.currentGame=new FractureJigsaw(); window.currentGame.start();
