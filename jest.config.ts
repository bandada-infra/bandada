import fs from "fs"
import type { Config } from "@jest/types"

const libs: any = fs
    .readdirSync("./libs", { withFileTypes: true })
    .filter((directory) => directory.isDirectory())
    .map(({ name }) => ({
        displayName: name,
        rootDir: `libs/${name}/src`,
        moduleNameMapper: {
            "@zk-groups/(.*)": "<rootDir>/../$1/src/index.ts"
        },
        moduleFileExtensions: ["js", "ts", "json"],
        transform: {
            "^.+\\.(t|j)s$": "ts-jest"
        }
    }))

export default async (): Promise<Config.InitialOptions> => ({
    projects: [
        ...libs,
        {
            displayName: "api",
            rootDir: "apps/api/src",
            moduleFileExtensions: ["js", "ts", "json"],
            moduleNameMapper: {
                "@zk-groups/(.*)": "<rootDir>/../../../libs/$1/src/index.ts"
            },
            transform: {
                "^.+\\.(t|j)s$": "ts-jest"
            },
            setupFiles: ["dotenv/config"]
        }
    ],
    verbose: true,
    coverageReporters: ["lcov"],
    coverageDirectory: "./coverage/jest",
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/src/**/index.ts",
        "!<rootDir>/src/**/*.d.ts"
    ],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 95,
            lines: 95,
            statements: 95
        }
    }
})
