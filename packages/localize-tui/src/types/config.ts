import { TranslationService } from "@toil/translate/types/client";

export type LocalizeConfig = {
  rootPath: string;
  localesDir: string;
  hashFile: string;
  ignoreLocales: string[];
  service: TranslationService;
  $schema?: string; // json schema
};

export type ConfigSchema = Partial<LocalizeConfig>;
