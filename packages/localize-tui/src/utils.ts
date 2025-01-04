// JSON.stringify with new line in the end and double spaces before keys
export function prettyStringify(content: any) {
  const result = JSON.stringify(content, null, 2);
  return result ? result + "\n" : result;
}
