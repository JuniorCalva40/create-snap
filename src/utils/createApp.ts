import path from 'node:path';
import fs from 'fs-extra';
import { PackageJson, ProjectConfig } from '../interfaces/index.js';
import { confirm } from '@clack/prompts';

export const createApp = async ({
  nameApp,
  framework,
  language,
  testFramework,
  additionalFeatures,
}: ProjectConfig) => {
  const cwd = process.cwd();
  const __dirname = path.dirname(new URL(import.meta.url).pathname);

  const targetDir = path.join(cwd, nameApp);

  const templateDir = path.resolve(
    __dirname,
    '..',
    '..',
    'templates',
    framework,
    language
  );

  const testDir = path.resolve(
    __dirname,
    '..',
    '..',
    'templates',
    'config',
    'test-runner',
    testFramework,
    language
  );
  const additionalFeaturesDir = path.resolve(
    __dirname,
    '..',
    '..',
    'templates',
    'config',
    'linters-formatters',
    additionalFeatures,
    language
  );

  console.log(templateDir, testDir, additionalFeaturesDir);

  // if (!fs.existsSync(templateDir)) {
  //   throw new Error(`Template not found: ${templateDir}`);
  // }

  // initTargetDir(targetDir);
  // const templatePaths = [templateDir, testDir, additionalFeaturesDir];

  // mergePackageJson(nameApp, targetDir, templatePaths);

  // copyTemplateFiles(templatePaths, targetDir);

  // renameSpecialFiles(targetDir);

  console.log('\n✅ Project created successfully! 🎉\n');
  console.log('Next steps:');
  console.log(`1. cd ${nameApp}`);
  console.log('2. npm install');
  console.log('3. npm run dev\n');
};

const initTargetDir = async (targetDir: string) => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    return;
  }
  if (fs.readdirSync(targetDir).length === 0) return;
  console.warn(
    `⚠️ The target directory "${targetDir}" is not empty and will be overwritten!`
  );
  console.info('🗑️ Clearing existing directory...');
  fs.emptyDirSync(targetDir);
};

function mergePackageJson(
  nameApp: string,
  targetDir: string,
  templatePaths: string[]
) {
  let basePackage: PackageJson = {
    name: nameApp,
    type: 'module',
    dependencies: {},
    devDependencies: {},
    scripts: {},
  };

  let isBaseSet = false;

  templatePaths.forEach((templatePath) => {
    const packageJsonPath = path.join(templatePath, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = fs.readJsonSync(packageJsonPath);

      if (!isBaseSet) {
        basePackage = { ...packageJson };
        isBaseSet = true;
      } else {
        basePackage.dependencies = {
          ...basePackage.dependencies,
          ...packageJson.dependencies,
        };
        basePackage.devDependencies = {
          ...basePackage.devDependencies,
          ...packageJson.devDependencies,
        };
        basePackage.scripts = {
          ...basePackage.scripts,
          ...packageJson.scripts,
        };
      }
    }
  });

  fs.writeJsonSync(path.join(targetDir, 'package.json'), basePackage, {
    spaces: 2,
  });
}

function copyTemplateFiles(templatePaths: string[], targetDir: string) {
  templatePaths.forEach((templatePath) => {
    if (fs.existsSync(templatePath)) {
      fs.copySync(templatePath, targetDir, {
        overwrite: false, // No sobrescribe archivos existentes (ej. package.json)
        filter: (src) => path.basename(src) !== 'package.json', // Evita copiar package.json
      });
    }
  });
}

function renameSpecialFiles(targetDir: string) {
  const specialFiles = {
    _env: '.env',
    _gitignore: '.gitignore',
  };

  Object.entries(specialFiles).forEach(([oldName, newName]) => {
    const oldPath = path.join(targetDir, oldName);
    const newPath = path.join(targetDir, newName);

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
    }
  });
}
