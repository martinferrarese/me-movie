const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: __dirname });

module.exports = createJestConfig({
  rootDir: __dirname,
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
});
