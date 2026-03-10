import { NextRequest, NextResponse } from 'next/server'
import { runSync } from '@/scripts/sync'

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-cron-secret')
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await runSync()

    return NextResponse.json({
      success: true,
      tournamentsSynced: result.tournaments,
      duration: `${result.duration}ms`,
    })
  } catch (error) {
    console.error('[api/sync] Error:', error)
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    )
  }
}
