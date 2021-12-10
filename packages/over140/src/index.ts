#!/usr/bin/env node

import glob from 'glob';
import fs from 'fs';
import chalk from 'chalk';

const run = () => {
    const over140FileName = 'scripts/over140.snapshot';
    const over140Snapshot = fs.existsSync(over140FileName) ? fs.readFileSync(over140FileName, 'utf-8') : '';

    const over140: string[] = [];

    const isMonorepo = fs.existsSync('packages');
    const files = isMonorepo
        ? glob.sync('packages/**/*.{ts,tsx,js,jsx}', {nodir: true})
        : glob.sync('src/**/*.{ts,tsx,js,jsx}', {nodir: true});

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        if (content.split('\n').length > 140) {
            const fileName = file.slice(file.indexOf(isMonorepo ? 'packages/': 'src/'));
            over140.push(fileName);
        }
    });

    const over140Output = over140.join('\n');

    if (over140Snapshot !== over140Output) {
        console.log();
        console.log(chalk.yellow(' ✨ 140 行以上文件发生变更，请重新 commit 后提交'));
        if (!fs.existsSync('scripts')) {
            fs.mkdirSync('scripts');
        }
        fs.writeFileSync(over140FileName, over140Output, 'utf-8');
        process.exit(1);
    }
};

run();
