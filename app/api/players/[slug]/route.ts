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
  player1: { gamerTag: string; score: number; character?: string }
  player2: { gamerTag: string; score: number; character?: string }
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

    const characterStats = (
      (playerDoc.characterStats as Array<{
        character: string
        setsPlayed: number
        setsWon: number
        winRate: number
      }>) || []
    ).map((c) => ({
      character: c.character,
      winRate: c.winRate,
      setsPlayed: c.setsPlayed,
    }))

    const secondaryMains = characterStats.slice(1).map((c) => c.character)

    const player = {
      tag,
      slug: playerDoc.slug,
      main: playerDoc.main || '',
      secondaryMains,
      tournamentsAttended: stats.tournamentsAttended,
      bestPlacement: stats.bestPlacement,
      totalPoints: (playerDoc.totalPoints as number) || 0,
      setsWon: stats.setsWon,
      setsLost: stats.setsLost,
      winRate: stats.winRate,
      currentStreak: stats.currentStreak,
      characterStats,
    }

    // Ranking: cuántos jugadores tienen más puntos
    const rank =
      (await PlayerModel.countDocuments({
        totalPoints: { $gt: playerDoc.totalPoints },
      })) + 1

    // Historial de torneos
    const allTournaments = (await TournamentModel.find({})
      .sort({ number: 1 })
      .lean()) as unknown as TournamentDoc[]

    const tournamentHistory = allTournaments
      .map((t) => {
        const standing = t.standings?.find((s) => s.gamerTag === tag)
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

    const h2hMap: Record<
      string,
      {
        wins: number
        losses: number
        lastPlayed: string
        myCharacters: Record<string, number>
        theirCharacters: Record<string, number>
      }
    > = {}

    for (const set of playerSets) {
      const isP1 = set.player1?.gamerTag === tag
      const opponent = isP1 ? set.player2?.gamerTag : set.player1?.gamerTag
      if (!opponent) continue

      if (!h2hMap[opponent]) {
        h2hMap[opponent] = {
          wins: 0,
          losses: 0,
          lastPlayed: '',
          myCharacters: {},
          theirCharacters: {},
        }
      }

      if (set.winnerId === tag) {
        h2hMap[opponent].wins++
      } else {
        h2hMap[opponent].losses++
      }

      const dateStr = set.date
        ? (set.date as unknown as Date).toISOString().split('T')[0]
        : ''
      if (dateStr) h2hMap[opponent].lastPlayed = dateStr

      // Registrar personajes usados en el matchup
      const myChar = isP1 ? set.player1?.character : set.player2?.character
      const theirChar = isP1 ? set.player2?.character : set.player1?.character

      if (myChar) {
        h2hMap[opponent].myCharacters[myChar] =
          (h2hMap[opponent].myCharacters[myChar] || 0) + 1
      }
      if (theirChar) {
        h2hMap[opponent].theirCharacters[theirChar] =
          (h2hMap[opponent].theirCharacters[theirChar] || 0) + 1
      }
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
      // Personaje más usado por el jugador vs este rival
      myMostUsed:
        Object.entries(data.myCharacters).sort((a, b) => b[1] - a[1])[0]?.[0] || '',
      // Personaje más usado por el rival
      theirMostUsed:
        Object.entries(data.theirCharacters).sort((a, b) => b[1] - a[1])[0]?.[0] || '',
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