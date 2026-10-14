import { styleText } from "node:util";

import { select, confirm } from "@inquirer/prompts";
import TranslationClient from "@toil/translate";
import { TranslationService } from "@toil/translate/types/client";

import BaseAction from "./base";
import UpdateHashAction from "./updateHash";
import GenerateTypesAction from "./generateTypes";

import { supportedLanguages } from "../config";
import { flatToLocale, localeToFlat } from "../utils";

export default class GenerateLocaleAction extends BaseAction {
  async run() {
    const existsLocales = await this.getAllLocales();
    const selectedLocale = await select({
      message: "Select the locale to generate",
      choices: Object.entries(supportedLanguages)
        .filter(([key]) => !existsLocales.includes(`${key}.json`))
        .map(([key, value]) => ({
          name: value,
          value: key,
        })),
    });
    const confirmed = await confirm({
      message: `Are you sure you want to generate the locale "${selectedLocale}"?`,
      default: false,
    });
    if (!confirmed) {
      return;
    }

    const allowUnsafeEval =
      this.instance.config.service === TranslationService.libretranslate;
    const translationClient = new TranslationClient({
      service: this.instance.config.service,
      allowUnsafeEval,
    });

    const baseLocale = await this.loadLocale("en.json");
    const flatPhrases = localeToFlat(baseLocale);
    const translatedResult = await translationClient.translate(
      Object.values(flatPhrases),
      `en-${selectedLocale}`,
    );
    const translatedFlatLocale = Object.entries(flatPhrases).reduce(
      (acc, [key], idx) => {
        acc[key] = translatedResult.translations[idx];
        return acc;
      },
      {} as Record<string, string>,
    );
    const translateLocale = flatToLocale(translatedFlatLocale);

    await this.saveLocale(`${selectedLocale}.json`, translateLocale);
    const phraseCount = Object.keys(flatPhrases).length.toString();
    console.log(
      `${styleText("green", "√")} Successfully generated new locale "${styleText(
        "gray",
        selectedLocale,
      )}" with ${styleText("yellow", phraseCount)} phrases!`,
    );

    await new UpdateHashAction(this.instance).run();
    await new GenerateTypesAction(this.instance).run();
  }
}
