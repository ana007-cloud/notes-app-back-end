import daStyle from 'eslint-config-dicodingacademy'; // Dicoding Academy ESLint style guide
import js from '@eslint/js'; // ESLint recommended rules for JavaScript
import globals from 'globals'; // Predefined global variables (like Node.js globals)
import { defineConfig } from 'eslint/config'; // Flat config helper for ESLint
import prettier from 'eslint-plugin-prettier'; // Prettier as an ESLint plugin
import eslintConfigPrettier from 'eslint-config-prettier'; // Disable ESLint rules that conflict with Prettier


export default defineConfig([
  daStyle, // Apply Dicoding style rules first
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js, prettier }, // Register JS and Prettier plugins
    extends: ["js/recommended"],
    rules: {
      "prettier/prettier": "error", // Show Prettier issues as ESLint errors
    },
  },

  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node } },

  // Override: turn off formatting rules that clash with Prettier
  eslintConfigPrettier,
]);
