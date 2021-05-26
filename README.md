# Push to changelog

A GitHub action for automating changelogs.

Every commit starting with a specified prefix (e.g. `changelog: add new feature`) gets added to your changelog file. You can then use the [update changelog version action](https://github.com/blackbullion/update-changelog-version) to group commits by the version they were released in.

## Inputs

| Input       | Required    | Description
| ----------- | ----------- | -----------
| token       | yes         | Your GitHub token (i.e. `${{ secrets.GITHUB_TOKEN }}`)
| filePath    | no          | Path to your changelog. Default: `CHANGELOG.md`
| prefix      | no          | What commits need to start with to be added to the changelog. Default: `changelog`

## Changelog versioning

This action goes hand-in-hand with our [update changelog version action](https://github.com/blackbullion/update-changelog-version). Here's an example of what this workflow could look like:

On push to your development branch:

```
steps:
  - uses: actions/checkout@v2

  - uses: blackbullion/push-to-changelog@v1
    with:
      token: ${{ secrets.GITHUB_TOKEN }}

  - name: Push updated changelog
```

And on push to your release branch:

```
steps:
  - uses: actions/checkout@v2
    with:
      ref: develop

  - uses: blackbullion/update-changelog-version@v1
    with:
      token: ${{ secrets.GITHUB_TOKEN }}

  - name: Push updated changelog to the development branch

  - name: Post to slack
```
The push to changelog action adds commits to the `Unreleased` section of your changelog.

When the update changelog version action runs, it takes every commit from the unreleased section and moves them under a new section labelled by the latest release version (using calendar versioning, e.g. 2021.5.3).

Only commits that exist in the branch the versioning action runs in (usually your release branch) get moved out of the unreleased section allowing you to do cherry-picked releases.
