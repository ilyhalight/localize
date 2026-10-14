import { expect, test, describe } from "bun:test";
import { localeToFlat, flatToLocale } from "../src/utils";

const LOCALE_MOCK = {
  greeting: {
    hello: "Hello",
    hi: "Hi",
    many: {
      hello: "Hello again",
    },
  },
  farewell: "Goodbye",
  "already.flatten": "Already flattened",
};
const FLAT_LOCALE_MOCK = {
  "greeting|||||hello": "Hello",
  "greeting|||||hi": "Hi",
  "greeting|||||many|||||hello": "Hello again",
  farewell: "Goodbye",
  "already.flatten": "Already flattened",
};

describe("localeToFlat", () => {
  test("should flatten nested locale objects", () => {
    const result = localeToFlat(LOCALE_MOCK);
    expect(result).toEqual(FLAT_LOCALE_MOCK);
  });

  test("should handle already flattened keys correctly", () => {
    const result = localeToFlat(FLAT_LOCALE_MOCK);
    expect(result).toEqual(FLAT_LOCALE_MOCK);
  });
});

describe("flatToLocale", () => {
  test("should convert flattened locale objects back to nested structure", () => {
    const result = flatToLocale(FLAT_LOCALE_MOCK);
    expect(result).toEqual(LOCALE_MOCK);
  });

  test("does not pollute Object.prototype", () => {
    const src = JSON.parse(
      '{"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"x":"y"}}}',
    );
    const out = flatToLocale(localeToFlat(src));

    expect(({} as any).polluted).toBeUndefined();
    expect(({} as any).x).toBeUndefined();
    expect(JSON.stringify(out)).toBe(JSON.stringify(src));
  });
});
