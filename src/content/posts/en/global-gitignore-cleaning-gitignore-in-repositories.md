---
title: "Global gitignore. Cleaning gitignore in repositories"
pubDate: 2024-04-08T16:30:00Z
tags: ['git']
---

We use to find cases where the `.gitignore` file of a project has a lot of stuff which is not directly related to the project itself but to the local environments of the developers who work on the project. This includes the index file of every developer's file system, such as the `Thumbs.db` file on Microsoft Windows or `.DS_Store` on Apple MacOS. Each developer's IDE or code editor settings file e.g. the `.idea` file on IntelliJ Idea or the `.vscode` file on Microsoft Visual Studio Code and even a container implementation like the `.docker-sync` file on Docker.

Our repositories shouldn't have to worry about these things. This is where a global gitignore comes into the picture.

First, we define a global `.gitignore` file in our local machine home path so this will be in the same directory as the `.gitconfig` file.  
The home path is `%userprofile%` in Microsoft Windows and `~` in GNU Linux and Apple MacOS.  
We include the names of the files to ignore that are not related to the project in this global `.gitignore` file.

**.gitignore**

```bash
.docker-sync
.docker-sync.yml
.DS_Store
.idea
.phpintel
.phpunit.cache
.Thumbs.db
.vscode
```

Then, we add a reference to this `.gitignore` file in our local `.gitconfig` file.

**.gitconfig**

```bash
[core]
  excludesfile = home/path/.gitignore
```

From now on, we won't have to worry about adding all those file names for each repository and they will have `.gitignore` files whose content is only related to their source code. The "downside" to this choice is that each developer has to implement their own global gitignore, so it is not the ideal choice for the lazy.