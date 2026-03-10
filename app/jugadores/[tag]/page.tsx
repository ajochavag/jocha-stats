'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Trophy, Target, TrendingUp, Zap, ArrowUpDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getPlayerBySlug, getPlayerTournamentHistory, getPlayerHeadToHead, players } from '@/lib/data'

function getPlacementColor(placement: number) {
  switch (placement) {
    case 1:
      return 'text-[#FFD700] bg-[#FFD700]/10'
    case 2:
      return 'text-[#C0C0C0] bg-[#C0C0C0]/10'
    case 3:
      return 'text-[#CD7F32] bg-[#CD7F32]/10'
    default:
      return 'text-zinc-400 bg-zinc-800'
  }
}

type H2HSortOption = 'winRate' | 'wins' | 'recent'

export default function PlayerProfilePage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = use(params)
  const player = getPlayerBySlug(tag)
  const [h2hSort, setH2hSort] = useState<H2HSortOption>('winRate')

  if (!player) {
    notFound()
  }

  const tournamentHistory = getPlayerTournamentHistory(player.tag)
  const headToHead = getPlayerHeadToHead(player.tag)

  const sortedH2H = useMemo(() => {
    const sorted = [...headToHead]
    switch (h2hSort) {
      case 'winRate':
        sorted.sort((a, b) => b.winRate - a.winRate)
        break
      case 'wins':
        sorted.sort((a, b) => b.wins - a.wins)
        break
      case 'recent':
        sorted.sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime())
        break
    }
    return sorted
  }, [headToHead, h2hSort])

  // Chart data - placement progress (inverted so 1st is at top)
  const chartData = tournamentHistory.map(({ tournament, result }) => ({
    name: `#${tournament.id}`,
    tournament: tournament.name,
    placement: result.placement,
    invertedPlacement: 13 - result.placement, // Invert so 1st (1) becomes 12, showing at top
  }))

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      {/* Back Button */}
      <Link
        href="/jugadores"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={18} />
        Volver a Jugadores
      </Link>

      {/* Profile Header */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#CC1F1F]/30 via-zinc-900 to-[#1E6FCC]/30" />
        <div className="absolute inset-0 bg-zinc-900/80" />
        
        {/* Glow effects */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#CC1F1F]/20 rounded-full blur-[100px]" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#1E6FCC]/20 rounded-full blur-[100px]" />

        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-white tracking-wider mb-2">
                {player.tag}
              </h1>
              <p className="text-xl text-zinc-400">{player.main}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-zinc-400">Ranking:</span>
              <span className="text-2xl font-bold text-white">
                #{players.findIndex(p => p.slug === player.slug) + 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
          <Target className="mx-auto text-[#CC1F1F] mb-3" size={24} />
          <div className="font-[var(--font-bebas-neue)] text-3xl text-white tracking-wide">{player.winRate}%</div>
          <p className="text-sm text-zinc-500 mt-1">Win Rate</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
          <Trophy className="mx-auto text-green-500 mb-3" size={24} />
          <div className="font-[var(--font-bebas-neue)] text-3xl text-white tracking-wide">{player.setsWon}</div>
          <p className="text-sm text-zinc-500 mt-1">Sets Ganados</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
          <TrendingUp className="mx-auto text-red-500 mb-3" size={24} />
          <div className="font-[var(--font-bebas-neue)] text-3xl text-white tracking-wide">{player.setsLost}</div>
          <p className="text-sm text-zinc-500 mt-1">Sets Perdidos</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
          <Zap className="mx-auto text-[#FFD700] mb-3" size={24} />
          <div className="font-[var(--font-bebas-neue)] text-3xl text-white tracking-wide">{player.currentStreak}</div>
          <p className="text-sm text-zinc-500 mt-1">Racha Actual</p>
        </div>
      </div>

      {/* Mains Section */}
      <section className="mb-12">
        <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-6">
          Mains
        </h2>
        <div className="flex flex-wrap gap-3">
          {player.characterStats.map((char) => (
            <div
              key={char.character}
              className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl"
            >
              <span className="text-white font-medium">{char.character}</span>
              <div className="h-4 w-px bg-zinc-700" />
              <span className="text-sm text-zinc-400">{char.winRate}% WR</span>
              <span className="text-xs text-zinc-600">({char.setsPlayed} sets)</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tournament History */}
      <section className="mb-12">
        <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-6">
          Historial de Torneos
        </h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Torneo</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Pos</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Sets W</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Sets L</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {tournamentHistory.reverse().map(({ tournament, result }) => (
                  <tr
                    key={tournament.id}
                    className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors group hover:border-l-2 hover:border-l-[#CC1F1F]"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/torneos/${tournament.slug}`}
                        className="text-white font-medium hover:text-[#CC1F1F] transition-colors"
                      >
                        {tournament.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${getPlacementColor(result.placement)}`}>
                        {result.placement}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-green-500 font-medium">{result.setsWon}</td>
                    <td className="px-4 py-4 text-red-500 font-medium">{result.setsLost}</td>
                    <td className="px-4 py-4 text-white font-semibold">{result.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Progress Chart */}
      {chartData.length > 1 && (
        <section className="mb-12">
          <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-6">
            Progreso de Posiciones
          </h2>
          <div className="bg-[#111114] border border-zinc-800 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#71717a"
                  fontSize={12}
                  domain={[0, 12]}
                  ticks={[2, 4, 6, 8, 10, 12]}
                  tickFormatter={(value) => {
                    const placement = 13 - value
                    if (placement === 1) return '1st'
                    if (placement === 3) return '3rd'
                    if (placement === 5) return '5th'
                    if (placement === 7) return '7th'
                    if (placement === 9) return '9th+'
                    return ''
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number, name: string) => {
                    const placement = 13 - value
                    return [`${placement}${placement === 1 ? 'st' : placement === 2 ? 'nd' : placement === 3 ? 'rd' : 'th'}`, 'Posición']
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.tournament
                    }
                    return label
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="invertedPlacement" 
                  stroke="#CC1F1F" 
                  strokeWidth={3}
                  dot={{ fill: '#CC1F1F', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, fill: '#CC1F1F' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Head to Head */}
      {sortedH2H.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide">
              Head-to-Head
            </h2>
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-zinc-500" />
              <select
                value={h2hSort}
                onChange={(e) => setH2hSort(e.target.value as H2HSortOption)}
                className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#CC1F1F]/50 transition-colors"
              >
                <option value="winRate">Por Win Rate</option>
                <option value="wins">Por Victorias</option>
                <option value="recent">Por Recientes</option>
              </select>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Oponente</th>
                    <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">W-L</th>
                    <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Win Rate</th>
                    <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Último Juego</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedH2H.map((h2h) => {
                    const opponentPlayer = players.find(p => p.tag === h2h.opponent)
                    return (
                      <tr
                        key={h2h.opponent}
                        className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors group hover:border-l-2 hover:border-l-[#CC1F1F]"
                      >
                        <td className="px-4 py-4">
                          <Link
                            href={`/jugadores/${opponentPlayer?.slug || h2h.opponent.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-white font-medium hover:text-[#CC1F1F] transition-colors"
                          >
                            {h2h.opponent}
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-green-500">{h2h.wins}</span>
                          <span className="text-zinc-600 mx-1">-</span>
                          <span className="text-red-500">{h2h.losses}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`font-semibold ${
                            h2h.winRate >= 50 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {h2h.winRate}%
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell text-zinc-500">
                          {new Date(h2h.lastPlayed).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
