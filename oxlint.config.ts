import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    suspicious: "warn",
  },
  plugins: ["typescript", "unicorn", "oxc"],
  env: {
    es6: true,
    browser: true,
  },
});
