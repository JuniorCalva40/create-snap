import colors from "picocolors";
import { setTimeout as sleep } from "node:timers/promises";
import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
const { white, bgBlue, gray, green, yellow } = colors;

// Usage create-snap [option] [args]

// Frameworks Available Support
enum FrameworkName {
  express = "express",
  fastify = "fastify",
  hapi = "hapi",
}

//Frameworks Available Test
enum FrameworkNameTest {
  jest = "jest",
  mocha = "mocha",
  vitest = "vitest",
  none = "none",
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
    label: "Express",
    color: white,
  },
  {
    value: FrameworkName.fastify,
    label: "Fastify",
    color: white,
  },
  {
    value: FrameworkName.hapi,
    label: "Hapi",
    color: white,
  },
];

const FrameworksTest: Framework[] = [
  {
    value: FrameworkNameTest.vitest,
    label: "Vitest",
    color: yellow,
  },
  {
    value: FrameworkNameTest.jest,
    label: "Jest",
    color: green,
  },
  {
    value: FrameworkNameTest.mocha,
    label: "Mocha",
    color: white,
  },
  {
    value: FrameworkNameTest.none,
    label: "None",
    color: gray,
  },
];

//Function prompts
const init = async () => {
  intro(bgBlue(" create-my-app "));
  const nameProject = await text({
    message: "What is the name of your app?",
    placeholder: "project-name",
  });

  if (isCancel(nameProject)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const frameworkType = await select({
    message: "Pick a framework .",
    options: Frameworks.map((f) => {
      return {
        value: f.value,
        label: f.color(f.label),
      };
    }),
  });

  if (isCancel(frameworkType)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const useTypescript = await select({
    message: "Use TypeScript?",
    options: [
      {
        value: true,
        label: "Yes",
      },
      {
        value: false,
        label: "No",
      },
    ],
  });

  if (isCancel(useTypescript)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const frameWorkTest = await select({
    message: "Pick a framework for Test .",
    options: FrameworksTest.map((f) => {
      return {
        value: f.value,
        label: f.color(f.label),
      };
    }),
  });

  if (isCancel(frameWorkTest)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const s = spinner();
  s.start("Installing via npm");

  await sleep(3000);

  s.stop("Installed via npm");

  await sleep(1000);

  outro(bgBlue(` You're all set! :) `));
};

init();
