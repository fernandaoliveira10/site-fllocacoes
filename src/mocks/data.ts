import type { Booking, Product } from "@/lib/types";

export const mockAdmin = {
  id: "user-admin",
  email: "admin@flocacoes.com",
  name: "Admin F&L",
  role: "ADMIN" as const,
  passwordHash: "mock",
};

const mockProductsList: Product[] = [
  {
    id: "prod-plataforma-360",
    name: "Plataforma 360",
    description: "Ideal para criar vídeos incríveis e personalizados.",
    category: "PLATAFORMA_360",
    extraPricePerHour: 10000,
    isOutsourced: false,
    priceConfirmed: true,
    isActive: true,
    media: [
      { id: "m-p360-1", url: "/images/produtos/plataforma-360.jpg", alt: "Plataforma 360", type: "IMAGE" },
      { id: "m-p360-2", url: "/images/plataforma_v.mp4", alt: "Plataforma 360 em vídeo", type: "VIDEO" },
      { id: "m-p360-2", url: "/images/plataforma_v2.mp4", alt: "Plataforma 360 em vídeo 2", type: "VIDEO" },
    ],
    priceTiers: [
      { id: "pt-p360-1", durationHours: 2, price: 32000, label: "2 horas", isComboPrice: false },
      { id: "pt-p360-2", durationHours: 3, price: 37000, label: "3 horas", isComboPrice: false },
    ],
  },
  {
    id: "prod-cama-elastica",
    name: "Cama Elástica de 3 Metros",
    description: "Monitor, montagem e desmontagem inclusos. Equipamento higienizado.",
    category: "CAMA_ELASTICA",
    extraPricePerHour: 10000,
    isOutsourced: false,
    priceConfirmed: true,
    isActive: true,
    media: [
      { id: "m-ce-1", url: "/images/produtos/cama-elastica.jpg", alt: "Cama Elástica 3m", type: "IMAGE" },
            { id: "m-ce-2", url: "/images/camaelastica_v.mp4", alt: "Cama Elástica em vídeo", type: "VIDEO" },
    ],
    priceTiers: [
      { id: "pt-ce-1", durationHours: 3, price: 15000, label: "3 horas com monitor", isComboPrice: false },
      { id: "pt-ce-2", durationHours: 5, price: 20000, label: "5 horas sem monitor", isComboPrice: false },
    ],
  },
  {
    id: "prod-fotografia",
    name: "Fotografia Profissional",
    description: "Capture cada momento com qualidade profissional.",
    category: "FOTOGRAFIA",
    extraPricePerHour: null,
    isOutsourced: false,
    priceConfirmed: true,
    isActive: true,
    media: [
      { id: "m-foto-1", url: "/images/produtos/fotografia.jpg", alt: "Fotografia Profissional", type: "IMAGE" },
      { id: "m-foto-2", url: "/images/produtos/foto1.jpeg", alt: "Fotografia Profissional", type: "IMAGE" },
      { id: "m-foto-3", url: "/images/produtos/foto2.jpeg", alt: "Fotografia Profissional", type: "IMAGE" },
      { id: "m-foto-4", url: "/images/produtos/foto3.jpeg", alt: "Fotografia Profissional", type: "IMAGE" },
      { id: "m-foto-5", url: "/images/produtos/foto4.jpeg", alt: "Fotografia Profissional", type: "IMAGE" },
    ],
    priceTiers: [
      { id: "pt-foto-1", durationHours: 2, price: 20000, label: "2 horas", isComboPrice: false },
      { id: "pt-foto-2", durationHours: 3, price: 30000, label: "3 horas", isComboPrice: false },
    ],
  },
  {
    id: "prod-piscina-bolinha",
    name: "Piscina de Bolinha",
    description: "Piscina de bolinha infantil com proteção e monitoramento.",
    category: "PISCINA_BOLINHA",
    extraPricePerHour: null,
    isOutsourced: true,
    priceConfirmed: false,
    isActive: true,
    media: [
      { id: "m-pb-1", url: "/images/produtos/piscina-bolinha.jpg", alt: "Piscina de Bolinha", type: "IMAGE" },
    ],
    priceTiers: [],
  },
  {
    id: "prod-mesas-cadeiras",
    name: "Mesas e Cadeiras",
    description: "Jogos de mesas e cadeiras para eventos. Consulte valores.",
    category: "MESAS_CADEIRAS",
    extraPricePerHour: null,
    isOutsourced: true,
    priceConfirmed: false,
    isActive: true,
    media: [
      { id: "m-mc-1", url: "/images/produtos/mesas-cadeiras.jpg", alt: "Mesas e Cadeiras", type: "IMAGE" },
    ],
    priceTiers: [],
  },
];

function getProductById(productId: string): Product | undefined {
  return mockProductsList.find((p) => p.id === productId);
}

export const mockProducts = mockProductsList;

export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    clientName: "Maria Silva",
    clientEmail: "maria@email.com",
    clientPhone: "11988887777",
    eventDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    eventTime: "14:00",
    durationHours: 3,
    extraHours: 0,
    totalAmount: 46150,
    depositAmount: 13845,
    paymentPlan: "deposit",
    paymentMethod: "pix",
    status: "CONFIRMED",
    notes: null,
    eventType: "aniversario",
    eventAddress: "Rua das Flores, 123 - Jardim Paulista",
    eventCity: "São José dos Campos",
    eventNotes: null,
    transportFee: 1500,
    hasTransportFee: true,
    items: [
      { id: "bi-1-1", productId: "prod-plataforma-360", product: getProductById("prod-plataforma-360")!, quantity: 1, price: 32000, durationHours: 2 },
      { id: "bi-1-2", productId: "prod-cama-elastica", product: getProductById("prod-cama-elastica")!, quantity: 1, price: 15000, durationHours: 3 },
    ],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "booking-2",
    clientName: "Carlos Oliveira",
    clientEmail: "carlos@email.com",
    clientPhone: "21966665555",
    eventDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    eventTime: "09:00",
    durationHours: 3,
    extraHours: 1,
    totalAmount: 63250,
    depositAmount: 18975,
    paymentPlan: "deposit",
    paymentMethod: "card",
    status: "PENDING",
    notes: null,
    eventType: "corporativo",
    eventAddress: "Av. Paulista, 1000 - Bela Vista",
    eventCity: "Caçapava",
    eventNotes: "Precisa montar 1h antes do início",
    transportFee: 4000,
    hasTransportFee: true,
    items: [
      { id: "bi-2-1", productId: "prod-plataforma-360", product: getProductById("prod-plataforma-360")!, quantity: 1, price: 35000, durationHours: 3 },
      { id: "bi-2-2", productId: "prod-fotografia", product: getProductById("prod-fotografia")!, quantity: 1, price: 20000, durationHours: 2 },
    ],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "booking-3",
    clientName: "Ana Costa",
    clientEmail: "ana@email.com",
    clientPhone: "31955554444",
    eventDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    eventTime: "10:00",
    durationHours: 5,
    extraHours: 0,
    totalAmount: 22000,
    depositAmount: 6600,
    paymentPlan: "deposit",
    paymentMethod: "pix",
    status: "COMPLETED",
    notes: "Evento corporativo, tudo ok.",
    eventType: "festa-infantil",
    eventAddress: "Rua dos Pinheiros, 50 - Centro",
    eventCity: "Jacareí",
    eventNotes: null,
    transportFee: 5000,
    hasTransportFee: true,
    items: [
      { id: "bi-3-1", productId: "prod-fotografia", product: getProductById("prod-fotografia")!, quantity: 1, price: 17000, durationHours: 5 },
    ],
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

export function getMockUserByEmail(email: string) {
  if (email === "admin@flocacoes.com") {
    return {
      email: mockAdmin.email,
      role: mockAdmin.role,
      id: mockAdmin.id,
      name: mockAdmin.name,
    };
  }
  return undefined;
}

