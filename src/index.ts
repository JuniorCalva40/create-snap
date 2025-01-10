import colors from "picocolors";
import { cancel, group, intro, outro, select, text } from "@clack/prompts";
import { TITLE } from "./helpers/constants.js";
import { createApp } from "./helpers/createApp.js";
import { ProjectConfig } from "./interfaces/index.js";

const { white, bgBlue, gray, green, yellow } = colors;

interface Framework {
  value: string;
  label: string;
  color: (input: string) => string;
}

//FrameWorks Supported
const Frameworks: Framework[] = [
  {
    value: "express",
    label: "Express",
    color: white,
  },
  {
    value: "fastify",
    label: "Fastify",
    color: white,
  },
  {
    value: "koa",
    label: "Koa",
    color: white,
  },
];

const FrameworksTest: Framework[] = [
  {
    value: "vitest",
    label: "Vitest",
    color: yellow,
  },
  {
    value: "jest",
    label: "Jest",
    color: green,
  },
  {
    value: "ava",
    label: "Ava",
    color: white,
  },
  {
    value: "none",
    label: "None",
    color: gray,
  },
];

//Function prompts CLI
const init = async () => {
  intro(bgBlue(TITLE));

  const { nameApp, language, framework, testFramework } = await group(
    {
      nameApp: () =>
        text({
          message: "What is the name of your app?",
          placeholder: "my-app",
          validate(value) {
            if (value.length === 0)
              return "Please enter a name for your project.";
          },
        }),
      framework: ({ results }) =>
        select({
          message: "Select a framework: ",
          options: Frameworks.map((f) => {
            return {
              value: f.value,
              label: f.color(f.label),
            };
          }),
        }),
      language: ({ results }) =>
        select({
          message: "Select your language:",
          options: [
            {
              value: "ts",
              label: "TypeScript",
            },
            {
              value: "js",
              label: "JavaScript",
            },
          ],
        }),
      testFramework: ({ results }) =>
        select({
          message: "Pick a framework for Test .",
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
        cancel("Operation cancelled.");
        process.exit(0);
      },
    },
  );
  const config: ProjectConfig = {
    nameApp,
    language: language as ProjectConfig["language"],
    framework: framework as ProjectConfig["framework"],
    testFramework: testFramework as ProjectConfig["testFramework"],
  };

  console.log(nameApp, language, framework, testFramework);

  createApp(config);

  outro(bgBlue(` You're all set! :) `));
};

init();
