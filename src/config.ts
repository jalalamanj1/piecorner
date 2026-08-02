import { RestaurantConfig, MenuData, MenuCategoryData } from './types';
import restaurantConfigJson from './restaurantConfig.json';
import menuDataJson from './menuData.json';

export const config: RestaurantConfig = restaurantConfigJson;

// Empty state used when clearing the menu
export const initialMenuData: MenuData = {
  featured: [],
  pie: [],
  lahm: [],
  pizza: [],
  croissant: [],
  kahi: [],
  buffaloMilk: [],
  hotDrinks: []
};

export const categories: MenuCategoryData[] = [
  {
    id: 'pie',
    titleAr: 'الفطائر',
    iconName: 'PieChart',
    descriptionAr: 'فطائر متنوعة بعجين طازج محضرة يومياً'
  },
  {
    id: 'lahm',
    titleAr: 'اللحم بعجين',
    iconName: 'Beef',
    descriptionAr: 'لحم بعجين على الطريقة العراقية الأصيلة'
  },
  {
    id: 'pizza',
    titleAr: 'البيتزا',
    iconName: 'Pizza',
    descriptionAr: 'بيتزا فاخرة بأحجام مختلفة من فرننا'
  },
  {
    id: 'croissant',
    titleAr: 'الكرواسون',
    iconName: 'Croissant',
    descriptionAr: 'كرواسون طازج بحشوات متنوعة'
  },
  {
    id: 'kahi',
    titleAr: 'الكاهي',
    iconName: 'Cake',
    descriptionAr: 'كاهي هش يقدم مع القشطة والفستق'
  },
  {
    id: 'buffaloMilk',
    titleAr: 'الحليب الجاموس',
    iconName: 'Milk',
    descriptionAr: 'حليب جاموس طازج، بالعسل أو سادة'
  },
  {
    id: 'hotDrinks',
    titleAr: 'المشروبات الساخنة',
    iconName: 'Coffee',
    descriptionAr: 'شاي عراقي أصيل ومشروبات منعشة'
  }
];

// Menu data (default populated state + sample reload)
export const sampleMenuData: MenuData = menuDataJson;

// Restaurant offers displayed in the "العروض" section
export type Offer = {
  id: string;
  titleAr: string;
  icon: string;
  accent: string;
  image?: string;
  rows: { label: string; value: string }[];
};

export const offers: Offer[] = [
  {
    id: 'pies',
    titleAr: 'عرض الفطائر',
    icon: '🥟',
    accent: 'from-[#E85D04] to-[#FFBA08]',
    rows: [
      { label: '5 قطع', value: '6000 دينار' },
      { label: '10 قطع', value: '12000 دينار' }
    ]
  },
  {
    id: 'lahm',
    titleAr: 'عرض اللحم بعجين',
    icon: '🥩',
    accent: 'from-[#FFBA08] to-[#E85D04]',
    rows: [
      { label: 'الطلب الأول', value: '8500 دينار' },
      { label: 'الطلب الثاني', value: '17000 دينار' }
    ]
  },
  {
    id: 'pizza',
    titleAr: 'عرض البيتزا',
    icon: '🍕',
    accent: 'from-[#E85D04] to-[#FFBA08]',
    rows: [
      { label: 'بيتزا بطل + بيبسي عائلي', value: '10500 دينار' }
    ]
  }
];
