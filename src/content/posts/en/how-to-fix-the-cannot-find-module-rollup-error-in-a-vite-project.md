---
title: "How to fix the \"Cannot find module @rollup\" error in a Vite project"
pubDate: 2025-01-27T21:00:00Z
tags: ['vite']
---
If you've made it this far, you've probably encountered one of the variants of this error in the terminal when trying to run a <a href="https://vite.dev/" target="_blank">Vite</a> project.

## The error
```plaintext
Error: Cannot find module @rollup/rollup-linux-x64-gnu.
```

The interesting part of this is what follows.

```
npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828).
Please try npm i again after removing both package-lock.json and node_modules directory.
```

But before blindly following the advice to delete the `package-lock.json` file and the `node_modules` directory, let's take a moment to analyze the cause of this error and its context.

## About RollUp
<a href="https://www.npmjs.com/package/rollup" target="_blank">RollUp</a>, the JavaScript module bundler used by Vite, has binaries specific to all major operating systems and architectures.

Chances are you're working on a project as part of a team of developers, each using a different operating system. Some will be working on GNU Linux while others will be working on MacOS or even Windows.

## The cause
The cause of the error is that the team member who created the project is working on a different operating system than the one you're using. This means that the RollUp binary that was initially installed on the project was the one specific to that member's operating system, which differs from the one that can be used by your system.

Having the `package-lock.json` file in version control is considered a good practice, as it helps the entire team work under the same versions of the dependencies used in the project. Therefore, deleting it would not be the right solution, since another team member will encounter the same error again, in addition to losing control over the installed versions of the rest of the dependencies.

## The solution
To solve the problem, what you need to do is include the different RollUp binaries that are used by the different team members as optional dependencies of the project.

Under the `"dependencies"` and `"devDependencies"` entries in the project's `package.json` file you can add an entry like the one in this example, with the RollUp binaries for the most common operating systems and architectures.

**package.json**
```json
...
"optionalDependencies": {
 "@rollup/rollup-darwin-arm64": "^4.32.0",
 "@rollup/rollup-darwin-x64": "^4.32.0",
 "@rollup/rollup-linux-arm64-gnu": "^4.32.0",
 "@rollup/rollup-linux-x64-gnu": "^4.32.0",
 "@rollup/rollup-win32-arm64-msvc": "^4.32.0",
 "@rollup/rollup-win32-x64-msvc": "^4.32.0"
}
```

If a team member continues to see the error, simply add the specific binary for his/her system to that list.

With this, the error is solved and the entire team will be able to run the project.