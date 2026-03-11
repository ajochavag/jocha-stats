import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import TournamentModel from '@/models/Tournament'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

    const tournaments = await TournamentModel.find({}).sort({ number: 1 }).lean()

    const mapped = tournaments.map((t) => ({
      id: t.number,
      name: t.name,
      slug: t.slug,
      date: (t.date as Date).toISOString().split('T')[0],
      entrants: t.entrantsCount || 0,
      format: 'Singles' as const,
      results: (
        (t.standings as Array<{
          placement: number
          gamerTag: string
          setsWon: number
          setsLost: number
          points: number
        }>) || []
      ).map((s) => ({
        placement: s.placement,
        playerTag: s.gamerTag,
        setsWon: s.setsWon || 0,
        setsLost: s.setsLost || 0,
        points: s.points || 0,
      })),
      // Los sets se cargan solo en /api/tournaments/[slug] para no sobrecargar esta ruta
      sets: [],
    }))

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('[api/tournaments] Error:', error)
    return NextResponse.json([], { status: 500 })
  }
}