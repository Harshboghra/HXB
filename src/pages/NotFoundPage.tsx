import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Panel } from '../components/Panel'

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center px-6 py-12">
      <Panel className="max-w-lg space-y-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-(--accent)">404</p>
        <h1 className="text-3xl font-semibold tracking-tight text-(--text)">Page not found</h1>
        <p className="text-sm leading-6 text-(--text-soft)">
          The page you requested is not available. Return to the dashboard to continue working.
        </p>
        <Link to="/">
          <Button className="w-full">Back to dashboard</Button>
        </Link>
      </Panel>
    </div>
  )
}
