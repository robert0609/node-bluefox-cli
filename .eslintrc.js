module.exports = {
    "root": true,
    "parser": "babel-eslint",
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": [ "error",  "windows" ],
        "quotes": [ "error", "single" ],
        "semi": [ "error", "always" ],
        "no-unused-vars": "warn",
        "no-console": "warn"
    }
};