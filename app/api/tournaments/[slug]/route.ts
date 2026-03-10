import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import TournamentModel from '@/models/Tournament'
import SetModel from '@/models/Set'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    await connectDB()

    const tournament = await TournamentModel.findOne({ slug }).lean()
    if (!tournament) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const tSets = await SetModel.find({ tournamentSlug: slug }).lean()

    const mapped = {
      id: tournament.number,
      name: tournament.name,
      slug: tournament.slug,
      date: (tournament.date as Date).toISOString().split('T')[0],
      entrants: tournament.entrantsCount || 0,
      format: 'Singles' as const,
      results: ((tournament.standings as Array<{
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

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('[api/tournaments/slug] Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
