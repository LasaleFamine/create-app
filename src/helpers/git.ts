/* eslint-disable no-empty */
import { execSync } from 'child_process';
import path from 'path';
import rimraf from 'rimraf';

const isInGitRepository = () => {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch {}
  return false;
};

const isInMercurialRepository = () => {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch {}
  return false;
};

export const tryGitInit = (root: string) => {
  let didInit = false;
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', { stdio: 'ignore' });
    didInit = true;

    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit from @lasalefamine/create-app"', {
      stdio: 'ignore',
    });
    return true;
  } catch {
    if (didInit) {
      try {
        rimraf.sync(path.join(root, '.git'));
      } catch {}
    }
    return false;
  }
};
