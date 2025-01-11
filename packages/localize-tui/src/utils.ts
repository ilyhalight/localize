// JSON.stringify with new line in the end and double spaces before keys
export function prettyStringify(content: any) {
  const result = JSON.stringify(content, null, 2);
  return result ? result + "\n" : result;
}

export const toType = ([key, value]: [string, unknown], deep = 0): string => {
  const valueType = typeof value;
  const cleanKey = /^(\w|\d|_)+$/.exec(key)
    ? key
    : `"${key.replaceAll('"', '\\"')}"`;
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

  return `${cleanKey}: ${genObjectTypes(
    value as Record<string, unknown>,
    deep + 1,
  )}`;
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
