'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getRankings, type Player } from '@/lib/data'

type FilterOption = 'all' | 'last5' | 'last3'

function getPlacementColor(rank: number) {
  switch (rank) {
    case 1:
      return 'bg-[#FFD700]/10 border-[#FFD700]/30'
    case 2:
      return 'bg-[#C0C0C0]/10 border-[#C0C0C0]/30'
    case 3:
      return 'bg-[#CD7F32]/10 border-[#CD7F32]/30'
    default:
      return ''
  }
}

function getRankColor(rank: number) {
  switch (rank) {
    case 1:
      return 'text-[#FFD700]'
    case 2:
      return 'text-[#C0C0C0]'
    case 3:
      return 'text-[#CD7F32]'
    default:
      return 'text-zinc-400'
  }
}

function getPlacementLabel(placement: number) {
  switch (placement) {
    case 1: return '1st'
    case 2: return '2nd'
    case 3: return '3rd'
    default: return `${placement}th`
  }
}

export default function RankingsPage() {
  const [filter, setFilter] = useState<FilterOption>('all')

  const rankings = useMemo(() => {
    return getRankings(filter)
  }, [filter])

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="font-[var(--font-bebas-neue)] text-4xl md:text-5xl text-white tracking-wide mb-2">
          Rankings
        </h1>
        <div className="h-1 w-24 bg-[#CC1F1F] rounded-full" />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-[#CC1F1F] text-white'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setFilter('last5')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'last5'
              ? 'bg-[#CC1F1F] text-white'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
          }`}
        >
          Last 5 Tournaments
        </button>
        <button
          onClick={() => setFilter('last3')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'last3'
              ? 'bg-[#CC1F1F] text-white'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
          }`}
        >
          Last 3 Tournaments
        </button>
      </div>

      {/* Rankings Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-left">
                <th className="px-4 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Rank</th>
                <th className="px-4 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Jugador</th>
                <th className="px-4 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Puntos</th>
                <th className="px-4 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Torneos</th>
                <th className="px-4 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Mejor Pos</th>
                <th className="px-4 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Win Rate</th>
                <th className="px-4 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Sets W-L</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((player, index) => {
                const rank = index + 1
                return (
                  <tr
                    key={player.slug}
                    className={`border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors group hover:border-l-2 hover:border-l-[#CC1F1F] ${getPlacementColor(rank)}`}
                  >
                    <td className="px-4 py-5">
                      <span className={`text-lg font-bold ${getRankColor(rank)}`}>
                        #{rank}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <Link
                        href={`/jugadores/${player.slug}`}
                        className="flex items-center gap-3"
                      >
                        <div>
                          <span className="text-white font-semibold hover:text-[#CC1F1F] transition-colors block">
                            {player.tag}
                          </span>
                          <span className="text-xs text-zinc-500">{player.main}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-white font-bold text-lg">{player.totalPoints}</span>
                    </td>
                    <td className="px-4 py-5 hidden sm:table-cell text-zinc-400">
                      {player.tournamentsAttended}
                    </td>
                    <td className="px-4 py-5 hidden md:table-cell">
                      <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-sm font-medium ${
                        player.bestPlacement === 1 ? 'bg-[#FFD700]/10 text-[#FFD700]' :
                        player.bestPlacement === 2 ? 'bg-[#C0C0C0]/10 text-[#C0C0C0]' :
                        player.bestPlacement === 3 ? 'bg-[#CD7F32]/10 text-[#CD7F32]' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {getPlacementLabel(player.bestPlacement)}
                      </span>
                    </td>
                    <td className="px-4 py-5 hidden lg:table-cell">
                      <span className={`font-medium ${
                        player.winRate >= 70 ? 'text-green-500' :
                        player.winRate >= 50 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {player.winRate}%
                      </span>
                    </td>
                    <td className="px-4 py-5 hidden lg:table-cell text-zinc-400">
                      <span className="text-green-500">{player.setsWon}</span>
                      <span className="text-zinc-600 mx-1">-</span>
                      <span className="text-red-500">{player.setsLost}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
