import path from "node:path";
import fs from "node:fs/promises";
import { createGenerator } from "ts-json-schema-generator";
import { Config } from "ts-json-schema-generator";

const root = path.join(__dirname, "..");
const config: Config = {
  path: path.join(
    root,
    "packages",
    "localize-tui",
    "src",
    "types",
    "config.ts",
  ),
  tsconfig: path.join(root, "tsconfig.json"),
  type: "ConfigSchema",
};

const schema = createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
await fs.writeFile(path.join(root, "schema.json"), schemaString);
