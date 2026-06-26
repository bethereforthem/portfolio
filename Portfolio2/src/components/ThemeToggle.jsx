import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { dark, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
        hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1
        ${dark
          ? 'bg-yellow-400/25 text-yellow-300 hover:bg-yellow-400/40 ring-1 ring-yellow-400/30'
          : 'bg-white/20 text-white hover:bg-white/35 ring-1 ring-white/30'}
        ${className}`}
    >
      <i className={`fas ${dark ? 'fa-sun' : 'fa-moon'} text-sm`} aria-hidden="true" />
    </button>
  )
}
