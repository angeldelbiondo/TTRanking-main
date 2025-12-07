const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Apunta a la raíz para cargar next.config.js y variables de entorno
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  // Esto asegura que Jest entienda los alias de path como @/components/...
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)