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
  "rootPath": "./src",
  "localesDir": "locales",
  "hashFile": "hashes.json",
  "ignoreLocales": ["de"],
  "service": "yandexbrowser"
}
```

`rootPath` - the path to the folder that will be considered the main folder of the project. For example, if the translation files in the project are in `./src/locales`, then the `rootPath` should be `./src`

`localesDir` - name of the translation folder

`hashFile` - the name of the file with translation hashes

`ignoreLocales` - localization files that will be ignored by the utility

`service` - a service for receiving a translate. In this case, Yandex Translate is used. Other available services:

- `yandexbrowser` - Yandex Translate (free)
- `yandexcloud` - YandexCloud (free)
- `yandextranslate` - Yandex Translate (free)
- `msedge` - Microsoft Edge Translate (free)

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

Почему используется `spark-md5`, а не `crypto-js` или нативная реализация из NodeJS?

1. это банально быстрее (в ~1.35 раза)
2. нативная реализация md5 появилась, только, в NodeJS 21+, что еще сильнее увеличило бы требования для запуска
