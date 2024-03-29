#!/usr/bin/env node

import {globSync} from 'glob';
import fs from 'fs';
import chalk from 'chalk';

const run = () => {
    const snapshotFileName = 'scripts/over140.snapshot';
    const snapshot = fs.existsSync(snapshotFileName) ? fs.readFileSync(snapshotFileName, 'utf-8') : '';

    const outputList: string[] = [];

    const isMonorepo = fs.existsSync('packages');
    const files = isMonorepo
        ? globSync('packages/**/*.{ts,tsx,js,jsx}', {nodir: true})
        : globSync('src/**/*.{ts,tsx,js,jsx}', {nodir: true});

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        if (content.split('\n').length > 140) {
            const fileName = file.slice(file.indexOf(isMonorepo ? 'packages/': 'src/'));
            outputList.push(fileName);
        }
    });

    outputList.sort();

    const output = outputList.join('\n');

    if (snapshot !== output) {
        console.log();
        console.log(chalk.yellow(' ✨ 140 行检查：文件快照发生变更，请重新 commit 后提交'));
        if (!fs.existsSync('scripts')) {
            fs.mkdirSync('scripts');
        }
        fs.writeFileSync(snapshotFileName, output, 'utf-8');
        process.exit(1);
    }
};

run();
