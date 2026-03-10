'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowUpDown } from 'lucide-react'
import { players } from '@/lib/data'
import { PlayerCard } from '@/components/player-card'

type SortOption = 'name' | 'winRate' | 'tournaments' | 'points'

export default function JugadoresPage() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('points')

  const filteredAndSortedPlayers = useMemo(() => {
    let result = [...players]

    // Filter by search
    if (search) {
      result = result.filter(p => 
        p.tag.toLowerCase().includes(search.toLowerCase()) ||
        p.main.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.tag.localeCompare(b.tag))
        break
      case 'winRate':
        result.sort((a, b) => b.winRate - a.winRate)
        break
      case 'tournaments':
        result.sort((a, b) => b.tournamentsAttended - a.tournamentsAttended)
        break
      case 'points':
        result.sort((a, b) => b.totalPoints - a.totalPoints)
        break
    }

    return result
  }, [search, sortBy])

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="font-[var(--font-bebas-neue)] text-4xl md:text-5xl text-white tracking-wide mb-2">
          Jugadores
        </h1>
        <div className="h-1 w-24 bg-[#CC1F1F] rounded-full" />
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar jugador o personaje..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#CC1F1F]/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} className="text-zinc-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#CC1F1F]/50 transition-colors"
          >
            <option value="points">Por Puntos</option>
            <option value="winRate">Por Win Rate</option>
            <option value="tournaments">Por Torneos</option>
            <option value="name">Por Nombre</option>
          </select>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedPlayers.map((player) => (
          <PlayerCard key={player.slug} player={player} />
        ))}
      </div>

      {filteredAndSortedPlayers.length === 0 && (
        <div className="text-center py-16">
          <p className="text-zinc-500">No se encontraron jugadores con ese criterio.</p>
        </div>
      )}
    </div>
  )
}
