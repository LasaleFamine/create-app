#!/usr/bin/env node
import meow from 'meow';
import updateNotifier from 'update-notifier';
import readPkg from 'read-pkg-up';
import { run } from './index';
import { log } from './helpers/log';

const cli = meow(`
  Usage
    $ lf-create-app <input>

  Options
    --template, -t  Specify template [options: next]

  Examples
    $ lf-create-app my-app --template next
`, {
  flags: {
    template: {
      type: 'string',
      alias: 't' as const,
    },
  },
});

const notifyUpdate = async () => {
  const pkg = await readPkg();
  updateNotifier({ pkg: pkg?.packageJson }).notify();
};

process.on('SIGTERM', () => {
  console.log('Closing...');
  process.exit(0);
});

log.start();

// TODO remove the as { template: string } when type problem is solved
run(cli.input[0], cli.flags as { template: string })
  .then(notifyUpdate)
  .catch(async (error) => {
    const newError = new Error(error);
    log.fail(newError.message);
    log.fail(newError.stack);
    log.stop();

    await notifyUpdate();
    process.exit(1);
  });
