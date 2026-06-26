class BubbleShooterPlus extends BaseGame{
  rewardWin(message, reward, bonus=250){ if(this.over) return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-'+reward.toLowerCase().replace(/[^a-z0-9]+/g,'-'),'Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }

  reset(){
    this.cols=12; this.rows=8; this.cell=44; this.off={x:136,y:40};
    this.colors=['#ff4d6d','#18e0ff','#ffd166','#36e28f','#a78bfa'];
    const R=this.colors[0], B=this.colors[1], Y=this.colors[2], G=this.colors[3], P=this.colors[4];
    const pattern=[
      [R,R,R,B,B,B,Y,Y,Y,G,G,G],
      [R,R,null,B,B,null,Y,Y,null,G,G,null],
      [P,P,P,R,R,R,B,B,B,Y,Y,Y],
      [P,P,null,R,R,null,B,B,null,Y,Y,null],
      [G,G,G,P,P,P,R,R,R,B,B,B],
      Array(12).fill(null), Array(12).fill(null), Array(12).fill(null)
    ];
    this.grid=pattern.map(r=>r.slice());
    this.queue=[R,B,Y,G,P,R,B,Y,G,P,R,B,Y,G,P,R,B,Y,G,P];
    this.angle=-Math.PI/2; this.current=this.queue.shift(); this.next=this.queue[0]||Utils.choice(this.colors); this.shot=null; this.score=0; this.shots=50;
    if(!this.boundControls){
      this.boundControls=true;
      this.canvas.addEventListener('pointerdown',e=>{this.setAim(e);});
      this.canvas.addEventListener('pointermove',e=>{if(e.buttons) this.setAim(e);});
      this.canvas.addEventListener('pointerup',e=>{this.setAim(e); this.fire();});
    }
  }

  setAim(e){
    const p=this.pointer(e), dx=p.x-400, dy=p.y-555;
    if(dy>=-10) return;
    this.angle=Utils.clamp(Math.atan2(dy,dx),-2.7,-.45);
  }
  fire(){ if(!this.shot&&this.shots>0){this.shot={x:400,y:555,vx:Math.cos(this.angle)*420,vy:Math.sin(this.angle)*420,c:this.current}; this.current=this.queue.shift()||Utils.choice(this.colors); this.next=this.queue[0]||Utils.choice(this.colors); this.shots--; AudioEngine.play('shoot');} }
  handleAction(a){ if(a==='action') this.fire(); }
  cellAt(px,py){ return {x:Math.round((px-this.off.x)/this.cell), y:Math.round((py-this.off.y)/this.cell)}; }
  nearestOpen(x,y){
    const choices=[[x,y],[x+1,y],[x-1,y],[x,y+1],[x,y-1],[x+1,y+1],[x-1,y+1],[x+1,y-1],[x-1,y-1]];
    return choices.map(([cx,cy])=>({x:Utils.clamp(cx,0,this.cols-1),y:Utils.clamp(cy,0,this.rows-1)})).find(p=>!this.grid[p.y][p.x]);
  }
  place(s){
    let p=this.cellAt(s.x,s.y); p.x=Utils.clamp(p.x,0,this.cols-1); p.y=Utils.clamp(p.y,0,this.rows-1);
    p=this.nearestOpen(p.x,p.y) || p;
    if(this.grid[p.y][p.x]) { this.gameOver('No Space For Bubble'); return; }
    this.grid[p.y][p.x]=s.c; this.clear(p.x,p.y);
  }
  clear(x,y){
    let color=this.grid[y][x], seen=new Set(), stack=[[x,y]], group=[];
    while(stack.length){
      let [cx,cy]=stack.pop(), k=cx+','+cy;
      if(seen.has(k)||this.grid[cy]?.[cx]!==color) continue;
      seen.add(k); group.push([cx,cy]);
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) stack.push([cx+dx,cy+dy]);
    }
    if(group.length>=3){
      for(const [gx,gy] of group) this.grid[gy][gx]=null;
      this.score+=group.length*45; this.particles.push(...Utils.makeParticles(this.off.x+x*this.cell,this.off.y+y*this.cell,14,color)); AudioEngine.play('success');
    } else AudioEngine.play('click');
  }
  update(dt){
    if(this.input.isPressed('left'))this.angle-=2*dt;
    if(this.input.isPressed('right'))this.angle+=2*dt;
    this.angle=Utils.clamp(this.angle,-2.7,-.45);
    if(this.shot){
      let s=this.shot; s.x+=s.vx*dt; s.y+=s.vy*dt;
      if(s.x<20||s.x>780){s.vx*=-1; s.x=Utils.clamp(s.x,20,780); AudioEngine.play('click');}
      if(s.y<35){this.place(s); this.shot=null;}
      else{
        outer: for(let y=0;y<this.rows;y++) for(let x=0;x<this.cols;x++) if(this.grid[y][x]){
          let bx=this.off.x+x*this.cell, by=this.off.y+y*this.cell;
          if(Math.hypot(s.x-bx,s.y-by)<this.cell*.78){this.place(s); this.shot=null; break outer;}
        }
      }
    }
    let remain=this.grid.flat().filter(Boolean).length;
    if(!remain){this.rewardWin('Board Cleared','Bubble Crown',900); return;}
    if(this.grid[this.rows-1].some(Boolean)){this.gameOver('Bubbles Reached Bottom'); return;}
    if(this.shots<=0&&!this.shot){this.gameOver('Out of Bubbles'); return;}
    this.updateHUD({Bubbles:remain,Shots:this.shots,Next:'●',Goal:'Clear board',Reward:'Bubble Crown'});
  }
  draw(){
    let c=this.ctx;
    for(let y=0;y<this.rows;y++) for(let x=0;x<this.cols;x++) if(this.grid[y][x]){c.fillStyle=this.grid[y][x]; c.beginPath(); c.arc(this.off.x+x*this.cell,this.off.y+y*this.cell,18,0,7); c.fill();}
    c.strokeStyle='#fff'; c.lineWidth=3; c.beginPath(); c.moveTo(400,555); c.lineTo(400+Math.cos(this.angle)*90,555+Math.sin(this.angle)*90); c.stroke();
    c.fillStyle=this.current; c.beginPath(); c.arc(400,555,20,0,7); c.fill();
    c.fillStyle=this.next; c.beginPath(); c.arc(460,555,12,0,7); c.fill();
    if(this.shot){c.fillStyle=this.shot.c; c.beginPath(); c.arc(this.shot.x,this.shot.y,18,0,7); c.fill();}
    c.font='16px sans-serif'; c.textAlign='left'; c.fillStyle='#c7d2fe'; c.fillText('Aim with mouse/touch or ← →, press Action/Space to shoot.',80,585);
  }
}
document.addEventListener('DOMContentLoaded',()=>{window.currentGame=new BubbleShooterPlus('bubble-shooter-plus','Bubble Shooter Plus');window.currentGame.start();});
