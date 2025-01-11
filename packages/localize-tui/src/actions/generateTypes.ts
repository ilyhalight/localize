import path from "node:path";
import fs from "node:fs/promises";
import { styleText } from "node:util";

import BaseAction from "./base";
import { genObjectTypes } from "../utils";

export default class GenerateTypesAction extends BaseAction {
  async run() {
    const { rootPath, withTypes, typesFile } = this.instance.config;
    if (!withTypes) {
      return;
    }

    const files = await this.getAllLocales();
    const typesFilePath = path.resolve(rootPath, typesFile);
    const locales = files
      .map((file) => `"${file.replace(".json", "")}"`)
      .join(" | ");
    const localeData = await this.loadLocale("en.json");
    const phrases = genObjectTypes(localeData);
    const generatedTypes = [
      `export type Locale = ${locales};`,
      `export type Hashes = Record<Locale, string>;`,
      `export type Phrases = ${phrases}`,
    ].join("\n\n");
    const types = `// This file is autogenerated. Don't modify it manually!\n${generatedTypes}\n`;

    await fs.writeFile(typesFilePath, types);

    console.log(
      `${styleText("green", "√")} Typings has been successfully generated!`,
    );
  }
}
