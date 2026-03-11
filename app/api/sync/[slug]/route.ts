import { NextRequest, NextResponse } from 'next/server'
import { syncSingleTournament } from '@/scripts/sync'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const secret = req.headers.get('x-cron-secret')
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params

    // El número se puede pasar en el body o se extrae del slug (smash-bong-z-12 → 12)
    const body = await req.json().catch(() => ({}))
    const number: number =
      body.number ??
      parseInt(slug.split('-').at(-1) ?? '0', 10)

    if (!number || isNaN(number)) {
      return NextResponse.json(
        { error: 'No se pudo determinar el número del torneo. Envíalo en el body: { "number": 12 }' },
        { status: 400 }
      )
    }

    const result = await syncSingleTournament(slug, number)

    if (!result.success) {
      return NextResponse.json(
        { error: `Torneo "${slug}" no encontrado en start.gg` },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      slug,
      number,
      duration: `${result.duration}ms`,
    })
  } catch (error) {
    console.error('[api/sync/slug] Error:', error)
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    )
  }
}