import fs from "fs"
import type { Config } from "@jest/types"

const libs: any = fs
    .readdirSync("./libs", { withFileTypes: true })
    .filter((directory) => directory.isDirectory())
    .map(({ name }) => ({
        displayName: name,
        rootDir: `libs/${name}/src`,
        testRegex: ".*\\.test\\.ts$",
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
            testRegex: ".*\\.test\\.ts$",
            moduleNameMapper: {
                "@zk-groups/(.*)": "<rootDir>/../../../libs/$1/src/index.ts"
            },
            moduleFileExtensions: ["js", "ts", "json"],
            transform: {
                "^.+\\.(t|j)s$": "ts-jest"
            },
            setupFiles: ["dotenv/config"]
        }
    ],
    verbose: true,
    coverageReporters: ["lcov", "html"],
    coverageDirectory: "./coverage/jest",
    collectCoverageFrom: [
        "<rootDir>/**/*.ts",
        "!<rootDir>/**/index.ts",
        "!<rootDir>/**/*.d.ts"
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
