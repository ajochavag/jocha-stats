'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Trophy, Target, TrendingUp, Zap, ArrowUpDown, Swords } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Player, Tournament, TournamentResult, HeadToHead } from '@/lib/data'
import { CharacterIcon } from '@/components/CharacterIcon'

function getPlacementColor(placement: number) {
  switch (placement) {
    case 1: return 'text-[#FFD700] bg-[#FFD700]/10'
    case 2: return 'text-[#C0C0C0] bg-[#C0C0C0]/10'
    case 3: return 'text-[#CD7F32] bg-[#CD7F32]/10'
    default: return 'text-zinc-400 bg-zinc-800'
  }
}

type H2HSortOption = 'winRate' | 'wins' | 'recent'

interface SetMatchup {
  player1: string
  player2: string
  winner: string
  character1: string
  character2: string
  games?: { gameNum: number; character1: string; character2: string }[]
}

interface CharMatchup {
  myChar: string
  oppChar: string
  wins: number
  losses: number
  total: number
  winRate: number
}

interface PlayerApiResponse {
  player: Player
  rank: number
  tournamentHistory: { tournament: Tournament; result: TournamentResult }[]
  headToHead: HeadToHead[]
  sets?: SetMatchup[]
}

function buildPlayerMatchups(sets: SetMatchup[], playerTag: string): CharMatchup[] {
  const muMap: Record<string, { wins: number; losses: number }> = {}

  for (const set of sets) {
    const isP1 = set.player1 === playerTag
    const won = set.winner === playerTag

    const gamesToProcess = set.games && set.games.length > 0
      ? set.games.map(g => ({
          myChar: isP1 ? g.character1 : g.character2,
          oppChar: isP1 ? g.character2 : g.character1,
        }))
      : [{
          myChar: isP1 ? set.character1 : set.character2,
          oppChar: isP1 ? set.character2 : set.character1,
        }]

    for (const game of gamesToProcess) {
      if (!game.myChar || !game.oppChar) continue
      const key = `${game.myChar}||${game.oppChar}`
      if (!muMap[key]) muMap[key] = { wins: 0, losses: 0 }
      if (won) muMap[key].wins++
      else muMap[key].losses++
    }
  }

  return Object.entries(muMap)
    .map(([key, data]) => {
      const [myChar, oppChar] = key.split('||')
      const total = data.wins + data.losses
      return {
        myChar,
        oppChar,
        wins: data.wins,
        losses: data.losses,
        total,
        winRate: total > 0 ? Math.round((data.wins / total) * 100) : 0,
      }
    })
    .filter(m => m.total > 0)
    .sort((a, b) => b.total - a.total)
}

export default function PlayerProfilePage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = use(params)
  const [h2hSort, setH2hSort] = useState<H2HSortOption>('winRate')
  const [data, setData] = useState<PlayerApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/players/${tag}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [tag])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-32 mb-8" />
          <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-2xl mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-zinc-900 border border-zinc-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) notFound()

  const { player, rank, tournamentHistory, headToHead } = data

  const sortedH2H = [...headToHead].sort((a, b) => {
    switch (h2hSort) {
      case 'winRate': return b.winRate - a.winRate
      case 'wins': return b.wins - a.wins
      case 'recent': return new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
      default: return 0
    }
  })

  const chartData = tournamentHistory.map(({ tournament, result }) => ({
    name: `#${tournament.id}`,
    tournament: tournament.name,
    placement: result.placement,
    invertedPlacement: 13 - result.placement,
  }))

  const playerMatchups = data.sets ? buildPlayerMatchups(data.sets, player.tag) : []

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <Link href="/jugadores" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={18} />
        Volver a Jugadores
      </Link>

      {/* Profile Header */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#CC1F1F]/30 via-zinc-900 to-[#1E6FCC]/30" />
        <div className="absolute inset-0 bg-zinc-900/80" />
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#CC1F1F]/20 rounded-full blur-[100px]" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#1E6FCC]/20 rounded-full blur-[100px]" />
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="font-[var(--font-bebas-neue)] text-5xl md:text-6xl text-white tracking-wider mb-2">{player.tag}</h1>
              <p className="text-xl text-zinc-400">{player.main}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-zinc-400">Ranking:</span>
              <span className="text-2xl font-bold text-white">#{rank}</span>
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

      {/* Mains */}
      {player.characterStats && player.characterStats.length > 0 && (
        <section className="mb-12">
          <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-6">Mains</h2>
          <div className="flex flex-wrap gap-3">
            {player.characterStats.map((char) => (
              <div key={char.character} className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors">
                <CharacterIcon character={char.character} size={36} />
                <div>
                  <span className="text-white font-medium block">{char.character}</span>
                  <span className="text-zinc-500 text-xs">{char.winRate}% WR · {char.setsPlayed} sets</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Matchups */}
      {playerMatchups.length > 0 && (
        <section className="mb-12">
          <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-6 flex items-center gap-3">
            <Swords className="text-[#CC1F1F]" size={24} />
            Matchups
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playerMatchups.map((mu, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  {/* Mi personaje */}
                  <div className="text-center flex-1">
                    <div className="flex justify-center mb-2">
                      <CharacterIcon character={mu.myChar} size={44} />
                    </div>
                    <span className="text-white text-xs font-semibold block">{mu.myChar}</span>
                    <span className={`text-lg font-bold ${mu.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                      {mu.winRate}%
                    </span>
                  </div>

                  {/* VS */}
                  <div className="px-3 text-center">
                    <span className="text-zinc-600 text-xs font-bold block">VS</span>
                    <span className="text-zinc-500 text-xs">{mu.wins}-{mu.losses}</span>
                  </div>

                  {/* Personaje rival */}
                  <div className="text-center flex-1">
                    <div className="flex justify-center mb-2">
                      <CharacterIcon character={mu.oppChar} size={44} />
                    </div>
                    <span className="text-zinc-400 text-xs font-semibold block">{mu.oppChar}</span>
                    <span className={`text-lg font-bold ${mu.winRate < 50 ? 'text-green-500' : 'text-red-500'}`}>
                      {100 - mu.winRate}%
                    </span>
                  </div>
                </div>

                {/* Barra */}
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
                  <div className={`h-full transition-all ${mu.winRate >= 50 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${mu.winRate}%` }} />
                  <div className={`h-full transition-all ${mu.winRate < 50 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${100 - mu.winRate}%` }} />
                </div>
                <p className="text-xs text-zinc-600 text-center mt-2">{mu.total} {mu.total === 1 ? 'Game' : 'Games'} jugados</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tournament History */}
      <section className="mb-12">
        <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-6">Historial de Torneos</h2>
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
                {[...tournamentHistory].reverse().map(({ tournament, result }) => (
                  <tr key={tournament.id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors group hover:border-l-2 hover:border-l-[#CC1F1F]">
                    <td className="px-4 py-4">
                      <Link href={`/torneos/${tournament.slug}`} className="text-white font-medium hover:text-[#CC1F1F] transition-colors">
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
          <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-6">Progreso de Posiciones</h2>
          <div className="bg-[#111114] border border-zinc-800 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  domain={[0, 12]}
                  ticks={[2, 4, 6, 8, 10, 12]}
                  tickFormatter={(value) => {
                    const p = 13 - value
                    if (p === 1) return '1st'
                    if (p === 3) return '3rd'
                    if (p === 5) return '5th'
                    if (p === 7) return '7th'
                    if (p === 9) return '9th+'
                    return ''
                  }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: number) => {
                    const p = 13 - value
                    return [`${p}${p === 1 ? 'st' : p === 2 ? 'nd' : p === 3 ? 'rd' : 'th'}`, 'Posición']
                  }}
                  labelFormatter={(label, payload) => payload?.[0] ? payload[0].payload.tournament : label}
                />
                <Line type="monotone" dataKey="invertedPlacement" stroke="#CC1F1F" strokeWidth={3} dot={{ fill: '#CC1F1F', strokeWidth: 2, r: 5 }} activeDot={{ r: 8, fill: '#CC1F1F' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Head to Head */}
      {sortedH2H.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide">Head-to-Head</h2>
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
                  {sortedH2H.map((h2h) => (
                    <tr key={h2h.opponent} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors group hover:border-l-2 hover:border-l-[#CC1F1F]">
                      <td className="px-4 py-4">
                        <Link href={`/jugadores/${h2h.opponent.toLowerCase().replace(/\s+/g, '-')}`} className="text-white font-medium hover:text-[#CC1F1F] transition-colors">
                          {h2h.opponent}
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-green-500">{h2h.wins}</span>
                        <span className="text-zinc-600 mx-1">-</span>
                        <span className="text-red-500">{h2h.losses}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`font-semibold ${h2h.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>{h2h.winRate}%</span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-zinc-500">
                        {h2h.lastPlayed ? new Date(h2h.lastPlayed).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}