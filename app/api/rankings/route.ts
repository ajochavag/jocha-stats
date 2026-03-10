import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import TournamentModel from '@/models/Tournament'
import PlayerModel from '@/models/Player'

export const dynamic = 'force-dynamic'

interface Standing {
  gamerTag: string
  points: number
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const filter = req.nextUrl.searchParams.get('filter') || 'all'

    let tournaments = await TournamentModel.find({}).sort({ number: 1 }).lean()

    if (filter === 'last5') {
      tournaments = tournaments.slice(-5)
    } else if (filter === 'last3') {
      tournaments = tournaments.slice(-3)
    }

    const pointsMap: Record<string, number> = {}
    for (const t of tournaments) {
      const standings = (t.standings || []) as Standing[]
      for (const s of standings) {
        if (!pointsMap[s.gamerTag]) pointsMap[s.gamerTag] = 0
        pointsMap[s.gamerTag] += s.points || 0
      }
    }

    const allPlayers = await PlayerModel.find({}).lean()

    const mapped = allPlayers
      .map((p) => {
        const tag = p.gamerTag as string
        const stats = (p.stats as {
          setsWon: number
          setsLost: number
          winRate: number
          currentStreak: number
          bestPlacement: number
          tournamentsAttended: number
        }) || {
          setsWon: 0,
          setsLost: 0,
          winRate: 0,
          currentStreak: 0,
          bestPlacement: 0,
          tournamentsAttended: 0,
        }

        return {
          tag,
          slug: p.slug as string,
          main: (p.main as string) || '',
          secondaryMains: [] as string[],
          tournamentsAttended: stats.tournamentsAttended,
          bestPlacement: stats.bestPlacement,
          totalPoints: pointsMap[tag] || 0,
          setsWon: stats.setsWon,
          setsLost: stats.setsLost,
          winRate: stats.winRate,
          currentStreak: stats.currentStreak,
          characterStats: [] as { character: string; winRate: number; setsPlayed: number }[],
        }
      })
      .sort((a, b) => b.totalPoints - a.totalPoints)

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('[api/rankings] Error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
