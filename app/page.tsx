import Link from 'next/link'
import { ArrowRight, Trophy, Users, Gamepad2, Crown } from 'lucide-react'
import { AnimatedCounter } from '@/components/animated-counter'
import { TournamentCard } from '@/components/tournament-card'
import { tournaments, players, getRecentTournaments, getLastChampion, getRankings } from '@/lib/data'

export default function HomePage() {
  const recentTournaments = getRecentTournaments(3)
  const lastChampion = getLastChampion()
  const topPlayers = getRankings().slice(0, 5)
  const totalSets = tournaments.reduce((acc, t) => acc + t.sets.length, 0)

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#CC1F1F]/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#1E6FCC]/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-[var(--font-bebas-neue)] text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-6">
              <span className="block">SMASH BONG</span>
              <span className="text-[#CC1F1F]">SUMMIT</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
              El circuito de Smash Bros más competitivo. Donde los mejores jugadores luchan por la gloria.
            </p>
            <Link
              href="/torneos"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#CC1F1F] text-white font-semibold rounded-lg hover:bg-[#CC1F1F]/90 transition-colors"
            >
              Ver Torneos
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-zinc-800 bg-zinc-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#CC1F1F]/10 text-[#CC1F1F] mb-3">
                <Trophy size={24} />
              </div>
              <div className="font-[var(--font-bebas-neue)] text-3xl md:text-4xl text-white tracking-wide">
                <AnimatedCounter end={tournaments.length} />
              </div>
              <p className="text-sm text-zinc-500 mt-1">Total Torneos</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#1E6FCC]/10 text-[#1E6FCC] mb-3">
                <Users size={24} />
              </div>
              <div className="font-[var(--font-bebas-neue)] text-3xl md:text-4xl text-white tracking-wide">
                <AnimatedCounter end={players.length} />
              </div>
              <p className="text-sm text-zinc-500 mt-1">Jugadores Registrados</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#CC1F1F]/10 text-[#CC1F1F] mb-3">
                <Gamepad2 size={24} />
              </div>
              <div className="font-[var(--font-bebas-neue)] text-3xl md:text-4xl text-white tracking-wide">
                <AnimatedCounter end={totalSets} />
              </div>
              <p className="text-sm text-zinc-500 mt-1">Sets Jugados</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#FFD700]/10 text-[#FFD700] mb-3">
                <Crown size={24} />
              </div>
              <div className="font-[var(--font-bebas-neue)] text-3xl md:text-4xl text-white tracking-wide">
                {lastChampion}
              </div>
              <p className="text-sm text-zinc-500 mt-1">Último Campeón</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Tournaments */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-[var(--font-bebas-neue)] text-3xl md:text-4xl text-white tracking-wide">
            Torneos Recientes
          </h2>
          <Link
            href="/torneos"
            className="text-sm text-[#CC1F1F] hover:text-[#CC1F1F]/80 flex items-center gap-1"
          >
            Ver todos
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      </section>

      {/* Top 5 Rankings Preview */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-[var(--font-bebas-neue)] text-3xl md:text-4xl text-white tracking-wide">
            Top 5 Rankings
          </h2>
          <Link
            href="/rankings"
            className="text-sm text-[#CC1F1F] hover:text-[#CC1F1F]/80 flex items-center gap-1"
          >
            Ver rankings completos
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Jugador</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Puntos</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Win Rate</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Main</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((player, index) => (
                  <tr
                    key={player.slug}
                    className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <span className={`font-bold ${
                        index === 0 ? 'text-[#FFD700]' :
                        index === 1 ? 'text-[#C0C0C0]' :
                        index === 2 ? 'text-[#CD7F32]' : 'text-zinc-400'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/jugadores/${player.slug}`}
                        className="text-white font-medium hover:text-[#CC1F1F] transition-colors"
                      >
                        {player.tag}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-white font-semibold">{player.totalPoints}</td>
                    <td className="px-4 py-4 hidden md:table-cell text-zinc-400">{player.winRate}%</td>
                    <td className="px-4 py-4 hidden md:table-cell text-zinc-400">{player.main}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
