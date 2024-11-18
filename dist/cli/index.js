import { fileURLToPath } from 'node:url';
import colors from 'picocolors';
import path from 'node:path';
import { cancel, group, intro, outro, select, text } from '@clack/prompts';
import { TITLE, cwd } from '../helpers/constants.js';
const { white, bgBlue, gray, green, yellow } = colors;
const Frameworks = [
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
const FrameworksTest = [
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
const init = async () => {
    intro(bgBlue(TITLE));
    const { nameApp, framework, testFramework, useTypescript } = await group({
        nameApp: () => text({
            message: 'What is the name of your app?',
            placeholder: 'my-app',
            validate(value) {
                if (value.length === 0)
                    return 'Please enter a name for your app.';
            },
        }),
        framework: ({ results }) => select({
            message: 'Select a framework:',
            options: Frameworks.map((f) => {
                return {
                    value: f.value,
                    label: f.color(f.value),
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
        testFramework: ({ results }) => select({
            message: 'Pick a framework for Test .',
            options: FrameworksTest.map((f) => {
                return {
                    value: f.value,
                    label: f.color(f.value),
                };
            }),
        }),
    }, {
        onCancel: () => {
            cancel('Operation cancelled.');
            process.exit(0);
        },
    });
    const targetDir = path.join(cwd, nameApp);
    console.log(targetDir);
    const templateDir = path.resolve(fileURLToPath(import.meta.url), '..', '..', '..', `templates/${framework}`);
    console.log(templateDir);
    outro(bgBlue(` You're all set! :) `));
};
init();
