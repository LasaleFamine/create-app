#!/usr/bin/env node

import meow from 'meow';
import { readPackageUp } from 'read-pkg-up';
import updateNotifier from 'update-notifier';

import { log } from './helpers/log.js';
import { run } from './index.js';

const cli = meow(`
  Usage
    $ lf-create-app <input>

  Options
    --template, -t  Specify template [options: next]

  Examples
    $ lf-create-app my-app --template next
`, {
  importMeta: import.meta,
  flags: {
    template: {
      type: 'string',
      alias: 't',
    },
  },
});

const notifyUpdate = async () => {
  const pkg = await readPackageUp();
  updateNotifier({ pkg: pkg?.packageJson }).notify();
};

process.on('SIGTERM', () => {
  console.log('Closing...');
  process.exit(0);
});

log.start();

// TODO remove the as { template: string } when type problem is solved
run(cli.input[0]!, cli.flags as { template: string })
  .then(notifyUpdate)
  .catch(async (error) => {
    const newError = new Error(error);
    log.fail(newError.message);
    log.fail(newError.stack);
    log.stop();

    await notifyUpdate();
    process.exit(1);
  });
