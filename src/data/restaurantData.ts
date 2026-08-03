import { Category, DietaryTag, HeroSlide, LocalizedText, MenuItem, RestaurantConfig } from '../types';
import menuData from './menuData.json';

const L = (ar: string, ckb: string, tr: string): LocalizedText => ({ ar, ckb, tr });

export const DIETARY_TAG_LABELS: Record<DietaryTag, LocalizedText> = {
  vegetarian: L('نباتي', 'سەوزخۆر', 'Vejetaryen'),
  vegan: L('نباتي صرف', 'ڤیگان', 'Vegan'),
  glutenFree: L('خالٍ من الغلوتين', 'بێ گلوتین', 'Glutensiz'),
  chefSpecial: L('مميزات الشيف', 'تایبەتمەندیی شێف', "Şefin Spesiyali"),
  spicy: L('حار', 'تیژ', 'Acılı'),
  nutFree: L('خالٍ من المكسرات', 'خاڵی لە گوێز', 'Kuruyemişsiz'),
};

export const defaultRestaurantConfig: RestaurantConfig = menuData.config as RestaurantConfig;
export const categories: Category[] = menuData.categories as Category[];
export const heroSlides: HeroSlide[] = menuData.heroSlides as HeroSlide[];
export const menuItems: MenuItem[] = menuData.menuItems as MenuItem[];
