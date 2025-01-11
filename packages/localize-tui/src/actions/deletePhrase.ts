import { styleText } from "node:util";

import { input, confirm } from "@inquirer/prompts";

import BaseAction from "./base";
import UpdateHashAction from "./updateHash";
import GenerateTypesAction from "./generateTypes";

export default class DeletePhraseAction extends BaseAction {
  async run() {
    const rawPhrase = await input({
      message: "Enter the raw phrase (English-key)",
      required: true,
    });
    if (!rawPhrase) {
      return;
    }

    const confirmed = await confirm({
      message: `Are you sure you want to delete the phrase "${rawPhrase}"?`,
      default: false,
    });
    if (!confirmed) {
      return;
    }

    const files = await this.getAllLocales();
    await Promise.all(
      files.map(async (file) => {
        const locale = await this.loadLocale(file);
        delete locale[rawPhrase];
        await this.saveLocale(file, locale);
      }),
    );

    const localesCount = files.length.toString();
    console.log(
      `${styleText("green", "√")} Successfully deleted phrase "${styleText(
        "gray",
        rawPhrase,
      )}" from ${styleText("yellow", localesCount)} locales!`,
    );
    await new UpdateHashAction(this.instance).run();
    await new GenerateTypesAction(this.instance).run();
  }
}
