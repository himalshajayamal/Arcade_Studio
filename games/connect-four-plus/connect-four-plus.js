class ConnectFourPlus extends BaseGame{
  rewardWin(message, reward, bonus=250){ if(this.over) return; this.score += bonus; StorageManager.saveAchievement(this.gameId, 'reward-'+reward.toLowerCase().replace(/[^a-z0-9]+/g,'-'), 'Reward: '+reward); this.win(message + ' — Reward: ' + reward); }

 reset(){this.cols=7;this.rows=6;this.cell=68;this.off={x:162,y:92};this.board=Array.from({length:this.rows},()=>Array(this.cols).fill(0));this.turn=1;this.score=0;if(!this.boundControls){this.boundControls=true;this.canvas.addEventListener('pointerdown',e=>this.drop(e));}}
 drop(e){if(this.turn!==1||this.over)return;let p=this.pointer(e),col=Math.floor((p.x-this.off.x)/this.cell);if(this.play(col,1)){if(this.check(1)){this.score=1000;this.rewardWin('You Connected Four', 'Four-Line Trophy');return;}this.turn=2;setTimeout(()=>this.ai(),180);}}
 play(col,who){if(col<0||col>=this.cols)return false;for(let y=this.rows-1;y>=0;y--)if(!this.board[y][col]){this.board[y][col]=who;AudioEngine.play('coin');return true;}return false;}
 ai(){let choice=null;for(let c=0;c<this.cols;c++){let copy=this.clone();if(this.try(copy,c,2)&&this.checkBoard(copy,2)){choice=c;break;}}if(choice==null)for(let c=0;c<this.cols;c++){let copy=this.clone();if(this.try(copy,c,1)&&this.checkBoard(copy,1)){choice=c;break;}}if(choice==null)choice=Utils.choice([3,2,4,1,5,0,6].filter(c=>this.board[0][c]===0));this.play(choice,2);if(this.check(2))this.gameOver('AI Connected Four');this.turn=1;}
 clone(){return this.board.map(r=>[...r]);}try(b,c,w){for(let y=this.rows-1;y>=0;y--)if(!b[y][c]){b[y][c]=w;return true;}return false;}
 check(w){return this.checkBoard(this.board,w);}checkBoard(b,w){for(let y=0;y<this.rows;y++)for(let x=0;x<this.cols;x++)for(const [dx,dy]of[[1,0],[0,1],[1,1],[1,-1]]){let ok=true;for(let i=0;i<4;i++)if(b[y+dy*i]?.[x+dx*i]!==w)ok=false;if(ok)return true;}return false;}
 update(){if(this.board[0].every(Boolean))this.gameOver('Board Full');this.updateHUD({Turn:this.turn===1?'You':'AI',Goal:'Connect four',Reward:'Four-Line Trophy'});}
 draw(){let c=this.ctx;c.fillStyle='#2563eb';c.fillRect(this.off.x-12,this.off.y-12,this.cols*this.cell+24,this.rows*this.cell+24);for(let y=0;y<this.rows;y++)for(let x=0;x<this.cols;x++){c.fillStyle=this.board[y][x]===1?'#ff4d6d':this.board[y][x]===2?'#ffd166':'#061020';c.beginPath();c.arc(this.off.x+x*this.cell+34,this.off.y+y*this.cell+34,26,0,7);c.fill();}}
}
document.addEventListener('DOMContentLoaded',()=>{window.currentGame=new ConnectFourPlus('connect-four-plus','Connect Four Plus');window.currentGame.start();});
