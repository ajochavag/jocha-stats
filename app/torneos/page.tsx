import { TournamentCard } from '@/components/tournament-card'
import type { Tournament } from '@/lib/data'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function getTournaments(): Promise<Tournament[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/tournaments`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function TorneosPage() {
  const tournaments = await getTournaments()

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="font-[var(--font-bebas-neue)] text-4xl md:text-5xl text-white tracking-wide mb-2">
          Torneos
        </h1>
        <div className="h-1 w-24 bg-[#CC1F1F] rounded-full" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...tournaments].reverse().map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>

      {tournaments.length === 0 && (
        <div className="text-center py-16">
          <p className="text-zinc-500">No hay torneos disponibles.</p>
        </div>
      )}
    </div>
  )
}
