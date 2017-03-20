## Contributing to Neatline

### Overview

Neatline is adopting a simplified workflow for new features and pull requests. This document describes it.

To contribute a feature to Neatline, in a nutshell:

1. Fork the repo and clone it locally
2. Create a feature branch, add some commits and push to a tracking branch on your fork
3. Rebase on master, squash all commits down to one, and open a PR with a cover letter to explain what your feature does
4. Request a review, respond, revise, rebase and update your PR
5. When everyone's happy with the PR, we'll merge it to master

The following details the git branch and rebase strategy we're using, which is based on [github flow](https://guides.github.com/introduction/flow/)

### Detailed Process

#### 1. Assumptions
- You've created a fork of the Neatline repo, or have push permissions to scholarslab/neatline.
- All your work will be done on a branch created off of a branch called `master`
- You've done `git clone` the repo to your local machine, and you're in that repo's directory
- You've got two git remotes on your repo, one called "origin" for your fork, one called "upstream" for scholarslab/neatline

#### 2. Optional Tools

If you want, you can install a couple of ruby gems that assist with this workflow. This workflow can be done without them, but they simplify a few of the steps.

- `gem install grb` # (grb, for "git remote branch", helps with branch workflow)
- `gem install hub` # (hub helps with github pull requests)

#### 3. Setup
- Create a new feature branch
- The `grb` gem offers a short cut for:
  - creating a local feature branch off of a local branch called `master`
  - creating a matching remote tracking branch on a remote called `origin`

```sh
grb new jf-feature-name # replace "jf" with your initials, and "feature-name" with the whatever you're working on.
```

If you don't want to use grb, create a local branch off master, and push it to your remote.


#### 4. Code
Write your tests and your feature, check what you've done:

```sh
git status
git diff
```

Then commit your work to your local feature branch and push it to the remote tracking branch:

```sh
git branch # check that you're on your feature branch.
git add .
git commit -m "Whatever I did in this feature branch..."
git push origin # pushes your changes from your local feature branch to the remote tracking branch on your fork
```

#### 5. Rebase on master

Rebasing is a way of adding your changes to the newest version of the code base, after any new features others may have merged to master in the time since you created your feature branch. 

The following commands "replay" your commits on top of the newest version of the master branch. If there are conflicts, you resolve them locally, before pushing and making a PR.

```sh
git co master # check out your local master branch`
git pull upstream/master # gets latest master from upstream into your local copy of master
git push origin master # updates your fork with latest master
git co jf-feature-name # or whatever your branch is called.`
git rebase -i upstream/master # opens editor; save and close to accept commits as-is, or use s to squash some commits, r to reword others.
```

This last step will either complete cleanly, or pause at the commit in which there are conflicts; in that case:

- `git status` will show you where they are. 
- Edit the files in question to resolve the conflicts, 
- Save, close, `git add` and `git commit` those fixed files. 
- `git rebase --continue`, 
- Lather, rinse, repeat until the rebase completes cleanly.

Once it does, you're ready to make a PR.

```sh
git push origin
```

This push will be rejected by the remote if you've squashed or reworded any commits; that rejection message is helpful, because it will confirm that you're pushing to the remote/branch you think you are.

**The following two points are the only real gotchas in this process, but they are important.**

If your push is rejected by the `origin` remote:

1. **Don't** *do what the rejection message suggests*, which is to `git pull` from the remote tracking branch to resolve the cause of the rejection before pushing your changes. You have rewritten history with your rebase, making it look as though you started coding at a later point in the history than is really the case. This is what you are trying to do: *to change the sequence of changes*. If you were to `git pull` now, you'd be un-rewriting the history, and in fact, creating local duplicates of the commits that happened since the time when you branched. 

2. **Do** *force push your feature branch over its remote tracking branch*. You *want* to overwrite the version of the repo history that your fork's remote maintains, *but only on the feature branch of the remote, not on master*. Master will get your new feature via merge, in a moment. Assuming you did get a rejection, and you are definitely on your own feature branch, on the correct remote, you can "force push" your rebased feature branch to its tracking feature branch on the remote called `origin`.

In case it's not clear from the above, **never force push to master**.

```sh
git branch # confirm you're not on the master branch, but rather on jf-feature-branch or whatever
git push --force # force pushes your rebased feature branch to the tracking branch on the github remote repo.
```

#### 6. Make a Pull Request

Now you have a cleanly rebased feature branch, on local and remote, and can create a pull request that can be cleanly merged to master.

```sh
hub pull-request
```
This will open your editor of choice, so you can write a title and a description for your PR. Once you save and close that file, hub will create a PR on the upstream repo from your feature branch.

Ideally, at this juncture, you'll deploy your branch to a staging server, to demonstrate the working feature. This helps with PR review and testing. This is the moment to invite others' input on your PR. 

You may make new commits to the feature branch, rebase and squash commits again, push to the remote again (which updates the open PR on github), and redeploy to staging.

> Note that in active projects, others' features may be merged to master while your PR is being discussed and improved. Before you merge, you may have to go back to step 4, and perhaps more than once, to get your branch rebased on the latest version of master before merging.

> This is one reason why it's good practice to keep your issues, and the feature branches and PRs that address them, tightly and narrowly defined, and to keep PRs focused on one thing at a time.

#### 7. Merge!

If/when everyone's happy with the PR, we'll merge your feature!
