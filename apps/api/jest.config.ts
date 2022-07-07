/* eslint-disable */
export default {
    displayName: "api",
    preset: "../../jest.preset.js",
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.spec.json"
        }
    },
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../coverage/api",
    coverageReporters: ["lcov"],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 95,
            lines: 95,
            statements: 95
        }
    }
}
