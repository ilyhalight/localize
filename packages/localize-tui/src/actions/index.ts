import { select } from "@inquirer/prompts";
import { styleText } from "node:util";

import GetAllLocalesAction from "./getAllLocales";
import GeneratePhraseAction from "./generatePhrase";
import GenerateTypesAction from "./generateTypes";
import DeletePhraseAction from "./deletePhrase";
import UpdateHashAction from "./updateHash";
import ExitAction from "./exit";

import { Action } from "../types/actions";
import { LocalizeConfig } from "../types/config";
import GenerateLocaleAction from "./generateLocale";
import DiffLocaleAction from "./diffLocale";

async function getAction(config: LocalizeConfig) {
  const genTypesAnswer = config.withTypes
    ? [{ name: "Generate types", value: Action.GenerateTypes }]
    : [];
  const answer = await select({
    message: "Select action with localization:",
    choices: [
      { name: "Generate phrase", value: Action.GeneratePhrase },
      { name: "Generate locale", value: Action.GenerateLocale },
      { name: "Delete phrase", value: Action.DeletePhrase },
      { name: "Get all locales", value: Action.GetAllLocales },
      ...genTypesAnswer,
      { name: "Update hashes", value: Action.UpdateHash },
      { name: "Diff locale", value: Action.DiffLocale },
      { name: styleText("gray", "Exit"), value: Action.Exit },
    ],
    loop: false,
    pageSize: 10,
  });

  if (!(answer in actions)) {
    throw new Error("Entered unknown action");
  }

  return actions[answer];
}

const actions = {
  [Action.GeneratePhrase]: GeneratePhraseAction,
  [Action.GenerateLocale]: GenerateLocaleAction,
  [Action.DeletePhrase]: DeletePhraseAction,
  [Action.GetAllLocales]: GetAllLocalesAction,
  [Action.GenerateTypes]: GenerateTypesAction,
  [Action.UpdateHash]: UpdateHashAction,
  [Action.DiffLocale]: DiffLocaleAction,
  [Action.Exit]: ExitAction,
};

export { getAction };
