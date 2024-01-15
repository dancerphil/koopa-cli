#!/usr/bin/env node

import {globSync} from 'glob';
import fs from 'fs';
import child_process from 'child_process';

const run = () => {
    const files = globSync('src/**/*.{js,jsx}', {nodir: true});

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        fs.writeFileSync(file, `// @ts-nocheck\n${content}`, 'utf-8');
    });

    console.log('Commit Part1');
    child_process.execSync('git add . && git commit -m "eject-ts: part1" --no-verify');

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const hasJsx = content.includes('/>') || content.includes('</');
        const targetExt = hasJsx ? 'tsx' : 'ts';
        const filePrefix = file.slice(0, file.lastIndexOf('.'));
        const nextFile = `${filePrefix}.${targetExt}`;
        fs.renameSync(file, nextFile);
    });

    console.log('Commit Part2');
    child_process.execSync('git add . && git commit -m "eject-ts: part2" --no-verify');
};

run();
