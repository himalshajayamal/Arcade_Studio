const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../..');
const main = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
if (/fetch\s*\(/.test(main)) throw new Error('main.js must not use fetch()');
const scripts = [];
(function walk(dir) { for (const ent of fs.readdirSync(dir, {withFileTypes:true})) { const p = path.join(dir, ent.name); if (ent.isDirectory()) walk(p); else if (p.endsWith('.js')) scripts.push(p); } })(root);
for (const s of scripts) new Function(fs.readFileSync(s, 'utf8'));
console.log(`Static check passed for ${scripts.length} JS files.`);
