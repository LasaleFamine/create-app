import chalk from 'chalk';
import emptyDir from 'empty-dir';
import { writeFileSync } from 'fs';
import makeDir from 'make-dir';
import os from 'os';
import path from 'path';
import { install } from 'pkg-install';

import { getCommonApp, getNextApp, templatesDepencencies } from './apps.js';
import { copyAll } from './helpers/copy.js';
import { tryGitInit } from './helpers/git.js';
import { log } from './helpers/log.js';
import { Templates } from './types.js';

type Props = {
  appPath: string;
  template: Templates;
}

export const createApp = async ({ appPath, template }: Props) => {
  const root = path.resolve(appPath);
  const name = path.basename(root);
  const originalDirectory = process.cwd();

  await makeDir(root);
  const rootIsEmpty = await emptyDir(root).catch(() => false);
  if (!rootIsEmpty) {
    log.fail(`The choosen folder is not empty: ${root}`);
    log.info('Try to remove the folder or try with another one.');
    process.exit(1);
  }

  log.color = 'yellow';
  log.start(`Creating a new app in: ${chalk.green(root)}.`);

  process.chdir(root);

  const commonApp = getCommonApp(name);
  const mainTemplateApp = getNextApp();
  const templateSpecific = templatesDepencencies[template] || { direct: [], dev: [], package: {} };

  const packageJSON = {
    ...commonApp.package,
    ...mainTemplateApp.package,
    ...templateSpecific.package,
  };

  writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJSON, null, 2) + os.EOL,
  );

  await copyAll({
    appRoot: root,
    baseTemplate: mainTemplateApp.defaultTemplate,
    specificTemplate: template,
  });

  const allDirectDeps = [
    ...commonApp.deps.direct,
    ...mainTemplateApp.deps.direct,
    ...templateSpecific.direct,
  ];

  const allDevDeps = [
    ...commonApp.deps.dev,
    ...mainTemplateApp.deps.dev,
    ...templateSpecific.dev,
  ];

  log.succeed('Content copied correctly and package.json written.');

  log.start(`Installing dependencies: ${chalk.cyan(allDirectDeps.join(', '))}`);
  await install(allDirectDeps, { cwd: root });
  log.succeed('Dependencies installed.');

  log.start(`Installing dev dependencies: ${chalk.gray(allDevDeps.join(', '))}`);
  await install(allDevDeps, { dev: true, cwd: root });
  log.succeed('Dev dependencies installed.');

  if (tryGitInit(root)) {
    log.succeed('Initialized git repository.');
  }

  const cdPath = path.join(originalDirectory, name) === appPath ? name : appPath;

  log.succeed(`${chalk.green('Success!')} Created ${chalk.cyan(name)} at ${chalk.cyan(appPath)}`);
  log.info(`
    Available commands:

      ${chalk.cyan('yarn dev')}

        Starts dev server.


      ${chalk.cyan('yarn build')}

        Build the app for production.


      ${chalk.cyan('yarn start')}

        Runs the built app in production mode.


    For start developing run:

      ${chalk.cyan(`cd ${cdPath}`)} && ${chalk.cyan('yarn dev')}
  `);
};
