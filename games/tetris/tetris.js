class TetrisGame extends BaseGame {
  constructor() { super('tetris', 'Tetris Modern'); this.cols=10; this.rows=20; this.cell=26; this.ox=250; this.oy=35; this.colors=['#000','#18e0ff','#ffd166','#ff4d6d','#36e28f','#7c5cff','#ff8c42','#59f']; this.shapes={I:[[1,1,1,1]],O:[[1,1],[1,1]],T:[[0,1,0],[1,1,1]],L:[[1,0],[1,0],[1,1]],J:[[0,1],[0,1],[1,1]],S:[[0,1,1],[1,1,0]],Z:[[1,1,0],[0,1,1]]}; }
  reset(){ this.board=Array.from({length:this.rows},()=>Array(this.cols).fill(0)); this.drop=0; this.dropRate=.6; this.nextPiece(); }
  nextPiece(){ const keys=Object.keys(this.shapes); const key=Utils.choice(keys); this.piece={shape:this.shapes[key].map(r=>[...r]), x:Math.floor(this.cols/2)-2, y:0, color:1+keys.indexOf(key)}; if(this.collides(this.piece.shape,this.piece.x,this.piece.y)) this.gameOver('Stack reached the top'); }
  rotate(shape){ return shape[0].map((_,i)=>shape.map(row=>row[i]).reverse()); }
  collides(shape,x,y){ return shape.some((row,dy)=>row.some((v,dx)=> v && (x+dx<0||x+dx>=this.cols||y+dy>=this.rows||this.board[y+dy]?.[x+dx]))); }
  merge(){ this.piece.shape.forEach((row,dy)=>row.forEach((v,dx)=>{ if(v && this.piece.y+dy>=0) this.board[this.piece.y+dy][this.piece.x+dx]=this.piece.color; })); let cleared=0; this.board=this.board.filter(r=>{ if(r.every(Boolean)){cleared++; return false;} return true; }); while(this.board.length<this.rows) this.board.unshift(Array(this.cols).fill(0)); if(cleared){ this.score += [0,100,300,500,800][cleared]; this.level=Math.floor(this.score/700)+1; this.dropRate=Math.max(.08,.6-this.level*.045); AudioEngine.play('success'); } this.nextPiece(); this.updateHUD({Lines:cleared}); }
  move(dx,dy){ if(!this.collides(this.piece.shape,this.piece.x+dx,this.piece.y+dy)){ this.piece.x+=dx; this.piece.y+=dy; return true;} return false; }
  handleDirection(d){ if(d==='left') this.move(-1,0); if(d==='right') this.move(1,0); if(d==='down') this.move(0,1); }
  handleAction(){ const r=this.rotate(this.piece.shape); if(!this.collides(r,this.piece.x,this.piece.y)){ this.piece.shape=r; AudioEngine.play('click'); } }
  handleKey(e){ if(e?.code==='Space'){ while(this.move(0,1)); this.merge(); } }
  update(dt){ this.drop+=dt; if(this.drop>this.dropRate){ this.drop=0; if(!this.move(0,1)) this.merge(); } this.updateHUD({Speed:this.level}); }
  drawCell(x,y,color){ const c=this.ctx; c.fillStyle=this.colors[color]; c.fillRect(this.ox+x*this.cell+1,this.oy+y*this.cell+1,this.cell-2,this.cell-2); c.strokeStyle='rgba(255,255,255,.15)'; c.strokeRect(this.ox+x*this.cell+1,this.oy+y*this.cell+1,this.cell-2,this.cell-2); }
  draw(){ const c=this.ctx; c.fillStyle='rgba(255,255,255,.05)'; c.fillRect(this.ox,this.oy,this.cols*this.cell,this.rows*this.cell); this.board.forEach((r,y)=>r.forEach((v,x)=>v&&this.drawCell(x,y,v))); this.piece.shape.forEach((r,y)=>r.forEach((v,x)=>v&&this.drawCell(this.piece.x+x,this.piece.y+y,this.piece.color))); }
}
window.currentGame = new TetrisGame(); window.addEventListener('DOMContentLoaded', () => currentGame.start());
