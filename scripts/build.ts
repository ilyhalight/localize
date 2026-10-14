import { $ } from "bun";

async function build(packageName: string, extraScripts: string[] = []) {
  console.log(`Building @toil/${packageName}...`);
  const packageUrl = `./packages/${packageName}`;
  $.cwd(packageUrl);
  await $`rm -rf dist`;
  for await (const script of extraScripts) {
    await $`bun ${script}`;
  }

  await $`tsc --project tsconfig.build.json --outdir ./dist && tsc-esm-fix --tsconfig tsconfig.build.json`;

  $.cwd("./");
}

await build("localize-tui");
await $`bun ./scripts/schema-gen.ts`;
