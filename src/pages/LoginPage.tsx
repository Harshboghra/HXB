import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { InputField } from '../components/FormField'
import { AuthLayout } from '../layouts/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { validatePassword, validateUsername } from '../lib/validation'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const destination = (location.state as { from?: string } | null)?.from ?? '/'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const usernameError = validateUsername(username)
    const passwordError = validatePassword(password)

    if (usernameError || passwordError) {
      setError(usernameError ?? passwordError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await login({ username, password })
      navigate(destination, { replace: true })
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in with your username and password to manage notes, daily tasks, and profile preferences."
      footer={
        <div className="flex items-center justify-between gap-3">
          <Link to="/forgot-password" className="text-sm font-medium text-(--text-soft) hover:text-(--text)">
            Forgot username?
          </Link>
          <Link to="/register" className="text-sm font-semibold text-(--accent) hover:underline">
            Create account
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
          hint="Email addresses are not required."
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Enter your password"
        />
        {error ? <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
        <Button type="submit" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  )
}
