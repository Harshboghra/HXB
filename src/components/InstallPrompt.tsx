import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from './Button'
import { Panel } from './Panel'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone
    if (isStandalone) {
      return undefined
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      setVisible(true)
    }

    function handleAppInstalled() {
      setVisible(false)
      setInstallEvent(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  async function handleInstall() {
    if (!installEvent) {
      return
    }

    await installEvent.prompt()
    const choice = await installEvent.userChoice
    setVisible(false)
    if (choice.outcome === 'accepted') {
      setInstallEvent(null)
    }
  }

  if (!visible || !installEvent) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-28 z-40 sm:inset-x-auto sm:right-6 sm:max-w-sm">
      <Panel className="pointer-events-auto flex items-start gap-3 border-(--border) bg-(--surface-strong) p-4 shadow-(--shadow)">
        <div className="mt-1 rounded-2xl bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] p-3 text-(--accent)">
          <Download size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-(--text)">Install Task Notes</p>
          <p className="mt-1 text-sm leading-6 text-(--text-soft)">Add the app to your home screen for faster access and better offline use.</p>
          <div className="mt-3 flex gap-2">
            <Button type="button" onClick={() => void handleInstall()} className="min-h-11">
              Install
            </Button>
            <Button type="button" variant="secondary" className="min-h-11 px-3" onClick={() => setVisible(false)}>
              <X size={16} />
              Later
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  )
}