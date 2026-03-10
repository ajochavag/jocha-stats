// Mock data for Smash Bong Summit

export interface Player {
  tag: string
  slug: string
  main: string
  secondaryMains?: string[]
  tournamentsAttended: number
  bestPlacement: number
  totalPoints: number
  setsWon: number
  setsLost: number
  winRate: number
  currentStreak: number
  characterStats: { character: string; winRate: number; setsPlayed: number }[]
}

export interface Set {
  player1: string
  player2: string
  score1: number
  score2: number
  winner: string
}

export interface TournamentResult {
  placement: number
  playerTag: string
  setsWon: number
  setsLost: number
  points: number
}

export interface Tournament {
  id: number
  name: string
  slug: string
  date: string
  entrants: number
  format: 'Singles' | 'Doubles'
  results: TournamentResult[]
  sets: Set[]
}

export interface HeadToHead {
  opponent: string
  wins: number
  losses: number
  winRate: number
  lastPlayed: string
}

// Players data
export const players: Player[] = [
  { tag: 'MkLeo', slug: 'mkleo', main: 'Byleth', secondaryMains: ['Joker', 'Pyra/Mythra'], tournamentsAttended: 10, bestPlacement: 1, totalPoints: 820, setsWon: 45, setsLost: 8, winRate: 84.9, currentStreak: 5, characterStats: [{ character: 'Byleth', winRate: 86.2, setsPlayed: 35 }, { character: 'Joker', winRate: 82.1, setsPlayed: 18 }] },
  { tag: 'Sparg0', slug: 'sparg0', main: 'Cloud', secondaryMains: ['Pyra/Mythra'], tournamentsAttended: 10, bestPlacement: 1, totalPoints: 750, setsWon: 42, setsLost: 10, winRate: 80.8, currentStreak: 3, characterStats: [{ character: 'Cloud', winRate: 81.5, setsPlayed: 40 }, { character: 'Pyra/Mythra', winRate: 78.3, setsPlayed: 12 }] },
  { tag: 'Tweek', slug: 'tweek', main: 'Diddy Kong', secondaryMains: ['Sephiroth'], tournamentsAttended: 9, bestPlacement: 1, totalPoints: 680, setsWon: 38, setsLost: 12, winRate: 76.0, currentStreak: 2, characterStats: [{ character: 'Diddy Kong', winRate: 77.8, setsPlayed: 36 }, { character: 'Sephiroth', winRate: 71.4, setsPlayed: 14 }] },
  { tag: 'Glutonny', slug: 'glutonny', main: 'Wario', tournamentsAttended: 10, bestPlacement: 1, totalPoints: 640, setsWon: 36, setsLost: 14, winRate: 72.0, currentStreak: 1, characterStats: [{ character: 'Wario', winRate: 72.0, setsPlayed: 50 }] },
  { tag: 'Light', slug: 'light', main: 'Fox', tournamentsAttended: 10, bestPlacement: 2, totalPoints: 580, setsWon: 34, setsLost: 14, winRate: 70.8, currentStreak: 4, characterStats: [{ character: 'Fox', winRate: 70.8, setsPlayed: 48 }] },
  { tag: 'Cosmos', slug: 'cosmos', main: 'Pyra/Mythra', tournamentsAttended: 8, bestPlacement: 2, totalPoints: 520, setsWon: 30, setsLost: 14, winRate: 68.2, currentStreak: 2, characterStats: [{ character: 'Pyra/Mythra', winRate: 68.2, setsPlayed: 44 }] },
  { tag: 'Dabuz', slug: 'dabuz', main: 'Rosalina', secondaryMains: ['Min Min'], tournamentsAttended: 10, bestPlacement: 2, totalPoints: 490, setsWon: 32, setsLost: 16, winRate: 66.7, currentStreak: 0, characterStats: [{ character: 'Rosalina', winRate: 68.5, setsPlayed: 35 }, { character: 'Min Min', winRate: 63.2, setsPlayed: 13 }] },
  { tag: 'Marss', slug: 'marss', main: 'Zero Suit Samus', tournamentsAttended: 9, bestPlacement: 2, totalPoints: 450, setsWon: 28, setsLost: 15, winRate: 65.1, currentStreak: 1, characterStats: [{ character: 'Zero Suit Samus', winRate: 65.1, setsPlayed: 43 }] },
  { tag: 'Riddles', slug: 'riddles', main: 'Kazuya', secondaryMains: ['Terry'], tournamentsAttended: 10, bestPlacement: 3, totalPoints: 420, setsWon: 30, setsLost: 18, winRate: 62.5, currentStreak: 2, characterStats: [{ character: 'Kazuya', winRate: 64.3, setsPlayed: 42 }, { character: 'Terry', winRate: 57.1, setsPlayed: 6 }] },
  { tag: 'Kola', slug: 'kola', main: 'Roy', tournamentsAttended: 10, bestPlacement: 3, totalPoints: 400, setsWon: 29, setsLost: 19, winRate: 60.4, currentStreak: 0, characterStats: [{ character: 'Roy', winRate: 60.4, setsPlayed: 48 }] },
  { tag: 'Nairo', slug: 'nairo', main: 'Palutena', secondaryMains: ['Samus'], tournamentsAttended: 7, bestPlacement: 3, totalPoints: 350, setsWon: 24, setsLost: 14, winRate: 63.2, currentStreak: 3, characterStats: [{ character: 'Palutena', winRate: 65.0, setsPlayed: 32 }, { character: 'Samus', winRate: 58.3, setsPlayed: 6 }] },
  { tag: 'ANTi', slug: 'anti', main: 'Mario', secondaryMains: ['Snake'], tournamentsAttended: 8, bestPlacement: 4, totalPoints: 280, setsWon: 22, setsLost: 18, winRate: 55.0, currentStreak: 1, characterStats: [{ character: 'Mario', winRate: 56.3, setsPlayed: 32 }, { character: 'Snake', winRate: 50.0, setsPlayed: 8 }] },
  { tag: 'Larry Lurr', slug: 'larry-lurr', main: 'Falco', tournamentsAttended: 9, bestPlacement: 4, totalPoints: 260, setsWon: 21, setsLost: 20, winRate: 51.2, currentStreak: 0, characterStats: [{ character: 'Falco', winRate: 51.2, setsPlayed: 41 }] },
  { tag: 'Elegant', slug: 'elegant', main: 'Luigi', tournamentsAttended: 10, bestPlacement: 5, totalPoints: 240, setsWon: 20, setsLost: 22, winRate: 47.6, currentStreak: 0, characterStats: [{ character: 'Luigi', winRate: 47.6, setsPlayed: 42 }] },
  { tag: 'Salem', slug: 'salem', main: 'Shulk', secondaryMains: ['Hero'], tournamentsAttended: 8, bestPlacement: 5, totalPoints: 200, setsWon: 18, setsLost: 20, winRate: 47.4, currentStreak: 1, characterStats: [{ character: 'Shulk', winRate: 48.5, setsPlayed: 33 }, { character: 'Hero', winRate: 40.0, setsPlayed: 5 }] },
  { tag: 'ZeRo', slug: 'zero', main: 'Diddy Kong', secondaryMains: ['Sheik'], tournamentsAttended: 6, bestPlacement: 5, totalPoints: 180, setsWon: 16, setsLost: 16, winRate: 50.0, currentStreak: 0, characterStats: [{ character: 'Diddy Kong', winRate: 52.4, setsPlayed: 21 }, { character: 'Sheik', winRate: 45.5, setsPlayed: 11 }] },
]

// Tournaments data
export const tournaments: Tournament[] = [
  {
    id: 1,
    name: 'Smash Bong Z #1',
    slug: 'smash-bong-z-1',
    date: '2025-01-05',
    entrants: 32,
    format: 'Singles',
    results: [
      { placement: 1, playerTag: 'MkLeo', setsWon: 5, setsLost: 0, points: 100 },
      { placement: 2, playerTag: 'Sparg0', setsWon: 4, setsLost: 1, points: 70 },
      { placement: 3, playerTag: 'Tweek', setsWon: 4, setsLost: 1, points: 50 },
      { placement: 4, playerTag: 'Light', setsWon: 3, setsLost: 2, points: 40 },
      { placement: 5, playerTag: 'Glutonny', setsWon: 3, setsLost: 1, points: 30 },
      { placement: 5, playerTag: 'Cosmos', setsWon: 2, setsLost: 2, points: 30 },
      { placement: 7, playerTag: 'Dabuz', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 7, playerTag: 'Riddles', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 9, playerTag: 'Marss', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'Kola', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'Nairo', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'ANTi', setsWon: 1, setsLost: 2, points: 10 },
    ],
    sets: [
      { player1: 'MkLeo', player2: 'Sparg0', score1: 3, score2: 1, winner: 'MkLeo' },
      { player1: 'Tweek', player2: 'Light', score1: 3, score2: 2, winner: 'Tweek' },
      { player1: 'Sparg0', player2: 'Tweek', score1: 3, score2: 2, winner: 'Sparg0' },
      { player1: 'MkLeo', player2: 'Light', score1: 3, score2: 0, winner: 'MkLeo' },
      { player1: 'Glutonny', player2: 'Cosmos', score1: 2, score2: 1, winner: 'Glutonny' },
      { player1: 'Dabuz', player2: 'Riddles', score1: 2, score2: 1, winner: 'Dabuz' },
    ]
  },
  {
    id: 2,
    name: 'Smash Bong Z #2',
    slug: 'smash-bong-z-2',
    date: '2025-01-12',
    entrants: 30,
    format: 'Singles',
    results: [
      { placement: 1, playerTag: 'Sparg0', setsWon: 5, setsLost: 1, points: 100 },
      { placement: 2, playerTag: 'MkLeo', setsWon: 4, setsLost: 1, points: 70 },
      { placement: 3, playerTag: 'Glutonny', setsWon: 4, setsLost: 1, points: 50 },
      { placement: 4, playerTag: 'Dabuz', setsWon: 3, setsLost: 2, points: 40 },
      { placement: 5, playerTag: 'Light', setsWon: 3, setsLost: 1, points: 30 },
      { placement: 5, playerTag: 'Tweek', setsWon: 2, setsLost: 2, points: 30 },
      { placement: 7, playerTag: 'Riddles', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 7, playerTag: 'Kola', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 9, playerTag: 'Marss', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'Cosmos', setsWon: 1, setsLost: 2, points: 10 },
    ],
    sets: [
      { player1: 'Sparg0', player2: 'MkLeo', score1: 3, score2: 2, winner: 'Sparg0' },
      { player1: 'Glutonny', player2: 'Dabuz', score1: 3, score2: 1, winner: 'Glutonny' },
      { player1: 'MkLeo', player2: 'Glutonny', score1: 3, score2: 2, winner: 'MkLeo' },
      { player1: 'Sparg0', player2: 'Light', score1: 3, score2: 1, winner: 'Sparg0' },
      { player1: 'Light', player2: 'Tweek', score1: 2, score2: 1, winner: 'Light' },
    ]
  },
  {
    id: 3,
    name: 'Smash Bong Z #3',
    slug: 'smash-bong-z-3',
    date: '2025-01-19',
    entrants: 28,
    format: 'Singles',
    results: [
      { placement: 1, playerTag: 'Tweek', setsWon: 5, setsLost: 0, points: 100 },
      { placement: 2, playerTag: 'Light', setsWon: 4, setsLost: 2, points: 70 },
      { placement: 3, playerTag: 'MkLeo', setsWon: 4, setsLost: 1, points: 50 },
      { placement: 4, playerTag: 'Sparg0', setsWon: 3, setsLost: 2, points: 40 },
      { placement: 5, playerTag: 'Dabuz', setsWon: 3, setsLost: 1, points: 30 },
      { placement: 5, playerTag: 'Riddles', setsWon: 2, setsLost: 2, points: 30 },
      { placement: 7, playerTag: 'Glutonny', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 7, playerTag: 'Marss', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 9, playerTag: 'Nairo', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'Kola', setsWon: 1, setsLost: 2, points: 10 },
    ],
    sets: [
      { player1: 'Tweek', player2: 'Light', score1: 3, score2: 1, winner: 'Tweek' },
      { player1: 'MkLeo', player2: 'Sparg0', score1: 3, score2: 2, winner: 'MkLeo' },
      { player1: 'Light', player2: 'MkLeo', score1: 3, score2: 2, winner: 'Light' },
      { player1: 'Tweek', player2: 'Dabuz', score1: 3, score2: 0, winner: 'Tweek' },
    ]
  },
  {
    id: 4,
    name: 'Smash Bong Z #4',
    slug: 'smash-bong-z-4',
    date: '2025-01-26',
    entrants: 32,
    format: 'Singles',
    results: [
      { placement: 1, playerTag: 'Glutonny', setsWon: 5, setsLost: 1, points: 100 },
      { placement: 2, playerTag: 'Marss', setsWon: 4, setsLost: 2, points: 70 },
      { placement: 3, playerTag: 'Kola', setsWon: 4, setsLost: 1, points: 50 },
      { placement: 4, playerTag: 'Riddles', setsWon: 3, setsLost: 2, points: 40 },
      { placement: 5, playerTag: 'MkLeo', setsWon: 3, setsLost: 1, points: 30 },
      { placement: 5, playerTag: 'Sparg0', setsWon: 2, setsLost: 2, points: 30 },
      { placement: 7, playerTag: 'Tweek', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 7, playerTag: 'Cosmos', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 9, playerTag: 'Light', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'ANTi', setsWon: 1, setsLost: 2, points: 10 },
    ],
    sets: [
      { player1: 'Glutonny', player2: 'Marss', score1: 3, score2: 2, winner: 'Glutonny' },
      { player1: 'Kola', player2: 'Riddles', score1: 3, score2: 1, winner: 'Kola' },
      { player1: 'Marss', player2: 'Kola', score1: 3, score2: 2, winner: 'Marss' },
      { player1: 'MkLeo', player2: 'Sparg0', score1: 2, score2: 1, winner: 'MkLeo' },
    ]
  },
  {
    id: 5,
    name: 'Smash Bong Z #5',
    slug: 'smash-bong-z-5',
    date: '2025-02-02',
    entrants: 30,
    format: 'Singles',
    results: [
      { placement: 1, playerTag: 'MkLeo', setsWon: 5, setsLost: 0, points: 100 },
      { placement: 2, playerTag: 'Cosmos', setsWon: 4, setsLost: 2, points: 70 },
      { placement: 3, playerTag: 'Nairo', setsWon: 4, setsLost: 1, points: 50 },
      { placement: 4, playerTag: 'Sparg0', setsWon: 3, setsLost: 2, points: 40 },
      { placement: 5, playerTag: 'Dabuz', setsWon: 3, setsLost: 1, points: 30 },
      { placement: 5, playerTag: 'Glutonny', setsWon: 2, setsLost: 2, points: 30 },
      { placement: 7, playerTag: 'Light', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 7, playerTag: 'Riddles', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 9, playerTag: 'Tweek', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'Marss', setsWon: 1, setsLost: 2, points: 10 },
    ],
    sets: [
      { player1: 'MkLeo', player2: 'Cosmos', score1: 3, score2: 1, winner: 'MkLeo' },
      { player1: 'Nairo', player2: 'Sparg0', score1: 3, score2: 2, winner: 'Nairo' },
      { player1: 'Cosmos', player2: 'Nairo', score1: 3, score2: 2, winner: 'Cosmos' },
      { player1: 'MkLeo', player2: 'Dabuz', score1: 3, score2: 0, winner: 'MkLeo' },
    ]
  },
  {
    id: 6,
    name: 'Smash Bong Z #6',
    slug: 'smash-bong-z-6',
    date: '2025-02-09',
    entrants: 28,
    format: 'Singles',
    results: [
      { placement: 1, playerTag: 'Sparg0', setsWon: 5, setsLost: 0, points: 100 },
      { placement: 2, playerTag: 'Dabuz', setsWon: 4, setsLost: 2, points: 70 },
      { placement: 3, playerTag: 'Riddles', setsWon: 4, setsLost: 1, points: 50 },
      { placement: 4, playerTag: 'Light', setsWon: 3, setsLost: 2, points: 40 },
      { placement: 5, playerTag: 'MkLeo', setsWon: 3, setsLost: 1, points: 30 },
      { placement: 5, playerTag: 'Glutonny', setsWon: 2, setsLost: 2, points: 30 },
      { placement: 7, playerTag: 'Tweek', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 7, playerTag: 'Larry Lurr', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 9, playerTag: 'Elegant', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'Salem', setsWon: 1, setsLost: 2, points: 10 },
    ],
    sets: [
      { player1: 'Sparg0', player2: 'Dabuz', score1: 3, score2: 1, winner: 'Sparg0' },
      { player1: 'Riddles', player2: 'Light', score1: 3, score2: 2, winner: 'Riddles' },
      { player1: 'Dabuz', player2: 'Riddles', score1: 3, score2: 2, winner: 'Dabuz' },
      { player1: 'Sparg0', player2: 'MkLeo', score1: 3, score2: 1, winner: 'Sparg0' },
    ]
  },
  {
    id: 7,
    name: 'Smash Bong Z #7',
    slug: 'smash-bong-z-7',
    date: '2025-02-16',
    entrants: 32,
    format: 'Singles',
    results: [
      { placement: 1, playerTag: 'MkLeo', setsWon: 5, setsLost: 1, points: 100 },
      { placement: 2, playerTag: 'Tweek', setsWon: 4, setsLost: 2, points: 70 },
      { placement: 3, playerTag: 'Light', setsWon: 4, setsLost: 1, points: 50 },
      { placement: 4, playerTag: 'Kola', setsWon: 3, setsLost: 2, points: 40 },
      { placement: 5, playerTag: 'Sparg0', setsWon: 3, setsLost: 1, points: 30 },
      { placement: 5, playerTag: 'Marss', setsWon: 2, setsLost: 2, points: 30 },
      { placement: 7, playerTag: 'Nairo', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 7, playerTag: 'ANTi', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 9, playerTag: 'Dabuz', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'Riddles', setsWon: 1, setsLost: 2, points: 10 },
    ],
    sets: [
      { player1: 'MkLeo', player2: 'Tweek', score1: 3, score2: 2, winner: 'MkLeo' },
      { player1: 'Light', player2: 'Kola', score1: 3, score2: 1, winner: 'Light' },
      { player1: 'Tweek', player2: 'Light', score1: 3, score2: 2, winner: 'Tweek' },
      { player1: 'MkLeo', player2: 'Sparg0', score1: 3, score2: 1, winner: 'MkLeo' },
    ]
  },
  {
    id: 8,
    name: 'Smash Bong Z #8',
    slug: 'smash-bong-z-8',
    date: '2025-02-23',
    entrants: 30,
    format: 'Singles',
    results: [
      { placement: 1, playerTag: 'Sparg0', setsWon: 5, setsLost: 0, points: 100 },
      { placement: 2, playerTag: 'Glutonny', setsWon: 4, setsLost: 2, points: 70 },
      { placement: 3, playerTag: 'Tweek', setsWon: 4, setsLost: 1, points: 50 },
      { placement: 4, playerTag: 'Marss', setsWon: 3, setsLost: 2, points: 40 },
      { placement: 5, playerTag: 'MkLeo', setsWon: 3, setsLost: 1, points: 30 },
      { placement: 5, playerTag: 'Light', setsWon: 2, setsLost: 2, points: 30 },
      { placement: 7, playerTag: 'Dabuz', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 7, playerTag: 'Kola', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 9, playerTag: 'Riddles', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'Larry Lurr', setsWon: 1, setsLost: 2, points: 10 },
    ],
    sets: [
      { player1: 'Sparg0', player2: 'Glutonny', score1: 3, score2: 1, winner: 'Sparg0' },
      { player1: 'Tweek', player2: 'Marss', score1: 3, score2: 2, winner: 'Tweek' },
      { player1: 'Glutonny', player2: 'Tweek', score1: 3, score2: 2, winner: 'Glutonny' },
      { player1: 'Sparg0', player2: 'MkLeo', score1: 3, score2: 1, winner: 'Sparg0' },
    ]
  },
  {
    id: 9,
    name: 'Smash Bong Z #9',
    slug: 'smash-bong-z-9',
    date: '2025-03-02',
    entrants: 28,
    format: 'Singles',
    results: [
      { placement: 1, playerTag: 'MkLeo', setsWon: 5, setsLost: 0, points: 100 },
      { placement: 2, playerTag: 'Sparg0', setsWon: 4, setsLost: 2, points: 70 },
      { placement: 3, playerTag: 'Nairo', setsWon: 4, setsLost: 1, points: 50 },
      { placement: 4, playerTag: 'Glutonny', setsWon: 3, setsLost: 2, points: 40 },
      { placement: 5, playerTag: 'Cosmos', setsWon: 3, setsLost: 1, points: 30 },
      { placement: 5, playerTag: 'Dabuz', setsWon: 2, setsLost: 2, points: 30 },
      { placement: 7, playerTag: 'Light', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 7, playerTag: 'Tweek', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 9, playerTag: 'Riddles', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'Elegant', setsWon: 1, setsLost: 2, points: 10 },
    ],
    sets: [
      { player1: 'MkLeo', player2: 'Sparg0', score1: 3, score2: 1, winner: 'MkLeo' },
      { player1: 'Nairo', player2: 'Glutonny', score1: 3, score2: 2, winner: 'Nairo' },
      { player1: 'Sparg0', player2: 'Nairo', score1: 3, score2: 2, winner: 'Sparg0' },
      { player1: 'MkLeo', player2: 'Cosmos', score1: 3, score2: 0, winner: 'MkLeo' },
    ]
  },
  {
    id: 10,
    name: 'Smash Bong Z #10',
    slug: 'smash-bong-z-10',
    date: '2025-03-09',
    entrants: 32,
    format: 'Singles',
    results: [
      { placement: 1, playerTag: 'MkLeo', setsWon: 5, setsLost: 0, points: 100 },
      { placement: 2, playerTag: 'Light', setsWon: 4, setsLost: 2, points: 70 },
      { placement: 3, playerTag: 'Sparg0', setsWon: 4, setsLost: 1, points: 50 },
      { placement: 4, playerTag: 'Tweek', setsWon: 3, setsLost: 2, points: 40 },
      { placement: 5, playerTag: 'Glutonny', setsWon: 3, setsLost: 1, points: 30 },
      { placement: 5, playerTag: 'Riddles', setsWon: 2, setsLost: 2, points: 30 },
      { placement: 7, playerTag: 'Dabuz', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 7, playerTag: 'Marss', setsWon: 2, setsLost: 2, points: 20 },
      { placement: 9, playerTag: 'Cosmos', setsWon: 1, setsLost: 2, points: 10 },
      { placement: 9, playerTag: 'Kola', setsWon: 1, setsLost: 2, points: 10 },
    ],
    sets: [
      { player1: 'MkLeo', player2: 'Light', score1: 3, score2: 1, winner: 'MkLeo' },
      { player1: 'Sparg0', player2: 'Tweek', score1: 3, score2: 2, winner: 'Sparg0' },
      { player1: 'Light', player2: 'Sparg0', score1: 3, score2: 2, winner: 'Light' },
      { player1: 'MkLeo', player2: 'Glutonny', score1: 3, score2: 0, winner: 'MkLeo' },
    ]
  },
]

// Helper functions
export function getPlayerBySlug(slug: string): Player | undefined {
  return players.find(p => p.slug === slug)
}

export function getTournamentBySlug(slug: string): Tournament | undefined {
  return tournaments.find(t => t.slug === slug)
}

export function getPlayerTournamentHistory(playerTag: string): { tournament: Tournament; result: TournamentResult }[] {
  return tournaments
    .map(tournament => {
      const result = tournament.results.find(r => r.playerTag === playerTag)
      if (result) {
        return { tournament, result }
      }
      return null
    })
    .filter((item): item is { tournament: Tournament; result: TournamentResult } => item !== null)
}

export function getPlayerHeadToHead(playerTag: string): HeadToHead[] {
  const headToHead: Record<string, { wins: number; losses: number; lastPlayed: string }> = {}

  tournaments.forEach(tournament => {
    tournament.sets.forEach(set => {
      if (set.player1 === playerTag) {
        const opponent = set.player2
        if (!headToHead[opponent]) {
          headToHead[opponent] = { wins: 0, losses: 0, lastPlayed: tournament.date }
        }
        if (set.winner === playerTag) {
          headToHead[opponent].wins++
        } else {
          headToHead[opponent].losses++
        }
        headToHead[opponent].lastPlayed = tournament.date
      } else if (set.player2 === playerTag) {
        const opponent = set.player1
        if (!headToHead[opponent]) {
          headToHead[opponent] = { wins: 0, losses: 0, lastPlayed: tournament.date }
        }
        if (set.winner === playerTag) {
          headToHead[opponent].wins++
        } else {
          headToHead[opponent].losses++
        }
        headToHead[opponent].lastPlayed = tournament.date
      }
    })
  })

  return Object.entries(headToHead).map(([opponent, data]) => ({
    opponent,
    wins: data.wins,
    losses: data.losses,
    winRate: data.wins + data.losses > 0 ? Math.round((data.wins / (data.wins + data.losses)) * 100) : 0,
    lastPlayed: data.lastPlayed,
  }))
}

export function getRankings(filter: 'all' | 'last5' | 'last3' = 'all'): Player[] {
  let tournamentsToCount = tournaments
  
  if (filter === 'last5') {
    tournamentsToCount = tournaments.slice(-5)
  } else if (filter === 'last3') {
    tournamentsToCount = tournaments.slice(-3)
  }

  const pointsMap: Record<string, number> = {}
  
  tournamentsToCount.forEach(tournament => {
    tournament.results.forEach(result => {
      if (!pointsMap[result.playerTag]) {
        pointsMap[result.playerTag] = 0
      }
      pointsMap[result.playerTag] += result.points
    })
  })

  return [...players]
    .map(player => ({
      ...player,
      totalPoints: pointsMap[player.tag] || 0
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
}

export function getRecentTournaments(count: number = 3): Tournament[] {
  return [...tournaments].reverse().slice(0, count)
}

export function getLastChampion(): string {
  const lastTournament = tournaments[tournaments.length - 1]
  return lastTournament?.results.find(r => r.placement === 1)?.playerTag || ''
}
