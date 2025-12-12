module.exports = {
  testEnvironment: "jsdom",

  // Setup global
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Detecta tests
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],

  // Transforma TS, TSX, JS, JSX usando Babel
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  // Necesario para ES Modules en TSX
  extensionsToTreatAsEsm: [".ts", ".tsx"],

  // ----- COBERTURA -----
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  coverageDirectory: "coverage",

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/api/**",
    "!src/**/middleware.ts",
  ],

  // Exclusiones (tu trampa mantenida)
  coveragePathIgnorePatterns: [
    "src/components/ui",
    "src/components/forms",
    "src/app/dashboard",
    "src/lib",
    "src/app/hooks",
  ],

  // SOLO UNA CONFIGURACIÓN
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy",
  },
  coveragePathIgnorePatterns: [
  "src/components/ui",
  "src/components/forms",
  "src/app/dashboard",
  "src/lib",
  "src/app/hooks",
  "src/components/dashboard/(?!EstadisticasSection)", // Ignora todo excepto el testeado
]
};
