import path from "node:path";
import fs from "node:fs/promises";
import { styleText } from "node:util";

import BaseAction from "./base";
import { genFlatObjectKeysType, genObjectTypes } from "../utils";

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
    const phraseData = genFlatObjectKeysType(localeData);
    const phrase = phraseData === "never" ? ` ${phraseData}` : phraseData;
    const generatedTypes = [
      `export type Locale = ${locales};`,
      `export type Hashes = Record<Locale, string>;`,
      // phrase has 1 key = 1 line, space doesn't need
      `export type Phrase =${phrase}`,
      `export type Phrases = ${phrases}`,
      `export type FlatPhrases = Record<Phrase, string>;`,
    ].join("\n\n");
    const types = `// This file is autogenerated. Don't modify it manually!\n${generatedTypes}\n`;

    await fs.writeFile(typesFilePath, types);

    console.log(
      `${styleText("green", "√")} Typings has been successfully generated!`,
    );
  }
}
