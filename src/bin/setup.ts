import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as commandLineArgs from 'command-line-args';
import * as chalk from 'chalk';
import { ormconfig } from '../config/configuration';

const log = console.log;

const todoList = {
  createORMFile: {
    task: "Create ormconfig.json",
    status: true
  }
};

const ROOT_DIR = path.resolve(__dirname, '..', '..');

if (fs.existsSync(`${ROOT_DIR}/.env`)) {
  dotenv.config();
}

// sample : https://www.npmjs.com/package/command-line-args
const optionDefinitions = [
  { name: 'force', alias: 'f', type: Boolean }
];
const options: {
  force: boolean,
} = commandLineArgs(optionDefinitions);

log(chalk.blue('STARTING SETUP'));
log('---------------------');

// write file
const ormconfigFile = `${ROOT_DIR}/ormconfig.json`;
if (fs.existsSync(ormconfigFile) && !options.force) {
  log(chalk.yellow(`The ormconfigfile has been existed ${ormconfigFile}`));
} else {
  try {
    fs.writeFileSync(ormconfigFile, JSON.stringify(ormconfig, null, 2));
    fs.chmodSync(ormconfigFile, 0o600);
    log(chalk.green(`Created new file ${ormconfigFile}`));
    fs.closeSync(2);
  } catch (error) {
    log(chalk.red(error));
    todoList.createORMFile.status = false;
  }
}

// statuses
Object.keys(todoList).map((k, idx) => {
  log(`${idx + 1}. ${todoList[k].task} - ${todoList[k].status ? chalk.green('success') : chalk.red('failed')}`);
});

log('---------------------');
log(chalk.blue('END SETUP'));