module.exports = {
    "extends": "airbnb",
    "env": {
      "browser": true,
      "node": true
    },
    "rules": {
        "max-len": [1, 120, 2, {ignoreComments: true}],
        "quote-props": [1, "consistent-as-needed"],
        "no-cond-assign": [2, "except-parens"],
        "radix": 0,
        "space-infix-ops": 0,
        "no-unused-vars": [1, {"vars": "local", "args": "none"}],
        "default-case": 0,
        "no-else-return": 0,
        "no-param-reassign": 0,
        "quotes": 0,
        "react/jsx-filename-extension": 0,
        "semi": [2, "never"],
    }
};
