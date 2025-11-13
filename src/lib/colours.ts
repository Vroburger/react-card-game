export default function rarityColor(rarity: string): string {
  switch (rarity) {
    case 'Legendary':
      return 'from-amber-500 to-yellow-400';
    case 'Epic':
      return 'from-purple-500 to-indigo-400';
    case 'Rare':
      return 'from-blue-500 to-cyan-400';
    case 'Common':
    default:
      return 'from-gray-500 to-gray-400';
  }
}