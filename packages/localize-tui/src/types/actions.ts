export enum Action {
  GeneratePhrase = "generate_phrase",
  DeletePhrase = "delete_phrase",
  GetAllLocales = "get_all_locales",
  UpdateHash = "update_hash",
}

export type Locale = Record<string, unknown>;
