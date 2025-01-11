import path from "node:path";
import { $ } from "bun";

import { generateTypebox } from "./typebox-gen";

async function build(packageName: string, extraScripts: string[] = []) {
  console.log(`Building @toil/${packageName}...`);
  const packageUrl = `./packages/${packageName}`;
  const packagePath = path.join(packageUrl);
  $.cwd(packageUrl);
  await $`rm -rf dist`;
  for await (const script of extraScripts) {
    await $`bun ${script}`;
  }

  await $`tsc --project tsconfig.build.json --outdir ./dist && tsc-esm-fix --tsconfig tsconfig.build.json`;
  await generateTypebox(packagePath);
  $.cwd("./");
}

await build("localize-tui");
await $`bun ./scripts/schema-gen.ts`;
