// module.exports = {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     collectCoverage: true,
//     collectCoverageFrom: ['src/**/*.ts'], // Adjust the path as needed
//     coverageReporters: ['lcov', 'text-summary'],
//   };
module.exports = {
  roots: ['<rootDir>'],  // Pointing to the root of your project.
  transform: {
    '^.+\\.tsx?$': 'ts-jest',  // Using ts-jest for TypeScript files.
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',  // File naming convention for tests.
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],  // File extensions that Jest should recognize.
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',  // If you're using '@src/' as a shorthand to point to your 'src' directory.
  },
  setupFilesAfterEnv: [],  // Any setup files to run before tests, if any.
  collectCoverage: true,  // If you want to collect coverage.
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],  // Specify which files you want coverage for.
  coverageReporters: ['text', 'lcov'],  // Coverage report formats.
  coveragePathIgnorePatterns: ['/node_modules/', '/src/utils', '/src/helpers'],  // Directories to ignore for coverage.
  testEnvironment: 'node',  // Specify the test environment.
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',  // Specify your TypeScript config file, if different.
    },
  },
};
