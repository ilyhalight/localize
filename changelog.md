## localize-tui 0.0.9

- Added support **Opera Aria AI** for translation `service`
- Fixed LibreTranslate

## localize-tui 0.0.8

- Added option `parseDotNotation` to parse dot notation in keys (default: `true`)

example with phrase "key1.key2.key3":

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

- Bump depends

## localize-tui 0.0.7

- Removed test value

## localize-tui 0.0.6

- Added `Phrase` and `FlatPhrases` type to generated phrases
- Added support **Bing**, **LibreTranslate** and **YandexGPT** for translation `service`
- Removed typebox types
- Bump depends

## localize-tui 0.0.5

- Added support generating localize types. To enable set `withTypes` to true in localize config

## localize-tui 0.0.4

- Added sort locales for `hashes.json`
- Added json schema for localize config

## localize-tui 0.0.3

- unreleased

## localize-tui 0.0.2

- initial release

## localize-tui 0.0.3

- test release
