export const getItemEmoji = (nameAr?: string): string => {
  if (!nameAr) return '🍽️';
  if (nameAr.includes('بيتزا')) return '🍕';
  if (nameAr.includes('كرواسون')) return '🥐';
  if (nameAr.includes('كاهي')) return '🍮';
  if (nameAr.includes('حليب') || nameAr.includes('لبنة')) return '🥛';
  if (nameAr.includes('فطيرة')) return '🥟';
  if (nameAr.includes('لحم')) return '🥩';
  if (nameAr.includes('شاي')) return '🍵';
  if (nameAr.includes('بيبسي') || nameAr.includes('ماء') || nameAr.includes('شنينة')) return '🥤';
  return '🍽️';
};
