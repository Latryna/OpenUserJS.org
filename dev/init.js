'use strict';

var chalk = require('chalk');

// Define some pseudo module globals
var isPro = require('../libs/debug').isPro;
var isDev = require('../libs/debug').isDev;
var isDbg = require('../libs/debug').isDbg;

//
var exec = require('child_process').exec;
var async = require('async');

console.log(chalk.yellow('Checking project dependencies. Please wait.'));

var tasks = [
  function (aCallback) {
    var cmd = 'node -v';

    exec(cmd, function (aErr, aStdout, aStderr) {
      if (aErr) {
        aCallback(aErr);
        return;
      }

      aCallback(null, ['$ ' + cmd + '\n' + chalk.gray(aStdout)]);
    });
  },
  function (aStdouts, aCallback) {
    var cmd = 'ruby -v';

    exec(cmd, function (aErr, aStdout, aStderr) {
      if (aErr) {
        aCallback(aErr);
        return;
      }

      aStdouts.push('$ ' + cmd + '\n' + chalk.gray(aStdout));
      aCallback(null, aStdouts);
    });
  },
  function (aStdouts, aCallback) {
    var cmd = 'bundler -v';

    exec(cmd, function (aErr, aStdout, aStderr) {
      if (aErr) {
        aCallback(aErr);
        return;
      }

      aStdouts.push('$ ' + cmd + '\n' + chalk.gray(aStdout));
      aCallback(null, aStdouts);
    });
  },
  function (aStdouts, aCallback) {
    var cmd = 'bundler outdated';

    exec(cmd, function (aErr, aStdout, aStderr) {
      if (aErr) {
        if (aErr.code === 7) {
          aStdouts.push('$ ' + cmd + '\n' + chalk.gray(aStdout));
          aCallback(null, false, aStdouts);
          return;
        } else {
          aCallback(aErr);
          return;
        }
      }

      aStdouts.push('$ ' + cmd + '\n' + chalk.gray(aStdout));
      aCallback(null, true, aStdouts);
    });
  },
  function (aSkip, aStdouts, aCallback) {
    var cmd = 'bundler install';

    if (aSkip) {
      aCallback(null, aStdouts);
      return;
    }

    exec(cmd, function (aErr, aStdout, aStderr) {
      if (aErr) {
        aCallback(aErr);
        return;
      }

      aStdouts.push('$ ' + cmd + '\n' + chalk.gray(aStdout));
      aCallback(null, aStdouts);
    });
  },
  function (aStdouts, aCallback) {
    var cmd = 'npm -v';

    exec(cmd, function (aErr, aStdout, aStderr) {
      if (aErr) {
        aCallback(aErr);
        return;
      }

      aStdouts.push('$ ' + cmd + '\n' + chalk.gray(aStdout));
      aCallback(null, aStdouts);
    });
  },
  function (aStdouts, aCallback) {
    var cmd = 'npm --depth 0 outdated';

    exec(cmd, function (aErr, aStdout, aStderr) {
      if (aErr) {
        aCallback(aErr);
        return;
      }

      aStdouts.push('$ ' + cmd + '\n' + chalk.gray(aStdout));
      aCallback(null, aStdouts);
    });
  }

];

async.waterfall(tasks, function (aErr, aResults) {
  if (aErr) {
    console.error(
      chalk.red('Project dependency error!\n\n'),
      'Code ' + aErr.code + '\n',
      aErr.message
    );
    return;
  }

  aResults.push(chalk.green('Returning to npm'));
  console.log(aResults.join('\n'));
});
