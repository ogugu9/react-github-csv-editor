import React from 'react'
import ReactDOM from 'react-dom/client'
import { GitHubSpreadsheetEditor } from '../src'

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>GitHub Spreadsheet Editor Demo</h1>
      <p>This is a demo of the GitHub Spreadsheet Editor component.</p>
      <p><strong>Note:</strong> You need to configure a GitHub OAuth App and provide a valid clientId to test the authentication flow.</p>
      
      <GitHubSpreadsheetEditor
        owner="octocat"
        repo="Hello-World"
        path="data.csv"
        clientId="your-github-oauth-client-id"
        onAuthSuccess={(token) => console.log('Auth success:', token)}
        onAuthError={(error) => console.error('Auth error:', error)}
        onSubmit={(prUrl) => console.log('PR created:', prUrl)}
        onError={(error) => console.error('Error:', error)}
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
