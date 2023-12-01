module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'json', 'vue'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
      '^.+\\.js$': 'babel-jest',
      '^.+\\.vue$': 'vue-jest',
    },
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.{js,vue}', '!<rootDir>/node_modules/**'],
  };
  