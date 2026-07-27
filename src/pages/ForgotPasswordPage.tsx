import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { AuthLayout } from '../layouts/AuthLayout'

export function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot username"
      description="Recovery is a placeholder here. Keep the username you registered with and sign in again when ready."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-(--accent) hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-[20px] border border-(--border) bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] p-4 text-sm leading-6 text-(--text-soft)">
          Username recovery is intentionally left as a placeholder in this build.
        </div>
        <Button type="button" className="w-full" disabled>
          Recovery coming soon
        </Button>
      </div>
    </AuthLayout>
  )
}
