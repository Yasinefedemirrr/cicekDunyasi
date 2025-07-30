export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Flower {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: number;
  flowerId: number;
  flowerName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  deliveryAddress: string;
  phoneNumber: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  deliveryDate?: string;
  notes?: string;
  orderItems: OrderItem[];
}

export interface CreateOrderRequest {
  customerName: string;
  deliveryAddress: string;
  phoneNumber: string;
  notes?: string;
  orderItems: CreateOrderItemRequest[];
}

export interface CreateOrderItemRequest {
  flowerId: number;
  quantity: number;
}

export interface CartItem {
  flower: Flower;
  quantity: number;
} 