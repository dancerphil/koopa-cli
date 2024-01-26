#!/usr/bin/env node

import {globSync} from 'glob';
import fs from 'fs';
import chalk from 'chalk';

const run = () => {
    const outputList: string[] = [];

    const isMonorepo = fs.existsSync('packages');
    const files = isMonorepo
        ? globSync('packages/**/*.{ts,tsx,js,jsx}', {nodir: true})
        : globSync('src/**/*.{ts,tsx,js,jsx}', {nodir: true});

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const fileName = file.slice(file.indexOf(isMonorepo ? 'packages/': 'src/'));
        const segments = fileName.split('/');
        const moduleAndDir = `${segments[1]}/${segments[2]}`;

        if (content.includes(`'@/${moduleAndDir}`)) {
            outputList.push(fileName);
        }
    });

    outputList.sort();

    if (outputList.length > 0) {
        console.log(chalk.yellow(' ✨ 模块内聚检查失败'));
        outputList.forEach(fileName => {
            console.log();
            console.log(`  ${chalk.underline(fileName)}`);
        });
        process.exit(1);
    }
};

run();
