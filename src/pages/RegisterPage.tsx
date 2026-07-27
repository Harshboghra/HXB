import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { InputField } from '../components/FormField'
import { AuthLayout } from '../layouts/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
  validateDisplayName,
  validatePassword,
  validateUsername,
} from '../lib/validation'

export function RegisterPage() {
  const { register } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const usernameError = validateUsername(username)
    const displayNameError = validateDisplayName(displayName)
    const passwordError = validatePassword(password)

    if (usernameError || displayNameError || passwordError) {
      setError(usernameError ?? displayNameError ?? passwordError)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await register({ username, password, displayName, themeMode: theme })
      navigate('/', { replace: true })
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to create your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your workspace"
      description="Set up a username-based account, store your password securely, and start managing tasks right away."
      footer={
        <div className="flex items-center justify-end gap-3">
          <Link to="/login" className="text-sm font-semibold text-(--accent) hover:underline">
            Sign in
          </Link>
        </div>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          placeholder="your_handle"
        />
        <InputField
          label="Display name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          autoComplete="nickname"
          placeholder="How your workspace should greet you"
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          placeholder="At least 8 characters, with letters and a number"
        />
        <InputField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          placeholder="Repeat your password"
        />
        {error ? <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}
