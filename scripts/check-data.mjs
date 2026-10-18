import fs from 'node:fs';
import path from 'node:path';

const { games } = JSON.parse(fs.readFileSync('db.json', 'utf8'));
if (games.length < 20) throw new Error('Need at least 20 games');
if (new Set(games.map(g => g.id)).size !== games.length) throw new Error('Duplicate game IDs');
for (const game of games) {
  if (typeof game.id !== 'string' || !game.title || !game.description || !Number.isFinite(game.price) || game.price < 0) throw new Error(`Invalid game ${game.id}`);
  if (!fs.existsSync(path.join('public', game.cover))) throw new Error(`Missing cover ${game.cover}`);
  if (!Number.isFinite(Date.parse(game.releaseDate))) throw new Error(`Invalid releaseDate ${game.id}`);
}
console.log(`Validated ${games.length} games: unique IDs, prices, dates and local cover files.`);
