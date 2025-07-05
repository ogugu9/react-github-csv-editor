import { useState, useCallback } from 'react'
import { Octokit } from '@octokit/rest'
import { PRState } from '../types'
import { stringifyCSV, stringifyTSV, detectFileType } from '../utils/csvParser'

interface UsePullRequestProps {
  owner: string
  repo: string
  path: string
  baseBranch?: string
  newBranchPrefix?: string
  token: string | null
  onSubmit?: (prUrl: string) => void
  onError?: (error: Error) => void
}

export function usePullRequest({
  owner,
  repo,
  path,
  baseBranch = 'main',
  newBranchPrefix = 'spreadsheet-edit',
  token,
  onSubmit,
  onError
}: UsePullRequestProps) {
  const [prState, setPrState] = useState<PRState>({
    creating: false,
    error: null,
    url: null
  })

  const octokit = token ? new Octokit({ auth: token }) : null

  const createPullRequest = useCallback(async (
    content: string[][],
    commitMessage: string = 'Update spreadsheet data',
    prTitle: string = 'Update spreadsheet data',
    prBody: string = 'Updated spreadsheet data via GitHub Spreadsheet Editor'
  ) => {
    if (!octokit) {
      const error = new Error('Not authenticated')
      setPrState(prev => ({ ...prev, error }))
      onError?.(error)
      return
    }

    setPrState({ creating: true, error: null, url: null })

    try {
      const baseRef = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${baseBranch}`
      })

      const timestamp = Date.now()
      const newBranchName = `${newBranchPrefix}-${timestamp}`
      
      await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranchName}`,
        sha: baseRef.data.object.sha
      })

      const currentFile = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: baseBranch
      })

      if (Array.isArray(currentFile.data) || currentFile.data.type !== 'file') {
        throw new Error('Path does not point to a file')
      }

      const fileType = detectFileType(path)
      let fileContent: string
      
      if (fileType === 'csv') {
        fileContent = stringifyCSV(content)
      } else if (fileType === 'tsv') {
        fileContent = stringifyTSV(content)
      } else {
        throw new Error('Unsupported file type')
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: commitMessage,
        content: Buffer.from(fileContent).toString('base64'),
        sha: currentFile.data.sha,
        branch: newBranchName
      })

      const pr = await octokit.pulls.create({
        owner,
        repo,
        title: prTitle,
        head: newBranchName,
        base: baseBranch,
        body: prBody
      })

      setPrState({
        creating: false,
        error: null,
        url: pr.data.html_url
      })

      onSubmit?.(pr.data.html_url)
    } catch (error) {
      const err = error as Error
      setPrState({
        creating: false,
        error: err,
        url: null
      })
      onError?.(err)
    }
  }, [octokit, owner, repo, path, baseBranch, newBranchPrefix, onSubmit, onError])

  return {
    ...prState,
    createPullRequest
  }
}
