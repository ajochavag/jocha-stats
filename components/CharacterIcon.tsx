import Image from 'next/image'
import { getCharacterIcon } from '@/lib/characters'

interface CharacterIconProps {
  character: string
  size?: number
  className?: string
  showName?: boolean
}

export function CharacterIcon({
  character,
  size = 40,
  className = '',
  showName = false,
}: CharacterIconProps) {
  const icon = getCharacterIcon(character)

  if (!icon) {
    // Fallback: colored circle with initials
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-zinc-700 text-zinc-300 font-bold text-xs ${className}`}
        style={{ width: size, height: size }}
        title={character}
      >
        {character.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  if (showName) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Image
          src={icon}
          alt={character}
          width={size}
          height={size}
          className="rounded-full object-cover"
          title={character}
        />
        <span className="text-white text-sm font-medium">{character}</span>
      </div>
    )
  }

  return (
    <Image
      src={icon}
      alt={character}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      title={character}
    />
  )
}