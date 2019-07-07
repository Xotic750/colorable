// https://facebook.github.io/jest/docs/en/configuration.html

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/*.js'],
  coverageDirectory: '__tests__/coverage/',
  moduleNameMapper: {
    '^RootDir/(.*)$': '<rootDir>/$1',
    '^dist/(.*)$': '<rootDir>/dist/$1',
    '^Src/(.*)$': '<rootDir>/src/$1',
    '^Global/(.*)$': '<rootDir>/Global/$1',
  },
  testMatch: ['**/*.test.js'],
  verbose: true,
};
