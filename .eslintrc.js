module.exports = {
  parserOptions: {
    ecmaVersion: 9
  },
  plugins: ['jest', 'prettier'],
  env: {
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:jest/recommended', 'plugin:prettier/recommended'],
  rules: {
    // ES6
    'no-var': 'error',
    'prefer-const': 'error',
    // 'prefer-template': 'error',
    // 'object-shorthand': 'error',
    // 'prefer-destructuring': 'error',
    'prefer-arrow-callback': 'error',

    // Override
    'no-empty': ['warn', { allowEmptyCatch: true }],
    'no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: 'info' }],

    // Disable
    'no-console': 'warn'
  }
}
