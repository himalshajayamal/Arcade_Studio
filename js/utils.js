/** Shared utility engine: deterministic RNG, collision, timers, particles, A*. */
const Utils = {
  clamp: (v, min, max) => Math.min(max, Math.max(min, v)),
  lerp: (a, b, t) => a + (b - a) * t,
  rectsOverlap: (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y,
  dist: (a, b) => Math.hypot(a.x - b.x, a.y - b.y),
  formatTime(seconds) { seconds = Math.floor(seconds || 0); return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`; },
  debounce(fn, wait = 200) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; },
  createRng(seed = 123456789) { let s = seed >>> 0; return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; }; },
  choice(arr, rng = Math.random) { return arr[Math.floor(rng() * arr.length)]; },
  drawRoundRect(ctx, x, y, w, h, r = 10) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x,y,w,h,r) : ctx.rect(x,y,w,h); ctx.fill(); },
  getPointer(canvas, event) { const r = canvas.getBoundingClientRect(); const p = event.touches ? event.touches[0] : event; return { x: (p.clientX - r.left) * canvas.width / r.width, y: (p.clientY - r.top) * canvas.height / r.height }; },
  makeParticles(x, y, count = 12, color = '#18e0ff') { return Array.from({length: count}, () => ({ x, y, vx:(Math.random()-.5)*220, vy:(Math.random()-.5)*220, life:.45+Math.random()*.35, color })); },
  updateParticles(particles, dt) { for (const p of particles) { p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 260*dt; p.life -= dt; } return particles.filter(p => p.life > 0); },
  drawParticles(ctx, particles) { for (const p of particles) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.fillRect(p.x-2, p.y-2, 4, 4); } ctx.globalAlpha = 1; },
  astar(grid, start, goal) {
    const key = p => `${p.x},${p.y}`; const open = [{...start, g:0, f:0}]; const came = new Map(); const gScore = new Map([[key(start), 0]]); const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    while (open.length) {
      open.sort((a,b)=>a.f-b.f); const cur = open.shift();
      if (cur.x === goal.x && cur.y === goal.y) { const path = [{x:cur.x,y:cur.y}]; let k = key(cur); while (came.has(k)) { const prev = came.get(k); path.push(prev); k = key(prev); } return path.reverse(); }
      for (const [dx,dy] of dirs) { const nx=cur.x+dx, ny=cur.y+dy; if (ny<0||ny>=grid.length||nx<0||nx>=grid[0].length||grid[ny][nx]) continue; const nk=`${nx},${ny}`; const ng=(gScore.get(key(cur)) ?? Infinity)+1; if (ng < (gScore.get(nk) ?? Infinity)) { came.set(nk,{x:cur.x,y:cur.y}); gScore.set(nk,ng); open.push({x:nx,y:ny,g:ng,f:ng+Math.abs(goal.x-nx)+Math.abs(goal.y-ny)}); } }
    }
    return [];
  }
};
window.Utils = Utils;
