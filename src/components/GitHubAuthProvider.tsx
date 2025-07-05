import React from 'react'
import { AuthProvider, type TAuthConfig } from 'react-oauth2-code-pkce/src'

interface GitHubAuthProviderProps {
  clientId: string
  redirectUri?: string
  children: React.ReactNode
}

export const GitHubAuthProvider: React.FC<GitHubAuthProviderProps> = ({
  clientId,
  redirectUri = window.location.origin,
  children
}) => {
  const authConfig: TAuthConfig = {
    clientId,
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    redirectUri,
    scope: 'repo',
    decodeToken: false,
    autoLogin: false,
    storage: 'session',
    storageKeyPrefix: 'GITHUB_OAUTH_',
    clearURL: true
  }

  return (
    <AuthProvider authConfig={authConfig}>
      {children}
    </AuthProvider>
  )
}
