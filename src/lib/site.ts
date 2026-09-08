import { supportedCities } from "@/lib/constants";

/**
 * Canonical origin of the marketing site, used for `metadataBase`, canonical
 * URLs, the sitemap and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` once a custom domain
 * is live; otherwise it falls back to the Vercel production URL, and finally to
 * the current deployment URL for local dev and previews.
 */
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://fllocacoes.vercel.app");

export const siteUrl = rawSiteUrl.replace(/\/$/, "");

export const siteName = "F&L Locações";

export const siteDescription =
  "Aluguel de atrações para festas e eventos no Vale do Paraíba: plataforma 360, cama elástica, fotografia profissional e totem fotográfico. Estrutura completa e preço claro em São José dos Campos, Jacareí, Caçapava e Taubaté.";

/** Cities we serve, without the "Outro" catch-all option. */
export const serviceCities = supportedCities.filter((city) => city !== "Outro");

/**
 * Business identity for structured data. `streetAddress`/`postalCode` are left
 * empty on purpose — fill them in once there is a public address to publish, or
 * the LocalBusiness card is weaker for local search.
 */
export const businessInfo = {
  legalName: "F&L Locações",
  telephone: "+55 12 99232-8681",
  areaServed: serviceCities,
  address: {
    locality: "São José dos Campos",
    region: "SP",
    country: "BR",
    streetAddress: "",
    postalCode: "",
  },
  /** Approx. centre of São José dos Campos — refine when a real address exists. */
  geo: { latitude: -23.2237, longitude: -45.9009 },
  sameAs: ["https://www.instagram.com/fl_locacoesvale/"],
  openingHours: "Mo-Sa 08:00-18:00",
};

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
