import chalk from 'chalk';
import path from 'path';
import prompts from 'prompts';

import { templatesDepencencies } from './apps.js';
import { createApp } from './create-app.js';
import { log } from './helpers/log.js';
import { validateAppName } from './helpers/validate-name.js';

const templatesAvailable = [{
  title: 'Next.js app with Typescript + PostCSS + CSSModules',
  value: 'next',
},
// {
//   title: 'Next.js app default + next-i18n',
//   value: 'next-i18n',
// }
];

type Flags = {
  template: string;
}

export const run = async (projectPath: string, flags: Flags) => {
  let finalProjectPath = projectPath;
  let finalTemplate = flags.template;

  log.start('Starting process for creating app...');

  if (!finalProjectPath) {
    log.stop();
    const promptResult = await prompts({
      type: 'text',
      name: 'path',
      message: 'What is your project named?',
      initial: 'my-app',
      validate: (name) => {
        const validation = validateAppName(name);
        return validation.valid || `Invalid project name: ${validation.problems.join('\n')}`;
      },
    });

    if (typeof promptResult?.path === 'string') {
      finalProjectPath = promptResult.path.trim();
    }
  }

  if (!finalProjectPath) {
    log.fail(`Please specify the project directory: ${chalk.cyan('lf-create-app')} ${chalk.green('<project-directory>')}`);
    log.info(`For example: ${chalk.cyan('lf-create-app')} ${chalk.green('my-app')}
    Run ${chalk.cyan('lf-create-app')} --help to see all options`);
    process.exit(1);
  }

  if (finalProjectPath) {
    const validationAppName = validateAppName(finalProjectPath);
    if (!validationAppName.valid) {
      log.fail(`Could not create a project called ${chalk.red(`"${finalProjectPath}"`)} because of npm naming restrictions:
        ${validationAppName.problems.join('\n')}
      `);
      process.exit(1);
    }
  }

  if (!finalTemplate) {
    log.stop();
    const promptResult = await prompts({
      type: 'select',
      name: 'template',
      message: 'Pick a template',
      choices: templatesAvailable,
    });

    if (typeof promptResult?.template === 'string') {
      finalTemplate = promptResult.template;
    }

    if (!finalTemplate) {
      log.fail('You must specify a template');
      log.info(`Run ${chalk.cyan('lf-create-app')} --help to see all options`);
      process.exit(1);
    }
  }

  if (!templatesAvailable.find(available => available.value === finalTemplate)) {
    log.fail(`Could not create a project with template ${chalk.red(`"${finalTemplate}"`)}: template not found.`);
    process.exit(1);
  }

  log.info(`Project path: ${chalk.green.bold(path.resolve(finalProjectPath))}`);
  log.info(`Template: ${chalk.green.bold(finalTemplate)}`);

  // We have everything we need
  await createApp({
    appPath: path.resolve(finalProjectPath),
    template: finalTemplate as keyof typeof templatesDepencencies,
  });
};
