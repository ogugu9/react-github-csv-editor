import { useState, useCallback, useEffect } from 'react'
import { Octokit } from '@octokit/rest'
import { FileState, GitHubFile } from '../types'
import { parseCSV, parseTSV, detectFileType } from '../utils/csvParser'

interface UseGitHubFileProps {
  owner: string
  repo: string
  path: string
  branch?: string
  token: string | null
}

export function useGitHubFile({
  owner,
  repo,
  path,
  branch = 'main',
  token
}: UseGitHubFileProps) {
  const [fileState, setFileState] = useState<FileState>({
    content: [],
    loading: false,
    error: null,
    sha: null
  })

  const octokit = token ? new Octokit({ auth: token }) : null

  const loadFile = useCallback(async () => {
    if (!octokit) return

    setFileState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch
      })

      const file = response.data as GitHubFile
      
      if (file.type !== 'file') {
        throw new Error('Path does not point to a file')
      }

      const content = Buffer.from(file.content, 'base64').toString('utf-8')
      const fileType = detectFileType(path)
      
      let parsedContent: string[][]
      if (fileType === 'csv') {
        parsedContent = parseCSV(content)
      } else if (fileType === 'tsv') {
        parsedContent = parseTSV(content)
      } else {
        throw new Error('Unsupported file type. Only CSV and TSV files are supported.')
      }

      setFileState({
        content: parsedContent,
        loading: false,
        error: null,
        sha: file.sha
      })
    } catch (error) {
      setFileState(prev => ({
        ...prev,
        loading: false,
        error: error as Error
      }))
    }
  }, [octokit, owner, repo, path, branch])

  const updateContent = useCallback((newContent: string[][]) => {
    setFileState(prev => ({ ...prev, content: newContent }))
  }, [])

  useEffect(() => {
    if (token) {
      loadFile()
    }
  }, [token, loadFile])

  return {
    ...fileState,
    loadFile,
    updateContent
  }
}
