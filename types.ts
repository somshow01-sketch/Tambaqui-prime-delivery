
export interface ProductOption {
  id: string;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  pricePerKg: number;
  options?: ProductOption[];
  images: string[];
  isCarouselEnabled: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedOption?: string;
}

export interface DeliveryDetails {
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  whatsapp: string;
  observations: string;
}

export type PaymentMethod = 'PIX' | 'DEBITO_CREDITO' | 'ESPECIE';

export interface Order {
  id: string;
  customerName: string;
  whatsapp: string;
  date: string;
  items: CartItem[];
  deliveryDetails: DeliveryDetails;
  paymentMethod: PaymentMethod;
  changeAmount?: string;
  deliveryFee: number;
  total: number;
}

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
}
