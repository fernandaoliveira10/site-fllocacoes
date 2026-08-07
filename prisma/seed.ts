import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.comboItem.deleteMany();
  await prisma.combo.deleteMany();
  await prisma.productPriceTier.deleteMany();
  await prisma.productMedia.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = hashSync("fl123456", 10);

  await prisma.user.create({
    data: {
      email: "admin@flocacoes.com",
      passwordHash,
      name: "Admin F&L",
      role: "ADMIN",
    },
  });

  const plataforma360 = await prisma.product.create({
    data: {
      name: "Plataforma 360",
      description: "Ideal para criar vídeos incríveis e personalizados.",
      category: "PLATAFORMA_360",
      extraPricePerHour: 5000,
      media: {
        create: [
          {
            url: "/images/produtos/plataforma-360.jpg",
            alt: "Plataforma 360",
          },
          {
            url: "/images/plataforma_v.mp4",
            alt: "Plataforma 360 em vídeo",
            type: "VIDEO",
          },
          {
            url: "/images/plataforma_v2.mp4",
            alt: "Plataforma 360 em vídeo 2",
            type: "VIDEO",
          },
        ],
      },
      priceTiers: {
        create: [
          { durationHours: 2, price: 32000, label: "2 horas" },
          { durationHours: 3, price: 37000, label: "3 horas" },
        ],
      },
    },
  });
  const camaElastica = await prisma.product.create({
    data: {
      name: "Cama ElÃ¡stica de 3 Metros",
      description: "Monitor, montagem e desmontagem inclusos. Equipamento higienizado.",
      category: "CAMA_ELASTICA",
      extraPricePerHour: 5000,
      media: {
        create: [
        {
          url: "/images/produtos/cama-elastica.jpg",
          alt: "Cama ElÃ¡stica 3m",
        },
        {
          url: "/images/camaelastica_v.mp4",
          alt: "Cama Elástica em vídeo",
          type: "VIDEO",
        }
      ],
      },
      priceTiers: {
        create: [
          { durationHours: 3, price: 17000, label: "3 horas" },
          { durationHours: 5, price: 20000, label: "5 horas sem monitor" },
        ],
      },
    },
  });

  const fotografia = await prisma.product.create({
    data: {
      name: "Fotografia Profissional",
      description: "Capture cada momento com qualidade profissional.",
      category: "FOTOGRAFIA",
      extraPricePerHour: 5000,
      media: {
        create: [
        {
          url: "/images/produtos/fotografia.jpg",
          alt: "Fotografia Profissional",
        },
                {
          url: "/images/produtos/foto1.jpeg",
          alt: "Fotografia Profissional",
        },
        {
          url: "/images/produtos/foto2.jpeg",
          alt: "Fotografia Profissional",
        },
        {
          url: "/images/produtos/foto3.jpeg",
          alt: "Fotografia Profissional",
        },
        {
          url: "/images/produtos/foto4.jpeg",
          alt: "Fotografia Profissional",
        },
      ]
      },
      priceTiers: {
        create: [
          { durationHours: 2, price: 30000, label: "2 horas" },
          { durationHours: 3, price: 35000, label: "3 horas" },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Piscina de Bolinha",
      description: "Piscina de bolinha infantil com proteÃ§Ã£o e monitoramento.",
      category: "PISCINA_BOLINHA",
      isOutsourced: true,
      priceConfirmed: false,
      media: {
        create: {
          url: "/images/produtos/piscina-bolinha.jpg",
          alt: "Piscina de Bolinha",
        },
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Mesas e Cadeiras",
      description: "Jogos de mesas e cadeiras para eventos. Consulte valores.",
      category: "MESAS_CADEIRAS",
      isOutsourced: true,
      priceConfirmed: false,
      media: {
        create: {
          url: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=1200&q=80",
          alt: "Mesas e Cadeiras",
        },
      },
    },
  });

  // Combos 2 itens - 12% de desconto
  await prisma.combo.create({
    data: {
      name: "Combo 1",
      description: "Plataforma 360Â° (2h) + Cama ElÃ¡stica (3h)",
      totalPrice: 43100,
      durationHours: 3,
      discountPct: 12,
      items: {
        create: [
          { productId: plataforma360.id, quantity: 1, durationHours: 2 },
          { productId: camaElastica.id, quantity: 1, durationHours: 3 },
        ],
      },
    },
  });

  await prisma.combo.create({
    data: {
      name: "Combo 2",
      description: "Plataforma 360Â° (3h) + Cama ElÃ¡stica (5h)",
      totalPrice: 48400,
      durationHours: 5,
      discountPct: 12,
      items: {
        create: [
          { productId: plataforma360.id, quantity: 1, durationHours: 3 },
          { productId: camaElastica.id, quantity: 1, durationHours: 5 },
        ],
      },
    },
  });

  await prisma.combo.create({
    data: {
      name: "Combo 3",
      description: "Plataforma 360Â° (2h) + Fotografia (2h)",
      totalPrice: 54600,
      durationHours: 2,
      discountPct: 12,
      items: {
        create: [
          { productId: plataforma360.id, quantity: 1, durationHours: 2 },
          { productId: fotografia.id, quantity: 1, durationHours: 2 },
        ],
      },
    },
  });

  await prisma.combo.create({
    data: {
      name: "Combo 4",
      description: "Plataforma 360Â° (3h) + Fotografia (3h)",
      totalPrice: 61600,
      durationHours: 3,
      discountPct: 12,
      items: {
        create: [
          { productId: plataforma360.id, quantity: 1, durationHours: 3 },
          { productId: fotografia.id, quantity: 1, durationHours: 3 },
        ],
      },
    },
  });

  await prisma.combo.create({
    data: {
      name: "Combo 7",
      description: "Cama ElÃ¡stica (3h) + Fotografia (2h)",
      totalPrice: 41400,
      durationHours: 3,
      discountPct: 12,
      items: {
        create: [
          { productId: camaElastica.id, quantity: 1, durationHours: 3 },
          { productId: fotografia.id, quantity: 1, durationHours: 2 },
        ],
      },
    },
  });

  await prisma.combo.create({
    data: {
      name: "Combo 8",
      description: "Cama ElÃ¡stica (5h) + Fotografia (3h)",
      totalPrice: 48400,
      durationHours: 5,
      discountPct: 12,
      items: {
        create: [
          { productId: camaElastica.id, quantity: 1, durationHours: 5 },
          { productId: fotografia.id, quantity: 1, durationHours: 3 },
        ],
      },
    },
  });

  // Combos 3 itens - 15% de desconto
  await prisma.combo.create({
    data: {
      name: "Combo 5",
      description: "Plataforma 360Â° (2h) + Fotografia (2h) + Cama ElÃ¡stica (3h)",
      totalPrice: 67200,
      durationHours: 3,
      discountPct: 15,
      items: {
        create: [
          { productId: plataforma360.id, quantity: 1, durationHours: 2 },
          { productId: fotografia.id, quantity: 1, durationHours: 2 },
          { productId: camaElastica.id, quantity: 1, durationHours: 3 },
        ],
      },
    },
  });

  await prisma.combo.create({
    data: {
      name: "Combo 6",
      description: "Plataforma 360Â° (3h) + Fotografia (3h) + Cama ElÃ¡stica (5h)",
      totalPrice: 76500,
      durationHours: 5,
      discountPct: 15,
      items: {
        create: [
          { productId: plataforma360.id, quantity: 1, durationHours: 3 },
          { productId: fotografia.id, quantity: 1, durationHours: 3 },
          { productId: camaElastica.id, quantity: 1, durationHours: 5 },
        ],
      },
    },
  });

  await prisma.combo.create({
    data: {
      name: "Combo Personalizado",
      description: "Monte seu pacote e ganhe condiÃ§Ãµes especiais. Consulte-nos!",
      totalPrice: 0,
      durationHours: 0,
      isActive: true,
    },
  });

  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 7);

  const combo1 = await prisma.combo.findFirst({ where: { name: "Combo 1" }, include: { items: true } });

  if (combo1 && combo1.items.length > 0) {
    await prisma.booking.create({
      data: {
        clientName: "Maria Silva",
        clientEmail: "maria@email.com",
        clientPhone: "11988887777",
        eventDate,
        eventTime: "14:00",
        durationHours: 3,
        extraHours: 0,
        comboId: combo1.id,
        totalAmount: combo1.totalPrice,
        depositAmount: Math.round(combo1.totalPrice * 0.3),
        paymentPlan: "deposit",
        paymentMethod: "pix",
        status: "CONFIRMED",
        eventType: "aniversario",
        eventAddress: "Rua das Flores, 123 - Jardim Paulista",
        eventCity: "SÃ£o Paulo",
        hasTransportFee: true,
        items: {
          create: combo1.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: 0,
            durationHours: item.durationHours ?? 3,
          })),
        },
      },
    });
  }

  console.log("Seed concluido.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


