import { Locale } from "./types/actions";

export const DEFAULT_DELIMITER = "|||||";

// JSON.stringify with new line in the end and double spaces before keys
export function prettyStringify(content: unknown) {
  const result = JSON.stringify(content, null, 2);
  return result ? result + "\n" : result;
}

export const clearKey = (key: string) =>
  /^(\w|\d|_)+$/.exec(key) ? key : `"${key.replaceAll('"', '\\"')}"`;

export const toType = ([key, value]: [string, unknown], deep = 0): string => {
  const valueType = typeof value;
  const cleanKey = clearKey(key);
  if (valueType !== "object") {
    return `${cleanKey}: ${valueType};`;
  }

  if (valueType === null) {
    return `${cleanKey}: null;`;
  }

  if (Array.isArray(value)) {
    // object in array unsupported
    const arrTypes = value.map((val) => {
      const valType = typeof val;
      return valType === "object" ? "unknown" : valType;
    });
    const isSame = arrTypes.every((valType, idx) => {
      if (idx === arrTypes.length - 1) {
        return true;
      }

      return valType === arrTypes[idx + 1];
    });

    const arrType = isSame ? `${arrTypes[0]}[]` : `[${arrTypes.join(", ")}]`;
    return `${cleanKey}: ${arrType};`;
  }

  return `${cleanKey}: ${genObjectTypes(value as Record<string, unknown>, deep + 1)}`;
};

const getSpaces = (count: number) => {
  return Array.from({ length: count }).fill(" ").join("");
};

export function genObjectTypes(data: Record<string, unknown>, deep = 0) {
  if (!data || !Object.keys(data).length) {
    return "undefined";
  }

  let types = "";
  const ls = `\n${getSpaces(2 * (deep + 1))}`;
  const lf = `\n${getSpaces(2 * deep)}`;
  for (const entries of Object.entries(data)) {
    types += `${ls}${toType(entries, deep)}`;
  }
  return `{${types}${lf}};`;
}

export function genFlatObjectKeysType(
  data: Record<string, unknown>,
  deep = 0,
  endWithSemicolon = true,
) {
  if (!data || !Object.keys(data).length) {
    return "never";
  }

  let types = "";
  const ls = `\n${getSpaces(2 * (deep + 1))}| `;
  for (const [key, val] of Object.entries(data)) {
    if (typeof val !== "object" || val === null) {
      types += `${ls}"${key}"`;
      continue;
    }

    const flatKeys = genFlatObjectKeysType(
      val as Record<string, unknown>,
      deep,
      false,
    )
      .split(ls)
      .slice(1)
      .reduce(
        (result, flatLine) =>
          (result += `${ls}"${key}.${flatLine.replace(/^"/, "")}`),
        "",
      );

    types += flatKeys;
  }

  if (endWithSemicolon) {
    types += ";";
  }

  return types;
}

export function localeToFlat(
  locale: Locale,
  delimiter = DEFAULT_DELIMITER,
): Record<string, string> {
  if (
    !Object.values(locale).some(
      (val) => typeof val === "object" && val !== null,
    )
  ) {
    return locale as Record<string, string>;
  }

  const result: Record<string, string> = {};
  const traverse = (obj: Record<string, unknown>, parentKey = "") => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value !== "object" || value === null) {
        result[parentKey + key] = String(value);
        continue;
      }

      traverse(value as Record<string, unknown>, parentKey + key + delimiter);
    }
  };

  traverse(locale);
  return result;
}

export function flatToLocale(
  flat: Record<string, string>,
  delimiter = DEFAULT_DELIMITER,
): Locale {
  const result: Locale = Object.create(null);
  for (const [flatKey, value] of Object.entries(flat)) {
    const keys = flatKey.split(delimiter);
    const lastKey = keys.pop()!;
    let current = result;
    for (const k of keys) {
      const next = current[k];
      if (next === undefined) {
        const child: Locale = Object.create(null);
        current[k] = child;
        current = child;
        continue;
      }

      if (typeof next !== "object" || next === null) {
        throw new Error(
          `Key conflict: "${k}" in "${flatKey}" is already a phrase`,
        );
      }

      current = next as Locale;
    }
    current[lastKey] = value;
  }

  return result;
}
