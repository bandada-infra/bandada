/**
 * This is a minimal script to bump new versions.
 * It takes the new version as an argument and updates all the package.json files.
 */

import { readCachedProjectGraph } from "@nrwl/devkit"
import chalk from "chalk"
import { readFileSync, writeFileSync } from "fs"

function invariant(condition, message) {
    if (!condition) {
        console.error(chalk.bold.red(message))
        process.exit(1)
    }
}

const [, , version] = process.argv

invariant(version, `No version provided`)

// A simple semver validation to validate the version.
const validVersion = /^\d+\.\d+\.\d(-\w+\.\d+)?/
invariant(
    version && validVersion.test(version),
    `Version did not match Semantic Versioning, expected: #.#.#, got ${version}`
)

// Search for the package.json files.
const graph = readCachedProjectGraph()

for (const node of Object.values(graph.nodes)) {
    const packageJsonPath = node.data.files.find(({ file }) =>
        file.endsWith("package.json")
    )

    if (packageJsonPath) {
        const { file: path } = packageJsonPath

        try {
            const json = JSON.parse(readFileSync(path).toString())

            json.version = version

            writeFileSync(path, JSON.stringify(json, null, 4))
        } catch (e) {
            console.error(chalk.bold.red(`Error reading '${path}' file`))
        }
    }
}
