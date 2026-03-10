import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Users, ArrowLeft, Trophy } from 'lucide-react'
import type { Tournament } from '@/lib/data'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function getTournament(slug: string): Promise<Tournament | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/tournaments/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function getAllTournaments(): Promise<Tournament[]> {
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

export async function generateStaticParams() {
  const tournaments = await getAllTournaments()
  return tournaments.map((tournament) => ({
    slug: tournament.slug,
  }))
}

function getPlacementStyle(placement: number) {
  switch (placement) {
    case 1:
      return 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30'
    case 2:
      return 'bg-[#C0C0C0]/20 text-[#C0C0C0] border-[#C0C0C0]/30'
    case 3:
      return 'bg-[#CD7F32]/20 text-[#CD7F32] border-[#CD7F32]/30'
    default:
      return 'bg-zinc-800 text-zinc-400 border-zinc-700'
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

export default async function TournamentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tournament = await getTournament(slug)

  if (!tournament) {
    notFound()
  }

  const top3 = tournament.results.filter(r => r.placement <= 3).sort((a, b) => a.placement - b.placement)

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      {/* Back Button */}
      <Link
        href="/torneos"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={18} />
        Volver a Torneos
      </Link>

      {/* Tournament Header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <h1 className="font-[var(--font-bebas-neue)] text-4xl md:text-5xl text-white tracking-wide">
            {tournament.name}
          </h1>
          <span className="px-3 py-1.5 text-sm font-medium bg-[#1E6FCC]/20 text-[#1E6FCC] rounded-lg">
            {tournament.format}
          </span>
        </div>
        <div className="flex items-center gap-6 text-zinc-400">
          <span className="flex items-center gap-2">
            <Calendar size={18} />
            {new Date(tournament.date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <span className="flex items-center gap-2">
            <Users size={18} />
            {tournament.entrants} participantes
          </span>
        </div>
      </div>

      {/* Podium */}
      <section className="mb-12">
        <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-6 flex items-center gap-3">
          <Trophy className="text-[#CC1F1F]" size={24} />
          Podio
        </h2>
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6">
          {/* 2nd Place */}
          {top3.find(r => r.placement === 2) && (
            <div className="order-1 md:order-1 w-full md:w-48">
              <div className="bg-zinc-900 border border-[#C0C0C0]/30 rounded-xl p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#C0C0C0]" />
                <span className="text-4xl font-bold text-[#C0C0C0] mb-2 block">2</span>
                <Link
                  href={`/jugadores/${top3.find(r => r.placement === 2)?.playerTag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-xl text-white font-semibold hover:text-[#CC1F1F] transition-colors"
                >
                  {top3.find(r => r.placement === 2)?.playerTag}
                </Link>
                <p className="text-sm text-zinc-500 mt-2">
                  {top3.find(r => r.placement === 2)?.setsWon}-{top3.find(r => r.placement === 2)?.setsLost} sets
                </p>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {top3.find(r => r.placement === 1) && (
            <div className="order-0 md:order-2 w-full md:w-56">
              <div className="bg-zinc-900 border border-[#FFD700]/30 rounded-xl p-8 text-center relative overflow-hidden shadow-lg shadow-[#FFD700]/10">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FFD700]" />
                <span className="text-5xl font-bold text-[#FFD700] mb-3 block">1</span>
                <Link
                  href={`/jugadores/${top3.find(r => r.placement === 1)?.playerTag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-2xl text-white font-bold hover:text-[#CC1F1F] transition-colors"
                >
                  {top3.find(r => r.placement === 1)?.playerTag}
                </Link>
                <p className="text-sm text-zinc-500 mt-2">
                  {top3.find(r => r.placement === 1)?.setsWon}-{top3.find(r => r.placement === 1)?.setsLost} sets
                </p>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3.find(r => r.placement === 3) && (
            <div className="order-2 md:order-3 w-full md:w-44">
              <div className="bg-zinc-900 border border-[#CD7F32]/30 rounded-xl p-5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#CD7F32]" />
                <span className="text-3xl font-bold text-[#CD7F32] mb-2 block">3</span>
                <Link
                  href={`/jugadores/${top3.find(r => r.placement === 3)?.playerTag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-lg text-white font-semibold hover:text-[#CC1F1F] transition-colors"
                >
                  {top3.find(r => r.placement === 3)?.playerTag}
                </Link>
                <p className="text-sm text-zinc-500 mt-2">
                  {top3.find(r => r.placement === 3)?.setsWon}-{top3.find(r => r.placement === 3)?.setsLost} sets
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Full Results */}
      <section className="mb-12">
        <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-6">
          Resultados Completos
        </h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Pos</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Jugador</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Sets W-L</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Puntos</th>
                  <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {tournament.results.map((result) => (
                  <tr
                    key={result.playerTag}
                    className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors group hover:border-l-2 hover:border-l-[#CC1F1F]"
                  >
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold border ${getPlacementStyle(result.placement)}`}>
                        {result.placement}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/jugadores/${result.playerTag.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-white font-medium hover:text-[#CC1F1F] transition-colors"
                      >
                        {result.playerTag}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-zinc-400">
                      <span className="text-green-500">{result.setsWon}</span>
                      <span className="text-zinc-600 mx-1">-</span>
                      <span className="text-red-500">{result.setsLost}</span>
                    </td>
                    <td className="px-4 py-4 text-white font-semibold">{result.points}</td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/jugadores/${result.playerTag.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm text-[#1E6FCC] hover:text-[#1E6FCC]/80 transition-colors"
                      >
                        Ver perfil
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sets List */}
      <section>
        <h2 className="font-[var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-6">
          Sets Jugados
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {tournament.sets.map((set, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Link
                  href={`/jugadores/${set.player1.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`font-medium transition-colors ${
                    set.winner === set.player1 ? 'text-white' : 'text-zinc-500'
                  } hover:text-[#CC1F1F]`}
                >
                  {set.player1}
                </Link>
                <span className="text-zinc-600">vs</span>
                <Link
                  href={`/jugadores/${set.player2.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`font-medium transition-colors ${
                    set.winner === set.player2 ? 'text-white' : 'text-zinc-500'
                  } hover:text-[#CC1F1F]`}
                >
                  {set.player2}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${set.winner === set.player1 ? 'text-green-500' : 'text-zinc-500'}`}>
                  {set.score1}
                </span>
                <span className="text-zinc-600">-</span>
                <span className={`text-lg font-bold ${set.winner === set.player2 ? 'text-green-500' : 'text-zinc-500'}`}>
                  {set.score2}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
