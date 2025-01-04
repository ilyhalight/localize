import { TranslationService } from "@toil/translate/types/client";

export type LocalizeConfig = {
  rootPath: string;
  localesDir: string;
  hashFile: string;
  ignoreLocales: string[];
  service: TranslationService;
};
