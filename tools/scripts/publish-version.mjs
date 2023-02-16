/**
 * This is a minimal script to publish NPM packages.
 * You might need to authenticate with NPM before running this script.
 */

import { readCachedProjectGraph } from "@nrwl/devkit"
import { execSync } from "child_process"

const projectRootPath = process.cwd()

// Search for the package.json files.
const graph = readCachedProjectGraph()

for (const node of Object.values(graph.nodes)) {
    const packageJsonPath = node.data.files.find(({ file }) =>
        file.endsWith("package.json")
    )

    if (packageJsonPath) {
        process.chdir(`${projectRootPath}/dist/${node.name}`)

        try {
            // Execute "npm publish" to publish.
            execSync("npm publish --access public")
        } catch (e) {}
    }
}
