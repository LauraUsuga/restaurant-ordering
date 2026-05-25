module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: false
    }
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|@?your-esm-packages)/)'
  ]
}