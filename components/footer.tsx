import Link from 'next/link'
import { Twitter, Youtube, Twitch } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#0A0A0F]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-[var(--font-bebas-neue)] text-xl font-bold tracking-wider text-white">
                STATS
              </span>
              <span className="font-[var(--font-bebas-neue)] text-xl font-bold tracking-wider text-[#CC1F1F]">
                BONG
              </span>
            </Link>
            <p className="text-sm text-zinc-500">
              Powered by{' '}
              <a 
                href="https://start.gg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#1E6FCC] hover:underline"
              >
                start.gg
              </a>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={20} />
            </a>
            <a
              href="https://twitch.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="Twitch"
            >
              <Twitch size={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Smash Bong. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
