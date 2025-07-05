import { useState } from 'react'
import { GitHubSpreadsheetEditor, GitHubAuthProvider } from 'github-spreadsheet-editor'
import './App.css'

function App() {
  const [clientId, setClientId] = useState('')
  const [owner, setOwner] = useState('octocat')
  const [repo, setRepo] = useState('Hello-World')
  const [path, setPath] = useState('data.csv')

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>GitHub Spreadsheet Editor Demo</h1>
        <p>Edit CSV/TSV files on GitHub with a spreadsheet interface</p>
      </header>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Configuration</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              GitHub OAuth Client ID:
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="your-github-oauth-client-id"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Repository Owner:
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Repository Name:
            </label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              File Path:
            </label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="data.csv"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>
        
        {!clientId && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
            <strong>Note:</strong> You need to provide a GitHub OAuth Client ID to test the authentication flow.
            <br />
            <a href="https://github.com/settings/applications/new" target="_blank" rel="noopener noreferrer">
              Create a GitHub OAuth App
            </a> and use the Client ID here.
          </div>
        )}
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        {clientId ? (
          <GitHubAuthProvider clientId={clientId}>
            <GitHubSpreadsheetEditor
              owner={owner}
              repo={repo}
              path={path}
              onAuthSuccess={(token: string) => {
                console.log('Authentication successful:', token)
              }}
              onAuthError={(error: Error) => {
                console.error('Authentication error:', error)
              }}
              onSubmit={(prUrl: string) => {
                console.log('Pull request created:', prUrl)
                alert(`Pull request created successfully!\n${prUrl}`)
              }}
              onError={(error: Error) => {
                console.error('Component error:', error)
              }}
              renderLoading={() => (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
                </div>
              )}
              renderError={(error: Error) => (
                <div style={{ padding: '20px', color: '#d73a49', backgroundColor: '#ffeef0', border: '1px solid #fdb8c0', borderRadius: '6px' }}>
                  <strong>Error:</strong> {error.message}
                </div>
              )}
            />
          </GitHubAuthProvider>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Please provide a GitHub OAuth Client ID to test the component.
          </div>
        )}
      </div>

      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        <p>
          This demo showcases the GitHub Spreadsheet Editor React component.
          <br />
          Check the browser console for authentication and submission events.
        </p>
      </footer>
    </div>
  )
}

export default App
