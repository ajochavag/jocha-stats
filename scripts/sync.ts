import { connectDB } from '../lib/mongodb'
import { fetchTournament, fetchStandings, fetchSets } from '../lib/startgg'
import TournamentModel from '../models/Tournament'
import PlayerModel from '../models/Player'
import SetModel from '../models/Set'

function getPoints(placement: number): number {
  if (placement === 1) return 100
  if (placement === 2) return 70
  if (placement === 3) return 50
  if (placement === 4) return 40
  if (placement <= 6) return 30
  if (placement <= 8) return 20
  return 10
}

function toSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-')
}

async function syncTournament(slug: string, number: number): Promise<boolean> {
  console.log(`[sync] Fetching tournament: ${slug}`)

  const tournament = await fetchTournament(slug)
  if (!tournament) {
    console.log(`[sync] Tournament not found: ${slug}`)
    return false
  }

  const singlesEvent = tournament.events?.[0]
  if (!singlesEvent) {
    console.log(`[sync] No singles event found for: ${slug}`)
    return false
  }

  console.log(`[sync] Fetching standings for event ${singlesEvent.id}...`)
  const standings = await fetchStandings(singlesEvent.id)

  console.log(`[sync] Fetching sets for event ${singlesEvent.id}...`)
  const sets = await fetchSets(singlesEvent.id)

  const standingsData = standings.map((s) => {
    const participant = s.entrant?.participants?.[0]
    const gamerTag = participant?.gamerTag || s.entrant?.name || 'Unknown'
    const userId = participant?.user?.id?.toString() || ''
    const userSlug = participant?.user?.slug || ''

    return {
      placement: s.placement,
      gamerTag,
      playerId: userId,
      setsWon: 0,
      setsLost: 0,
      points: getPoints(s.placement),
    }
  })

  // Count sets won/lost per player from the sets data
  const playerSetCounts: Record<string, { won: number; lost: number }> = {}
  for (const set of sets) {
    if (!set.slots || set.slots.length < 2) continue
    const p1 = set.slots[0]?.entrant?.participants?.[0]?.gamerTag
    const p2 = set.slots[1]?.entrant?.participants?.[0]?.gamerTag
    if (!p1 || !p2) continue

    const p1Id = set.slots[0]?.entrant?.id
    const isP1Winner = p1Id === set.winnerId

    if (!playerSetCounts[p1]) playerSetCounts[p1] = { won: 0, lost: 0 }
    if (!playerSetCounts[p2]) playerSetCounts[p2] = { won: 0, lost: 0 }

    if (isP1Winner) {
      playerSetCounts[p1].won++
      playerSetCounts[p2].lost++
    } else {
      playerSetCounts[p2].won++
      playerSetCounts[p1].lost++
    }
  }

  for (const standing of standingsData) {
    const counts = playerSetCounts[standing.gamerTag]
    if (counts) {
      standing.setsWon = counts.won
      standing.setsLost = counts.lost
    }
  }

  await TournamentModel.findOneAndUpdate(
    { slug },
    {
      slug,
      name: tournament.name,
      number,
      date: new Date(tournament.startAt * 1000),
      entrantsCount: tournament.numAttendees || 0,
      eventId: singlesEvent.id,
      standings: standingsData,
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  )

  // Upsert players
  for (const s of standings) {
    const participant = s.entrant?.participants?.[0]
    const gamerTag = participant?.gamerTag || s.entrant?.name || 'Unknown'
    const playerSlug = toSlug(gamerTag)
    const userId = participant?.user?.id?.toString() || ''
    const userSlug = participant?.user?.slug || ''

    await PlayerModel.findOneAndUpdate(
      { slug: playerSlug },
      {
        $setOnInsert: {
          slug: playerSlug,
          main: '',
          totalPoints: 0,
          stats: {
            setsWon: 0,
            setsLost: 0,
            winRate: 0,
            currentStreak: 0,
            bestPlacement: 999,
            tournamentsAttended: 0,
          },
        },
        $set: {
          gamerTag,
          startggUserId: userId,
          startggSlug: userSlug,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )
  }

  // Upsert sets
  const tournamentDate = new Date(tournament.startAt * 1000)
  for (const set of sets) {
    if (!set.slots || set.slots.length < 2) continue
    const slot1 = set.slots[0]
    const slot2 = set.slots[1]
    if (!slot1?.entrant || !slot2?.entrant) continue

    const p1Tag = slot1.entrant.participants?.[0]?.gamerTag || slot1.entrant.name
    const p2Tag = slot2.entrant.participants?.[0]?.gamerTag || slot2.entrant.name
    const p1Score = slot1.standing?.stats?.score?.value ?? 0
    const p2Score = slot2.standing?.stats?.score?.value ?? 0

    const isP1Winner = slot1.entrant.id === set.winnerId
    const winnerTag = isP1Winner ? p1Tag : p2Tag

    await SetModel.findOneAndUpdate(
      { startggSetId: set.id.toString() },
      {
        startggSetId: set.id.toString(),
        tournamentSlug: slug,
        round: set.round?.toString() || '',
        player1: {
          gamerTag: p1Tag,
          playerId: slot1.entrant.id.toString(),
          score: p1Score,
        },
        player2: {
          gamerTag: p2Tag,
          playerId: slot2.entrant.id.toString(),
          score: p2Score,
        },
        winnerId: winnerTag,
        displayScore: set.displayScore || `${p1Tag} ${p1Score} - ${p2Score} ${p2Tag}`,
        date: tournamentDate,
      },
      { upsert: true }
    )
  }

  console.log(
    `[sync] Synced ${slug}: ${standingsData.length} standings, ${sets.length} sets`
  )
  return true
}

async function recalculatePlayerStats() {
  console.log('[sync] Recalculating player stats...')

  const allPlayers = await PlayerModel.find({})
  const allTournaments = await TournamentModel.find({}).sort({ number: 1 })
  const allSets = await SetModel.find({}).sort({ date: 1 })

  for (const player of allPlayers) {
    const tag = player.gamerTag

    let setsWon = 0
    let setsLost = 0
    let totalPoints = 0
    let bestPlacement = 999
    let tournamentsAttended = 0

    for (const t of allTournaments) {
      const standing = t.standings.find(
        (s: { gamerTag: string }) => s.gamerTag === tag
      )
      if (standing) {
        tournamentsAttended++
        totalPoints += standing.points || 0
        if (standing.placement < bestPlacement) {
          bestPlacement = standing.placement
        }
      }
    }

    for (const set of allSets) {
      const isP1 = set.player1?.gamerTag === tag
      const isP2 = set.player2?.gamerTag === tag
      if (!isP1 && !isP2) continue

      if (set.winnerId === tag) {
        setsWon++
      } else {
        setsLost++
      }
    }

    const totalSets = setsWon + setsLost
    const winRate = totalSets > 0 ? Math.round((setsWon / totalSets) * 1000) / 10 : 0

    // Current streak: count consecutive wins from most recent set backwards
    let currentStreak = 0
    const playerSets = allSets.filter(
      (s) => s.player1?.gamerTag === tag || s.player2?.gamerTag === tag
    )
    for (let i = playerSets.length - 1; i >= 0; i--) {
      if (playerSets[i].winnerId === tag) {
        currentStreak++
      } else {
        break
      }
    }

    await PlayerModel.findOneAndUpdate(
      { slug: player.slug },
      {
        totalPoints,
        stats: {
          setsWon,
          setsLost,
          winRate,
          currentStreak,
          bestPlacement: bestPlacement === 999 ? 0 : bestPlacement,
          tournamentsAttended,
        },
        updatedAt: new Date(),
      }
    )
  }

  console.log(`[sync] Recalculated stats for ${allPlayers.length} players`)
}

export async function runSync(): Promise<{ tournaments: number; duration: number }> {
  const start = Date.now()
  await connectDB()

  const totalEnv = process.env.TOTAL_TOURNAMENTS
  let totalTournaments = totalEnv ? parseInt(totalEnv, 10) : 0
  const autoDetect = !totalEnv || isNaN(totalTournaments) || totalTournaments <= 0

  let synced = 0

  if (autoDetect) {
    let n = 1
    while (true) {
      const slug = `smash-bong-z-${n}`
      try {
        const found = await syncTournament(slug, n)
        if (!found) break
        synced++
        n++
      } catch (err) {
        console.log(`[sync] Stopping auto-detect at ${slug}: ${err}`)
        break
      }
    }
  } else {
    for (let n = 1; n <= totalTournaments; n++) {
      const slug = `smash-bong-z-${n}`
      try {
        await syncTournament(slug, n)
        synced++
      } catch (err) {
        console.error(`[sync] Error syncing ${slug}:`, err)
      }
    }
  }

  await recalculatePlayerStats()

  const duration = Date.now() - start
  console.log(`[sync] Complete: ${synced} tournaments in ${duration}ms`)
  return { tournaments: synced, duration }
}
