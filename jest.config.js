module.exports = {
  verbose: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@app(.*)$': '<rootDir>/src/$1',
  },
};
