# Contributing

:tada: Thank you for being interested in contributing to the Bandada project! :tada:

Feel welcome and read the following sections in order to know how to ask questions and how to work on something.

All members of our community are expected to follow our [Code of Conduct](/CODE_OF_CONDUCT.md). Please make sure you are welcoming and friendly in all of our spaces.

We're really glad you're reading this, because we need volunteer developers to help this project come to fruition. 👏

## Issues

The best way to contribute to our projects is by opening a [new issue](https://github.com/bandada-infra/bandada/issues/new/choose) or tackling one of the issues listed [here](https://github.com/bandada-infra/bandada/contribute).

## Pull Requests

Pull requests are great if you want to add a feature or fix a bug. Here's a quick guide:

1. Fork the repo.

2. Run the tests. We only take pull requests with passing tests.

3. Add a test for your change. Only refactoring and documentation changes require no new tests.

4. Make sure to check out the [Style Guide](/CONTRIBUTING.md#style-guide) and ensure that your code complies with the rules.

5. Make the test pass.

6. Commit your changes.

7. Push to your fork and submit a pull request on our `dev` branch. Please provide us with some explanation of why you made the changes you made. For new features make sure to explain a standard use case to us.

## CI (Github Actions)

We use GitHub Actions to verify if the code of your PR passes all our checks.

When you submit your PR (or later change that code), a CI build will automatically be kicked off. A note will be added to the PR, and will indicate the current status of the build.

## Style Guide

### Code

We use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to keep our code clean and readable. If you want to make sure your code passes our checks and follows our rules, simply run the following scripts in our `package.json` file: `lint:all` and `prettier`.

### Commits

We use [Conventional Commits](https://www.conventionalcommits.org) to add human and machine readable meaning to our commit messages. In particular, we use the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

Don't worry if it looks complicated. In our repositories, after adding your files with git (i.e `git add`), you can just run the `commit` script in our `package.json`, and you'll be prompted to fill out any required commit fields at commit time. We use [Commitizen](https://github.com/commitizen/cz-cli) under the hood.

Each commit message consists of a **header**, a **body** and a **footer**. The **header** has a special format that includes a **type**, a **scope** and a **subject**:

    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    <footer>

The **header** is mandatory and the **scope** of the header is optional.

#### Type

The type must be one of the following:

-   feat: A new feature
-   fix: A bug fix
-   docs: Documentation only changes
-   style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
-   refactor: A code change that neither fixes a bug nor adds a feature (improvements of the code structure)
-   perf: A code change that improves the performance
-   test: Adding missing or correcting existing tests
-   build: Changes that affect the build system or external dependencies (example scopes: gulp, npm)
-   ci: Changes to CI configuration files and scripts (example scopes: travis, circle)
-   chore: Other changes that don't modify src or test files
-   revert: Reverts a previous commit

#### Scope

The scope could be anything specifying place of the commit change. In a monorepo, it could be the name of the package or project affected.

#### Subject

The subject contains a succinct description of the change:

-   Use the imperative, present tense: "change" not "changed" nor "changes".
-   Don't capitalize the first letter.
-   No dot (.) at the end.

#### Body

Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

### Branches

-   There must be a `main` branch, used only for the releases.
-   There must be a `dev` branch, used to merge all the branches under it.
-   Avoid long descriptive names for long-lived branches.
-   Use kebab-case (no CamelCase).
-   Use grouping tokens (words) at the beginning of your branch names (in a similar way to the `type` of commit).
-   Define and use short lead tokens to differentiate branches in a way that is meaningful to your workflow.
-   Use slashes to separate parts of your branch names.
-   Remove your branch after merging it if it is not important.

Examples:

```bash
git branch -b docs/readme
git branch -b test/a-feature
git branch -b feat/sidebar
git branch -b fix/b-feature
```
