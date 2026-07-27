import { MoonStar, SunMedium } from 'lucide-react'
import { Button } from './Button'
import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="secondary" onClick={() => void toggleTheme()} className="w-full justify-start">
      {theme === 'dark' ? <SunMedium size={16} /> : <MoonStar size={16} />}
      <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </Button>
  )
}
