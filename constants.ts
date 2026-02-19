
import { Product, AdminUser } from './types';

export const DELIVERY_FEE = 5.00;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tambaqui Inteiro',
    pricePerKg: 36.00,
    images: ['https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop'],
    isCarouselEnabled: false,
    options: [
      { id: '1-1', label: 'Sem espinha e sem escama' },
      { id: '1-2', label: 'Com espinha e sem escama' }
    ]
  },
  {
    id: '2',
    name: 'Tambaqui Bandado Premium',
    pricePerKg: 38.00,
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop'],
    isCarouselEnabled: false,
    options: [
      { id: '2-1', label: 'Sem espinha e sem escama' },
      { id: '2-2', label: 'Com espinha e sem escama' }
    ]
  },
  {
    id: '3',
    name: 'Costela Nobre',
    pricePerKg: 36.00,
    images: ['https://images.unsplash.com/photo-1534604973900-c41ab4cdda97?q=80&w=800&auto=format&fit=crop'],
    isCarouselEnabled: false,
  },
  {
    id: '4',
    name: 'Filé Especial',
    pricePerKg: 45.00,
    images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop'],
    isCarouselEnabled: false,
  }
];

export const MAIN_ADMIN: AdminUser = {
  id: 'main-admin',
  username: 'somshow01@gmail.com',
  password: 'Palmeiras@123'
};
