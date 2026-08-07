# F&L Locações

Sistema de locação de equipamentos para eventos: Plataforma 360, Cama Elástica 3m, Fotografia Profissional, Piscina de Bolinha, Mesas e Cadeiras.

## Stack

- Next.js App Router + React + TypeScript
- TailwindCSS
- Auth.js (NextAuth v5) com credenciais e sessão JWT
- Prisma ORM + PostgreSQL
- APIs REST com route handlers do Next.js

## Módulos

- Landing page pública com apresentação dos produtos
- Formulário público de orçamento sem dependência de banco para o lead
- Dashboard administrativo com resumo financeiro
- CRUD de produtos

## Setup

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Credenciais demo

- Admin: `admin@flocacoes.com` / `fl123456`

## Rotas principais

- `/` — Landing page
- `/orcamento` — Formulário de orçamento
- `/login` — Login admin
- `/dashboard` — Resumo financeiro
- `/dashboard/produtos` — Gerenciar produtos

## APIs

- `GET/POST /api/products`
- `GET/PATCH/DELETE /api/products/:id`
- `POST /api/bookings` (captura de lead público)
- `GET /api/bookings` (admin)
- `PATCH /api/bookings/:id` (admin)
- `GET /api/dashboard/summary` (admin)

## Testes

```bash
npm run test
```
