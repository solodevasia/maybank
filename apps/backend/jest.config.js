module.exports = {
  roots: ['src'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['src/main.ts', 'src/app.module.ts'],
  moduleNameMapper: {
    '@maybank/(.*)$': ['<rootDir>/src/$1'],
  },
};
