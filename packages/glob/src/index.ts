#!/usr/bin/env node

import {globSync} from 'glob';
import fs from 'fs';
import chalk from 'chalk';

const getFilePattern = () => {
    const argv = process.argv.slice(2);
    if (argv[0] && argv[0].includes('.')) {
        return {
            name: argv[0],
            pattern: argv[0],
        };
    }
    if(argv.length === 1) {
        return {
            name: argv[0],
            pattern: `*.${argv[0]}`,
        };
    }
    return {
        name: argv.join(','),
        pattern: `*.{${argv.join(',')}}`,
    };
};

const run = () => {
    const {name, pattern} = getFilePattern();
    const snapshotFileName = `scripts/${name}.snapshot`;
    const snapshot = fs.existsSync(snapshotFileName) ? fs.readFileSync(snapshotFileName, 'utf-8') : '';

    const isMonorepo = fs.existsSync('packages');
    const files = isMonorepo
        ? globSync(`packages/**/${pattern}`, {nodir: true})
        : globSync(`src/**/${pattern}`, {nodir: true});

    const output = files.join('\n');

    if (snapshot !== output) {
        console.log();
        console.log(chalk.yellow(` ✨ 匹配${name}的文件快照发生变更，请重新 commit 后提交`));
        if (!fs.existsSync('scripts')) {
            fs.mkdirSync('scripts');
        }
        fs.writeFileSync(snapshotFileName, output, 'utf-8');
        process.exit(1);
    }
};

run();
