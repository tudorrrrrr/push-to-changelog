const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs').promises

const listItemPrefix = '- '

const getLastCommitSHA = (changelogContents) => {
  const availableLines = changelogContents
    .split('\n')
    .filter((l) => Boolean(l))
    .filter((l) => l.startsWith(listItemPrefix))

  if (availableLines.length === 0) {
    return null
  } else {
    const url = availableLines[0].split('[commit]')[1].replace(/[()]/g, '')
    return url.split('commit/')[1]
  }
}

const processCommits = (commitsData) => {
  const prefix = core.getInput('prefix') || 'changelog: '

  return commitsData
    .map((commit) => ({ message: commit.commit.message, sha: commit.html_url }))
    .filter((commit) => commit.message.toLowerCase().startsWith(prefix))
    .map((commit) => `${listItemPrefix}${commit.message.replace(prefix, '')} ([commit](${commit.sha}))`)
}

const main = async () => {
  try {
    const token = core.getInput('token')
    const octokit = github.getOctokit(token)  
    const repo = github.context.repo

    const filePath = core.getInput('filePath')
    let changelogContents = await fs.readFile(filePath, 'utf8')

    const base = getLastCommitSHA(changelogContents) || github.context.sha

    const allCommits = await octokit.rest.repos.compareCommits({ ...repo, base, head: 'HEAD' })
    if (allCommits.data.commits.length === 0) throw new Error('No commits found')

    const unreleasedHeader = '## Unreleased'
    if (!changelogContents.split('\n').find((l) => l.startsWith(unreleasedHeader))) {
      // add in the unreleased header
      changelogContents = `${unreleasedHeader}\n${changelogContents}`
    }

    // add commits under unreleased header
    const commits = processCommits(allCommits.data.commits)
    changelogContents = changelogContents.replace(unreleasedHeader, `${unreleasedHeader}\n${commits.join('\n')}`)
    await fs.writeFile(filePath, changelogContents)
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
