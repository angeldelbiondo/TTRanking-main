const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Apunta a la raíz para cargar next.config.js y variables de entorno
  dir: './',
})

const customJestConfig = {
  // --- CONFIGURACIÓN DE JEST STANDARD ---
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // --- CONFIGURACIÓN CRÍTICA PARA SONARQUBE ---
  // 1. Activar la recolección de cobertura
  collectCoverage: true, 
  // 2. Establecer el directorio de salida del reporte
  coverageDirectory: 'coverage', 
  // 3. Tipos de reportes (LCOV es esencial para SonarQube)
  coverageReporters: ['json', 'lcov', 'text'],
  
  // 4. CRÍTICO: Forzar a Jest a generar rutas relativas para el reporte LCOV
  //    Esto asegura que SonarQube pueda mapear las líneas de código fuente.
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/", // Excluir módulos
    "<rootDir>/.next/",       // Excluir archivos de Next.js
  ],
  // 5. Definir qué archivos deben ser considerados para la cobertura
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
}

module.exports = createJestConfig(customJestConfig)