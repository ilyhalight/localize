import path from "node:path";
import { $ } from "bun";

import { GenX } from "@toil/typebox-genx";

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
  if (packageName === "localize-tui") {
    return $.cwd("./");
  }

  const genx = new GenX({
    root: packagePath,
    workspaceRoot: path.join(__dirname, ".."),
  });
  await $`mkdir dist/typebox`;
  await genx.generateByDir(
    path.resolve(packagePath, "src", "types"),
    path.resolve(packagePath, "dist", "typebox"),
  );

  $.cwd("./");
}

await build("localize-tui");
await $`bun ./scripts/schema-gen.ts`;
