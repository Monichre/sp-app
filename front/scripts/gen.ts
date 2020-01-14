const childProcess = require('child_process');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');

const writeFile = (p, ...args) => {
    fs.writeFileSync(p, ...args);
};

// Arguments 
const inputComponentName = process.argv[2]
const antComp = process.argv[3] === '--antd'
const workspace = '../src/App';

// Paths 
const rootPath = path.join(__dirname, `${workspace}`);
const allComponentsPath = path.join(rootPath, 'Components')
const compRoot = path.join(
    allComponentsPath, inputComponentName
);

if (fs.existsSync(compRoot)) {
    console.error('Component already exists.');
    // @ts-ignore
    return;
}

mkdirp.sync(compRoot);


/**
 *
 * Gen Storybook File
 *
 */

writeFile(
    path.join(compRoot, `${inputComponentName}.stories.tsx`),
    `import * as React from 'react';
import { ${inputComponentName} } from './${inputComponentName}';\n

export default { title: '${inputComponentName}' };

export const ${inputComponentName}FirstStory = () => <${inputComponentName} />;
`);


writeFile(
    path.join(compRoot, `${inputComponentName}.styles.tsx`),
    `import * as React from 'react';
import styled, { css } from 'styled-components';\n

// Write some styles mutha fuckah


`);


/**
 *
 * Gen Core Component File
 *
 */


if (antComp) {
    writeFile(
        path.join(compRoot, `${inputComponentName}.tsx`),
        `export { ${inputComponentName} } from 'antd';`
    );
} else {

    writeFile(
        path.join(compRoot, `${inputComponentName}.tsx`),
        `import * as React from 'react';\n

export interface ${inputComponentName}Props {
            
}

export const ${inputComponentName}: React.SFC<${inputComponentName}Props> = () => {
    return (
        <div>Do some cool shit</div>
    );
}`
    );
}