import path from 'node:path';
import fs from 'node:fs';
import { cwd, __dirname } from './constants.js';
import { ProjectConfig } from '../interfaces/index.js';
import { createPackageJson } from './utils.js';

export const createApp = ({
  language,
  framework,
  nameApp,
  testFramework,
}: ProjectConfig) => {
  const targetDir = path.join(cwd, nameApp);
  const templateDir = path.resolve(
    __dirname,
    '..',
    '..',
    `templates/${framework}-${language}`
  );

  const renameFiles: Record<string, string | undefined> = {
    _gitignore: '.gitignore',
    _env: '.env',
    '_eslint.config.js': 'eslint.config.js',
  };

  const write = (file: string, content?: string) => {
    const targetPath = path.join(targetDir, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file);
  }

  const newPkgJson = createPackageJson(templateDir, {
    framework,
    language,
    nameApp,
    testFramework,
  });

  write('package.json', newPkgJson);
};

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}
