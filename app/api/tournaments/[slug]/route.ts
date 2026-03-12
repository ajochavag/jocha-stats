import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import TournamentModel from '@/models/Tournament'
import SetModel from '@/models/Set'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB()
    const { slug } = await params
    const t = await TournamentModel.findOne({ slug }).lean() as any
    if (!t) return NextResponse.json(null, { status: 404 })

    const tSets = await SetModel.find({ tournamentSlug: slug }).lean() as any[]

    return NextResponse.json({
      id: t.number,
      name: t.name,
      slug: t.slug,
      date: (t.date as Date).toISOString().split('T')[0],
      entrants: t.entrantsCount || 0,
      format: 'Singles',
      results: (t.standings || []).map((s: any) => ({
        placement: s.placement,
        playerTag: s.gamerTag,
        setsWon: s.setsWon || 0,
        setsLost: s.setsLost || 0,
        points: s.points || 0,
      })),
      sets: tSets.map((s: any) => ({
        player1: s.player1?.gamerTag || '',
        player2: s.player2?.gamerTag || '',
        score1: s.player1?.score || 0,
        score2: s.player2?.score || 0,
        winner: s.winnerId || '',
        character1: s.player1?.character || '',
        character2: s.player2?.character || '',
        games: (s.games || []).map((g: any) => ({
          gameNum: g.gameNum,
          character1: g.character1 || '',
          character2: g.character2 || '',
        })),
      })),
    })
  } catch (error) {
    console.error('[api/tournaments/slug] Error:', error)
    return NextResponse.json(null, { status: 500 })
  }
}