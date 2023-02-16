/**
 * This is a minimal script to bump new versions.
 * It takes the new version as an argument and updates all the package.json files.
 */

import { readCachedProjectGraph } from "@nrwl/devkit"
import chalk from "chalk"
import { execSync } from "child_process"
import { readFileSync, writeFileSync, appendFileSync } from "fs"
import { EOL } from "os"

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
const packageJsonPaths = []

for (const node of Object.values(graph.nodes)) {
    const file = node.data.files.find(({ file }) =>
        file.endsWith("package.json")
    )

    if (file) {
        const { file: path } = file

        packageJsonPaths.push(path)

        try {
            const json = JSON.parse(readFileSync(path).toString())

            json.version = version

            writeFileSync(path, JSON.stringify(json, null, 4))
            appendFileSync(path, EOL, "utf8")
        } catch (e) {
            console.error(chalk.bold.red(`Error reading '${path}' file`))
        }
    }
}

// Execute "git add" and "git commit" to commit the changes.
execSync(`git add ${packageJsonPaths.join(" ")}`)
execSync(`git commit -m "chore(zk-groups): v${version}"`)
// Execute "git tag" to tag the commit.
execSync(`git tag v${version}`)
