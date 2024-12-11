import path from 'node:path';
import fs from 'node:fs';
import type { PackageJson, ProjectConfig } from '../interfaces/index.js';

const DEPENDENCIES = {
  vitestJS: {
    vitest: '^2.1.4',
    supertest: '^7.0.0',
  },
  jestJS: {
    '@swc/core': '^1.9.1',
    '@swc/jest': '^0.2.37',
    jest: '^29.7.0',
    supertest: '^7.0.0',
  },
  vitestTS: {
    '@types/supertest': '^6.0.2',
    vitest: '^2.1.4',
    supertest: '^7.0.0',
  },
  jestTS: {
    '@swc/core': '^1.9.1',
    '@swc/jest': '^0.2.37',
    '@types/jest': '^29.5.14',
    '@types/supertest': '^6.0.2',
    jest: '^29.7.0',
    supertest: '^7.0.0',
  },
};

export const createPackageJson = (
  templateDir: string,
  options: ProjectConfig
) => {
  const pkgPath = path.join(templateDir, 'package.json');
  let pkg: PackageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  pkg.name = options.nameApp;

  if (options.testFramework === 'none') {
    return JSON.stringify(pkg, null, 2) + '\n';
  }

  const dependencyKey = `${
    options.testFramework
  }${options.language.toUpperCase()}` as keyof typeof DEPENDENCIES;

  const dependencies = DEPENDENCIES[dependencyKey];
  if (!dependencies) {
    throw new Error(
      `Not supported framework for ${options.testFramework} and ${options.language}`
    );
  }

  if (options.framework === 'fastify') {
    const { supertest, ...filteredDependencies } = dependencies;
    pkg.devDependencies = {
      ...pkg.devDependencies,
      ...filteredDependencies,
    };
  } else {
    pkg.devDependencies = {
      ...pkg.devDependencies,
      ...dependencies,
    };
  }

  pkg.scripts = {
    ...pkg.scripts,
    test: options.testFramework === 'vitest' ? 'vitest' : 'jest',
    ...(options.testFramework === 'jest' && {
      'test:watch': 'jest --watchAll',
    }),
  };

  return JSON.stringify(pkg, null, 2) + '\n';
};
