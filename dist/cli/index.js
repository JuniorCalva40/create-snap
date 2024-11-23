import colors from 'picocolors';
import { cancel, group, intro, outro, select, text } from '@clack/prompts';
import { TITLE } from '../helpers/constants.js';
import { createApp } from '../helpers/createApp.js';
const { white, bgBlue, gray, green, yellow } = colors;
const Frameworks = [
    {
        value: 'express',
        label: 'Express',
        color: white,
    },
    {
        value: 'fastify',
        label: 'Fastify',
        color: white,
    },
    {
        value: 'koa',
        label: 'Koa',
        color: white,
    },
];
const FrameworksTest = [
    {
        value: 'vitest',
        label: 'Vitest',
        color: yellow,
    },
    {
        value: 'jest',
        label: 'Jest',
        color: green,
    },
    {
        value: 'ava',
        label: 'Ava',
        color: white,
    },
    {
        value: 'none',
        label: 'None',
        color: gray,
    },
];
const init = async () => {
    intro(bgBlue(TITLE));
    const { nameApp, language, framework, testFramework } = await group({
        nameApp: () => text({
            message: 'What is the name of your app?',
            placeholder: 'my-app',
            validate(value) {
                if (value.length === 0)
                    return 'Please enter a name for your app.';
            },
        }),
        framework: ({ results }) => select({
            message: 'Select a framework: ',
            options: Frameworks.map((f) => {
                return {
                    value: f.value,
                    label: f.color(f.label),
                };
            }),
        }),
        language: ({ results }) => select({
            message: 'Select your language:',
            options: [
                {
                    value: 'ts',
                    label: 'TypeScript',
                },
                {
                    value: 'js',
                    label: 'JavaScript',
                },
            ],
        }),
        testFramework: ({ results }) => select({
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
    const config = {
        nameApp,
        language: language,
        framework: framework,
        testFramework: testFramework,
    };
    createApp(config);
    outro(bgBlue(` You're all set! :) `));
};
init();
