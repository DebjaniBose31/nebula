# Contributing

> [!important]
>
> - If you are from JWoC program, then you should only request for assigning you the issue which labeled with `jwoc-2026`.
> - And you should always ask first in the comments to assigning you the issue (It will happen with the first come first serve basis)
> - Although you can create your own issue Just make sure to check the box `I am willing to help develop this feature`, so that when collaborators will verify the issue they can assign it to you directly.
> - According to the JWoC, one user can be assigned to 3 unresolved issues at a time
> - Always include `Resolves #issue-number` in the pull request description
> - If you are not following the rules then contributors can reject your pull request

- [Contributing](#contributing)
  - [Steps to contribute to Nebula](#steps-to-contribute-to-nebula)
  - [Commit Message Guidelines](#commit-message-guidelines)
    - [Valid Types](#valid-types)
  - [Setup Custom Hooks](#setup-custom-hooks)
  - [How to report a Bug](#how-to-report-a-bug)
  - [How to request a Feature](#how-to-request-a-feature)
  - [Installation](#installation)
    - [Server](#server)
    - [Client](#client)
  - [Execution](#execution)
    - [Server](#server-1)
    - [Client](#client-1)
  - [Coding Standards](#coding-standards)
  - [Licensing](#licensing)

## Steps to contribute to Nebula

- Fork this repository
- Clone the forked repository to your local machine
- Create a new branch
- Do respective changes to your code and then commit it
- Push the new branch and open a Pull Request

> [!note]
> If you want to change something then try to do it in one commit (If possible)

## Commit Message Guidelines

Nebula enforces **Conventional Commits** to maintain a clean and automated history. Your commit messages must follow this regex-validated format:

`<type>(<optional scope>): <description>`

### Valid Types

- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation changes.
- `style`: Formatting/style changes.
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `test`: Adding or updating tests.
- `chore`: Routine tasks like updating dependencies.
- `build`: Changes affecting the build system.
- `ci`: Changes to CI configurations.
- `perf`: Performance improvements.

**Example:** `feat(auth): add login functionality`

## Setup Custom Hooks

Use the following command to apply the custom hook, it blocks the commit if the commit message is not following a specific standard

```sh
git config core.hooksPath .githooks
```

## How to report a Bug

If you encounter a bug, please use our **Bug Report** template when opening an issue. Be prepared to provide:

- **Steps to Reproduce**: Detailed actions that lead to the bug.
- **Expected vs. Actual Behavior**: What should have happened versus what did happen.
- **Affected Components**: Specify if it impacts the Control Panel (Python), or Dashboard (React).
- **Environment Details**: Your Docker version, OS, and browser.
- **Log Output**: Relevant terminal or console logs.

## How to request a Feature

We encourage new ideas! Please use the **Feature Request** template to explain:

- **Problem Statement**: Detailed explanation of the need.
- **Proposed Implementation**: How you'd like to see the feature work.
- **Affected Components**: Which parts of the architecture are involved.

## Installation

> [!important]
> Make sure the following requirements are satisfied before installing any software
>
> - Docker
> - Python v3.13 or up
> - Node v22 or up
> - Poetry v2 or up
> - Npm v11 or up

### Server

- After cloning this repository, open VS Code Terminal and switch to `server` directory
- Now type the following commands to install all the python packages

  ```sh
  poetry install
  ```

### Client

- After cloning this repository, open VS Code Terminal and switch to `client` directory
- Now type the following commands to install all the node packages

  ```sh
  npm i
  ```

## Execution

> [!tip]
> Skim through https://12factor.net/, if you want to know more about software lifecycle

### Server

- cd to `server` directory and run the following command to run the server

  ```sh
  fastapi dev
  ```

### Client

- cd to `client` directory and run the following command to run the web application

  ```sh
  npm run dev
  ```

## Coding Standards

- **Python**: We use **Ruff** for linting and formatting. Ensure your code passes Ruff checks before submitting.
- **React**: Use TypeScript and ensure there are no ESLint errors.

## Licensing

By contributing to Nebula, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
