# Push to changelog

A GitHub action for automating changelogs.

Every commit starting with a specified prefix gets added to your changelog file. You can then use the [update changelog version action](https://github.com/blackbullion/changelog-version-action) to group commits by the version they were released in.

## Inputs

| Input       | Required    | Description
| ----------- | ----------- | -----------
| token       | yes         | Your GitHub token (usually `${{ secrets.GITHUB_TOKEN }}`)
| filePath    | yes         | Path to your changelog
| prefix      | no          | What commits need to start with to be added to the changelog. Default: `changelog`

## Example
```
on:
  push:
    branches:
      - develop

jobs:
  push-to-changelog:
    runs-on: ubuntu-latest
    name: Push to changelog
    steps:
      - uses: actions/checkout@v2

      - uses: blackbullion/push-to-changelog@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          filePath: './changelog.md'

```

