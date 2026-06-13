import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const rootDir = process.cwd();
const exploreDir = path.resolve(rootDir, 'todayler:explore');
const exploreDistDir = path.resolve(exploreDir, 'dist');
const publicExploreDir = path.resolve(rootDir, 'public/explore');

if (!existsSync(path.resolve(exploreDir, 'package.json'))) {
  console.error('Missing todayler:explore/package.json');
  process.exit(1);
}

const buildResult = spawnSync('npm', ['run', 'build'], {
  cwd: exploreDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_BASE_PATH: '/explore/',
  },
});

if (buildResult.status !== 0) {
  process.exit(buildResult.status ?? 1);
}

if (!existsSync(exploreDistDir)) {
  console.error(`Missing build output: ${exploreDistDir}`);
  process.exit(1);
}

rmSync(publicExploreDir, { recursive: true, force: true });
mkdirSync(publicExploreDir, { recursive: true });
cpSync(exploreDistDir, publicExploreDir, { recursive: true });

const syncedIndexPath = path.resolve(publicExploreDir, 'index.html');
if (existsSync(syncedIndexPath)) {
  const syncedIndex = readFileSync(syncedIndexPath, 'utf8').replaceAll(
    'https://todayler.com"',
    'https://todayler.com/explore"',
  );
  writeFileSync(syncedIndexPath, syncedIndex, 'utf8');
}

console.log(`Synced ${exploreDistDir} -> ${publicExploreDir}`);
