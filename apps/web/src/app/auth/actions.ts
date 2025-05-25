'use server'

import { env } from '@saas/env'
import { redirect } from 'next/navigation'

export async function signInWithGithub() {
  const githubSigninUrl = new URL('login/oauth/authorize', 'https://github.com')

  githubSigninUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  githubSigninUrl.searchParams.set(
    'redirect_uri',
    env.GITHUB_OAUTH_REDIRECT_URI,
  )
  githubSigninUrl.searchParams.set('scope', 'user')

  redirect(githubSigninUrl.toString())
}
