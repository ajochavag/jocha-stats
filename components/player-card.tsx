import Link from 'next/link'
import { Trophy, Gamepad2, Target } from 'lucide-react'
import type { Player } from '@/lib/data'

interface PlayerCardProps {
  player: Player
}

function getPlacementLabel(placement: number) {
  switch (placement) {
    case 1: return '1st'
    case 2: return '2nd'
    case 3: return '3rd'
    default: return `${placement}th`
  }
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link href={`/jugadores/${player.slug}`}>
      <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-[#CC1F1F]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#CC1F1F]/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide group-hover:text-[#CC1F1F] transition-colors">
              {player.tag}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">{player.main}</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#CC1F1F]/10 text-[#CC1F1F]">
            <Target size={14} />
            <span className="text-sm font-semibold">{player.winRate}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <Gamepad2 size={14} className="text-zinc-600" />
            <span className="text-sm text-zinc-400">{player.tournamentsAttended} torneos</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-zinc-600" />
            <span className="text-sm text-zinc-400">Mejor: {getPlacementLabel(player.bestPlacement)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
