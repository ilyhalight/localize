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
  "parseDotNotation": true,
  "service": "yandexbrowser"
}
```

`rootPath` - the path to the folder that will be considered the main folder of the project. For example, if the translation files in the project are in `./src/locales`, then the `rootPath` should be `./src`

`localesDir` - name of the translation folder (default: `locales`)

`hashFile` - the name of the file with translation hashes (default: `hashes.json`)

`ignoreLocales` - localization files that will be ignored by the utility

`typesFile` - relative path from `localeDir` to generated localize types file (default: `locales.ts`)

`withTypes` - generate file with typescript localize types

`parseDotNotation` - parse dot notation in keys (default: `true`)

For example, if `rawPhrase` is "key1.key2.key3" and `localizedPhrase` is "phrase", then

`"parseDotNotation": true`:

```json
{
  "key1": {
    "key2": {
      "key3": "phrase"
    }
  }
}
```

`"parseDotNotation": false`:

```json
{
  "key1.key2.key3": "phrase"
}
```

`service` - a service for receiving a translate. Available services:

- `yandexbrowser` - [Browser version] Yandex Translate (used by default)
- `yandexcloud` - [Cloud version] Yandex Translate
- `yandextranslate` - [Website version] Yandex Translate
- `yandexgpt` - [Neuro version] Yandex Translate
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
