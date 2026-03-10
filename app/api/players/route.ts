import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import PlayerModel from '@/models/Player'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

    const players = await PlayerModel.find({}).sort({ totalPoints: -1 }).lean()

    const mapped = players.map((p) => {
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
        tag: p.gamerTag,
        slug: p.slug,
        main: p.main || '',
        secondaryMains: [] as string[],
        tournamentsAttended: stats.tournamentsAttended,
        bestPlacement: stats.bestPlacement,
        totalPoints: p.totalPoints || 0,
        setsWon: stats.setsWon,
        setsLost: stats.setsLost,
        winRate: stats.winRate,
        currentStreak: stats.currentStreak,
        characterStats: [] as { character: string; winRate: number; setsPlayed: number }[],
      }
    })

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('[api/players] Error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
