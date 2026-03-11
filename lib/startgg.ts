const STARTGG_API = 'https://api.start.gg/gql/alpha'

async function gqlRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const token = process.env.STARTGG_TOKEN
  if (!token) throw new Error('STARTGG_TOKEN not set')

  const res = await fetch(STARTGG_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(`start.gg API error: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  if (json.errors) {
    throw new Error(`start.gg GraphQL error: ${JSON.stringify(json.errors)}`)
  }

  return json.data as T
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// --- Types ---

export interface TournamentData {
  id: number
  name: string
  startAt: number
  numAttendees: number
  events: { id: number; name: string }[]
}

export interface StandingData {
  placement: number
  entrant: {
    name: string
    participants: {
      gamerTag: string
      user: { id: number; slug: string } | null
    }[]
  }
}

export interface SetData {
  id: number
  displayScore: string | null
  winnerId: number | null
  round: number
  slots: {
    entrant: {
      id: number
      name: string
      participants: { gamerTag: string }[]
    } | null
    standing: { stats: { score: { value: number } } } | null
  }[]
  games?: {
    selections?: {
      selectionType: string
      entrant: { id: number } | null
      character: { id: number; name: string } | null
    }[]
  }[]
}

// --- Queries ---

const TOURNAMENT_QUERY = `
  query TournamentInfo($slug: String!) {
    tournament(slug: $slug) {
      id
      name
      startAt
      numAttendees
      events(filter: { type: 1 }) {
        id
        name
      }
    }
  }
`

const STANDINGS_QUERY = `
  query EventStandings($eventId: ID!, $page: Int!) {
    event(id: $eventId) {
      standings(query: { perPage: 64, page: $page }) {
        pageInfo {
          totalPages
        }
        nodes {
          placement
          entrant {
            name
            participants {
              gamerTag
              user {
                id
                slug
              }
            }
          }
        }
      }
    }
  }
`

const SETS_QUERY = `
  query EventSets($eventId: ID!, $page: Int!) {
    event(id: $eventId) {
      sets(
        page: $page
        perPage: 20
        filters: { state: 3 }
      ) {
        pageInfo {
          totalPages
        }
        nodes {
          id
          displayScore
          winnerId
          round
          slots {
            entrant {
              id
              name
              participants { gamerTag }
            }
            standing { stats { score { value } } }
          }
          games {
            selections {
              selectionType
              entrant { id }
              character { id name }
            }
          }
        }
      }
    }
  }
`

// --- API Functions ---

export async function fetchTournament(slug: string): Promise<TournamentData | null> {
  const data = await gqlRequest<{ tournament: TournamentData | null }>(
    TOURNAMENT_QUERY,
    { slug }
  )
  return data.tournament
}

export async function fetchStandings(eventId: number): Promise<StandingData[]> {
  const allStandings: StandingData[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const data = await gqlRequest<{
      event: {
        standings: {
          pageInfo: { totalPages: number }
          nodes: StandingData[]
        }
      }
    }>(STANDINGS_QUERY, { eventId, page })

    totalPages = data.event.standings.pageInfo.totalPages
    allStandings.push(...data.event.standings.nodes)
    page++

    if (page <= totalPages) await delay(1000)
  }

  return allStandings
}

export async function fetchSets(eventId: number): Promise<SetData[]> {
  const allSets: SetData[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const data = await gqlRequest<{
      event: {
        sets: {
          pageInfo: { totalPages: number }
          nodes: SetData[]
        }
      }
    }>(SETS_QUERY, { eventId, page })

    totalPages = data.event.sets.pageInfo.totalPages
    allSets.push(...data.event.sets.nodes)
    page++

    if (page <= totalPages) await delay(1000)
  }

  return allSets
}