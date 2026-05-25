module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testMatch: ['**/tests/**/*.test.ts'],
  testTimeout: 20000,
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: false }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)'
  ]
}