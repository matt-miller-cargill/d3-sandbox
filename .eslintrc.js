module.exports = {
    env: {
        es6: true,
        browser: true
    },
    //   extends: "eslint:recommended",
    extends: ['eslint:recommended', 'plugin:react-hooks/recommended', 'plugin:react/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module'
    },
    rules: {
        strict: ['error', 'safe'],
        'react/prop-types': 0,
        'react-hooks/exhaustive-deps': 0,
        'no-unused-vars': 0
    }
}
