import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import TournamentModel from '@/models/Tournament'
import PlayerModel from '@/models/Player'
import SetModel from '@/models/Set'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

    const [totalTournaments, totalPlayers, totalSets, lastTournament] = await Promise.all([
      TournamentModel.countDocuments(),
      PlayerModel.countDocuments(),
      SetModel.countDocuments(),
      TournamentModel.findOne({}).sort({ number: -1 }).lean(),
    ])

    const lastChampion =
      (lastTournament?.standings as Array<{ placement: number; gamerTag: string }> | undefined)
        ?.find((s) => s.placement === 1)?.gamerTag || ''

    return NextResponse.json({
      totalTournaments,
      totalPlayers,
      totalSets,
      lastChampion,
    })
  } catch (error) {
    console.error('[api/stats] Error:', error)
    return NextResponse.json(
      { totalTournaments: 0, totalPlayers: 0, totalSets: 0, lastChampion: '' },
      { status: 500 }
    )
  }
}