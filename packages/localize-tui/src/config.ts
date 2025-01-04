import path from "node:path";
import fs from "node:fs/promises";
import { TranslationService } from "@toil/translate/types/client";
import { LocalizeConfig } from "./types/config";

const execPath = process.cwd();
const availableConfigNames = ["localize", "l10n"] as const;

export const supportedLanguages = {
  af: "Afrikaans",
  ak: "Akan",
  sq: "Shqip",
  am: "አማርኛ",
  ar: "العربية",
  hy: "Հայերեն",
  as: "অসমীয়া",
  ay: "Aymara",
  az: "Azərbaycan dili",
  bn: "বাংলা",
  eu: "Euskara",
  be: "Беларуская",
  bho: "भोजपुरी",
  bs: "Bosanski",
  bg: "Български",
  my: "ဗမာစာ",
  ca: "Català",
  ceb: "Cebuano",
  zh: "中文",
  co: "Corsu",
  hr: "Hrvatski",
  cs: "Čeština",
  da: "Dansk",
  dv: "ދިވެހި",
  nl: "Nederlands",
  en: "English",
  eo: "Esperanto",
  et: "Eesti",
  ee: "Eʋegbe",
  fil: "Filipino",
  fi: "Suomi",
  fr: "Français",
  gl: "Galego",
  lg: "Luganda",
  ka: "ქართული",
  de: "Deutsch",
  el: "Ελληνικά",
  gn: "Avañe'ẽ",
  gu: "ગુજરાતી",
  ht: "Kreyòl Ayisyen",
  ha: "Hausa",
  haw: "ʻŌlelo Hawaiʻi",
  iw: "עברית",
  hi: "हिन्दी",
  hmn: "Hmoob",
  hu: "Magyar",
  is: "Íslenska",
  ig: "Igbo",
  id: "Bahasa Indonesia",
  ga: "Gaeilge",
  it: "Italiano",
  ja: "日本語",
  jv: "Basa Jawa",
  kn: "ಕನ್ನಡ",
  kk: "Қазақ тілі",
  km: "ខ្មែរ",
  rw: "Kinyarwanda",
  ko: "한국어",
  kri: "Krio",
  ku: "Kurdî",
  ky: "Кыргызча",
  lo: "ລາວ",
  la: "Lingua Latina",
  lv: "Latviešu",
  ln: "Lingála",
  lt: "Lietuvių",
  lb: "Lëtzebuergesch",
  mk: "Македонски",
  mg: "Malagasy",
  ms: "Bahasa Melayu",
  ml: "മലയാളം",
  mt: "Malti",
  mi: "Māori",
  mr: "मराठी",
  mn: "Монгол хэл",
  ne: "नेपाली",
  nso: "Sesotho sa Leboa",
  no: "Norsk",
  ny: "ChiCheŵa",
  or: "ଓଡ଼ିଆ",
  om: "Afaan Oromoo",
  ps: "پښتو",
  fa: "فارسی",
  pl: "Polski",
  pt: "Português",
  pa: "ਪੰਜਾਬੀ",
  qu: "Runa Simi",
  ro: "Română",
  ru: "Русский",
  sm: "Gagana Sāmoa",
  sa: "संस्कृतम्",
  gd: "Gàidhlig",
  sr: "Српски",
  sn: "ChiShona",
  sd: "سنڌي",
  si: "සිංහල",
  sk: "Slovenčina",
  sl: "Slovenščina",
  so: "Soomaali",
  st: "Sesotho",
  es: "Español",
  su: "Basa Sunda",
  sw: "Kiswahili",
  sv: "Svenska",
  tg: "Тоҷикӣ",
  ta: "தமிழ்",
  tt: "Татарча",
  te: "తెలుగు",
  th: "ไทย",
  ti: "ትግርኛ",
  ts: "Xitsonga",
  tr: "Türkçe",
  tk: "Türkmençe",
  uk: "Українська",
  ur: "اردو",
  ug: "ئۇيغۇرچە",
  uz: "Oʻzbekcha",
  vi: "Tiếng Việt",
  cy: "Cymraeg",
  fy: "Frysk",
  xh: "isiXhosa",
  yi: "ייִדיש",
  yo: "Yorùbá",
  zu: "isiZulu",
} as const;

export type Language = keyof typeof supportedLanguages;

const getDefaultConfig = (): LocalizeConfig => {
  return {
    rootPath: path.resolve(execPath),
    localesDir: "locales",
    hashFile: "hashes.json",
    ignoreLocales: [],
    service: TranslationService.yandexbrowser,
  };
};

export async function parseConfig() {
  const fileList = await fs.readdir(execPath);
  const configFile = fileList.find((file) =>
    availableConfigNames.some((name) => file === `${name}.config.json`),
  );
  const defaultConfig = getDefaultConfig();
  if (!configFile) {
    return defaultConfig;
  }

  const configFilePath = path.resolve(execPath, configFile);
  try {
    const configContent = await fs.readFile(configFilePath, {
      encoding: "utf8",
    });
    const parsedConfig = JSON.parse(configContent) as Partial<LocalizeConfig>;
    console.log(parsedConfig);
    let { service, rootPath, ignoreLocales } = parsedConfig;
    const {
      localesDir = defaultConfig.localesDir,
      hashFile = defaultConfig.hashFile,
    } = parsedConfig;
    if (!service || !Object.values(TranslationService).includes(service)) {
      service = defaultConfig.service;
    }

    if (rootPath && !path.isAbsolute(rootPath)) {
      rootPath = path.resolve(execPath, rootPath);
    }

    const rootPathExists = rootPath ? await fs.exists(rootPath) : false;
    if (!rootPath || !rootPathExists) {
      rootPath = defaultConfig.rootPath;
    }

    const localesPath = path.resolve(rootPath, localesDir);
    const localesDirExists = localesDir ? await fs.exists(localesPath) : false;
    if (!localesDirExists) {
      await fs.access(rootPath, fs.constants.O_RDWR);
    }

    if (!ignoreLocales || !Array.isArray(ignoreLocales)) {
      ignoreLocales = defaultConfig.ignoreLocales;
    }

    return {
      service,
      rootPath,
      localesDir,
      ignoreLocales,
      hashFile,
    };
  } catch {
    console.error(`Failed to parse config file: ${configFile}`);
    return defaultConfig;
  }
}
