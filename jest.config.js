module.exports = {
  setupFilesAfterEnv: ["./jest.setup.js"],
  roots: ["src"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  preset: "ts-jest",
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
