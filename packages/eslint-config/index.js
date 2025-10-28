import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";

const base = defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
]);

export default {
  base,
  react: [
    ...base,
    reactHooks.configs.flat.recommended,
    {
      languageOptions: {
        globals: globals.browser,
      },
    },
  ],
};
