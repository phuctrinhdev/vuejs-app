module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/recommended"
  ],
  "parser": 'vue-eslint-parser',
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module",
  },
  "rules": {
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1
      }
    ],
    "linebreak-style": [
      0,
      "error",
      "windows"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-empty-function": "error",
    "no-void": "error",
    "init-declarations": [
      "error",
      "always"
    ],
    "no-console": "warn",
    "vue/no-use-v-if-with-v-for": "warn",
    "vue/valid-template-root": "warn",
    "vue/max-attributes-per-line": [
      "error", 
      {
        "singleline": 3,
        "multiline": {
          "max": 3,
          "allowFirstLine": true
        }
      }
    ],
    "eslint linebreak-style": [0, "error", "windows"],
  }
}