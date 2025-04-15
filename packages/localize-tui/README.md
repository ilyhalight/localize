# @toil/localize-tui

tui-based utility for quick and easy localization

To use:

```bash
bunx @toil/localize-tui
```

```bash
npx @toil/localize-tui
```

## Config

The utility can be configured using the `localize.config.json` or `l10n.config.json` config in the root of the project (where you will run the utility).

Example of `localize.config.json`:

```json
{
  "$schema": "https://raw.githubusercontent.com/ilyhalight/localize/refs/heads/master/schema.json",
  "rootPath": "./src",
  "localesDir": "locales",
  "hashFile": "hashes.json",
  "ignoreLocales": ["de"],
  "typesFile": "locales.ts",
  "withTypes": true,
  "service": "yandexbrowser"
}
```

`rootPath` - the path to the folder that will be considered the main folder of the project. For example, if the translation files in the project are in `./src/locales`, then the `rootPath` should be `./src`

`localesDir` - name of the translation folder

`hashFile` - the name of the file with translation hashes

`ignoreLocales` - localization files that will be ignored by the utility

`typesFile` - relative path from `localeDir` to generated localize types file

`withTypes` - generate file with typescript localize types

`service` - a service for receiving a translate. In this case, Yandex Translate is used. Other available services:

- `yandexbrowser` - Yandex Translate
- `yandexcloud` - YandexCloud
- `yandextranslate` - Yandex Translate
- `yandexgpt` - Yandex Translate
- `msedge` - Microsoft Edge Translate
- `bing` - Bing Translate
- `libretranslate` - Libre Translate

Any of these parameters can be removed.

## TODO:

- [x] Generate phrase
- [x] Delete phrase
- [x] Get all locales
- [x] Update hashes
- [] Diff locales
- [] Add locale files
- [] Fun languages

## FAQ

Why is `spark-md5` used and not `crypto-js` or the native implementation from NodeJS?

1. it's faster (~1.35 times)
2. The native md5 implementation appeared only in NodeJS 21+, which would further increase the startup requirements
