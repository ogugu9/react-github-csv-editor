declare module 'github-spreadsheet-editor' {
  import { ReactNode } from 'react';

  export interface GitHubSpreadsheetEditorProps {
    owner: string;
    repo: string;
    path: string;
    baseBranch?: string;
    newBranchPrefix?: string;
    readOnly?: boolean;
    onAuthSuccess?: (token: string) => void;
    onAuthError?: (error: Error) => void;
    onSubmit?: (prUrl: string) => void;
    onError?: (error: Error) => void;
    renderLoading?: () => ReactNode;
    renderError?: (error: Error) => ReactNode;
  }

  export interface GitHubAuthProviderProps {
    clientId: string;
    redirectUri?: string;
    children: ReactNode;
  }

  export const GitHubSpreadsheetEditor: React.FC<GitHubSpreadsheetEditorProps>;
  export const GitHubAuthProvider: React.FC<GitHubAuthProviderProps>;
}
