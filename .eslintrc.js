// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: ['vue'],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        vue: 'never'
      }
    ],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e' // for e.returnvalue
        ]
      }
    ],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js']
      }
    ],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': [
      'error',
      {
        allow: ['log', 'warn', 'error']
      }
    ],
    'comma-dangle': ['error', 'never'], // 不提示对象或数组最后的属性加逗号
    'linebreak-style': 'off', // 打开会提示 LF CRLF
    'no-unused-vars': 'off', // 不提示未使用的变量
    'no-param-reassign': 'off', //禁止给参数重新赋值
    'max-len': ['error', {
      code: 500
    }],
    'arrow-body-style': ['error', 'always'],
    'prefer-template': 'off', // Unexpected string concatenation
    'no-mixed-operators': 0,
    'eqeqeq': 'off',
    'no-restricted-syntax': 'off',
    'no-unused-expressions': 'off',
    'no-undef': 0,
    'no-underscore-dangle': 'off',
    'comma-dangle': 'off',
    'arrow-parens': 'off',
    'camelcase': 'off',
    'consistent-return': 'off',
    'func-names': 'off'
  }
};
