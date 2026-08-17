import nodemailer from "nodemailer";
import { calculateBookingPricing } from "@/lib/booking-pricing";
import { formatCurrency } from "@/lib/formatters";
import { supportedCities } from "@/lib/constants";
import { mockProducts } from "@/mocks/data";

export interface LeadItemInput {
  productId: string;
  quantity: number;
  durationHours: number;
  price: number;
}

export interface LeadRequestInput {
  clientName: string;
  clientPhone: string;
  eventDate: string;
  eventCity: string;
  notes?: string;
  extraHours?: number;
  items: LeadItemInput[];
}

function assertMailerConfig() {
  const to = process.env.LEAD_EMAIL_TO;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;

  if (!to) throw new Error("Configure LEAD_EMAIL_TO para receber os orçamentos.");
  if (!host || !user || !pass || !from) {
    throw new Error("Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS e SMTP_FROM.");
  }

  return { to, host, port, user, pass, from };
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "America/Sao_Paulo" }).format(date);
}

function resolveProductName(productId: string) {
  return mockProducts.find((product) => product.id === productId)?.name ?? productId;
}

function buildPricing(input: LeadRequestInput) {
  return calculateBookingPricing({
    items: input.items,
    extraHours: input.extraHours ?? 0,
  });
}

function buildLeadLines(input: LeadRequestInput) {
  const pricing = buildPricing(input);
  const lines = [
    "Novo pedido de orçamento",
    "",
    `Nome: ${input.clientName}`,
    `Telefone: ${input.clientPhone}`,
    `Data do evento: ${formatDateTime(input.eventDate)}`,
    `Cidade: ${input.eventCity}`,
    "",
    "Produtos selecionados:",
    ...input.items.map((item) => `- ${item.quantity}x ${resolveProductName(item.productId)} (${item.durationHours}h) - ${formatCurrency(item.price)}`),
    "",
    `Subtotal dos produtos: ${formatCurrency(pricing.subtotalAmount)}`,
    pricing.discountAmount > 0 ? `Desconto de pacote: - ${formatCurrency(pricing.discountAmount)}` : "Desconto de pacote: não aplicado",
    `Total parcial dos produtos: ${formatCurrency(pricing.totalAmount)}`,
    `Taxa de deslocamento: sob consulta (${supportedCities.includes(input.eventCity as (typeof supportedCities)[number]) ? input.eventCity : "cidade a confirmar"})`,
    "",
    "Informações para o cliente:",
    "- 30% é pago na hora da reserva.",
    "- Pagamento disponível via Pix ou crédito com taxa da maquininha.",
    "- O valor final será confirmado após a análise do deslocamento.",
  ];

  if (input.notes) lines.push(`Observações: ${input.notes}`);
  return lines.join("\n");
}

function buildLeadHtml(input: LeadRequestInput) {
  const pricing = buildPricing(input);
  const rows = input.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;">${item.quantity}x ${resolveProductName(item.productId)}</td>
          <td style="padding:8px 0; text-align:right;">${item.durationHours}h</td>
          <td style="padding:8px 0; text-align:right;">${formatCurrency(item.price)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f2937;">
      <h2 style="margin:0 0 16px;">Novo pedido de orçamento</h2>
      <p><strong>Nome:</strong> ${input.clientName}<br />
      <strong>Telefone:</strong> ${input.clientPhone}<br />
      <strong>Data do evento:</strong> ${formatDateTime(input.eventDate)}<br />
      <strong>Local:</strong> ${input.eventCity}</p>
      <h3 style="margin:24px 0 8px;">Produtos selecionados</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Produto</th>
            <th style="text-align:right;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Horas</th>
            <th style="text-align:right;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Valor</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:16px;"><strong>Subtotal dos produtos:</strong> ${formatCurrency(pricing.subtotalAmount)}<br />
      <strong>Desconto de pacote:</strong> ${pricing.discountAmount > 0 ? `- ${formatCurrency(pricing.discountAmount)}` : "não aplicado"}<br />
      <strong>Total parcial dos produtos:</strong> ${formatCurrency(pricing.totalAmount)}<br />
      <strong>Taxa de deslocamento:</strong> sob consulta</p>
      <ul>
        <li>30% é pago na hora da reserva.</li>
        <li>Pagamento via Pix ou crédito com taxa da maquininha.</li>
        <li>O valor final será confirmado após a análise do deslocamento.</li>
      </ul>
      ${input.notes ? `<p><strong>Observações:</strong> ${input.notes}</p>` : ""}
    </div>
  `;
}

export async function sendLeadRequestEmail(input: LeadRequestInput) {
  const mailer = assertMailerConfig();
  const transporter = nodemailer.createTransport({
    host: mailer.host,
    port: mailer.port,
    secure: mailer.port === 465,
    auth: { user: mailer.user, pass: mailer.pass },
  });

  await transporter.sendMail({
    from: mailer.from,
    to: mailer.to,
    subject: `Novo orçamento - ${input.clientName}`,
    text: buildLeadLines(input),
    html: buildLeadHtml(input),
  });
}
