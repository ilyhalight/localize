import { TranslationService } from "@toil/translate/types/client";

export type LocalizeConfig = {
  rootPath: string;
  localesDir: string;
  hashFile: string;
  ignoreLocales: string[];
  service: TranslationService;
  withTypes: boolean;
  typesFile: string;
  $schema?: string; // json schema
};

export type ConfigSchema = Partial<LocalizeConfig>;
