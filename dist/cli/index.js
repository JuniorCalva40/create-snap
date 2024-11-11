import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import colors from 'picocolors';
import path from 'node:path';
import { cancel, group, intro, outro, select, text } from '@clack/prompts';
const { white, bgBlue, gray, green, yellow } = colors;
var FrameworkName;
(function (FrameworkName) {
    FrameworkName["express"] = "express";
    FrameworkName["fastify"] = "fastify";
    FrameworkName["koa"] = "koa";
})(FrameworkName || (FrameworkName = {}));
var FrameworkNameTest;
(function (FrameworkNameTest) {
    FrameworkNameTest["jest"] = "jest";
    FrameworkNameTest["mocha"] = "mocha";
    FrameworkNameTest["vitest"] = "vitest";
    FrameworkNameTest["none"] = "none";
})(FrameworkNameTest || (FrameworkNameTest = {}));
const Frameworks = [
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
        value: FrameworkName.koa,
        label: 'Koa',
        color: white,
    },
];
const FrameworksTest = [
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
const init = async () => {
    intro(bgBlue(' create-my-app '));
    const groups = await group({
        name: () => text({
            message: 'What is the name of your app?',
            placeholder: 'project-name',
            validate(value) {
                if (value.length === 0)
                    return 'Please enter a name for your app.';
            },
        }),
        selectedFramework: ({ results }) => select({
            message: 'Select a framework:',
            options: Frameworks.map((f) => {
                return {
                    value: f.value,
                    label: f.color(f.label),
                };
            }),
        }),
        useTypescript: ({ results }) => select({
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
        selectedTestFramework: ({ results }) => select({
            message: 'Pick a framework for Test .',
            options: FrameworksTest.map((f) => {
                return {
                    value: f.value,
                    label: f.color(f.label),
                };
            }),
        }),
    }, {
        onCancel: () => {
            cancel('Operation cancelled.');
            process.exit(0);
        },
    });
    const targetDir = path.join(cwd, groups.name || DEFAULT_TARGET_DIR);
    let framework = groups.selectedFramework;
    let frameworkTest = groups.selectedTestFramework;
    const useTypescript = groups.useTypescript;
    framework = `${framework}-${useTypescript ? 'ts' : 'js'}`;
    const pkgInfo = getAgentUserInfo(process.env.npm_config_user_agent);
    const templateDir = path.resolve(fileURLToPath(import.meta.url), '..', '..', '..', `templates/${framework}`);
    console.log(templateDir);
    const renameFiles = {
        _gitignore: '.gitignore',
        _env: '.env',
        '_eslint.config.js': 'eslint.config.js',
        '_eslint.config.mjs': 'eslint.config.js',
    };
    const write = (file, content) => {
        const targetPath = path.join(targetDir, renameFiles[file] ?? file);
        if (content) {
            fs.writeFileSync(targetPath, content);
        }
        else {
            copy(path.join(templateDir, file), targetPath);
        }
    };
    const files = fs.readdirSync(templateDir);
    for (const file of files.filter((f) => f !== 'package.json' && f !== 'package-lock.json')) {
        write(file);
    }
    const pkgPath = path.join(templateDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.name = groups.name;
    write('package.json', JSON.stringify(pkg, null, 2) + '\n');
    outro(bgBlue(` You're all set! :) `));
};
init();
function getAgentUserInfo(userAgent) {
    if (!userAgent)
        return undefined;
    const [pkgSpec, nodeSpec] = userAgent.split(' ');
    if (!pkgSpec || !nodeSpec)
        return undefined;
    const [pkgManager, pkgVersion] = pkgSpec.split('/');
    const [node, nodeVersion] = nodeSpec.split('/');
    return { pkgManager, pkgVersion, node, nodeVersion };
}
function copy(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        copyDir(src, dest);
    }
    else {
        fs.copyFileSync(src, dest);
    }
}
function copyDir(srcDir, destDir) {
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);
        copy(srcFile, destFile);
    }
}
