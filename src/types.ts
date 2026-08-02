export interface MenuItem {
  id: string;
  nameAr: string;
  descriptionAr?: string;
  price: number | string;
  image?: string;
  badge?: string;
  calories?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

export type MenuCategoryId =
  | 'pie'
  | 'lahm'
  | 'pizza'
  | 'croissant'
  | 'kahi'
  | 'buffaloMilk'
  | 'hotDrinks';

export interface MenuCategoryData {
  id: MenuCategoryId;
  titleAr: string;
  iconName: string;
  image?: string;
  descriptionAr: string;
}

export interface MenuData {
  featured: MenuItem[];
  pie: MenuItem[];
  lahm: MenuItem[];
  pizza: MenuItem[];
  croissant: MenuItem[];
  kahi: MenuItem[];
  buffaloMilk: MenuItem[];
  hotDrinks: MenuItem[];
}

export interface RestaurantConfig {
  phone: string;
  orderLink: string;
  locationLink: string;
  restaurantName: string;
  slogan: string;
  logo: string;
  openingHoursAr: string;
  addressAr: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
}
