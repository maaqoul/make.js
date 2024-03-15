module.exports = {
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    // Ensure you have a babel config file with the necessary plugins/presets
    requireConfigFile: false,
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    // Custom rules here
  },
};
