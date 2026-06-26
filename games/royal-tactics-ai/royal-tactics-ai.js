
class RoyalTacticsAI extends BaseGame{
  constructor(){ super('royal-tactics-ai','Royal Tactics AI'); this.canvas.addEventListener('pointerdown',e=>this.pick(e)); }
  rewardWin(message,reward,bonus=900){ if(this.over) return; this.score+=bonus; StorageManager.saveAchievement(this.gameId,'reward-royal-victory','Reward: '+reward); AudioEngine.play('reward'); this.win(message+' — Reward: '+reward); }
  reset(){
    this.board=[
      ['r','n','b','q','k','b','n','r'], ['p','p','p','p','p','p','p','p'],
      ['','','','','','','',''], ['','','','','','','',''], ['','','','','','','',''], ['','','','','','','',''],
      ['P','P','P','P','P','P','P','P'], ['R','N','B','Q','K','B','N','R']
    ];
    this.sel=null; this.moves=[]; this.score=0; this.level=1; this.lives=1; this.lastMove=null; this.aiThinking=false;
  }
  color(p){ if(!p) return null; return p===p.toUpperCase()?'white':'black'; }
  in(x,y){ return x>=0&&x<8&&y>=0&&y<8; }
  pieceValue(p){ return {p:10,n:30,b:32,r:50,q:90,k:900}[String(p).toLowerCase()]||0; }
  ray(x,y,dx,dy,color,out){ let nx=x+dx,ny=y+dy; while(this.in(nx,ny)){ const p=this.board[ny][nx]; if(!p) out.push({x:nx,y:ny}); else { if(this.color(p)!==color) out.push({x:nx,y:ny,capture:p}); break; } nx+=dx; ny+=dy; } }
  legal(x,y){
    const p=this.board[y][x]; if(!p) return []; const color=this.color(p), t=p.toLowerCase(), out=[]; const add=(nx,ny)=>{ if(!this.in(nx,ny)) return; const q=this.board[ny][nx]; if(!q||this.color(q)!==color) out.push({x:nx,y:ny,capture:q||null}); };
    if(t==='p'){ const dir=color==='white'?-1:1, start=color==='white'?6:1; if(this.in(x,y+dir)&&!this.board[y+dir][x]){ out.push({x,y:y+dir}); if(y===start&&!this.board[y+2*dir][x]) out.push({x,y:y+2*dir}); } for(const dx of [-1,1]) if(this.in(x+dx,y+dir)&&this.board[y+dir][x+dx]&&this.color(this.board[y+dir][x+dx])!==color) out.push({x:x+dx,y:y+dir,capture:this.board[y+dir][x+dx]}); }
    if(t==='n') for(const d of [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]]) add(x+d[0],y+d[1]);
    if(t==='b'||t==='q') for(const d of [[1,1],[-1,1],[1,-1],[-1,-1]]) this.ray(x,y,d[0],d[1],color,out);
    if(t==='r'||t==='q') for(const d of [[1,0],[-1,0],[0,1],[0,-1]]) this.ray(x,y,d[0],d[1],color,out);
    if(t==='k') for(let dx=-1;dx<=1;dx++) for(let dy=-1;dy<=1;dy++) if(dx||dy) add(x+dx,y+dy);
    return out;
  }
  allMoves(color){ const out=[]; for(let y=0;y<8;y++)for(let x=0;x<8;x++) if(this.color(this.board[y][x])===color) for(const m of this.legal(x,y)) out.push({fromX:x,fromY:y,toX:m.x,toY:m.y,capture:m.capture||null}); return out; }
  pick(e){
    if(this.aiThinking||this.paused||this.over) return; const p=this.pointer(e), s=62, ox=152, oy=54; const x=Math.floor((p.x-ox)/s), y=Math.floor((p.y-oy)/s); if(!this.in(x,y)) return;
    if(this.sel){ const mv=this.moves.find(m=>m.x===x&&m.y===y); if(mv){ this.applyMove(this.sel.x,this.sel.y,x,y); this.sel=null; this.moves=[]; if(!this.over){ this.aiThinking=true; setTimeout(()=>this.aiMove(),240); } return; } }
    if(this.color(this.board[y][x])==='white'){ this.sel={x,y}; this.moves=this.legal(x,y); AudioEngine.play('click'); } else { this.sel=null; this.moves=[]; }
  }
  applyMove(x,y,nx,ny){
    const p=this.board[y][x], cap=this.board[ny][nx]; this.board[ny][nx]=p; this.board[y][x]=''; if(p==='P'&&ny===0)this.board[ny][nx]='Q'; if(p==='p'&&ny===7)this.board[ny][nx]='q'; this.lastMove={x,y,nx,ny};
    if(cap){ this.score += this.pieceValue(cap); AudioEngine.play(cap.toLowerCase()==='k'?'success':'coin'); } else AudioEngine.play('click');
    if(cap==='k') this.rewardWin('Black king captured','Royal Strategist Crown',1500);
    if(cap==='K') this.gameOver('Your king was captured');
  }
  aiMove(){
    if(this.over) return; const moves=this.allMoves('black'); if(!moves.length){ this.rewardWin('AI has no legal move','Royal Strategist Crown',1000); return; }
    let best=moves[0], bestScore=-99999; for(const m of moves){ let score=(m.capture?this.pieceValue(m.capture):0)+Math.random()*3; if(m.capture==='K') score+=99999; score+=3-Math.abs(3.5-m.toX)-Math.abs(3.5-m.toY); if(score>bestScore){bestScore=score;best=m;} }
    this.aiThinking=false; this.applyMove(best.fromX,best.fromY,best.toX,best.toY);
  }
  update(){ this.updateHUD({Turn:this.aiThinking?'AI thinking':'White',Captured:this.score,Goal:'Capture black king',Reward:'Royal Strategist Crown'}); }
  draw(){
    const c=this.ctx, s=62, ox=152, oy=54; c.fillStyle='#061020'; c.fillRect(0,0,800,600); c.fillStyle='#cbd7ff'; c.font='14px system-ui'; c.fillText('Click a white piece, then a highlighted square. The browser AI replies after your move.',92,34);
    for(let y=0;y<8;y++)for(let x=0;x<8;x++){ c.fillStyle=(x+y)%2?'#24314a':'#d9e4ff'; c.fillRect(ox+x*s,oy+y*s,s,s); }
    if(this.lastMove){ c.fillStyle='rgba(255,209,102,.45)'; c.fillRect(ox+this.lastMove.nx*s,oy+this.lastMove.ny*s,s,s); }
    if(this.sel){ c.fillStyle='rgba(24,224,255,.35)'; c.fillRect(ox+this.sel.x*s,oy+this.sel.y*s,s,s); c.fillStyle='rgba(54,226,143,.42)'; for(const m of this.moves) c.fillRect(ox+m.x*s+10,oy+m.y*s+10,s-20,s-20); }
    const map={K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
    c.font='46px serif'; c.textAlign='center'; c.textBaseline='middle';
    for(let y=0;y<8;y++)for(let x=0;x<8;x++){ const p=this.board[y][x]; if(p){ c.fillStyle=this.color(p)==='white'?'#ffffff':'#101827'; c.fillText(map[p],ox+x*s+s/2,oy+y*s+s/2+2); } }
    c.textAlign='left'; c.textBaseline='alphabetic';
  }
}
window.currentGame=new RoyalTacticsAI(); window.currentGame.start();
