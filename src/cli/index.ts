import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import colors from 'picocolors';
import path from 'node:path';
import { cancel, group, intro, outro, select, text } from '@clack/prompts';
import { getAgentUserInfo } from '../helpers/getAgentUserInfo.js';
import { TITLE, cwd } from '../helpers/constants.js';

const { white, bgBlue, gray, green, yellow } = colors;

interface Framework {
  value: string;
  color: (input: string) => string;
}

//FrameWorks Supported
const Frameworks: Framework[] = [
  {
    value: 'Express',
    color: white,
  },
  {
    value: 'Fastify',
    color: white,
  },
  {
    value: 'koa',
    color: white,
  },
];

const FrameworksTest: Framework[] = [
  {
    value: 'Vitest',
    color: yellow,
  },
  {
    value: 'Jest',
    color: green,
  },
  {
    value: 'None',
    color: gray,
  },
];

//Function prompts CLI
const init = async () => {
  intro(bgBlue(TITLE));

  const responses = await group(
    {
      nameApp: () =>
        text({
          message: 'What is the name of your app?',
          placeholder: 'my-app',
          validate(value) {
            if (value.length === 0) return 'Please enter a name for your app.';
          },
        }),
      selectedframework: ({ results }) =>
        select({
          message: 'Select a framework:',
          options: Frameworks.map((f) => {
            return {
              value: f.value,
              label: f.color(f.value),
            };
          }),
        }),
      useTypescript: ({ results }) =>
        select({
          message: 'Do you want to use TypeScript?',
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
      testFramework: ({ results }) =>
        select({
          message: 'Pick a framework for Test .',
          options: FrameworksTest.map((f) => {
            return {
              value: f.value,
              label: f.color(f.value),
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

  let framework = responses.selectedframework as string;
  let testFramework = responses.testFramework as string;
  let useTypescript = responses.useTypescript as boolean;

  framework = `${framework.toLocaleLowerCase()}-${useTypescript ? 'ts' : 'js'}`;

  const targetDir = path.join(cwd, responses.nameApp);
  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '..',
    '..',
    '..',
    `templates/${framework}`
  );

  const renameFiles: Record<string, string | undefined> = {
    _gitignore: '.gitignore',
    _env: '.env',
    '_eslint.config.js': 'eslint.config.js',
    '_eslint.config.mjs': 'eslint.config.js',
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
  console.log(files);

  // for (const file of files.filter((f) => f !== 'package.json')) {
  //   write(file);
  // }

  //Get Package Json and parser Object.
  // const pkgPath = path.join(templateDir, 'package.json');
  // const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  // const newPackageJson = {
  //   name: groups.name,
  //   version: '0.1.0',
  //   type: 'module',
  //   private: true,
  //   scripts: {},
  //   author: '',
  //   license: 'ISC',
  //   dependencies: {},
  //   devDependencies: {},
  // };

  // if (groups.useTypescript === false) {
  //   newPackageJson.scripts = {
  //     start: 'node src/index.js',
  //     dev: 'node --watch src/index.js',
  //     lint: 'eslint',
  //   };
  //   newPackageJson.dependencies = {
  //     dotenv: '^16.4.5',
  //   };
  //   newPackageJson.devDependencies = {
  //     '@eslint/js': '^9.13.0',
  //     eslint: '^9.13.0',
  //     globals: '^15.11.0',
  //   };
  // }
  // if (groups.useTypescript) {
  //   newPackageJson.scripts = {
  //     build: 'tsc',
  //     start: 'node dist/index.js',
  //     dev: 'tsx --watch src/index.ts',
  //     lint: 'eslint',
  //   };
  //   newPackageJson.dependencies = {
  //     dotenv: '^16.4.5',
  //   };
  //   newPackageJson.devDependencies = {
  //     '@eslint/js': '^9.13.0',
  //     '@types/dotenv': '^6.1.1',
  //     '@types/express': '^5.0.0',
  //     tsx: '^4.19.2',
  //     typescript: '^5.6.3',
  //     eslint: '^9.13.0',
  //     globals: '^15.11.0',
  //     'typescript-eslint': '^8.12.2',
  //   };
  // }
  // if (groups.selectedFramework === 'express') {
  //   newPackageJson.dependencies = {
  //     ...newPackageJson.dependencies,
  //     express: '^4.21.1',
  //   };
  // }
  // if (groups.selectedTestFramework === 'jest') {
  //   newPackageJson.scripts = {
  //     ...newPackageJson.scripts,
  //     test: 'jest',
  //   };
  //   newPackageJson.devDependencies = {
  //     ...newPackageJson.devDependencies,
  //     jest: '^29.7.0',
  //     '@types/jest': '^29.5.12',
  //     'ts-jest': '^29.1.2',
  //   };
  // }

  // write('package.json', JSON.stringify(newPackageJson, null, 2) + '\n');

  outro(bgBlue(` You're all set! :) `));
};

init();

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
