module.exports = {
  testEnvironment: "node",
  testTimeout: 10000,
  forceExit: true,
  detectOpenHandles: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["routes/**/*.js", "server.js", "!node_modules/**"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
