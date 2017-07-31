module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },

    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": 0,
        "quotes": [
            "error",
            "double"
        ],
        "no-unused-vars" :[
            "warn"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};