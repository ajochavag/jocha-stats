import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import TournamentModel from '@/models/Tournament'
import SetModel from '@/models/Set'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

    const tournaments = await TournamentModel.find({}).sort({ number: 1 }).lean()
    const allSets = await SetModel.find({}).lean()

    const setsByTournament: Record<string, typeof allSets> = {}
    for (const set of allSets) {
      const slug = set.tournamentSlug as string
      if (!setsByTournament[slug]) setsByTournament[slug] = []
      setsByTournament[slug].push(set)
    }

    const mapped = tournaments.map((t) => {
      const tSets = setsByTournament[t.slug as string] || []

      return {
        id: t.number,
        name: t.name,
        slug: t.slug,
        date: (t.date as Date).toISOString().split('T')[0],
        entrants: t.entrantsCount || 0,
        format: 'Singles' as const,
        results: ((t.standings as Array<{
          placement: number
          gamerTag: string
          setsWon: number
          setsLost: number
          points: number
        }>) || []).map((s) => ({
          placement: s.placement,
          playerTag: s.gamerTag,
          setsWon: s.setsWon || 0,
          setsLost: s.setsLost || 0,
          points: s.points || 0,
        })),
        sets: tSets.map((s) => ({
          player1: (s.player1 as { gamerTag: string }).gamerTag,
          player2: (s.player2 as { gamerTag: string }).gamerTag,
          score1: (s.player1 as { score: number }).score || 0,
          score2: (s.player2 as { score: number }).score || 0,
          winner: s.winnerId as string,
        })),
      }
    })

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('[api/tournaments] Error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
