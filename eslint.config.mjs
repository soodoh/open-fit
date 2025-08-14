import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "eslint/config";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import prettierRecommended from "eslint-plugin-prettier/recommended";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  globalIgnores(["node_modules", ".next"]),
  ...compat.config({
    extends: [
      "next",
      "next/core-web-vitals",
      "next/typescript",
      "plugin:import/recommended",
      "plugin:import/typescript",
    ],
  }),
  {
    files: ["**/*.{js,ts,tsx}"],
    plugins: {
      "no-relative-import-paths": noRelativeImportPaths,
    },
    rules: {
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { allowSameFolder: true, rootDir: "./", prefix: "@" },
      ],
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      "import/order": [
        1,
        {
          groups: [
            ["builtin", "external", "internal"],
            ["parent", "index", "sibling"],
            "object",
            "type",
          ],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  prettierRecommended,
];

export default eslintConfig;
