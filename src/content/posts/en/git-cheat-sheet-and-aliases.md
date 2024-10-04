---
title: "Git cheat sheet and aliases"
pubDate: 2024-10-04T22:25:00Z
tags: ['git']
---
This post features the most important and commonly used Git commands for easy reference, plus some useful Git aliases.

* [Configuration](#configuration)
* [Setup](#setup)
* [Stage and Snapshot](#stage-and-snapshot)
* [Store](#store)
* [Branch and Merge](#branch-and-merge)
* [Inspect and Compare](#inspect-and-compare)
* [Share and Update](#share-and-update)
* [Rewrite History](#rewrite-history)
* [Useful Git Aliases](#useful-git-aliases)

## Configuration
Set your user name globally.
```shell
git config --global user.name "[first_name last_name]"
```

Set your email address globally.
```shell
git config --global user.email "[email_address]"
```

Set automatic command line coloring for Git for easy reviewing.
```shell
git config --global color.ui auto
```

List all your Git aliases.
```shell
git config --get-regexp ^alias\.
```

## Setup
Initialize an existing directory as a Git repository.
```shell
git init
```

Retrieve an entire repository from a hosted location via URL.
```shell
git clone [url]
```

## Stage and Snapshot
Show modified files in working directory.
```shell
git status
```

Add a file as it looks now to stage for your next commit.
```shell
git add [file]
```

Add all files as they look now to stage for your next commit.
```shell
git add .
```

Remove a file from the working directory and the repository, staging the deletion.
```shell
git rm [file]
```

Moves or renames a file or directory in your repository.
```shell
git mv [file_or_directory]
```

Put a file out of stage while retaining the changes in working directory.
```shell
git reset [file]
```

Put all files out of stage.
```shell
git reset .
```

Discard changes made to a file.
```shell
git checkout [file_name]
```

Discard changes made to all files.
```shell
git checkout .
```

Difference of what is changed but not staged.
```shell
git diff
```

Difference of what is staged but not yet in commit.
```shell
git diff --staged
```

Commit your staged content as a new commit snapshot.
```shell
git commit -m "[meaningful_message]"
```

## Store

Store modified and staged changes (stack)
```shell
git stash
```

List stashed file changes in stack order.
```shell
git stash list
```

Get file changes from top of the stack.
```shell
git stash pop
```

Discard changes from top of the stack.
```shell
git stash drop
```

## Branch and Merge
List branches. An asterisk will appear next to the current branch.
```shell
git branch
```

Create a new branch at the current commit.
```shell
git branch [branch_name]
```

Switch to another branch and checkout the working directory.
```shell
git checkout [branch_name]
```

Create a new branch and switch to it.
```shell
git checkout -b [branch_name]
```

Merge the specified branch history into the current one.
```shell
git merge [branch]
```

## Inspect and Compare
Show the commit history for the currently active branch.
```shell
git log
```

Show the commits in `branch_a` that are not in `branch_b`.
```shell
git log branch_b..branch_a
```

Show the commits that changed file, even across renames.
```shell
git log --follow [file]
```

Show the difference of what is in `branch_a` but not in `branch_b`.
```shell
git diff branch_b..branch_a
```

Show the details of the current commit, including its changes.
```shell
git show
```

Show the details of the specified commit, including its changes.
```shell
git show [commit_sha]
```

## Share and Update
Add a Git URL as an alias. The most common alias is `origin`.
```shell
git remote add [alias] [url]
```

Fetch down all the branches from the remote repository.
```shell
git fetch
```

Fetch and merge any commits from the tracking remote branch.
```shell
git pull
```

Merge a remote branch into your current branch to bring it up to date.
```shell
git merge [alias]/[branch]
```

Push local branch commits to the remote repository branch.
```shell
git push
```

Push local branch commits to a new branch in the remote repository.
```shell
git push -u [alias] [branch]
```

## Rewrite History
Apply any commits of current branch ahead of the specified one.
```shell
git rebase [branch]
```

Clear staging area, rewrite working tree from specified commit (rollback)
```shell
git reset --hard [commit]
```

Include staged changes to the last commit.
```shell
git commit --amend
```

Making changes to a past commit (not recommended when there are more people working on the branch the commit came from)
1. Perform an interactive rebase of the commit to be edited.
```shell
git rebase -i [commit_sha]~
```
2. Change the commit you want to edit from `pick` to `edit`.
```shell
edit 8a62da1 commit_to_edit
pick 9ee3178 next_commit
pick 9cca210 next_commit
```
3. Once you have made your changes, add them to the stage and perform an `amend`.
```shell
git add .
git commit --amend
```
4. Finish the rebase.
```shell
git rebase --continue
```
5. If the remote repository has been pushed previously, a new push will need to be forced.
```shell
git push --force
```

## Useful Git Aliases
List aliases shortcut.
```shell
git config --global alias.aliases "config --get-regexp '^alias\.'"
```

List all global configurations shortcut.
```shell
git config --global alias.g "config --global -l"
```

Status shortcut.
```shell
git config --global alias.s "status"
```

Commit shortcut.
```shell
git config --global alias.c "commit -m"
```

Diff shortcut.
```shell
git config --global alias.d "diff"
```

Push shortcut.
```shell
git config --global alias.p "push"
```

Logs with pretty format graph shortcut.
```shell
git config --global alias.l "log --graph --pretty=format:'%C(red)%h%C(reset) -%C(yellow)%d%C(reset) %s %C(green)(%cr) %C(magenta)<%an>%C(reset)' --abbrev-commit --date=relative"
```