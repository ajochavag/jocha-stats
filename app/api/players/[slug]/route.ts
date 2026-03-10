import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import PlayerModel from '@/models/Player'
import TournamentModel from '@/models/Tournament'
import SetModel from '@/models/Set'

export const dynamic = 'force-dynamic'

interface Standing {
  placement: number
  gamerTag: string
  setsWon: number
  setsLost: number
  points: number
}

interface TournamentDoc {
  slug: string
  name: string
  number: number
  date: Date
  entrantsCount: number
  standings: Standing[]
}

interface SetDoc {
  tournamentSlug: string
  player1: { gamerTag: string; score: number }
  player2: { gamerTag: string; score: number }
  winnerId: string
  date: Date
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    await connectDB()

    const playerDoc = await PlayerModel.findOne({ slug }).lean()
    if (!playerDoc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const stats = (playerDoc.stats as {
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

    const tag = playerDoc.gamerTag as string

    const player = {
      tag,
      slug: playerDoc.slug,
      main: playerDoc.main || '',
      secondaryMains: [] as string[],
      tournamentsAttended: stats.tournamentsAttended,
      bestPlacement: stats.bestPlacement,
      totalPoints: (playerDoc.totalPoints as number) || 0,
      setsWon: stats.setsWon,
      setsLost: stats.setsLost,
      winRate: stats.winRate,
      currentStreak: stats.currentStreak,
      characterStats: [] as { character: string; winRate: number; setsPlayed: number }[],
    }

    // Ranking: count players with more points
    const rank =
      (await PlayerModel.countDocuments({
        totalPoints: { $gt: playerDoc.totalPoints },
      })) + 1

    // Tournament history
    const allTournaments = (await TournamentModel.find({}).sort({ number: 1 }).lean()) as unknown as TournamentDoc[]

    const tournamentHistory = allTournaments
      .map((t) => {
        const standing = t.standings?.find(
          (s) => s.gamerTag === tag
        )
        if (!standing) return null

        return {
          tournament: {
            id: t.number,
            name: t.name,
            slug: t.slug,
            date: (t.date as Date).toISOString().split('T')[0],
            entrants: t.entrantsCount || 0,
            format: 'Singles' as const,
          },
          result: {
            placement: standing.placement,
            playerTag: standing.gamerTag,
            setsWon: standing.setsWon || 0,
            setsLost: standing.setsLost || 0,
            points: standing.points || 0,
          },
        }
      })
      .filter(Boolean)

    // Head-to-head
    const playerSets = (await SetModel.find({
      $or: [{ 'player1.gamerTag': tag }, { 'player2.gamerTag': tag }],
    })
      .sort({ date: 1 })
      .lean()) as unknown as SetDoc[]

    const h2hMap: Record<string, { wins: number; losses: number; lastPlayed: string }> = {}

    for (const set of playerSets) {
      const isP1 = set.player1?.gamerTag === tag
      const opponent = isP1 ? set.player2?.gamerTag : set.player1?.gamerTag
      if (!opponent) continue

      if (!h2hMap[opponent]) {
        h2hMap[opponent] = { wins: 0, losses: 0, lastPlayed: '' }
      }

      if (set.winnerId === tag) {
        h2hMap[opponent].wins++
      } else {
        h2hMap[opponent].losses++
      }

      const dateStr = set.date
        ? (set.date as Date).toISOString().split('T')[0]
        : ''
      if (dateStr) h2hMap[opponent].lastPlayed = dateStr
    }

    const headToHead = Object.entries(h2hMap).map(([opponent, data]) => ({
      opponent,
      wins: data.wins,
      losses: data.losses,
      winRate:
        data.wins + data.losses > 0
          ? Math.round((data.wins / (data.wins + data.losses)) * 100)
          : 0,
      lastPlayed: data.lastPlayed,
    }))

    return NextResponse.json({
      player,
      rank,
      tournamentHistory,
      headToHead,
    })
  } catch (error) {
    console.error('[api/players/slug] Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
