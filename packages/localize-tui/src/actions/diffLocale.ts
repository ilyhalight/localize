import { styleText } from "node:util";

import { select } from "@inquirer/prompts";

import BaseAction from "./base";

import { supportedLanguages } from "../config";
import { DEFAULT_DELIMITER, localeToFlat } from "../utils";

export default class DiffLocaleAction extends BaseAction {
  async run() {
    const existsLocales = await this.getAllLocales();
    if (existsLocales.length < 2) {
      console.log(
        `${styleText("red", "×")} At least two locales are required to perform a diff.`,
      );
      return;
    }
    const source = await select({
      message: "Select the source locale",
      default: existsLocales.includes("en.json") ? "en" : undefined,
      choices: Object.entries(supportedLanguages)
        .filter(([key]) => existsLocales.includes(`${key}.json`))
        .map(([key, value]) => ({
          name: value,
          value: key,
        })),
    });
    const target = await select({
      message: "Select the target locale",
      choices: Object.entries(supportedLanguages)
        .filter(
          ([key]) => existsLocales.includes(`${key}.json`) && key !== source,
        )
        .map(([key, value]) => ({
          name: value,
          value: key,
        })),
    });

    const baseLocale = await this.loadLocale(`${source}.json`);
    const targetLocale = await this.loadLocale(`${target}.json`);
    const baseFlat = localeToFlat(baseLocale);
    const targetFlat = localeToFlat(targetLocale);
    const missingPhrases = Object.keys(baseFlat)
      .filter((key) => !(key in targetFlat))
      .map((key) =>
        key.replaceAll(DEFAULT_DELIMITER, styleText("gray", " --> ")),
      );
    const onlyInTarget = Object.keys(targetFlat).filter(
      (key) => !(key in baseFlat),
    );

    const isSuccess = !missingPhrases.length && !onlyInTarget.length;
    if (isSuccess) {
      console.log(
        `${styleText("green", "√")} No missing or extra phrases found between "${styleText("gray", source)}" and "${styleText("gray", target)}"!`,
      );
      return;
    }

    let health = 100;

    if (missingPhrases.length) {
      console.log(
        `${styleText("red", "×")} Missing phrases in target locale "${styleText("gray", target)}" (${missingPhrases.length}):`,
      );
      for (const phrase of missingPhrases) {
        console.log(`-  ${phrase}`);
      }
      health -= (missingPhrases.length / Object.keys(baseFlat).length) * 100;
    }

    if (onlyInTarget.length) {
      console.log(
        `${styleText("yellow", "!")} Extra phrases in target locale "${styleText("gray", target)}" (${onlyInTarget.length}):`,
      );
      for (const phrase of onlyInTarget) {
        console.log(`-  ${phrase}`);
      }
      health -=
        (onlyInTarget.length / Object.keys(targetFlat).length / 2) * 100;
    }

    const finalHealth = Math.max(0, health);
    console.log(
      "Total healthy score:",
      styleText(
        finalHealth > 85 ? "yellow" : "red",
        `${finalHealth.toFixed(2)}%`,
      ),
    );
  }
}
