import path from 'node:path';
import fs from 'node:fs';
import { cwd, __dirname } from './constants.js';
import { ProjectConfig } from '../interfaces/index.js';
import { createPackageJson } from './utils.js';

export const createApp = (opts: ProjectConfig) => {
  const { framework, language, nameApp, testFramework } = opts;
  const targetDir = path.join(cwd, nameApp);
  const templateDir = path.resolve(
    __dirname,
    '..',
    '..',
    `templates/${framework}-${language}`
  );

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template not found: ${templateDir}`);
  }

  initTargetDir(targetDir);

  const renameFiles: Record<string, string> = {
    _gitignore: '.gitignore',
    _env: '.env',
    '_eslint.config.js': 'eslint.config.js',
  };

  const renameFile = (file: string) => renameFiles[file] ?? file;

  const write = (file: string, content?: string) => {
    const targetPath = path.join(targetDir, renameFile(file));
    try {
      if (content) {
        fs.writeFileSync(targetPath, content);
      } else {
        copy(path.join(templateDir, file), targetPath);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file);
  }

  write('package.json', createPackageJson(templateDir, opts));
};

function initTargetDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copy(src: string, dest: string): void {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}
