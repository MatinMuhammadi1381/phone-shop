import { NextResponse } from 'next/server'

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_SCOPES = ['openid', 'email', 'profile']
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI

function isValidClientId(value: string) {
  return Boolean(value) && !/your[-_]?google|your[-_]?client/i.test(value)
}

function getAppBaseUrl(request: Request) {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  const url = new URL(request.url)
  return `${url.protocol}//${url.host}`
}

function getRedirectUri(request: Request) {
  return GOOGLE_REDIRECT_URI ?? `${getAppBaseUrl(request)}/api/auth/google/callback`
}

function buildGoogleAuthUrl(request: Request) {
  if (!isValidClientId(GOOGLE_CLIENT_ID)) {
    throw new Error('Google OAuth client ID is not configured correctly')
  }

  return `${GOOGLE_AUTH_ENDPOINT}?${new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: getRedirectUri(request),
    response_type: 'code',
    scope: GOOGLE_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'select_account',
    include_granted_scopes: 'true',
  }).toString()}`
}

export function GET(request: Request) {
  try {
    return NextResponse.redirect(buildGoogleAuthUrl(request))
  } catch (error) {
    const redirectUrl = new URL('/auth', request.url)
    redirectUrl.searchParams.set('error', (error as Error).message)
    return NextResponse.redirect(redirectUrl)
  }
}
