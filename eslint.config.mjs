import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["node_modules/", "src-tauri/", "out/", ".next/"],
  },
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "jsx-a11y/alt-text": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  }),
];

export default eslintConfig;
