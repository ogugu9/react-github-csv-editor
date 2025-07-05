import React, { useMemo, useContext } from 'react'
import Spreadsheet from 'react-spreadsheet'
import { AuthContext, type IAuthContext } from 'react-oauth2-code-pkce/src'
import { GitHubSpreadsheetEditorProps } from '../types'
import { useGitHubFile } from '../hooks/useGitHubFile'
import { usePullRequest } from '../hooks/usePullRequest'

export const GitHubSpreadsheetEditor: React.FC<GitHubSpreadsheetEditorProps> = ({
  owner,
  repo,
  path,
  baseBranch = 'main',
  newBranchPrefix = 'spreadsheet-edit',
  readOnly = false,
  sheetOptions = {},
  onSubmit,
  onError,
  renderLoading,
  renderError
}) => {
  const { token, logIn, logOut, error: authError, loginInProgress }: IAuthContext = useContext(AuthContext)

  const file = useGitHubFile({
    owner,
    repo,
    path,
    branch: baseBranch,
    token: token
  })

  const pr = usePullRequest({
    owner,
    repo,
    path,
    baseBranch,
    newBranchPrefix,
    token: token,
    onSubmit,
    onError
  })

  const spreadsheetData = useMemo(() => {
    return file.content.map(row => 
      row.map(cell => ({ value: cell }))
    )
  }, [file.content])

  const handleSpreadsheetChange = (data: any[][]) => {
    const newContent = data.map(row => 
      row.map(cell => cell?.value?.toString() || '')
    )
    file.updateContent(newContent)
  }

  const handleSubmit = async () => {
    if (readOnly) return
    
    const commitMessage = `Update ${path}`
    const prTitle = `Update ${path} via GitHub Spreadsheet Editor`
    const prBody = `Updated ${path} using GitHub Spreadsheet Editor.\n\nRepository: ${owner}/${repo}\nFile: ${path}\nBase branch: ${baseBranch}`
    
    await pr.createPullRequest(file.content, commitMessage, prTitle, prBody)
  }

  if (loginInProgress || file.loading) {
    if (renderLoading) {
      return <>{renderLoading()}</>
    }
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    )
  }

  const error = authError || file.error || pr.error
  if (error) {
    const errorObj = typeof error === 'string' ? new Error(error) : error
    if (renderError) {
      return <>{renderError(errorObj)}</>
    }
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <div>Error: {errorObj.message}</div>
      </div>
    )
  }

  if (!token) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>GitHub Authentication Required</h3>
        <p>Please authenticate with GitHub to access the repository.</p>
        <button
          onClick={() => logIn()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#24292e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Sign in with GitHub
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0 }}>
            {owner}/{repo} - {path}
          </h3>
          <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
            Authenticated with GitHub
          </p>
        </div>
        <div>
          {!readOnly && (
            <button
              onClick={handleSubmit}
              disabled={pr.creating}
              style={{
                padding: '8px 16px',
                backgroundColor: pr.creating ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: pr.creating ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                marginRight: '10px'
              }}
            >
              {pr.creating ? 'Creating PR...' : 'Create Pull Request'}
            </button>
          )}
          <button
            onClick={() => logOut()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {pr.url && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '6px',
          color: '#155724'
        }}>
          Pull request created successfully! 
          <a 
            href={pr.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ marginLeft: '10px', color: '#155724' }}
          >
            View PR
          </a>
        </div>
      )}

      <div style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
        <Spreadsheet
          data={spreadsheetData}
          onChange={readOnly ? undefined : handleSpreadsheetChange}
          {...sheetOptions}
        />
      </div>
    </div>
  )
}
