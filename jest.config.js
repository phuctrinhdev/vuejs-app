module.exports = {
  // specifies aliases for imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    // '^vue$'   : 'vue/dist/vue.js'
  },
  // specifies that .js files must be transformed using babel-jest, and vue files must be transformed using vue-jest
  transform: {
    '^.+\\.js$'  : '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  // specifies extensions of files that will be tested
  moduleFileExtensions: ['js', 'vue', 'json'],
  // specifies a regular extension that will be used to find test files in your project
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(js)$',
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-serializer-vue'
  ]
}