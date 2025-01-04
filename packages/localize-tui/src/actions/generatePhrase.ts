import { styleText } from "node:util";

import { input, confirm } from "@inquirer/prompts";
import TranslationClient from "@toil/translate";

import BaseAction from "./base";
import UpdateHashAction from "./updateHash";
import { Language, supportedLanguages } from "../config";

export default class GeneratePhraseAction extends BaseAction {
  async run() {
    const rawPhrase = await input({
      message: "Enter the raw phrase (English-key)",
      required: true,
    });
    if (!rawPhrase) {
      return;
    }

    const englishPhrase = await input({
      message: "Enter the phrase (English-value)",
      default: rawPhrase,
    });
    if (!englishPhrase) {
      return;
    }

    const needAddToJSON = await confirm({
      message: "Add the phrase to the json files?",
      default: false,
    });
    if (!needAddToJSON) {
      console.log(styleText("yellow", "Generated locales:"));
    }
    const files = await this.getAllLocales();

    const translationClient = new TranslationClient({
      service: this.instance.config.service,
    });

    const translate = async (locale: string) => {
      const result = await translationClient.translate(
        englishPhrase,
        `en-${locale}`,
      );
      return result.translations[0];
    };

    await Promise.all(
      files.map(async (file) => {
        const locale = file.replace(".json", "") as Language;
        const localeData = await this.loadLocale(file);
        const localizedPhrase =
          locale === "en" ? englishPhrase : await translate(locale);
        if (!needAddToJSON) {
          console.log(
            `  - ${supportedLanguages[locale]} (${styleText(
              "gray",
              file,
            )}): '${styleText(
              "gray",
              `"${rawPhrase}": "${localizedPhrase}"`,
            )}'`,
          );
          return;
        }

        localeData[rawPhrase] = localizedPhrase;
        await this.saveLocale(file, localeData);
      }),
    );

    const localesCount = files.length.toString();
    console.log(
      `${styleText(
        "green",
        "√",
      )} Successfully generated new phrase "${styleText(
        "gray",
        rawPhrase,
      )}" (${styleText("gray", englishPhrase)}) for ${styleText(
        "yellow",
        localesCount,
      )} locales!`,
    );
    if (needAddToJSON) {
      await new UpdateHashAction(this.instance).run();
    }
  }
}
