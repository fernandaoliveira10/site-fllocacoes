export type UserRole = "ADMIN";

export type ProductCategory =
  | "PLATAFORMA_360"
  | "CAMA_ELASTICA"
  | "FOTOGRAFIA"
  | "PISCINA_BOLINHA"
  | "MESAS_CADEIRAS";

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type ProductMediaType = "IMAGE" | "VIDEO";
export type CarouselSlideType = ProductMediaType;

export interface CarouselSlide {
  src: string;
  alt: string;
  type?: CarouselSlideType;
  poster?: string;
}

export const productCategoryLabels: Record<ProductCategory, string> = {
  PLATAFORMA_360: "Plataforma 360",
  CAMA_ELASTICA: "Cama Elastica 3m",
  FOTOGRAFIA: "Fotografia Profissional",
  PISCINA_BOLINHA: "Piscina de Bolinha",
  MESAS_CADEIRAS: "Mesas e Cadeiras",
};

export interface ProductMedia {
  id: string;
  url: string;
  alt?: string;
  type: ProductMediaType;
}

export interface ProductPriceTier {
  id: string;
  durationHours: number;
  price: number;
  label?: string;
  isComboPrice: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  extraPricePerHour: number | null;
  isOutsourced: boolean;
  priceConfirmed: boolean;
  isActive: boolean;
  media: ProductMedia[];
  priceTiers: ProductPriceTier[];
}

export interface BookingItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  durationHours: number;
}
export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  durationHours: number;
  extraHours: number;
  totalAmount: number;
  depositAmount: number;
  paymentPlan: string;
  paymentMethod: string;
  status: BookingStatus;
  notes: string | null;
  eventType: string | null;
  eventCity: string | null;
  eventNotes: string | null;
  items: BookingItem[];
  createdAt: string;
}

export interface DashboardSummary {
  realizedRevenue: number;
  pendingRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  upcomingBookings: number;
  avgTicket: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
}
