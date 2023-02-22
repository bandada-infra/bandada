import fs from "fs"
import type { Config } from "@jest/types"

const libs: any = fs
    .readdirSync("./libs", { withFileTypes: true })
    .filter((directory) => directory.isDirectory())
    .map(({ name }) => ({
        rootDir: `libs/${name}`,
        displayName: name,
        setupFiles: ["dotenv/config"],
        moduleNameMapper: {
            "@zk-groups/(.*)": "<rootDir>/../$1/src/index.ts" // Interdependency packages.
        }
    }))

export default async (): Promise<Config.InitialOptions> => ({
    projects: libs,
    verbose: true,
    coverageDirectory: "./coverage/libs",
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
