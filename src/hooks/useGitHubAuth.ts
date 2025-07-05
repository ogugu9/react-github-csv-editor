import { useState, useCallback, useEffect } from 'react'
import { AuthState } from '../types'

interface UseGitHubAuthProps {
  clientId: string
  scope?: string
  redirectUri?: string
  onAuthSuccess?: (token: string) => void
  onAuthError?: (error: Error) => void
}

export function useGitHubAuth({
  clientId,
  scope = 'repo',
  redirectUri = window.location.origin,
  onAuthSuccess,
  onAuthError
}: UseGitHubAuthProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    loading: false,
    error: null
  })

  const login = useCallback(() => {
    const state = Math.random().toString(36).substring(2, 15)
    localStorage.setItem('github_oauth_state', state)
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      state
    })
    
    window.location.href = `https://github.com/login/oauth/authorize?${params}`
  }, [clientId, redirectUri, scope])

  const logout = useCallback(() => {
    localStorage.removeItem('github_access_token')
    localStorage.removeItem('github_oauth_state')
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      loading: false,
      error: null
    })
  }, [])

  const handleCallback = useCallback(async (code: string, state: string) => {
    const savedState = localStorage.getItem('github_oauth_state')
    if (state !== savedState) {
      const error = new Error('Invalid OAuth state')
      setAuthState(prev => ({ ...prev, error, loading: false }))
      onAuthError?.(error)
      return
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          state
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error_description || data.error)
      }

      const token = data.access_token
      localStorage.setItem('github_access_token', token)
      localStorage.removeItem('github_oauth_state')

      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      const user = await userResponse.json()

      setAuthState({
        isAuthenticated: true,
        token,
        user,
        loading: false,
        error: null
      })

      onAuthSuccess?.(token)
    } catch (error) {
      const err = error as Error
      setAuthState(prev => ({ ...prev, error: err, loading: false }))
      onAuthError?.(err)
    }
  }, [clientId, onAuthSuccess, onAuthError])

  useEffect(() => {
    const token = localStorage.getItem('github_access_token')
    if (token) {
      setAuthState(prev => ({ ...prev, loading: true }))
      
      fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => response.json())
      .then(user => {
        setAuthState({
          isAuthenticated: true,
          token,
          user,
          loading: false,
          error: null
        })
        onAuthSuccess?.(token)
      })
      .catch(error => {
        localStorage.removeItem('github_access_token')
        setAuthState(prev => ({ ...prev, error, loading: false }))
        onAuthError?.(error)
      })
    }

    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    
    if (code && state) {
      handleCallback(code, state)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [handleCallback, onAuthSuccess, onAuthError])

  return {
    ...authState,
    login,
    logout
  }
}
