import Link from 'next/link'
import { Calendar, Users, Trophy } from 'lucide-react'
import type { Tournament } from '@/lib/data'

interface TournamentCardProps {
  tournament: Tournament
}

function getPlacementColor(placement: number) {
  switch (placement) {
    case 1:
      return 'text-[#FFD700]'
    case 2:
      return 'text-[#C0C0C0]'
    case 3:
      return 'text-[#CD7F32]'
    default:
      return 'text-[#C8C8C8]'
  }
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const top3 = tournament.results.filter(r => r.placement <= 3).sort((a, b) => a.placement - b.placement)

  return (
    <Link href={`/torneos/${tournament.slug}`}>
      <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-[#CC1F1F]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#CC1F1F]/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-[var(--font-bebas-neue)] text-xl text-white tracking-wide group-hover:text-[#CC1F1F] transition-colors">
              {tournament.name}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(tournament.date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {tournament.entrants}
              </span>
            </div>
          </div>
          <span className="px-2 py-1 text-xs font-medium bg-[#1E6FCC]/20 text-[#1E6FCC] rounded">
            {tournament.format}
          </span>
        </div>

        <div className="flex items-end gap-3 pt-3 border-t border-zinc-800">
          <Trophy size={16} className="text-zinc-600 mb-0.5" />
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {top3.map((result, index) => (
              <div key={result.playerTag} className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${getPlacementColor(result.placement)}`}>
                  {result.placement === 1 ? '1st' : result.placement === 2 ? '2nd' : '3rd'}
                </span>
                <span className="text-sm text-white">{result.playerTag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
