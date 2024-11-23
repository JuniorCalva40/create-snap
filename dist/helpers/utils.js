import path from 'node:path';
import fs from 'node:fs';
import { getAgentUserInfo } from './getAgentUserInfo.js';
const DEPENDENCIES = {
    vitest: {
        '@types/supertest': '^6.0.2',
        vitest: '^2.1.4',
        supertest: '^7.0.0',
    },
    jest: {
        '@swc/core': '^1.9.1',
        '@swc/jest': '^0.2.37',
        '@types/jest': '^29.5.14',
        '@types/supertest': '^6.0.2',
        jest: '^29.7.0',
        supertest: '^7.0.0',
    },
};
export const createPackageJson = (templateDir, options) => {
    const pkgPath = path.join(templateDir, 'package.json');
    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const info = getAgentUserInfo(process.env.npm_config_user_agent);
    pkg.name = options.nameApp;
    if (options.testFramework === 'none') {
        return JSON.stringify(pkg, null, 2) + '\n';
    }
    const dependencies = DEPENDENCIES[options.testFramework];
    if (!dependencies) {
        throw new Error(`Unsupported test framework: ${options.testFramework}`);
    }
    pkg.scripts = {
        ...pkg.scripts,
        test: options.testFramework === 'vitest' ? 'vitest' : 'jest',
        ...(options.testFramework === 'jest' && {
            'test:watch': 'jest --watchAll',
        }),
    };
    pkg.devDependencies = {
        ...pkg.devDependencies,
        ...dependencies,
    };
    return JSON.stringify(pkg, null, 2) + '\n';
};
