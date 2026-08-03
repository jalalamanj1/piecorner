export type Lang = 'ar' | 'ckb' | 'tr';

export const LANGS: Lang[] = ['ar', 'ckb', 'tr'];

export interface LocalizedText {
  ar: string;
  ckb: string;
  tr: string;
}

export type DietaryTag = 'vegetarian' | 'vegan' | 'glutenFree' | 'chefSpecial' | 'spicy' | 'nutFree';

export interface MenuItem {
  id: string;
  name: LocalizedText;
  description?: LocalizedText;
  price: number;
  originalPrice?: number; // For special offers
  image?: string;
  categoryId: string;
  isSpecialOffer?: boolean;
  offerBadge?: LocalizedText;
  dietaryTags?: DietaryTag[];
  calories?: number;
  chefNote?: LocalizedText;
  ingredients?: LocalizedText[];
}

export interface Category {
  id: string;
  name: LocalizedText;
  icon: string; // Emoji
  badge?: LocalizedText;
}

export interface HeroSlide {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  image: string;
  targetCategoryId: string;
  tag?: LocalizedText;
}

export interface RestaurantConfig {
  name: LocalizedText;
  tagline: LocalizedText;
  logo: string;
  phone: string;
  formattedPhone: string;
  address: string;
  openingHours: LocalizedText;
  currencySymbol: string;
  primaryColor: string;
  secondaryColor: string;
}
