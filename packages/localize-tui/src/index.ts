#!/usr/bin/env node
import { parseConfig } from "./config";
import { getAction } from "./actions/index";
import { LocalizeConfig } from "./types/config";

export class Instance {
  config!: LocalizeConfig;

  async run() {
    this.config = await parseConfig();

    const Action = await getAction(this.config);
    await new Action(this).run();
  }
}

if (process.platform === "win32") {
  // fix issue with bun (https://github.com/SBoudrias/Inquirer.js/issues/1478)
  const { createInterface } = await import("node:readline");
  createInterface({
    input: process.stdin,
    output: process.stdout,
  }).on("SIGINT", () => {
    process.emit("SIGINT");
  });
}

await new Instance().run();
