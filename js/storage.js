/** Shared Storage Manager: scores, settings, achievements, statistics.
 * Robust patch: localStorage is used when available, with in-memory fallback for browsers
 * that block storage in privacy/file modes.
 */
class StorageManager {
  static prefix = 'industryArcade.';
  static memory = {};
  static safeParse(value, fallback) { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } }
  static key(name) { return `${this.prefix}${name}`; }
  static getLocal(name, fallback = null) {
    try { return this.safeParse(localStorage.getItem(this.key(name)), fallback); }
    catch { return Object.prototype.hasOwnProperty.call(this.memory, name) ? this.memory[name] : fallback; }
  }
  static setLocal(name, value) {
    try { localStorage.setItem(this.key(name), JSON.stringify(value)); }
    catch { this.memory[name] = value; }
  }
  static saveScore(gameId, score, meta = {}) {
    const scores = this.getLocal('scores', {});
    if (!scores[gameId]) scores[gameId] = [];
    scores[gameId].push({ score: Math.max(0, Math.floor(score || 0)), date: new Date().toISOString(), ...meta });
    scores[gameId].sort((a, b) => b.score - a.score);
    scores[gameId] = scores[gameId].slice(0, 10);
    this.setLocal('scores', scores);
  }
  static getHighScores(gameId) { return (this.getLocal('scores', {})[gameId] || []); }
  static saveSetting(key, value) { const settings = this.getLocal('settings', {}); settings[key] = value; this.setLocal('settings', settings); }
  static getSetting(key, fallback = null) { const settings = this.getLocal('settings', {}); return Object.prototype.hasOwnProperty.call(settings, key) ? settings[key] : fallback; }
  static saveAchievement(gameId, achievementId, label = achievementId) {
    const achievements = this.getLocal('achievements', {});
    if (!achievements[gameId]) achievements[gameId] = {};
    achievements[gameId][achievementId] = { label, unlockedAt: new Date().toISOString() };
    this.setLocal('achievements', achievements);
  }
  static getAchievements(gameId = null) { const all = this.getLocal('achievements', {}); return gameId ? (all[gameId] || {}) : all; }
  static trackPlaySession(gameId) {
    const stats = this.getStats();
    stats.totalLaunches += 1; stats.lastPlayed = gameId;
    stats.recentlyPlayed = [gameId, ...stats.recentlyPlayed.filter(id => id !== gameId)].slice(0, 12);
    stats.games[gameId] = stats.games[gameId] || { launches: 0, playTime: 0, favorite: false };
    stats.games[gameId].launches += 1;
    this.setLocal('stats', stats);
  }
  static addPlayTime(gameId, seconds) {
    const stats = this.getStats();
    stats.totalPlayTime += Math.max(0, seconds || 0);
    stats.games[gameId] = stats.games[gameId] || { launches: 0, playTime: 0, favorite: false };
    stats.games[gameId].playTime += Math.max(0, seconds || 0);
    this.setLocal('stats', stats);
  }
  static toggleFavorite(gameId) {
    const stats = this.getStats();
    stats.games[gameId] = stats.games[gameId] || { launches: 0, playTime: 0, favorite: false };
    stats.games[gameId].favorite = !stats.games[gameId].favorite;
    if (stats.games[gameId].favorite) stats.favoriteGame = gameId;
    this.setLocal('stats', stats);
    return stats.games[gameId].favorite;
  }
  static isFavorite(gameId) { const stats = this.getStats(); return !!(stats.games[gameId] && stats.games[gameId].favorite); }
  static getStats() { return this.getLocal('stats', { totalLaunches: 0, totalPlayTime: 0, favoriteGame: null, lastPlayed: null, recentlyPlayed: [], games: {} }); }
}
window.StorageManager = StorageManager;
window.GameStorage = StorageManager;
