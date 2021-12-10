#!/usr/bin/env node

import glob from 'glob';
import fs from 'fs';

const run = () => {
    const files = glob.sync('src/**/*.{js,jsx}', {nodir: true});

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const hasJsx = content.includes('/>') || content.includes('</');
        const targetExt = hasJsx ? 'tsx' : 'ts';
        const filePrefix = file.slice(0, file.lastIndexOf('.'));
        const nextFile = `${filePrefix}.${targetExt}`;
        fs.unlinkSync(file);
        fs.writeFileSync(nextFile, `// @ts-nocheck\n${content}`, 'utf-8');
    });
};

run();
