import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import colors from 'picocolors';
import path from 'node:path';
import { cancel, group, intro, outro, select, text } from '@clack/prompts';
const { white, bgBlue, gray, green, yellow } = colors;

// Frameworks Available Support
enum FrameworkName {
  express = 'express',
  fastify = 'fastify',
  hapi = 'hapi',
}

//Frameworks Available Test
enum FrameworkNameTest {
  jest = 'jest',
  mocha = 'mocha',
  vitest = 'vitest',
  none = 'none',
}

type AllFrameworkNames = FrameworkName | FrameworkNameTest;

interface Framework {
  value: AllFrameworkNames;
  label: string;
  color: (input: string) => string;
}

const Frameworks: Framework[] = [
  {
    value: FrameworkName.express,
    label: 'Express',
    color: white,
  },
  {
    value: FrameworkName.fastify,
    label: 'Fastify',
    color: white,
  },
  {
    value: FrameworkName.hapi,
    label: 'Hapi',
    color: white,
  },
];

const FrameworksTest: Framework[] = [
  {
    value: FrameworkNameTest.vitest,
    label: 'Vitest',
    color: yellow,
  },
  {
    value: FrameworkNameTest.jest,
    label: 'Jest',
    color: green,
  },
  {
    value: FrameworkNameTest.mocha,
    label: 'Mocha',
    color: white,
  },
  {
    value: FrameworkNameTest.none,
    label: 'None',
    color: gray,
  },
];

const DEFAULT_TARGET_DIR = 'snap-project';
const cwd = process.cwd();

//Function prompts CLI
const init = async () => {
  intro(bgBlue(' create-my-app '));

  const groups = await group(
    {
      name: () =>
        text({
          message: 'What is the name of your app?',
          placeholder: 'project-name',
          validate(value) {
            if (value.length === 0) return 'Please enter a name for your app.';
          },
        }),
      selectedFramework: ({ results }) =>
        select({
          message: 'What is your age?',
          options: Frameworks.map((f) => {
            return {
              value: f.value,
              label: f.color(f.label),
            };
          }),
        }),
      useTypescript: ({ results }) =>
        select({
          message: 'Use TypeScript?',
          options: [
            {
              value: true,
              label: 'Yes',
            },
            {
              value: false,
              label: 'No',
            },
          ],
        }),
      selectedTestFramework: ({ results }) =>
        select({
          message: 'Pick a framework for Test .',
          options: FrameworksTest.map((f) => {
            return {
              value: f.value,
              label: f.color(f.label),
            };
          }),
        }),
    },
    {
      onCancel: () => {
        cancel('Operation cancelled.');
        process.exit(0);
      },
    }
  );

  const targetDir = path.join(cwd, groups.name || DEFAULT_TARGET_DIR);
  let framework = groups.selectedFramework;
  const useTypescript = groups.useTypescript as boolean;

  framework = `${framework}-${useTypescript ? 'ts' : 'js'}`;

  const pkgInfo = getAgentUserInfo(process.env.npm_config_user_agent);

  console.log(pkgInfo);

  //*FIX FOR PRODUCTION RELATIVE PATH FROM dist
  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../templates',
    `${framework}`
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

  outro(bgBlue(` You're all set! :) `));
};

init();

function getAgentUserInfo(userAgent?: string) {
  if (!userAgent) return undefined;

  const [pkgSpec, nodeSpec] = userAgent.split(' ');
  const [pkgManager, pkgVersion] = pkgSpec.split('/');
  const [node, nodeVersion] = nodeSpec.split('/');

  return { pkgManager, pkgVersion, node, nodeVersion };
}

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
