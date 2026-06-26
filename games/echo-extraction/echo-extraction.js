/**
 * Echo Extraction — Game 41.
 * A full mission-based tactical extraction shooter built for the static arcade architecture.
 * Systems included: camera/world, collision, weapon/reload, inventory/loot, objective/extraction,
 * finite-state enemy AI, A* navigation grid, perception/noise, doors, hazards, rewards, save scoring.
 */
class EchoExtractionGame extends BaseGame {
  constructor() {
    super('echo-extraction', 'Echo Extraction');
    this.tile = 50;
    this.worldW = 1600;
    this.worldH = 1100;
    this.pointerWorld = { x: 450, y: 520 };
    this.pointerDown = false;
    this.directKeys = new Set();
    this._boundKeyDown = e => this.onDirectKey(e, true);
    this._boundKeyUp = e => this.onDirectKey(e, false);
    window.addEventListener('keydown', this._boundKeyDown);
    window.addEventListener('keyup', this._boundKeyUp);
    this.bindPointerControls();
  }

  bindPointerControls() {
    if (!this.canvas) return;
    const updatePointer = ev => {
      const p = this.pointer(ev);
      this.pointerWorld = { x: p.x + this.camera.x, y: p.y + this.camera.y };
      const dx = this.pointerWorld.x - this.player.x;
      const dy = this.pointerWorld.y - this.player.y;
      if (Math.hypot(dx, dy) > 8) this.player.angle = Math.atan2(dy, dx);
    };
    this.canvas.addEventListener('pointermove', ev => updatePointer(ev));
    this.canvas.addEventListener('pointerdown', ev => { this.pointerDown = true; updatePointer(ev); this.canvas.focus?.(); });
    window.addEventListener('pointerup', () => { this.pointerDown = false; });
  }

  onDirectKey(event, down) {
    if (['KeyE','KeyF','KeyM','KeyQ','KeyX'].includes(event.code)) event.preventDefault();
    if (down) {
      if (!this.directKeys.has(event.code)) {
        if (event.code === 'KeyE' || event.code === 'KeyF') this.tryInteract();
        if (event.code === 'KeyM') this.useMedkit();
        if (event.code === 'KeyQ') { this.player.crouched = !this.player.crouched; this.toast(this.player.crouched ? 'Crouch: quieter movement' : 'Standing movement', 1.4); }
        if (event.code === 'KeyX') this.forceExtractionPrompt();
      }
      this.directKeys.add(event.code);
    } else {
      this.directKeys.delete(event.code);
    }
  }

  reset() {
    this.worldW = 1600; this.worldH = 1100; this.camera = { x: 0, y: 0 };
    this.timer = 420; this.level = 1; this.lives = 1; this.score = 0;
    this.mission = {
      keycard: false,
      dataCore: false,
      terminalProgress: 0,
      terminalActive: false,
      extractionOpen: false,
      stealthBroken: false,
      alarmLevel: 0,
      reward: 'Locked',
      objective: 'Find a keycard in the facility.'
    };
    this.player = {
      x: 115, y: 930, r: 16, angle: -0.45, health: 100, armor: 55, stamina: 100,
      ammo: 30, mag: 30, reserve: 84, medkits: 1, weight: 0, maxWeight: 10,
      bleeding: false, crouched: false, reloadTimer: 0, fireTimer: 0, hurtFlash: 0,
      kills: 0, lootValue: 0, steps: 0
    };
    this.extractZone = { x: 52, y: 858, w: 138, h: 160 };
    this.terminal = { x: 1370, y: 202, r: 30 };
    this.noiseEvents = [];
    this.tracers = [];
    this.floaters = [];
    this.shells = [];
    this.alertPings = [];
    this.toastText = 'Operation started. Recover the data core and extract alive.';
    this.toastTimer = 4;
    this.setupFacility();
    this.buildNavigationGrid();
    this.updateHUD();
  }

  setupFacility() {
    this.walls = [
      {x:0,y:0,w:1600,h:32,type:'wall'}, {x:0,y:1068,w:1600,h:32,type:'wall'},
      {x:0,y:0,w:32,h:1100,type:'wall'}, {x:1568,y:0,w:32,h:1100,type:'wall'},
      {x:250,y:120,w:32,h:300,type:'wall'}, {x:250,y:505,w:32,h:360,type:'wall'},
      {x:505,y:0,w:32,h:270,type:'wall'}, {x:505,y:355,w:32,h:330,type:'wall'}, {x:505,y:770,w:32,h:280,type:'wall'},
      {x:735,y:105,w:32,h:245,type:'wall'}, {x:735,y:610,w:32,h:455,type:'wall'},
      {x:1080,y:0,w:32,h:318,type:'wall'}, {x:1080,y:418,w:32,h:262,type:'wall'}, {x:1080,y:765,w:32,h:300,type:'wall'},
      {x:320,y:500,w:242,h:32,type:'wall'}, {x:595,y:760,w:244,h:32,type:'wall'}, {x:920,y:500,w:258,h:32,type:'wall'},
      {x:1130,y:710,w:332,h:32,type:'wall'}, {x:330,y:235,w:225,h:28,type:'wall'}, {x:1160,y:318,w:320,h:30,type:'wall'},
      {x:890,y:160,w:120,h:36,type:'cover'}, {x:928,y:222,w:36,h:150,type:'cover'},
      {x:430,y:890,w:82,h:64,type:'cover'}, {x:640,y:890,w:76,h:60,type:'cover'},
      {x:1220,y:860,w:116,h:58,type:'cover'}, {x:1325,y:548,w:92,h:52,type:'cover'},
      {x:620,y:430,w:90,h:48,type:'cover'}, {x:135,y:352,w:88,h:44,type:'cover'}
    ];
    this.doors = [
      {id:'security', name:'Security Gate', x:735, y:350, w:32, h:260, locked:true, open:false, needs:'Keycard'},
      {id:'server', name:'Server Blast Door', x:1080, y:318, w:32, h:100, locked:true, open:false, needs:'Keycard'},
      {id:'armory', name:'Armory Door', x:505, y:270, w:32, h:85, locked:false, open:false, needs:'Manual'}
    ];
    this.hazards = [
      {x:1178,y:375,w:168,h:75,damage:7,label:'Toxic gas leak'},
      {x:880,y:805,w:115,h:82,damage:9,label:'Electric floor'},
      {x:365,y:120,w:90,h:60,damage:6,label:'Fire spill'}
    ];
    this.crates = [
      {id:'security-cache', x:382, y:900, r:22, opened:false, label:'Security Cache', items:[{type:'keycard', name:'Blue Keycard', value:150, weight:1},{type:'ammo', name:'Rifle Ammo', amount:36, value:80, weight:1}]},
      {id:'medbay', x:190, y:220, r:22, opened:false, label:'Med Bay Box', items:[{type:'medkit', name:'Field Medkit', amount:1, value:120, weight:2},{type:'loot', name:'Medical Injector Kit', value:210, weight:2}]},
      {id:'armory', x:622, y:214, r:22, opened:false, label:'Armory Case', items:[{type:'ammo', name:'AP Ammo Box', amount:42, value:110, weight:1},{type:'armor', name:'Armor Plate', amount:30, value:180, weight:2}]},
      {id:'lab-safe', x:945, y:314, r:22, opened:false, label:'Research Safe', items:[{type:'loot', name:'Prototype Chip', value:340, weight:3},{type:'medkit', name:'Trauma Kit', amount:1, value:140, weight:2}]},
      {id:'server-rack', x:1432, y:160, r:22, opened:false, label:'Server Rack', items:[{type:'loot', name:'Encrypted SSD', value:420, weight:2},{type:'ammo', name:'Emergency Ammo', amount:24, value:70, weight:1}]},
      {id:'loading-bay', x:1310, y:920, r:22, opened:false, label:'Loading Bay Crate', items:[{type:'loot', name:'Rare Components', value:280, weight:2},{type:'armor', name:'Plate Bundle', amount:20, value:100, weight:2}]}
    ];
    this.enemies = [
      this.makeEnemy('patrol', 430, 610, [[430,610],[650,610],[650,470],[430,470]]),
      this.makeEnemy('raider', 860, 245, [[860,245],[1010,245],[1010,420],[860,420]]),
      this.makeEnemy('guard', 1230, 205, [[1230,205],[1450,205],[1450,460],[1240,460]]),
      this.makeEnemy('heavy', 1210, 840, [[1210,840],[1450,840],[1450,1010],[1210,1010]]),
      this.makeEnemy('patrol', 370, 180, [[370,180],[470,180],[470,340],[360,340]]),
      this.makeEnemy('guard', 875, 870, [[875,870],[1015,870],[1015,695],[875,695]])
    ];
  }

  makeEnemy(type, x, y, patrol) {
    const stats = {
      patrol: {hp:55, speed:84, damage:10, range:250, color:'#ffcf5a', reward:90},
      guard: {hp:80, speed:76, damage:14, range:300, color:'#ff5f7c', reward:130},
      raider: {hp:60, speed:112, damage:9, range:185, color:'#a78bfa', reward:110},
      heavy: {hp:130, speed:55, damage:20, range:270, color:'#ff884d', reward:220}
    }[type];
    return { type, x, y, r:16, hp:stats.hp, maxHp:stats.hp, speed:stats.speed, damage:stats.damage, range:stats.range, color:stats.color, reward:stats.reward,
      state:'PATROL', patrol, patrolIndex:0, path:[], pathTimer:0, target:{x:patrol[0][0],y:patrol[0][1]}, cooldown:0.4+Math.random()*0.6,
      searchTimer:0, lastSeen:null, spawn:{x,y}, alert:0, hitFlash:0, dead:false };
  }

  buildNavigationGrid() {
    this.cols = Math.ceil(this.worldW / this.tile);
    this.rows = Math.ceil(this.worldH / this.tile);
    this.navGrid = [];
    for (let y=0; y<this.rows; y++) {
      const row = [];
      for (let x=0; x<this.cols; x++) {
        const wx = x*this.tile + this.tile/2, wy = y*this.tile + this.tile/2;
        row.push(this.blocksPoint(wx, wy, 18) ? 1 : 0);
      }
      this.navGrid.push(row);
    }
  }

  activeBlockers() {
    return this.walls.concat(this.doors.filter(d => !d.open));
  }

  blocksPoint(x, y, pad=0) {
    return this.activeBlockers().some(r => x > r.x-pad && x < r.x+r.w+pad && y > r.y-pad && y < r.y+r.h+pad);
  }

  pointInRect(x, y, r) { return x >= r.x && x <= r.x+r.w && y >= r.y && y <= r.y+r.h; }

  rectDistance(cx, cy, r) {
    const px = Utils.clamp(cx, r.x, r.x+r.w), py = Utils.clamp(cy, r.y, r.y+r.h);
    return Math.hypot(cx-px, cy-py);
  }

  worldToCell(p) {
    return { x: Utils.clamp(Math.floor(p.x/this.tile), 0, this.cols-1), y: Utils.clamp(Math.floor(p.y/this.tile), 0, this.rows-1) };
  }

  cellToWorld(c) { return { x: c.x*this.tile + this.tile/2, y: c.y*this.tile + this.tile/2 }; }

  pathBetween(a, b) {
    const start=this.worldToCell(a), goal=this.worldToCell(b);
    const path = Utils.astar(this.navGrid, start, goal);
    return path.slice(1, 12).map(c => this.cellToWorld(c));
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0) { this.gameOver('Raid timer expired'); return; }
    this.handlePlayer(dt);
    this.updateMission(dt);
    this.updateEnemies(dt);
    this.updateEffects(dt);
    this.applyHazards(dt);
    this.updateCamera();
    this.checkLoss();
    this.updateHUD(this.hudRows());
  }

  handlePlayer(dt) {
    const p = this.player;
    p.fireTimer = Math.max(0, p.fireTimer - dt);
    p.hurtFlash = Math.max(0, p.hurtFlash - dt);
    if (p.reloadTimer > 0) {
      p.reloadTimer -= dt;
      if (p.reloadTimer <= 0) this.finishReload();
    }
    let mx = (this.input.isPressed('right')?1:0) - (this.input.isPressed('left')?1:0);
    let my = (this.input.isPressed('down')?1:0) - (this.input.isPressed('up')?1:0);
    const moving = Math.hypot(mx,my) > 0;
    if (moving) { const len = Math.hypot(mx,my); mx/=len; my/=len; p.angle = Math.atan2(my, mx); }
    const sprinting = moving && this.input.isPressed('secondary') && p.stamina > 5 && p.ammo === p.mag && !p.crouched;
    const base = p.crouched ? 88 : sprinting ? 215 : 142;
    if (sprinting) p.stamina = Math.max(0, p.stamina - 32*dt); else p.stamina = Math.min(100, p.stamina + (p.crouched ? 22 : 16)*dt);
    const oldX = p.x, oldY = p.y;
    this.moveCircle(p, mx*base*dt, my*base*dt);
    if (Math.hypot(p.x-oldX, p.y-oldY) > .2) {
      p.steps += dt;
      if (!p.crouched && p.steps > .45) { this.makeNoise(p.x, p.y, sprinting ? 250 : 120, sprinting ? 'sprint' : 'footstep'); p.steps = 0; }
    }
    if (p.bleeding) p.health -= 2.8 * dt;
    if (this.input.consumeAction('secondary')) this.reload();
    const actionHeld = this.input.isPressed('action');
    if (this.input.consumeAction('action')) {
      if (!this.tryInteract()) this.fireWeapon();
    } else if (this.pointerDown || actionHeld) {
      this.fireWeapon();
    }
  }

  moveCircle(entity, dx, dy) {
    const tryAxis = (axis, delta) => {
      entity[axis] += delta;
      for (const r of this.activeBlockers()) {
        const closestX = Utils.clamp(entity.x, r.x, r.x+r.w);
        const closestY = Utils.clamp(entity.y, r.y, r.y+r.h);
        const dist = Math.hypot(entity.x-closestX, entity.y-closestY);
        if (dist < entity.r) entity[axis] -= delta;
      }
      entity.x = Utils.clamp(entity.x, entity.r+32, this.worldW-entity.r-32);
      entity.y = Utils.clamp(entity.y, entity.r+32, this.worldH-entity.r-32);
    };
    tryAxis('x', dx); tryAxis('y', dy);
  }

  reload() {
    const p = this.player;
    if (p.reloadTimer > 0 || p.ammo >= p.mag || p.reserve <= 0) return false;
    p.reloadTimer = 1.15;
    this.toast('Reloading...', .9);
    AudioEngine.play('click');
    return true;
  }

  finishReload() {
    const p = this.player;
    const needed = p.mag - p.ammo, take = Math.min(needed, p.reserve);
    p.ammo += take; p.reserve -= take;
    AudioEngine.play('powerup');
    this.toast(`Reloaded ${take} rounds`, 1.2);
  }

  fireWeapon() {
    const p = this.player;
    if (p.reloadTimer > 0 || p.fireTimer > 0 || this.over || this.paused) return;
    if (p.ammo <= 0) { this.reload(); return; }
    p.fireTimer = p.crouched ? 0.16 : 0.105;
    p.ammo -= 1;
    this.makeNoise(p.x, p.y, p.crouched ? 340 : 520, 'gunshot');
    this.mission.stealthBroken = true;
    const spread = (p.crouched ? 0.035 : 0.075) + (100-p.stamina)*0.0006;
    const ang = p.angle + (Math.random()-.5)*spread;
    const origin = {x:p.x + Math.cos(ang)*18, y:p.y + Math.sin(ang)*18};
    const result = this.raycast(origin.x, origin.y, ang, 620);
    this.tracers.push({x1:origin.x, y1:origin.y, x2:result.x, y2:result.y, life:.08, color:'#bdf7ff'});
    this.particles.push(...Utils.makeParticles(origin.x, origin.y, 5, '#f8f7b6'));
    AudioEngine.play('shoot');
    if (result.enemy) this.damageEnemy(result.enemy, 28 + Math.floor(Math.random()*8), result.x, result.y);
  }

  raycast(x, y, angle, maxDist) {
    const step = 12, dx = Math.cos(angle), dy = Math.sin(angle);
    let hitEnemy = null, hx=x+dx*maxDist, hy=y+dy*maxDist, best=maxDist;
    for (const e of this.enemies) {
      if (e.dead || e.hp <= 0) continue;
      const t = this.rayCircle(x,y,dx,dy,e.x,e.y,e.r+5);
      if (t !== null && t < best && !this.segmentBlocked(x,y,x+dx*t,y+dy*t)) { hitEnemy = e; best = t; hx=x+dx*t; hy=y+dy*t; }
    }
    for (let d=0; d<=Math.min(best,maxDist); d+=step) {
      const px=x+dx*d, py=y+dy*d;
      if (this.blocksPoint(px, py, 0)) return {x:px, y:py, enemy:null};
    }
    return {x:hx, y:hy, enemy:hitEnemy};
  }

  rayCircle(ox, oy, dx, dy, cx, cy, r) {
    const lx = cx-ox, ly=cy-oy;
    const tca = lx*dx + ly*dy;
    if (tca < 0) return null;
    const d2 = lx*lx + ly*ly - tca*tca;
    if (d2 > r*r) return null;
    const thc = Math.sqrt(r*r-d2);
    return tca - thc;
  }

  segmentBlocked(x1,y1,x2,y2) {
    const dist = Math.hypot(x2-x1, y2-y1), steps = Math.max(1, Math.ceil(dist/18));
    for (let i=1; i<steps; i++) {
      const t=i/steps, x=x1+(x2-x1)*t, y=y1+(y2-y1)*t;
      if (this.blocksPoint(x,y,0)) return true;
    }
    return false;
  }

  damageEnemy(enemy, amount, x, y) {
    enemy.hp -= amount; enemy.state = 'CHASE'; enemy.lastSeen = {x:this.player.x,y:this.player.y}; enemy.alert = 1;
    enemy.hitFlash = .12; this.floaters.push({x,y,text:`-${amount}`,life:.6,color:'#ffdf7e'});
    this.particles.push(...Utils.makeParticles(x,y,14, enemy.color));
    if (enemy.hp <= 0 && !enemy.dead) {
      enemy.dead = true; enemy.state = 'DEAD'; this.player.kills += 1; this.score += enemy.reward;
      this.floaters.push({x:enemy.x,y:enemy.y-20,text:`+${enemy.reward}`,life:1,color:'#7dffb2'});
      this.particles.push(...Utils.makeParticles(enemy.x, enemy.y, 32, '#ff4d6d'));
      AudioEngine.play('explosion');
      if (Math.random() < .3) this.crates.push({id:'drop-'+Date.now()+Math.random(),x:enemy.x,y:enemy.y,r:16,opened:false,label:'Enemy Drop',items:[{type:'ammo',name:'Dropped Ammo',amount:12,value:30,weight:1}]});
    } else AudioEngine.play('click');
  }

  updateEnemies(dt) {
    for (const e of this.enemies) {
      if (e.dead) continue;
      e.cooldown -= dt; e.pathTimer -= dt; e.hitFlash = Math.max(0, e.hitFlash-dt);
      const dist = Math.hypot(this.player.x-e.x, this.player.y-e.y);
      const hasSight = dist < 420 && !this.segmentBlocked(e.x,e.y,this.player.x,this.player.y);
      const playerNoise = this.noiseEvents.find(n => Math.hypot(n.x-e.x,n.y-e.y) < n.radius && n.life > 0.1);
      if (playerNoise && e.state !== 'ATTACK' && e.state !== 'CHASE') {
        e.state = 'INVESTIGATE'; e.target = {x:playerNoise.x, y:playerNoise.y}; e.searchTimer = 1.7; e.alert = Math.max(e.alert, .6);
      }
      const detection = this.player.crouched ? 0.58 : 1;
      if (hasSight && dist < 350 * detection) { e.state = dist < e.range ? 'ATTACK' : 'CHASE'; e.lastSeen = {x:this.player.x,y:this.player.y}; e.alert = 1; }
      if (e.hp < e.maxHp*.28 && e.state === 'ATTACK') { e.state = 'RETREAT'; e.target = {x:e.spawn.x,y:e.spawn.y}; }
      if (e.state === 'PATROL') {
        const point = e.patrol[e.patrolIndex]; e.target = {x:point[0], y:point[1]};
        if (Math.hypot(e.x-e.target.x,e.y-e.target.y) < 26) e.patrolIndex = (e.patrolIndex+1)%e.patrol.length;
        this.followTarget(e, e.target, dt);
      } else if (e.state === 'INVESTIGATE') {
        this.followTarget(e, e.target, dt);
        if (Math.hypot(e.x-e.target.x,e.y-e.target.y) < 30) { e.searchTimer -= dt; if (e.searchTimer <= 0) e.state='PATROL'; }
      } else if (e.state === 'CHASE') {
        e.target = e.lastSeen || {x:this.player.x,y:this.player.y};
        this.followTarget(e, e.target, dt);
        if (hasSight && dist < e.range) e.state = 'ATTACK';
        else if (!hasSight && Math.hypot(e.x-e.target.x,e.y-e.target.y)<25) { e.state='INVESTIGATE'; e.searchTimer=1.8; }
      } else if (e.state === 'ATTACK') {
        if (!hasSight) { e.state='CHASE'; continue; }
        if (dist > e.range*1.08) { e.state='CHASE'; continue; }
        if (e.cooldown <= 0) {
          e.cooldown = e.type === 'heavy' ? 1.05 : e.type === 'raider' ? .58 : .82;
          this.enemyFire(e);
        }
        // small tactical strafe around cover line
        const side = Math.sin(this.elapsed*2 + e.x) > 0 ? 1 : -1;
        this.moveCircle(e, Math.cos(Math.atan2(this.player.y-e.y,this.player.x-e.x)+Math.PI/2)*side*e.speed*.25*dt, Math.sin(Math.atan2(this.player.y-e.y,this.player.x-e.x)+Math.PI/2)*side*e.speed*.25*dt);
      } else if (e.state === 'RETREAT') {
        this.followTarget(e, e.spawn, dt);
        if (Math.hypot(e.x-e.spawn.x,e.y-e.spawn.y)<40) { e.hp = Math.min(e.maxHp, e.hp + 10*dt); if (e.hp > e.maxHp*.52) e.state='PATROL'; }
      }
    }
  }

  followTarget(e, target, dt) {
    if (e.pathTimer <= 0 || !e.path.length) { e.path = this.pathBetween(e, target); e.pathTimer = .55 + Math.random()*.25; }
    const node = e.path[0] || target;
    const ang = Math.atan2(node.y-e.y, node.x-e.x);
    this.moveCircle(e, Math.cos(ang)*e.speed*dt, Math.sin(ang)*e.speed*dt);
    if (Math.hypot(e.x-node.x,e.y-node.y) < 18) e.path.shift();
  }

  enemyFire(e) {
    const ang = Math.atan2(this.player.y-e.y, this.player.x-e.x) + (Math.random()-.5)*(this.player.crouched ? 0.10 : 0.16);
    const miss = Math.abs(Math.atan2(Math.sin(ang-Math.atan2(this.player.y-e.y,this.player.x-e.x)), Math.cos(ang-Math.atan2(this.player.y-e.y,this.player.x-e.x)))) > .13;
    const tx = miss ? this.player.x + (Math.random()-.5)*80 : this.player.x;
    const ty = miss ? this.player.y + (Math.random()-.5)*80 : this.player.y;
    this.tracers.push({x1:e.x,y1:e.y,x2:tx,y2:ty,life:.1,color:e.color});
    this.makeNoise(e.x,e.y,440,'enemy fire');
    if (!miss && !this.segmentBlocked(e.x,e.y,this.player.x,this.player.y)) this.damagePlayer(e.damage, e.type);
    AudioEngine.play('shoot');
  }

  damagePlayer(amount, source='enemy') {
    const p=this.player;
    const absorbed = Math.min(p.armor, Math.ceil(amount*.45));
    p.armor -= absorbed; p.health -= Math.max(1, amount-absorbed); p.hurtFlash=.25;
    if (amount > 12 && Math.random() < .22) p.bleeding = true;
    this.toast(`Hit by ${source}! ${absorbed ? 'Armor absorbed '+absorbed+'.' : 'No armor.'}`, 1.6);
    this.particles.push(...Utils.makeParticles(p.x,p.y,12,'#ff4d6d'));
    AudioEngine.play('failure');
  }

  updateMission(dt) {
    const p=this.player;
    if (this.mission.terminalActive) {
      if (Math.hypot(p.x-this.terminal.x,p.y-this.terminal.y) < 82 && !this.segmentBlocked(p.x,p.y,this.terminal.x,this.terminal.y)) {
        this.mission.terminalProgress += dt;
        if (this.mission.terminalProgress >= 4.0 && !this.mission.dataCore) {
          this.mission.dataCore = true; this.mission.extractionOpen = true; this.mission.terminalActive = false;
          this.score += 650; this.mission.reward = 'Echo Extraction Badge';
          this.toast('Data core recovered. Extraction is open. Return to the entry point!', 4);
          this.spawnReinforcements(); AudioEngine.play('success'); this.buildNavigationGrid();
        }
      } else {
        this.mission.terminalActive = false;
        this.toast('Download interrupted. Stay near the terminal.', 2);
      }
    }
    if (!this.mission.keycard) this.mission.objective = 'Find a keycard in Security Cache or loot rooms.';
    else if (!this.mission.dataCore) this.mission.objective = 'Reach the server terminal and download the data core.';
    else this.mission.objective = 'Extract alive at the blue extraction zone.';
    if (this.mission.dataCore && this.pointInRect(p.x, p.y, this.extractZone)) this.forceExtractionPrompt();
  }

  spawnReinforcements() {
    this.mission.alarmLevel += 1;
    this.enemies.push(this.makeEnemy('raider', 1015, 1000, [[1015,1000],[810,1000],[810,820],[1015,820]]));
    this.enemies.push(this.makeEnemy('guard', 1510, 620, [[1510,620],[1300,620],[1300,780],[1510,780]]));
    this.makeNoise(this.terminal.x, this.terminal.y, 900, 'alarm');
  }

  tryInteract() {
    if (this.over || this.paused) return false;
    const p=this.player;
    const nearDoor = this.doors.find(d => !d.open && this.rectDistance(p.x,p.y,d) < 58);
    if (nearDoor) {
      if (nearDoor.locked && (nearDoor.id === 'security' || nearDoor.id === 'server') && !this.mission.keycard) { this.toast(`${nearDoor.name} requires a blue keycard.`, 2); return true; }
      nearDoor.open = true; nearDoor.locked = false; this.buildNavigationGrid(); this.makeNoise(p.x,p.y,180,'door'); this.toast(`${nearDoor.name} opened.`, 1.6); AudioEngine.play('click'); return true;
    }
    const crate = this.crates.find(c => !c.opened && Math.hypot(c.x-p.x,c.y-p.y) < 62);
    if (crate) { this.openCrate(crate); return true; }
    if (Math.hypot(p.x-this.terminal.x,p.y-this.terminal.y) < 78 && !this.mission.dataCore) {
      if (!this.mission.keycard) { this.toast('Terminal access denied. Find a keycard first.', 2); return true; }
      this.mission.terminalActive = true; this.toast('Downloading data core. Hold position for 4 seconds.', 2.4); this.makeNoise(this.terminal.x,this.terminal.y,280,'terminal'); AudioEngine.play('powerup'); return true;
    }
    if (this.pointInRect(p.x, p.y, this.extractZone)) {
      if (!this.mission.dataCore) { this.toast('Extraction requires the mission data core.', 2); return true; }
      this.extractWin(); return true;
    }
    return false;
  }

  openCrate(crate) {
    crate.opened = true; this.makeNoise(crate.x, crate.y, 150, 'crate');
    const gained = [];
    for (const item of crate.items) {
      if (item.type === 'keycard') { this.mission.keycard = true; this.score += item.value; gained.push(item.name); }
      else if (item.type === 'ammo') { this.player.reserve += item.amount; this.score += item.value; gained.push(`+${item.amount} ammo`); }
      else if (item.type === 'medkit') { if (this.canCarry(item.weight)) { this.player.medkits += item.amount; this.player.weight += item.weight; this.score += item.value; gained.push(item.name); } else gained.push('Medkit too heavy'); }
      else if (item.type === 'armor') { if (this.canCarry(item.weight)) { this.player.armor = Math.min(100, this.player.armor + item.amount); this.player.weight += item.weight; this.score += item.value; gained.push(item.name); } else gained.push('Armor too heavy'); }
      else if (item.type === 'loot') { if (this.canCarry(item.weight)) { this.player.weight += item.weight; this.player.lootValue += item.value; this.score += item.value; gained.push(`${item.name} $${item.value}`); } else gained.push(`${item.name} too heavy`); }
    }
    this.toast(`${crate.label}: ${gained.join(', ')}`, 3.3);
    this.particles.push(...Utils.makeParticles(crate.x, crate.y, 20, '#53f4ff')); AudioEngine.play('coin');
  }

  canCarry(w) { return this.player.weight + w <= this.player.maxWeight; }

  useMedkit() {
    const p=this.player;
    if (p.medkits <= 0 || p.health >= 98 && !p.bleeding) { this.toast('No medkit needed or available.', 1.4); return; }
    p.medkits -= 1; p.health = Math.min(100, p.health + 38); p.bleeding = false;
    this.toast('Medkit used. Bleeding stopped.', 1.8); AudioEngine.play('success');
  }

  applyHazards(dt) {
    for (const h of this.hazards) if (this.pointInRect(this.player.x,this.player.y,h)) {
      this.player.health -= h.damage*dt; this.player.hurtFlash=.08; this.toast(h.label, .5);
    }
  }

  makeNoise(x, y, radius, type) {
    this.noiseEvents.push({x,y,radius,type,life:.8});
    if (type === 'gunshot' || type === 'alarm') this.alertPings.push({x,y,radius,life:.7});
  }

  updateEffects(dt) {
    this.noiseEvents.forEach(n => n.life -= dt); this.noiseEvents = this.noiseEvents.filter(n => n.life>0);
    this.tracers.forEach(t => t.life -= dt); this.tracers = this.tracers.filter(t => t.life>0);
    this.floaters.forEach(f => { f.life -= dt; f.y -= 28*dt; }); this.floaters = this.floaters.filter(f => f.life>0);
    this.alertPings.forEach(a => a.life -= dt); this.alertPings = this.alertPings.filter(a => a.life>0);
    this.toastTimer = Math.max(0, this.toastTimer-dt);
  }

  updateCamera() {
    this.camera.x = Utils.clamp(this.player.x - this.canvas.width/2, 0, this.worldW - this.canvas.width);
    this.camera.y = Utils.clamp(this.player.y - this.canvas.height/2, 0, this.worldH - this.canvas.height);
  }

  checkLoss() { if (this.player.health <= 0) this.gameOver('Operator down — mission failed'); }

  extractWin() {
    const timeBonus = Math.max(0, Math.floor(this.timer*3));
    const healthBonus = Math.floor(Math.max(0,this.player.health)*4 + Math.max(0,this.player.armor)*2);
    const stealthBonus = this.mission.stealthBroken ? 0 : 500;
    const reward = 1000 + this.player.lootValue + timeBonus + healthBonus + stealthBonus;
    this.score += reward;
    this.mission.reward = stealthBonus ? 'Silent Echo Badge + Full Extraction Reward' : 'Echo Extraction Badge + Loot Reward';
    StorageManager.saveAchievement(this.gameId, 'echo-extraction-badge', this.mission.reward);
    this.win(`Extraction successful — reward +${reward}`);
  }

  forceExtractionPrompt() {
    if (this.mission.dataCore && this.pointInRect(this.player.x, this.player.y, this.extractZone)) this.extractWin();
    else if (this.mission.dataCore) this.toast('Return to the blue extraction zone and press E/F.', 1.5);
  }

  toast(text, seconds=2) { this.toastText = text; this.toastTimer = Math.max(this.toastTimer, seconds); }

  hudRows() {
    const p=this.player;
    return {
      Health: `${Math.max(0, Math.floor(p.health))}%${p.bleeding?' • Bleeding':''}`,
      Armor: `${Math.floor(p.armor)}%`,
      Ammo: p.reloadTimer>0 ? 'Reloading' : `${p.ammo}/${p.reserve}`,
      Stamina: `${Math.floor(p.stamina)}%${p.crouched?' • Crouch':''}`,
      Carry: `${p.weight}/${p.maxWeight}`,
      Loot: `$${p.lootValue}`,
      Objective: this.mission.objective,
      Timer: Utils.formatTime(this.timer),
      Reward: this.mission.reward
    };
  }

  draw() {
    const c=this.ctx;
    c.save();
    c.translate(-this.camera.x, -this.camera.y);
    this.drawWorld(c);
    this.drawZones(c);
    this.drawHazards(c);
    this.drawCrates(c);
    this.drawDoors(c);
    this.drawEnemies(c);
    this.drawPlayer(c);
    this.drawWorldEffects(c);
    c.restore();
    this.drawScreenUI(c);
  }

  drawWorld(c) {
    c.fillStyle='#07101c'; c.fillRect(0,0,this.worldW,this.worldH);
    c.strokeStyle='rgba(83,244,255,.06)'; c.lineWidth=1;
    for (let x=0; x<this.worldW; x+=50) { c.beginPath(); c.moveTo(x,0); c.lineTo(x,this.worldH); c.stroke(); }
    for (let y=0; y<this.worldH; y+=50) { c.beginPath(); c.moveTo(0,y); c.lineTo(this.worldW,y); c.stroke(); }
    this.label(c, 'ENTRY / EXTRACTION', 58, 845, '#53f4ff');
    this.label(c, 'ARMORY', 340, 100, '#ffb84d');
    this.label(c, 'SECURITY WING', 845, 130, '#ff6e8a');
    this.label(c, 'SERVER CORE', 1245, 110, '#42f59e');
    for (const w of this.walls) {
      c.fillStyle = w.type === 'cover' ? '#26354e' : '#122036'; c.fillRect(w.x,w.y,w.w,w.h);
      c.strokeStyle = w.type === 'cover' ? 'rgba(255,184,77,.28)' : 'rgba(83,244,255,.16)'; c.strokeRect(w.x+.5,w.y+.5,w.w-1,w.h-1);
    }
  }

  drawZones(c) {
    c.fillStyle = this.mission.extractionOpen ? 'rgba(83,244,255,.20)' : 'rgba(83,244,255,.08)';
    c.fillRect(this.extractZone.x,this.extractZone.y,this.extractZone.w,this.extractZone.h);
    c.strokeStyle = this.mission.extractionOpen ? '#53f4ff' : 'rgba(83,244,255,.35)'; c.lineWidth=3; c.strokeRect(this.extractZone.x,this.extractZone.y,this.extractZone.w,this.extractZone.h);
    c.fillStyle = this.mission.terminalActive ? '#42f59e' : '#1d3f52'; c.beginPath(); c.arc(this.terminal.x,this.terminal.y,this.terminal.r,0,Math.PI*2); c.fill();
    c.strokeStyle='#42f59e'; c.lineWidth=3; c.stroke();
    if (this.mission.terminalProgress > 0 && !this.mission.dataCore) {
      c.fillStyle='rgba(66,245,158,.75)'; c.fillRect(this.terminal.x-42, this.terminal.y-48, 84*(this.mission.terminalProgress/4), 8);
      c.strokeStyle='rgba(255,255,255,.35)'; c.strokeRect(this.terminal.x-42,this.terminal.y-48,84,8);
    }
  }

  drawHazards(c) {
    for (const h of this.hazards) {
      c.fillStyle='rgba(255,61,102,.14)'; c.fillRect(h.x,h.y,h.w,h.h);
      c.strokeStyle='rgba(255,61,102,.45)'; c.setLineDash?.([8,5]); c.strokeRect(h.x,h.y,h.w,h.h); c.setLineDash?.([]);
    }
  }

  drawDoors(c) {
    for (const d of this.doors) {
      if (d.open) { c.fillStyle='rgba(66,245,158,.14)'; c.fillRect(d.x,d.y,d.w,d.h); continue; }
      c.fillStyle = d.locked ? '#51263a' : '#3b2b15'; c.fillRect(d.x,d.y,d.w,d.h);
      c.strokeStyle = d.locked ? '#ff4d6d' : '#ffb84d'; c.lineWidth=2; c.strokeRect(d.x,d.y,d.w,d.h);
    }
  }

  drawCrates(c) {
    for (const crate of this.crates) {
      c.save(); c.translate(crate.x,crate.y); c.rotate(.78);
      c.fillStyle = crate.opened ? '#253346' : '#274363'; c.fillRect(-crate.r,-crate.r,crate.r*2,crate.r*2);
      c.strokeStyle = crate.opened ? 'rgba(255,255,255,.22)' : '#53f4ff'; c.lineWidth=2; c.strokeRect(-crate.r,-crate.r,crate.r*2,crate.r*2);
      c.restore();
    }
  }

  drawEnemies(c) {
    for (const e of this.enemies) {
      if (e.dead) continue;
      c.save(); c.translate(e.x,e.y);
      if (e.state === 'ATTACK' || e.state === 'CHASE') {
        c.fillStyle='rgba(255,61,102,.08)'; c.beginPath(); c.arc(0,0,e.range,0,Math.PI*2); c.fill();
      }
      c.fillStyle = e.hitFlash>0 ? '#ffffff' : e.color; c.beginPath(); c.arc(0,0,e.r,0,Math.PI*2); c.fill();
      c.strokeStyle = e.state === 'PATROL' ? 'rgba(255,255,255,.25)' : '#ff3d66'; c.lineWidth=3; c.stroke();
      c.fillStyle='rgba(0,0,0,.55)'; c.fillRect(-18,-28,36,5); c.fillStyle='#ff4d6d'; c.fillRect(-18,-28,36*(e.hp/e.maxHp),5);
      c.fillStyle='#fff'; c.font='10px sans-serif'; c.textAlign='center'; c.fillText(e.state[0],0,4);
      c.restore();
    }
  }

  drawPlayer(c) {
    const p=this.player;
    c.save(); c.translate(p.x,p.y); c.rotate(p.angle);
    c.fillStyle = p.hurtFlash>0 ? '#fff' : p.crouched ? '#60a5fa' : '#53f4ff';
    c.beginPath(); c.moveTo(22,0); c.lineTo(-14,-13); c.lineTo(-8,0); c.lineTo(-14,13); c.closePath(); c.fill();
    c.strokeStyle='#eaffff'; c.lineWidth=2; c.stroke();
    c.fillStyle='#f8f7b6'; c.fillRect(14,-3,20,6);
    c.restore();
    c.strokeStyle='rgba(83,244,255,.22)'; c.lineWidth=1; c.beginPath(); c.arc(p.x,p.y,p.crouched?44:82,0,Math.PI*2); c.stroke();
  }

  drawWorldEffects(c) {
    for (const t of this.tracers) { c.globalAlpha = Math.max(0, t.life/.1); c.strokeStyle=t.color; c.lineWidth=3; c.beginPath(); c.moveTo(t.x1,t.y1); c.lineTo(t.x2,t.y2); c.stroke(); c.globalAlpha=1; }
    for (const n of this.alertPings) { c.globalAlpha = Math.max(0, n.life/.7)*.3; c.strokeStyle='#ff4d6d'; c.lineWidth=2; c.beginPath(); c.arc(n.x,n.y,n.radius*(1-n.life/.7),0,Math.PI*2); c.stroke(); c.globalAlpha=1; }
    for (const f of this.floaters) { c.globalAlpha = Math.max(0, f.life); c.fillStyle=f.color; c.font='bold 18px system-ui'; c.textAlign='center'; c.fillText(f.text,f.x,f.y); c.globalAlpha=1; }
  }

  drawScreenUI(c) {
    c.save();
    c.fillStyle='rgba(4,8,18,.72)'; c.fillRect(14,14,315,96);
    c.strokeStyle='rgba(83,244,255,.22)'; c.strokeRect(14.5,14.5,314,95);
    c.fillStyle='#eaffff'; c.font='bold 16px system-ui'; c.textAlign='left'; c.fillText('ECHO EXTRACTION',28,38);
    c.font='13px system-ui'; c.fillStyle='#b9c7da'; c.fillText(this.mission.objective,28,62);
    const near = this.nearestInteractionText(); c.fillStyle= near ? '#ffdf7e' : '#7f8ea8'; c.fillText(near || 'Move • Shoot • Loot • Extract',28,86);
    this.drawBars(c);
    this.drawMiniMap(c);
    if (this.toastTimer > 0 && this.toastText) {
      c.fillStyle='rgba(4,8,18,.84)'; c.fillRect(150,536,500,42); c.strokeStyle='rgba(255,184,77,.28)'; c.strokeRect(150.5,536.5,499,41);
      c.fillStyle='#ffdf7e'; c.font='14px system-ui'; c.textAlign='center'; c.fillText(this.toastText,400,562);
    }
    c.restore();
  }

  drawBars(c) {
    const p=this.player, x=28, y=124;
    const bar = (label, pct, color, yy) => { c.fillStyle='rgba(255,255,255,.10)'; c.fillRect(x,yy,170,8); c.fillStyle=color; c.fillRect(x,yy,170*Utils.clamp(pct,0,1),8); c.fillStyle='#d7e6ff'; c.font='11px system-ui'; c.textAlign='left'; c.fillText(label,x+180,yy+8); };
    bar('Health', p.health/100, '#42f59e', y);
    bar('Armor', p.armor/100, '#60a5fa', y+14);
    bar('Stamina', p.stamina/100, '#ffb84d', y+28);
  }

  drawMiniMap(c) {
    const w=180,h=124,x=604,y=18,sx=w/this.worldW,sy=h/this.worldH;
    c.fillStyle='rgba(5,10,22,.78)'; c.fillRect(x,y,w,h); c.strokeStyle='rgba(83,244,255,.35)'; c.strokeRect(x+.5,y+.5,w-1,h-1);
    c.fillStyle='rgba(83,244,255,.22)'; c.fillRect(x+this.extractZone.x*sx,y+this.extractZone.y*sy,this.extractZone.w*sx,this.extractZone.h*sy);
    c.fillStyle='#42f59e'; c.fillRect(x+this.terminal.x*sx-2,y+this.terminal.y*sy-2,4,4);
    c.fillStyle='#ff4d6d'; for (const e of this.enemies) if (!e.dead) c.fillRect(x+e.x*sx-2,y+e.y*sy-2,4,4);
    c.fillStyle='#53f4ff'; c.beginPath(); c.arc(x+this.player.x*sx,y+this.player.y*sy,3,0,Math.PI*2); c.fill();
  }

  label(c, text, x, y, color) { c.fillStyle=color; c.font='bold 13px system-ui'; c.fillText(text,x,y); }

  nearestInteractionText() {
    const p=this.player;
    const d=this.doors.find(d=>!d.open && this.rectDistance(p.x,p.y,d)<58); if (d) return `Press E/F: ${d.locked ? d.needs : 'open '+d.name}`;
    const crate=this.crates.find(c=>!c.opened && Math.hypot(c.x-p.x,c.y-p.y)<62); if (crate) return `Press E/F: open ${crate.label}`;
    if (Math.hypot(p.x-this.terminal.x,p.y-this.terminal.y)<78 && !this.mission.dataCore) return 'Press E/F: download data core';
    if (this.pointInRect(p.x,p.y,this.extractZone)) return this.mission.dataCore ? 'Press E/F: extract now' : 'Extraction locked until data core recovered';
    if (p.medkits > 0 && (p.health < 80 || p.bleeding)) return 'Press M: use medkit';
    return '';
  }

  handleDirection(direction) {
    const angles = {right:0,left:Math.PI,up:-Math.PI/2,down:Math.PI/2};
    if (direction in angles) this.player.angle = angles[direction];
  }
  handleAction(action) { if (action === 'action') { if (!this.tryInteract()) this.fireWeapon(); } if (action === 'secondary') this.reload(); }
  handleKey(_event) {}
}

window.addEventListener('DOMContentLoaded', () => {
  window.currentGame = new EchoExtractionGame();
  window.currentGame.start();
});
