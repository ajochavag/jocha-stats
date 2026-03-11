// Melee character icon mapping
// Icons are in /public/characters/ folder (1.png - 26.png)

export const CHARACTER_ICONS: Record<string, string> = {
  // Row 1
  'Bowser': '/characters/1.png',
  'Captain Falcon': '/characters/2.png',
  'Donkey Kong': '/characters/3.png',
  'Dr. Mario': '/characters/4.png',
  'Falco': '/characters/5.png',
  'Fox': '/characters/6.png',
  'Ganondorf': '/characters/7.png',
  'Ice Climbers': '/characters/8.png',
  'Jigglypuff': '/characters/9.png',
  'Kirby': '/characters/10.png',
  'Link': '/characters/11.png',
  'Luigi': '/characters/12.png',
  'Mario': '/characters/13.png',
  'Marth': '/characters/14.png',
  // Row 2
  'Mewtwo': '/characters/15.png',
  'Mr. Game & Watch': '/characters/16.png',
  'Ness': '/characters/17.png',
  'Peach': '/characters/18.png',
  'Pichu': '/characters/19.png',
  'Pikachu': '/characters/20.png',
  'Roy': '/characters/21.png',
  'Samus': '/characters/22.png',
  'Sheik': '/characters/23.png',
  'Yoshi': '/characters/24.png',
  'Young Link': '/characters/25.png',
  'Zelda': '/characters/26.png',
}

export function getCharacterIcon(characterName: string): string | null {
  return CHARACTER_ICONS[characterName] ?? null
}

export const ALL_CHARACTERS = Object.keys(CHARACTER_ICONS)