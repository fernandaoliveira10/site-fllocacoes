import type { Booking, Combo, Product } from "@/lib/types";

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
    extraPricePerHour: 5000,
    isOutsourced: false,
    priceConfirmed: true,
    isActive: true,
    media: [
      { id: "m-p360-1", url: "/images/produtos/plataforma-360.jpg", alt: "Plataforma 360", type: "IMAGE" },
    ],
    priceTiers: [
      { id: "pt-p360-1", durationHours: 2, price: 32000, label: "2 horas", isComboPrice: false },
      { id: "pt-p360-2", durationHours: 3, price: 35000, label: "3 horas", isComboPrice: false },
    ],
  },
  {
    id: "prod-cama-elastica",
    name: "Cama Elástica de 3 Metros",
    description: "Monitor, montagem e desmontagem inclusos. Equipamento higienizado.",
    category: "CAMA_ELASTICA",
    extraPricePerHour: 5000,
    isOutsourced: false,
    priceConfirmed: true,
    isActive: true,
    media: [
      { id: "m-ce-1", url: "/images/produtos/cama-elastica.jpg", alt: "Cama Elástica 3m", type: "IMAGE" },
    ],
    priceTiers: [
      { id: "pt-ce-1", durationHours: 3, price: 17000, label: "3 horas", isComboPrice: false },
      { id: "pt-ce-2", durationHours: 5, price: 20000, label: "5 horas", isComboPrice: false },
    ],
  },
  {
    id: "prod-fotografia",
    name: "Fotografia Profissional",
    description: "Capture cada momento com qualidade profissional.",
    category: "FOTOGRAFIA",
    extraPricePerHour: 5000,
    isOutsourced: false,
    priceConfirmed: true,
    isActive: true,
    media: [
      { id: "m-foto-1", url: "/images/produtos/fotografia.jpg", alt: "Fotografia Profissional", type: "IMAGE" },
    ],
    priceTiers: [
      { id: "pt-foto-1", durationHours: 2, price: 30000, label: "2 horas", isComboPrice: false },
      { id: "pt-foto-2", durationHours: 3, price: 35000, label: "3 horas", isComboPrice: false },
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

const p360 = (id: string) => getProductById(id)!;

export const mockCombos: Combo[] = [
  {
    id: "combo-1",
    name: "Combo 1",
    description: "Plataforma 360° (2h) + Cama Elástica (3h)",
    totalPrice: 43100,
    durationHours: 3,
    discountPct: 12,
    isActive: true,
    items: [
      { id: "ci-1-1", productId: "prod-plataforma-360", product: p360("prod-plataforma-360"), quantity: 1, durationHours: 2 },
      { id: "ci-1-2", productId: "prod-cama-elastica", product: p360("prod-cama-elastica"), quantity: 1, durationHours: 3 },
    ],
  },
  {
    id: "combo-2",
    name: "Combo 2",
    description: "Plataforma 360° (3h) + Cama Elástica (5h)",
    totalPrice: 48400,
    durationHours: 5,
    discountPct: 12,
    isActive: true,
    items: [
      { id: "ci-2-1", productId: "prod-plataforma-360", product: p360("prod-plataforma-360"), quantity: 1, durationHours: 3 },
      { id: "ci-2-2", productId: "prod-cama-elastica", product: p360("prod-cama-elastica"), quantity: 1, durationHours: 5 },
    ],
  },
  {
    id: "combo-3",
    name: "Combo 3",
    description: "Plataforma 360° (2h) + Fotografia (2h)",
    totalPrice: 54600,
    durationHours: 2,
    discountPct: 12,
    isActive: true,
    items: [
      { id: "ci-3-1", productId: "prod-plataforma-360", product: p360("prod-plataforma-360"), quantity: 1, durationHours: 2 },
      { id: "ci-3-2", productId: "prod-fotografia", product: p360("prod-fotografia"), quantity: 1, durationHours: 2 },
    ],
  },
  {
    id: "combo-4",
    name: "Combo 4",
    description: "Plataforma 360° (3h) + Fotografia (3h)",
    totalPrice: 61600,
    durationHours: 3,
    discountPct: 12,
    isActive: true,
    items: [
      { id: "ci-4-1", productId: "prod-plataforma-360", product: p360("prod-plataforma-360"), quantity: 1, durationHours: 3 },
      { id: "ci-4-2", productId: "prod-fotografia", product: p360("prod-fotografia"), quantity: 1, durationHours: 3 },
    ],
  },
  {
    id: "combo-7",
    name: "Combo 7",
    description: "Cama Elástica (3h) + Fotografia (2h)",
    totalPrice: 41400,
    durationHours: 3,
    discountPct: 12,
    isActive: true,
    items: [
      { id: "ci-7-1", productId: "prod-cama-elastica", product: p360("prod-cama-elastica"), quantity: 1, durationHours: 3 },
      { id: "ci-7-2", productId: "prod-fotografia", product: p360("prod-fotografia"), quantity: 1, durationHours: 2 },
    ],
  },
  {
    id: "combo-8",
    name: "Combo 8",
    description: "Cama Elástica (5h) + Fotografia (3h)",
    totalPrice: 48400,
    durationHours: 5,
    discountPct: 12,
    isActive: true,
    items: [
      { id: "ci-8-1", productId: "prod-cama-elastica", product: p360("prod-cama-elastica"), quantity: 1, durationHours: 5 },
      { id: "ci-8-2", productId: "prod-fotografia", product: p360("prod-fotografia"), quantity: 1, durationHours: 3 },
    ],
  },
  {
    id: "combo-5",
    name: "Combo 5",
    description: "Plataforma 360° (2h) + Fotografia (2h) + Cama Elástica (3h)",
    totalPrice: 67200,
    durationHours: 3,
    discountPct: 15,
    isActive: true,
    items: [
      { id: "ci-5-1", productId: "prod-plataforma-360", product: p360("prod-plataforma-360"), quantity: 1, durationHours: 2 },
      { id: "ci-5-2", productId: "prod-fotografia", product: p360("prod-fotografia"), quantity: 1, durationHours: 2 },
      { id: "ci-5-3", productId: "prod-cama-elastica", product: p360("prod-cama-elastica"), quantity: 1, durationHours: 3 },
    ],
  },
  {
    id: "combo-6",
    name: "Combo 6",
    description: "Plataforma 360° (3h) + Fotografia (3h) + Cama Elástica (5h)",
    totalPrice: 76500,
    durationHours: 5,
    discountPct: 15,
    isActive: true,
    items: [
      { id: "ci-6-1", productId: "prod-plataforma-360", product: p360("prod-plataforma-360"), quantity: 1, durationHours: 3 },
      { id: "ci-6-2", productId: "prod-fotografia", product: p360("prod-fotografia"), quantity: 1, durationHours: 3 },
      { id: "ci-6-3", productId: "prod-cama-elastica", product: p360("prod-cama-elastica"), quantity: 1, durationHours: 5 },
    ],
  },
  {
    id: "combo-personalizado",
    name: "Combo Personalizado",
    description: "Monte seu pacote e ganhe condições especiais. Consulte-nos!",
    totalPrice: 0,
    durationHours: 0,
    discountPct: null,
    isActive: true,
    items: [],
  },
];

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
    combo: { id: "combo-1", name: "Combo 1" },
    totalAmount: 43100,
    depositAmount: 12930,
    paymentPlan: "deposit",
    paymentMethod: "pix",
    status: "CONFIRMED",
    notes: null,
    eventType: "aniversario",
    eventAddress: "Rua das Flores, 123 - Jardim Paulista",
    eventCity: "São Paulo",
    eventNotes: null,
    transportFee: null,
    hasTransportFee: true,
    items: [
      { id: "bi-1-1", productId: "prod-plataforma-360", product: p360("prod-plataforma-360"), quantity: 1, price: 0, durationHours: 2 },
      { id: "bi-1-2", productId: "prod-cama-elastica", product: p360("prod-cama-elastica"), quantity: 1, price: 0, durationHours: 3 },
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
    durationHours: 5,
    extraHours: 0,
    combo: { id: "combo-2", name: "Combo 2" },
    totalAmount: 48400,
    depositAmount: 14520,
    paymentPlan: "deposit",
    paymentMethod: "card",
    status: "PENDING",
    notes: null,
    eventType: "corporativo",
    eventAddress: "Av. Paulista, 1000 - Bela Vista",
    eventCity: "São Paulo",
    eventNotes: "Precisa montar 1h antes do início",
    transportFee: null,
    hasTransportFee: true,
    items: [
      { id: "bi-2-1", productId: "prod-plataforma-360", product: p360("prod-plataforma-360"), quantity: 1, price: 0, durationHours: 3 },
      { id: "bi-2-2", productId: "prod-cama-elastica", product: p360("prod-cama-elastica"), quantity: 1, price: 0, durationHours: 5 },
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
    durationHours: 3,
    extraHours: 0,
    combo: null,
    totalAmount: 35000,
    depositAmount: 10500,
    paymentPlan: "deposit",
    paymentMethod: "pix",
    status: "COMPLETED",
    notes: "Evento corporativo, tudo ok.",
    eventType: "festa-infantil",
    eventAddress: "Rua dos Pinheiros, 50 - Centro",
    eventCity: "Osasco",
    eventNotes: null,
    transportFee: 5000,
    hasTransportFee: false,
    items: [
      { id: "bi-3-1", productId: "prod-fotografia", product: p360("prod-fotografia"), quantity: 1, price: 35000, durationHours: 3 },
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
