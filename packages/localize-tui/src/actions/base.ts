import path from "node:path";
import fs from "node:fs/promises";
import fsSync from "node:fs";

import { Instance } from "../index";
import { Locale } from "../types/actions";
import { prettyStringify } from "../utils";

export default class BaseAction {
  instance: Instance;
  localesPath: string;

  constructor(instance: Instance) {
    this.instance = instance;
    const { rootPath, localesDir } = this.instance.config;
    this.localesPath = path.resolve(rootPath, localesDir);
  }

  async getLocaleText(filename: string) {
    return await fs.readFile(path.resolve(this.localesPath, filename), {
      encoding: "utf8",
    });
  }

  async loadLocale(filename: string) {
    const fileContent = await this.getLocaleText(filename);

    return JSON.parse(fileContent) as Locale;
  }

  async saveLocale(filename: string, content: Locale) {
    return await fs.writeFile(
      path.resolve(this.localesPath, filename),
      prettyStringify(content),
    );
  }

  async getAllLocales() {
    const isExists = fsSync.existsSync(this.localesPath);
    if (!isExists) {
      await fs.mkdir(this.localesPath, { recursive: true });
    }

    const { ignoreLocales } = this.instance.config;
    const files = await fs.readdir(this.localesPath);
    return files.filter((file) => {
      if (!file.endsWith(".json")) {
        return false;
      }

      const locale = file.replace(".json", "");
      return !ignoreLocales.some((ignoreLocale) => ignoreLocale === locale);
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async run() {
    throw new Error("Not implemented yet");
  }
}
