# Contributing Guide

Thanks for taking time to contribute here.

**Any help is much appreciated!**

## Found a bug?

If you find a bug in the source code, you can help by [submitting an issue](https://github.com/10xcompany/neo4j/issues/new)
or even better, by [submitting a Pull Request](https://github.com/10xcompany/neo4j/issues/pulls) with a fix.

## Missing a feature?

You can _request_ a new feature by [submitting an issue](https://github.com/10xcompany/neo4j/issues/ew) to this GitHub
Repository. If you would like to _implement_ a new feature, please submit an issue with a proposal for your work first,
so we can discuss what is the best way to implement, as well as to be sure nobody else works on that already.

## Submission guidelines

### Submitting an issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion
might inform you of workarounds readily available.

Please provide steps to reproduce for found bug or ideally fork the repository and add failing test that demonstrates what
is wrong. This will help to understand and fix the issue faster.

### Submitting a pull request

Before you submit your pull request consider the following guidelines:

- Search [GitHub](https://github.com/mikro-orm/mikro-orm/pulls) for an open or closed PR
  that relates to your submission. You don't want to duplicate effort.

- Run tests before you start working, to be sure they all pass and your setup is working correctly:

```sh
yarn test
```

- This project aims to have 100% code coverage, so be sure to **include appropriate test cases**.
- Follow defined coding standard, use `yarn lint` command to check it.
- Commit your changes using a descriptive commit message that follows defined commit message conventions.
  Adherence to these conventions is necessary because release notes are automatically generated from these messages.
- Push the code to your forked repository and create a pull request on GitHub.
- If somebody from project contributors suggest changes then:
  - Make the required updates.
  - Re-run all test suites to ensure tests are still passing.
  - Rebase your branch and force push to your GitHub repository (this will update your Pull Request). Basically you can
    use `git commit -a --amend` and `git push --force origin my-fix-branch` in order to keep single commit in the feature
    branch.

That's it! Thank you for your contribution!

## Coding standard

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- All features or bug fixes **must be tested**, ideally by both unit tests and integration tests.
- If you are implementing new feature or extending public API, you should **document it**.
- All these will be checked by GitHub Actions when you submit your PR.

Some highlights:

- use 2 spaces for indentation
- always use semicolons
- use single quotes where possible
- do not use `public` keyword (allowed only in constructor)
- prefer `const` over `let` (and do not use `var`)

## Commit Message Guidelines

The project have very precise rules over how git commit messages can be formatted. This leads to
**more readable messages** that are easy to follow when looking through the **project history**.
But also, git history is used to **generate the change log**.

## What's next

Checkout [ROADMAP.md](ROADMAP.md) for the next features this package is meant to introduce
