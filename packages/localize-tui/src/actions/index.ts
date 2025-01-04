import { select } from "@inquirer/prompts";

import GetAllLocalesAction from "./getAllLocales";
import GeneratePhraseAction from "./generatePhrase";
import DeletePhraseAction from "./deletePhrase";
import UpdateHashAction from "./updateHash";
import { Action } from "../types/actions";

async function getAction() {
  const answer = await select({
    message: "Select action with localization:",
    choices: [
      { name: "Generate phrase", value: Action.GeneratePhrase },
      { name: "Delete phrase", value: Action.DeletePhrase },
      { name: "Get all locales", value: Action.GetAllLocales },
      { name: "Update hashes", value: Action.UpdateHash },
    ],
  });

  if (!(answer in actions)) {
    throw new Error("Entered unknown action");
  }

  return actions[answer];
}

const actions = {
  [Action.GeneratePhrase]: GeneratePhraseAction,
  [Action.DeletePhrase]: DeletePhraseAction,
  [Action.GetAllLocales]: GetAllLocalesAction,
  [Action.UpdateHash]: UpdateHashAction,
};

export { getAction };
