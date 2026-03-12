'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { href: '/torneos', label: 'Torneos' },
  { href: '/jugadores', label: 'Jugadores' },
  { href: '/rankings', label: 'Rankings' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#0A0A0F]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0F]/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <span className="font-[var(--font-bebas-neue)] text-2xl md:text-3xl font-bold tracking-wider text-white">
              STATS
            </span>
            <span className="font-[var(--font-bebas-neue)] text-2xl md:text-3xl font-bold tracking-wider text-[#CC1F1F] ml-2">
              BONG
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-white relative py-2',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#CC1F1F]'
                  : 'text-[#C8C8C8]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-zinc-800 bg-[#0A0A0F]">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-lg font-medium transition-colors hover:text-white py-2 border-l-2',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-white border-[#CC1F1F] pl-4'
                    : 'text-[#C8C8C8] border-transparent pl-4'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
