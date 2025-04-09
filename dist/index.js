import colors from 'picocolors';
import { cancel, group, intro, outro, select, text, spinner, } from '@clack/prompts';
import { createApp } from './utils/createApp.js';
const { white, bgBlue, green, gray, whiteBright, yellow, yellowBright, blueBright, magentaBright, } = colors;
const Frameworks = [
    {
        value: 'express',
        label: 'Express',
        color: whiteBright,
        hint: 'Fast, unopinionated, minimalist web framework',
    },
    {
        value: 'fastify',
        label: 'Fastify',
        color: white,
        hint: 'High performance web framework',
    },
    {
        value: 'hono',
        label: 'Hono',
        color: yellowBright,
        hint: 'Ultrafast web framework for the Edges',
    },
];
const FrameworksTest = [
    {
        value: 'vitest',
        label: 'Vitest',
        color: yellow,
        hint: 'Next generation testing framework',
    },
    {
        value: 'jest',
        label: 'Jest',
        color: green,
        hint: 'Popular testing framework with built-in assertions',
    },
    {
        value: 'node-test',
        label: 'Node Test Runner',
        color: green,
        hint: 'Built-in test runner for Node.js',
    },
    {
        value: 'none',
        label: 'None',
        color: gray,
        hint: 'Skip testing setup',
    },
];
const AdditionalFeaturesList = [
    {
        value: 'eslint',
        label: 'ESLint',
        hint: 'Code linting only',
        color: yellowBright,
    },
    {
        value: 'eslint-prettier',
        label: 'ESLint + Prettier',
        hint: 'Code linting and formatting',
        color: magentaBright,
    },
    {
        value: 'biome',
        label: 'Biome',
        color: blueBright,
        hint: 'All-in-one formatter and linter',
    },
    {
        value: 'none',
        label: 'None',
        color: gray,
        hint: 'Skip linting and formatting setup',
    },
];
const validateProjectName = (value) => {
    if (value.length === 0)
        return 'Please enter a name for your project.';
    if (value.length > 214)
        return 'Project name is too long.';
    if (!/^[a-z0-9-]+$/.test(value)) {
        return 'Project name can only contain lowercase letters, numbers, and hyphens.';
    }
    if (value.startsWith('.') || value.startsWith('_')) {
        return 'Project name cannot start with a dot or underscore.';
    }
};
const init = async () => {
    console.clear();
    intro(bgBlue(` 🚀 Welcome to the Node.js Project Generator `));
    try {
        const { nameApp, language, framework, testFramework, additionalFeatures } = await group({
            nameApp: () => text({
                message: 'What is the name of your project?',
                placeholder: 'my-awesome-app',
                validate: validateProjectName,
            }),
            framework: ({ results }) => select({
                message: 'Select a framework:',
                options: Frameworks.map((f) => ({
                    value: f.value,
                    label: f.color(f.label),
                    hint: f.hint,
                })),
            }),
            language: ({ results }) => select({
                message: 'Select a language:',
                options: [
                    {
                        value: 'ts',
                        label: 'TypeScript',
                        hint: 'Static type checking',
                    },
                    { value: 'js', label: 'JavaScript', hint: 'Dynamic typing' },
                ],
            }),
            testFramework: ({ results }) => select({
                message: 'Select a testing framework:',
                options: FrameworksTest.map((f) => ({
                    value: f.value,
                    label: f.color(f.label),
                    hint: f.hint,
                })),
            }),
            additionalFeatures: ({ results }) => select({
                message: 'Select additional features:',
                options: AdditionalFeaturesList.map((f) => ({
                    value: f.value,
                    label: f.color(f.label),
                    hint: f.hint,
                })),
            }),
        }, {
            onCancel: () => {
                cancel('Operation cancelled.');
                process.exit(0);
            },
        });
        const config = {
            nameApp,
            language: language,
            framework: framework,
            testFramework: testFramework,
            additionalFeatures: additionalFeatures,
        };
        const s = spinner();
        s.start('Creating your project...');
        await createApp(config);
        s.stop('Project created successfully! 🎉');
        outro(`
      ${bgBlue(` Next steps: `)}
      
      ${green('1.')} cd ${config.nameApp}
      ${green('2.')} npm install
      ${green('3.')} npm run dev
      
      ${yellow('Happy coding! 🚀')}
    `);
    }
    catch (error) {
        cancel('An error occurred while creating your project.');
        console.error(error);
        process.exit(1);
    }
};
init().catch(console.error);
