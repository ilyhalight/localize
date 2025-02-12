import path from "node:path";
import fs from "node:fs/promises";
import { styleText } from "node:util";

import SparkMD5 from "spark-md5";

import BaseAction from "./base";
import { prettyStringify } from "../utils";

export default class UpdateHashAction extends BaseAction {
  async run() {
    const files = await this.getAllLocales();

    const hashes: Record<string, string> = {};
    await Promise.all(
      files.map(async (file) => {
        const locale = file.replace(".json", "");
        const localeText = await this.getLocaleText(file);
        hashes[locale] = SparkMD5.hash(localeText);
      }),
    );

    const { rootPath, hashFile } = this.instance.config;
    const hashFilePath = path.resolve(rootPath, hashFile);
    const hashData = Object.fromEntries(Object.entries(hashes).sort());
    await fs.writeFile(hashFilePath, prettyStringify(hashData));

    const localesCount = Object.keys(hashes).length.toString();
    console.log(
      `${styleText("green", "√")} Successfully updated hashes for ${styleText(
        "yellow",
        localesCount,
      )} locales!`,
    );
  }
}
