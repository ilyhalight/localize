import { styleText } from "node:util";

import BaseAction from "./base";
import { Language, supportedLanguages } from "../config";

export default class GetAllLocalesAction extends BaseAction {
  async run() {
    const files = await this.getAllLocales();

    const availableLocales = files
      .map((file) => {
        const filename = file.replace(".json", "");
        const localizedName =
          filename in supportedLanguages
            ? supportedLanguages[filename as Language]
            : filename;
        return `\n  - ${localizedName} (${styleText("gray", file)})`;
      })
      .join("");
    if (!availableLocales.length) {
      console.error(styleText("red", "No locales found"));
      return;
    }

    console.log(styleText("yellow", "Available locales:"), availableLocales);
  }
}
