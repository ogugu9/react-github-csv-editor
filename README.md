# GitHub Spreadsheet Editor

A React component for editing CSV/TSV files on GitHub with OAuth authentication and automatic Pull Request creation.

## Features

- 🔐 **GitHub OAuth Authentication** - Secure authentication using GitHub OAuth Web flow
- 📊 **Spreadsheet Interface** - Familiar spreadsheet-like editing experience using react-spreadsheet
- 🔄 **Automatic PR Creation** - Creates new branches and pull requests automatically
- 📁 **CSV/TSV Support** - Supports both CSV and TSV file formats
- 🔒 **Fine-grained Permissions** - Works with GitHub Apps for secure, limited access
- ⚛️ **React Component** - Easy to integrate into existing React applications

## Installation

```bash
npm install github-spreadsheet-editor
```

## Usage

```tsx
import React from 'react'
import { GitHubSpreadsheetEditor } from 'github-spreadsheet-editor'

function App() {
  return (
    <GitHubSpreadsheetEditor
      owner="your-username"
      repo="your-repo"
      path="data.csv"
      clientId="your-github-oauth-client-id"
      onAuthSuccess={(token) => console.log('Authenticated:', token)}
      onSubmit={(prUrl) => console.log('PR created:', prUrl)}
      onError={(error) => console.error('Error:', error)}
    />
  )
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `owner` | `string` | ✅ | - | GitHub repository owner |
| `repo` | `string` | ✅ | - | GitHub repository name |
| `path` | `string` | ✅ | - | Path to CSV/TSV file in repository |
| `clientId` | `string` | ✅ | - | GitHub OAuth App client ID |
| `baseBranch` | `string` | ❌ | `"main"` | Base branch to create PR against |
| `newBranchPrefix` | `string` | ❌ | `"spreadsheet-edit"` | Prefix for new branch names |
| `scope` | `string` | ❌ | `"repo"` | GitHub OAuth scope |
| `redirectUri` | `string` | ❌ | `window.location.origin` | OAuth redirect URI |
| `readOnly` | `boolean` | ❌ | `false` | Whether to disable editing |
| `sheetOptions` | `object` | ❌ | `{}` | Options passed to react-spreadsheet |
| `onAuthSuccess` | `function` | ❌ | - | Callback when authentication succeeds |
| `onAuthError` | `function` | ❌ | - | Callback when authentication fails |
| `onSubmit` | `function` | ❌ | - | Callback when PR is created |
| `onError` | `function` | ❌ | - | Callback when an error occurs |
| `renderLoading` | `function` | ❌ | - | Custom loading component renderer |
| `renderError` | `function` | ❌ | - | Custom error component renderer |

## GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your app name
   - **Homepage URL**: Your app's homepage
   - **Authorization callback URL**: Your app's URL (e.g., `http://localhost:3000` for development)
4. Copy the Client ID and use it in the `clientId` prop

## GitHub App Setup (Recommended)

For production use, it's recommended to use a GitHub App instead of an OAuth App for better security and fine-grained permissions:

1. Go to GitHub Settings > Developer settings > GitHub Apps
2. Click "New GitHub App"
3. Configure the app with minimal required permissions:
   - **Repository permissions**: Contents (Read & Write), Pull requests (Write), Metadata (Read)
4. Generate a client secret and configure your OAuth flow

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the library
npm run build

# Preview the built library
npm run preview
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
