// /** @type {import('ts-jest').JestConfigWithTsJest} */
// const { compilerOptions } = require('./tsconfig')
// const { pathsToModuleNameMapper } = require('ts-jest')


// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   // testMatch: ['**/tests/test.ts?(x)'],

//   // // moduleNameMapper: {
//   // //   '^@App/(.*)$': '<rootDir>/src/$1',
//   // // },
//   // roots: ['<rootDir>'],
//   // modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
//   // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /*, { prefix: '<rootDir>/' } */),
// };

module.exports = {
  preset: 'ts-jest',
  // moduleFileExtensions: ["ts, tsx"],
  testEnvironment: 'node',
  testMatch: ["**/tests/*.ts"],
  moduleNameMapper: {
    "@exmpl/(.*)": "<rootDir>/src/$1"
  },
};


// import type { JestConfigWithTsJest } from 'ts-jest'

// const jestConfig: JestConfigWithTsJest = {
//   // [...]
//   // Replace `ts-jest` with the preset you want to use
//   // from the above list
//   preset: 'ts-jest',
//   moduleNameMapper: {
//     "@exmpl/(.*)": "<rootDir>/src/$1"
//   },
// }

// export default jestConfig