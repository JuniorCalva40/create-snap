//Options Available
type Framework = 'express' | 'fastify' | 'koa';
type TestFramework = 'jest' | 'vitest' | 'none';
type Language = 'ts' | 'js';

export interface ProjectConfig {
  nameApp: string;
  framework: Framework;
  testFramework: TestFramework;
  language: Language;
}

export interface PackageJson {
  name: string;
  version: string;
  description?: string;
  type: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}
