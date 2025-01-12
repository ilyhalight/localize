export enum Action {
  GeneratePhrase = "generate_phrase",
  DeletePhrase = "delete_phrase",
  GetAllLocales = "get_all_locales",
  GenerateTypes = "generate_types",
  UpdateHash = "update_hash",
  Exit = "exit",
}

export type Locale = Record<string, unknown>;
