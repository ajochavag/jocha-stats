import { tournaments } from '@/lib/data'
import { TournamentCard } from '@/components/tournament-card'

export default function TorneosPage() {
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
    </div>
  )
}
