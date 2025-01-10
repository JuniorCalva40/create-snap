/* Version Map For Testing, Config Eslint and TypeScript */
export const dependencyVersionMap = {
  // Vitest JS
  vitest: '^2.1.4',

  // Jest JS dependencies
  '@swc/core': '^1.9.1',
  '@swc/jest': '^0.2.37',
  jest: '^29.7.0',
  supertest: '^7.0.0',

  // Additional TypeScript types for testing
  '@types/supertest': '^6.0.2',
  '@types/jest': '^29.5.14',
} as const;

export type AvailableDependencies = keyof typeof dependencyVersionMap;
