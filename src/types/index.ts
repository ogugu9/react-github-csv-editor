export interface GitHubSpreadsheetEditorProps {
  owner: string
  repo: string
  path: string
  baseBranch?: string
  newBranchPrefix?: string
  readOnly?: boolean
  sheetOptions?: Partial<any>
  onAuthSuccess?: (token: string) => void
  onAuthError?: (error: Error) => void
  onSubmit?: (prUrl: string) => void
  onError?: (error: Error) => void
  renderLoading?: () => React.ReactNode
  renderError?: (error: Error) => React.ReactNode
}

export interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  content: string
  encoding: string
}

export interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: any | null
  loading: boolean
  error: Error | null
}

export interface FileState {
  content: string[][]
  loading: boolean
  error: Error | null
  sha: string | null
}

export interface PRState {
  creating: boolean
  error: Error | null
  url: string | null
}
