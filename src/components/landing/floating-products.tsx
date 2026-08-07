"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const items = [
  {
    label: "Plataforma 360",
    image: "/images/produtos/plataforma-360.jpg",
    delay: 0.2,
    col: "col-span-1",
  },
  {
    label: "Cama Elástica",
    image: "/images/produtos/cama-elastica.jpg",
    delay: 0.4,
    col: "col-span-1",
  },
  {
    label: "Piscina de Bolinhas",
    image: "/images/produtos/piscina-bolinha.jpg",
    delay: 0.6,
    col: "col-span-1",
  },
  {
    label: "Fotografia",
    image: "/images/produtos/fotografia.jpg",
    delay: 0.8,
    col: "col-span-1",
  },
];

const cardVariants = {
  initial: { y: 0 },
  animate: (delay: number) => ({
    y: [0, -6, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    },
  }),
};

export function FloatingProducts() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-400">
          Mais procurados
        </p>
        <span className="rounded-full bg-fl-blue/10 px-3 py-1 text-[11px] font-semibold text-fl-blue">
          Seleção popular
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <motion.div
            key={item.label}
            custom={item.delay}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            className={`${item.col}`}
          >
            <div className="overflow-hidden rounded-2xl border border-fl-gray-200 bg-white shadow-floating transition-shadow hover:shadow-soft-xl">
              <div className="aspect-[4/3] w-full">
                <Image
                  src={item.image}
                  alt={item.label}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-fl-blue-dark">{item.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
