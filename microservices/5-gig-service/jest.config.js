module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@gig/(.*)$': '<rootDir>/src/$1'
  },

  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }]
  },

  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)'
  ]
};


