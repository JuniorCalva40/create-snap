//Options Available
export type Framework = 'express' | 'fastify' | 'hono';
export type TestFramework = 'jest' | 'vitest' | 'node-test' | 'none';
export type Language = 'ts' | 'js';
export type AdditionalFeatures =
  | 'none'
  | 'eslint'
  | 'eslint-prettier'
  | 'biome';

export interface ProjectConfig {
  nameApp: string;
  language: Language;
  framework: Framework;
  testFramework: TestFramework;
  additionalFeatures: AdditionalFeatures;
}

export interface PackageJson {
  name: string;
  type: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}
